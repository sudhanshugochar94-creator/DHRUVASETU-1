"""One factory per box in the architecture diagram."""
from crewai import Agent, LLM

from . import config as cfg
from .tools import (analyze_image, analyze_video, get_source_facts,
                    graphrag_search, read_document)

GROUNDING = ("You never invent facts. Every statement must come from tool output or supplied "
             "evidence, and must carry its source_id.")


def _agent(role, goal, backstory, tools=None):
    return Agent(role=role, goal=goal, backstory=backstory + " " + GROUNDING,
                 tools=tools or [], llm=LLM(model=cfg.LLM_MODEL, temperature=0.2),
                 allow_delegation=False, verbose=cfg.VERBOSE)


def orchestrator():
    return _agent("Orchestrator Agent",
                  "Manage and coordinate the complete polar-science outreach workflow",
                  "You analyse what knowledge has been ingested and decide which stories are worth telling.")


def schedule_agent():
    return _agent("Schedule Agent",
                  "Plan publishing times from expedition timelines and dates",
                  "You align outreach with expedition milestones, anniversaries and audience attention.")


def document_agent():
    return _agent("Document Agent", "Extract key information from reports, papers and datasets",
                  "You read polar research documents and summarise them faithfully.", [read_document])


def image_agent():
    return _agent("Image Agent", "Extract visual information from field photos, maps and diagrams",
                  "You annotate and classify polar imagery from OCR, detections and metadata.", [analyze_image])


def video_agent():
    return _agent("Video Agent", "Extract key events from expedition videos and audio",
                  "You turn transcripts and scene detections into structured event summaries.", [analyze_video])


def extraction_agent():
    return _agent("Information Extraction Agent", "Extract structured entities, relations and facts",
                  "You convert text into atomic facts, entities and relations for a knowledge graph.")


def linking_agent():
    return _agent("Cross-Media Linking Agent", "Link related content across documents, images and video",
                  "You find sources that describe the same expedition, place, event or entity.")


def knowledge_agent():
    return _agent("Knowledge Agent", "Answer questions using GraphRAG retrieval and refine over turns",
                  "You retrieve from the knowledge graph and vector index, re-querying when evidence is thin.",
                  [graphrag_search])


def content_agent():
    return _agent("Content Generation Agent", "Create factual, claim-level cited content",
                  "You draft outreach content strictly from retrieved evidence.", [graphrag_search])


def validation_agent():
    return _agent("Validation Agent", "Verify every claim against its cited sources",
                  "You are a sceptical fact-checker who rejects anything not supported by stored facts.",
                  [get_source_facts])


def persona_agent():
    return _agent("Persona Styling & Media Generation Agent", "Adapt verified content for each platform",
                  "You write engaging polar-science outreach for X and the website using only verified claims.")
