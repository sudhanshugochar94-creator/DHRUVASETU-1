"""GraphRAG store: networkx knowledge graph + Chroma vector index."""
import json
import re

try:
    import chromadb
except ImportError:
    chromadb = None

import networkx as nx

from . import config as cfg
from .models import CrossLinks, ExtractionResult


def _key(name: str) -> str:
    return re.sub(r"\s+", " ", name.strip().lower())


class LightweightFactsCollection:
    def __init__(self, path):
        self.path = path
        self.data = {}
        if self.path.exists():
            try:
                self.data = json.loads(self.path.read_text())
            except Exception:
                self.data = {}

    def _save(self):
        try:
            self.path.parent.mkdir(parents=True, exist_ok=True)
            self.path.write_text(json.dumps(self.data, indent=1))
        except Exception:
            pass

    def upsert(self, ids, documents, metadatas):
        for fid, doc, meta in zip(ids, documents, metadatas):
            self.data[fid] = {"doc": doc, "meta": meta}
        self._save()

    def get(self, where=None):
        docs = []
        source_id = (where or {}).get("source_id")
        for v in self.data.values():
            if not source_id or v.get("meta", {}).get("source_id") == source_id:
                docs.append(v["doc"])
        return {"documents": docs}

    def delete(self, where=None):
        source_id = (where or {}).get("source_id")
        if source_id:
            self.data = {k: v for k, v in self.data.items() if v.get("meta", {}).get("source_id") != source_id}
            self._save()

    def count(self):
        return len(self.data)

    def query(self, query_texts, n_results=6):
        q = (query_texts[0] if query_texts else "").lower()
        scored = []
        for v in self.data.values():
            doc = v["doc"]
            meta = v.get("meta", {})
            words = [w for w in re.split(r"\W+", q) if len(w) > 2]
            score = sum(1 for w in words if w in doc.lower())
            scored.append((score, doc, meta))
        scored.sort(key=lambda x: x[0], reverse=True)
        top = scored[:n_results]
        return {
            "documents": [[x[1] for x in top]],
            "metadatas": [[x[2] for x in top]]
        }


class KnowledgeStore:
    def __init__(self):
        self.path = cfg.STORE / "graph.json"
        self.g = nx.MultiDiGraph()
        if self.path.exists():
            d = json.loads(self.path.read_text())
            for n, a in d["nodes"]:
                self.g.add_node(n, **a)
            for u, v, a in d["edges"]:
                self.g.add_edge(u, v, **a)
        if chromadb is not None:
            self.col = chromadb.PersistentClient(path=str(cfg.STORE / "chroma")) \
                .get_or_create_collection("facts")
        else:
            self.col = LightweightFactsCollection(cfg.STORE / "facts.json")

    # ---------- write side (Knowledge Agent: build) ----------
    def _has_edge(self, u, v, relation):
        return any(a.get("relation") == relation for a in (self.g.get_edge_data(u, v) or {}).values())

    def add_extraction(self, ex: ExtractionResult):
        sid = f"src::{ex.source_id}"
        try:
            self.col.delete(where={"source_id": ex.source_id})   # re-ingest = replace
        except Exception:
            pass
        self.g.add_node(sid, kind="source", label=ex.source_id,
                        media_type=ex.media_type, summary=ex.summary)
        for e in ex.entities:
            k = _key(e.name)
            self.g.add_node(k, kind="entity", label=e.name, etype=e.type)
            if not self._has_edge(sid, k, "mentions"):
                self.g.add_edge(sid, k, relation="mentions")
        for r in ex.relations:
            a, b = _key(r.source), _key(r.target)
            for k, label in ((a, r.source), (b, r.target)):
                if k not in self.g:
                    self.g.add_node(k, kind="entity", label=label, etype="Thing")
            if not self._has_edge(a, b, r.relation):
                self.g.add_edge(a, b, relation=r.relation, source_id=ex.source_id)
        facts = ex.facts or [ex.summary]
        self.col.upsert(
            ids=[f"{ex.source_id}::{i}" for i in range(len(facts))],
            documents=facts,
            metadatas=[{
                "source_id": ex.source_id,
                "entities": "|".join(e.name for e in ex.entities if e.name.lower() in f.lower()),
            } for f in facts],
        )

    def add_links(self, links: CrossLinks):
        for l in links.links:
            a, b = f"src::{l.source_id_a}", f"src::{l.source_id_b}"
            if a in self.g and b in self.g and not self._has_edge(a, b, l.relation):
                self.g.add_edge(a, b, relation=l.relation, reason=l.reason, source_id="cross-media")

    def save(self):
        self.path.write_text(json.dumps({
            "nodes": [[n, a] for n, a in self.g.nodes(data=True)],
            "edges": [[u, v, a] for u, v, a in self.g.edges(data=True)],
        }, indent=1))

    # ---------- read side ----------
    def has_source(self, source_id: str) -> bool:
        return f"src::{source_id}" in self.g

    def source_summaries(self) -> list[tuple[str, str, str]]:
        return [(a["label"], a.get("media_type", ""), a.get("summary", ""))
                for _, a in self.g.nodes(data=True) if a.get("kind") == "source"]

    def _label(self, n):
        return self.g.nodes[n].get("label", n)

    def source_facts(self, source_id: str) -> list[str]:
        r = self.col.get(where={"source_id": source_id})
        return r["documents"] or []

    def query(self, q: str, k: int = 6, max_triples: int = 20) -> str:
        """GraphRAG: vector search -> seed entities -> graph traversal (1 hop)."""
        facts, seeds, src_ids = [], set(), set()
        n = self.col.count()
        if n:
            r = self.col.query(query_texts=[q], n_results=min(k, n))
            for doc, meta in zip(r["documents"][0], r["metadatas"][0]):
                facts.append(f"- {doc} [{meta['source_id']}]")
                src_ids.add(meta["source_id"])
                seeds.update(_key(x) for x in meta.get("entities", "").split("|") if x)
        ql = q.lower()
        seeds.update(n_ for n_, a in self.g.nodes(data=True)
                     if a.get("kind") == "entity" and a["label"].lower() in ql)
        seeds.update(f"src::{s}" for s in src_ids)
        triples = []
        for s in seeds:
            if s not in self.g:
                continue
            for u, v, a in list(self.g.out_edges(s, data=True)) + list(self.g.in_edges(s, data=True)):
                if a.get("relation") == "mentions":
                    continue
                triples.append(f"- {self._label(u)} -[{a['relation']}]-> {self._label(v)} "
                               f"[{a.get('source_id', '?')}]")
        triples = list(dict.fromkeys(triples))[:max_triples]
        if not facts and not triples:
            return "NO EVIDENCE FOUND"
        return "FACTS (vector search):\n" + "\n".join(facts) + \
               "\n\nRELATIONS (graph traversal):\n" + "\n".join(triples)


_store = None


def get_store() -> KnowledgeStore:
    global _store
    if _store is None:
        _store = KnowledgeStore()
    return _store
