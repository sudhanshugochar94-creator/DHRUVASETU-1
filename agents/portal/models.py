from pydantic import BaseModel, Field


class MediaResult(BaseModel):
    """Output of the Document / Image / Video agents."""
    source_id: str
    media_type: str
    title: str = ""
    summary: str
    key_facts: list[str] = Field(default_factory=list)


class Entity(BaseModel):
    name: str
    type: str = "Thing"          # Person, Place, Expedition, Instrument, Species, Date...


class Relation(BaseModel):
    source: str
    relation: str
    target: str


class ExtractionResult(BaseModel):
    """Output of the Information Extraction Agent."""
    source_id: str = ""
    media_type: str = ""
    summary: str
    facts: list[str] = Field(default_factory=list)
    entities: list[Entity] = Field(default_factory=list)
    relations: list[Relation] = Field(default_factory=list)


class CrossLink(BaseModel):
    source_id_a: str
    source_id_b: str
    relation: str
    reason: str = ""


class CrossLinks(BaseModel):
    links: list[CrossLink] = Field(default_factory=list)


class ContentPlan(BaseModel):
    topics: list[str]
    notes: str = ""


class ScheduleItem(BaseModel):
    topic: str
    publish_at: str              # ISO-8601, UTC
    rationale: str = ""


class SchedulePlan(BaseModel):
    items: list[ScheduleItem] = Field(default_factory=list)


class Claim(BaseModel):
    text: str
    source_ids: list[str] = Field(default_factory=list)


class Draft(BaseModel):
    topic: str
    claims: list[Claim]


class ClaimCheck(BaseModel):
    text: str
    supported: bool
    note: str = ""


class ValidationReport(BaseModel):
    topic: str
    checks: list[ClaimCheck]
    verified_claims: list[Claim]


class StyledContent(BaseModel):
    topic: str
    x_post: str
    article_md: str
    hashtags: list[str] = Field(default_factory=list)
    image_prompt: str = ""
