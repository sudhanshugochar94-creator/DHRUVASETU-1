from dataclasses import dataclass
from typing import Optional

from .models import StyledContent


@dataclass
class Decision:
    action: str                       # approve | reject | skip
    feedback: str = ""
    content: Optional[StyledContent] = None


def review(c: StyledContent, confidence: float, issues: list[str]) -> Decision:
    print("\n" + "=" * 70)
    print(f"HUMAN APPROVAL  |  topic: {c.topic}  |  confidence: {confidence:.0%}")
    print("=" * 70)
    print(f"X POST ({len(c.x_post)} chars):\n{c.x_post}\n")
    print(f"ARTICLE:\n{c.article_md}\n")
    print(f"IMAGE PROMPT: {c.image_prompt}")
    if issues:
        print("VALIDATION FLAGS:\n" + "\n".join(f"  - {i}" for i in issues))
    while True:
        a = input("\n[a]pprove  [e]dit X post  [r]eject with feedback  [s]kip topic > ").strip().lower()
        if a == "a":
            return Decision("approve", content=c)
        if a == "e":
            new = input("New X post text: ").strip()
            if new:
                c = c.model_copy(update={"x_post": new[:280]})
                return Decision("approve", content=c)
        if a == "r":
            return Decision("reject", feedback=input("What should change? > ").strip())
        if a == "s":
            return Decision("skip")
