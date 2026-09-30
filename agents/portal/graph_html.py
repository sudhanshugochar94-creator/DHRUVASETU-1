"""Interactive Knowledge Graph output: standalone HTML (vis-network via CDN)."""
import json

from . import config as cfg
from .knowledge import get_store


def export() -> str:
    g = get_store().g
    nodes = [{"id": n, "label": a.get("label", n), "group": a.get("kind", "entity"),
              "title": a.get("summary", a.get("etype", ""))} for n, a in g.nodes(data=True)]
    edges = [{"from": u, "to": v, "label": a.get("relation", ""), "arrows": "to"} for u, v, a in g.edges(data=True)]
    html = f"""<!doctype html><html><head><meta charset="utf-8"><title>Polar Knowledge Graph</title>
<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
<style>html,body,#g{{height:100%;margin:0}}</style></head><body><div id="g"></div>
<script>new vis.Network(document.getElementById('g'),
{{nodes:new vis.DataSet({json.dumps(nodes)}),edges:new vis.DataSet({json.dumps(edges)})}},
{{physics:{{stabilization:true}},edges:{{font:{{size:9}}}}}});</script></body></html>"""
    path = cfg.OUT / "knowledge_graph.html"
    path.write_text(html)
    return str(path)
