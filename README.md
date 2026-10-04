<div align="center">

# 🧠 DHRUVASETU

### A structured knowledge layer for multimodal scientific content

**Ingest → Extract → Structure → Link → Retrieve**

<br>

[![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![SQL](https://img.shields.io/badge/SQL-Migrations-4479A1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Knowledge Graph](https://img.shields.io/badge/Knowledge-Graph-8B5CF6?style=for-the-badge)](#)

<br>

**From uploaded content to structured, connected scientific knowledge.**

</div>

---

<div align="center">

## ✦ About DHRUVASETU

</div>

DHRUVASETU adds a persistent knowledge layer to a scientific content platform.

Instead of treating uploaded files as isolated objects, the system stores the information extracted from them as structured knowledge — including **images, videos, entities, claims, transcript segments, evidence, and relationships**.

The goal is to preserve scientific context so it can be searched, connected, reviewed, and reused across different workflows.

<div align="center">

> **Files → Knowledge → Evidence → Relationships**

</div>

---

<div align="center">

## 🚀 What DHRUVASETU Adds

</div>

<div align="center">

| 🖼️ Media | 🧩 Knowledge | 🔗 Relationships |
|:---:|:---:|:---:|
| Images | Entities | Cross-media links |
| Videos | Claims | Source relationships |
| Video frames | Entity mentions | Dataset connections |
| Transcripts | Evidence | Publication connections |

</div>

The Phase 3 knowledge layer builds on the platform's existing ingestion, processing, task orchestration, and embedding capabilities.

It provides the persistence layer needed to retain structured information after the initial ingestion process.

---

<div align="center">

## 🔄 Knowledge Workflow

<pre align="center">
┌─────────────────────────────┐
│       INGESTED CONTENT      │
│                             │
│  Documents • Images • Video │
│  Datasets • Other Sources   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         PROCESSING          │
│                             │
│ OCR • Transcription         │
│ Metadata • Embeddings       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│     KNOWLEDGE EXTRACTION    │
│                             │
│ Entities • Claims           │
│ Mentions • Evidence         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│     RELATIONSHIP LAYER      │
│                             │
│ Documents ↔ Media           │
│ Entities ↔ Claims           │
│ Sources ↔ Evidence          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      SUPABASE / POSTGRES    │
│                             │
│     Persistent Knowledge    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       SEARCH & AI           │
│                             │
│ Retrieval • Context         │
│ Reasoning • Validation      │
└─────────────────────────────┘
</pre>

</div>

---

<div align="center">

## 🏗️ Architecture

</div>

<div align="center">

<pre align="center">
                         DHRUVASETU
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
        Documents          Images           Videos
             │                │                │
             └────────────────┼────────────────┘
                              │
                              ▼
                       Processing Layer
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
              OCR       Transcription   Metadata
                │             │             │
                └─────────────┼─────────────┘
                              │
                              ▼
                     Knowledge Layer
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
          Entities          Claims          Evidence
             │                │                │
             └────────────────┼────────────────┘
                              │
                              ▼
                    Cross-Media Links
                              │
                              ▼
                       PostgreSQL
                        / Supabase
                              │
                              ▼
                   Search • Retrieval • AI
</pre>

</div>

---

<div align="center">

## 🗂️ Database Schema

### Phase 3 Knowledge Persistence

</div>

The migration introduces a set of tables designed around two major ideas:

**1. Store richer media**

**2. Store the meaning and relationships extracted from that media**

```text
                         KNOWLEDGE LAYER
                                │
           ┌────────────────────┼────────────────────┐
           │                    │                    │
           ▼                    ▼                    ▼
         MEDIA              KNOWLEDGE           RELATIONSHIPS
           │                    │                    │
      ┌────┴────┐          ┌────┴────┐              │
      │         │          │         │              │
      ▼         ▼          ▼         ▼              ▼
   images    videos    entities    claims    cross_media_links
                │
        ┌───────┼────────┐
        │       │        │
        ▼       ▼        ▼
      frames  moments  transcripts
