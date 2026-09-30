"""CLI: python main.py [serve|run|chat|sync|publish-due|graph]"""
import argparse

from portal import config as cfg
from api import app


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("serve", help="API for the React portal + background review/publish loop")
    r = sub.add_parser("run", help="standalone: data/inbox -> agents -> terminal approval -> publish")
    r.add_argument("--force", action="store_true", help="reprocess files already in the knowledge base")
    sub.add_parser("sync", help="one pass of: regenerate rejected drafts, publish approved ones")
    sub.add_parser("chat", help="terminal chat over the knowledge base")
    sub.add_parser("publish-due", help="standalone mode: publish due items from data/output/scheduled.json")
    sub.add_parser("graph", help="export the interactive knowledge graph as HTML")
    a = ap.parse_args()

    if a.cmd == "serve":
        import uvicorn
        uvicorn.run("api:app", host="0.0.0.0", port=8000)
    elif a.cmd == "run":
        from portal.flow import PortalFlow
        flow = PortalFlow()
        flow.state.force = a.force
        flow.kickoff()
    elif a.cmd == "sync":
        from portal.sync import tick
        print("revised, published:", tick())
    elif a.cmd == "chat":
        from portal.crews import chat_turn
        hist = []
        print("Ask about the ingested polar material (blank line to quit).")
        while (q := input("\n> ").strip()):
            ans = chat_turn(hist, q)
            hist.append((q, str(ans)))
            print("\n" + str(ans))
    elif a.cmd == "publish-due":
        from portal.publisher import publish_due
        print(f"{publish_due()} published (DRY_RUN={cfg.DRY_RUN})")
    elif a.cmd == "graph":
        from portal.graph_html import export
        print("wrote", export())


if __name__ == "__main__":
    main()
