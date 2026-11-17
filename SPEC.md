# Project Specification: Team Synergy & Operating Manual Engine (BaZi + MBTI + RACI)

## 1. Project Overview & Objective
Build a lightweight, privacy-first web application designed for office team building and workplace collaboration. The app combines **Chinese Astrology (BaZi / Four Pillars of Destiny)** with **MBTI Cognitive Functions** and the **RACI Matrix** to generate an actionable "Team Operating Manual" and "Pair Compatibility Matrix" for colleagues.

**Core Philosophy:**
- **Not fortune-telling:** Translate elemental interactions and personality traits into practical workplace communication protocols, stress-handling guides, and role alignments.
- **Deterministic First:** Never rely on LLMs to calculate astronomical dates or BaZi pillars. Use a deterministic Python backend engine for exact calculations, then feed structured JSON to the LLM for psychological/workplace synthesis.
- **Stateless & Privacy-First (PDPA):** Do not persist personal birth data in a permanent database. Process in-memory or use encrypted local storage/session state.

---

## 2. Tech Stack & Architecture
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide Icons.
- **Calculation Engine (Backend API):** Python 3.11+ (FastAPI) using `lunar-python` (or `sxtwl`) for accurate Solar Terms (24 Jieqi) and Four Pillars calculation, plus custom True Solar Time (TST) adjustment based on Thailand provincial longitudes.
- **AI Synthesis Layer:** OpenAI-compatible API endpoint (configurable via `.env` to support local **Ollama** models or cloud LLMs).
- **Deployment Target:** Local workstation / NixOS Docker Compose ready.

---

## 3. Engineering Constraints (Karpathy Guidelines)
- **Simplicity First:** Keep the architecture minimal. Avoid heavy ORMs, complex auth providers, or unnecessary state management libraries.
- **Surgical & Modular:** Separate the deterministic BaZi math engine, the static MBTI/RACI knowledge base, and the LLM prompt generator into distinct, testable modules.
- **Verifiable Success:** Include unit tests for the BaZi calculation engine (verifying known birth dates against standard Chinese Solar Calendar pillars) before building the UI.

---

## 4. Functional Requirements

### Module A: Deterministic Calculation Engine (`/backend`)
1. **Input Schema:**
   - `name` (Display nickname)
   - `birth_date` (YYYY-MM-DD)
   - `birth_time` (HH:MM, optional — if unknown, calculate 3 pillars and flag `hour_pillar: null`)
   - `province` (Thai province name -> map to Longitude for True Solar Time correction relative to 120°E standard)
   - `mbti` (16 types + `-A`/`-T` variant, e.g., `INTP-A`, `ENFP-T`)
   - `role` (Optional job title/department, e.g., "Developer", "Content Creator", "Marketing")

2. **Processing Logic:**
   - Convert local time to **True Solar Time (TST)** using longitude offset: `(Longitude - 120.0) * 4 minutes` + Equation of Time approximation.
   - Calculate **Four Pillars (Year, Month, Day, Hour)** using strict Solar Terms (立春 Lichun for Year boundary, 12 Jieqi for Month boundaries).
   - Extract **Day Master (日主)** (e.g., Yin Fire `丁`, Yang Water `壬`), elemental strengths, and basic branch interactions (Clash `冲`, Combine `合`, Harm `害`, Punishment `刑`).
   - Map MBTI to its 4-function stack (e.g., `INTP` -> `Ti - Ne - Si - Fe`) and identify the **Inferior Function (The Grip)**.
   - Output a clean, deterministic `ProfileJSON`.

### Module B: AI Synthesis & Simulation Layer (`/backend/synthesizer.py`)
1. **Single Profile Analysis (Individual Operating Manual):**
   - Feed `ProfileJSON` into LLM with strict system instructions: *Do not use external user memory. Rely strictly on the provided JSON.*
   - Generate structured JSON output containing:
     - `archetype_title`: Fun, memorable work persona (e.g., "Strategic Candlelight Architect").
     - `natural_raci`: Best fit in RACI (Responsible, Accountable, Consulted, Informed) and why.
     - `communication_cheat_sheet`: 3 bullet points on how to brief/talk to this person effectively.
     - `stress_and_grip_protocol`: Signs they are overwhelmed (based on Inferior Function + Elemental imbalance) and how teammates should support them.
     - `confidence_tags`: Label each insight as `[Structural Rule]` or `[Behavioral Simulation]`.

2. **Pairwise Team Synergy (2-Person Comparison):**
   - Input two `ProfileJSON` objects (Person A & Person B).
   - Detect cross-pillar interactions (e.g., Month Pillar match, Day Stem combine/clash) and Cognitive Function dynamics (e.g., `Ti` vs `Fe` friction).
   - Generate:
     - `synergy_score` (0-100, playful metric)
     - `power_combo`: Where they complement each other best.
     - `friction_triggers`: Specific workplace scenarios where they might clash (e.g., last-minute scope changes, blunt feedback) and a concrete mitigation rule.

### Module C: Web UI (`/frontend`)
1. **Clean, Modern Dashboard (Light/Dark mode):**
   - **Tab 1: My Work Manual:** Form to input birth details & MBTI -> renders a clean, card-based "User Manual" (inspired by modern Notion/Linear cards) with copy-to-clipboard / shareable summary card.
   - **Tab 2: Team Matrix (Compare):** Select 2 colleagues from session memory -> displays side-by-side Elemental + MBTI breakdown, RACI alignment, and "Do's & Don'ts" when working together.
   - **Disclaimer Footer:** Clear note that BaZi elements are used as a metaphorical framework alongside MBTI psychology for team communication, not medical or HR evaluation advice.

---

## 5. Directory Structure to Generate
```text
team-synergy-app/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── main.py              # FastAPI endpoints (/calculate, /analyze, /compare)
│   ├── bazi_engine.py       # True Solar Time + lunar-python Four Pillars logic
│   ├── mbti_data.py         # Static mapping of Cognitive Functions & Grip states
│   ├── prompts.py           # Strict System Prompts for Workplace/RACI synthesis
│   ├── test_bazi.py         # Pytest unit tests verifying Solar Terms & TST math
│   └── requirements.txt
└── frontend/
    ├── package.json
    └── src/
        ├── app/page.tsx     # Main dashboard with Tabs (Manual / Compare)
        ├── components/      # PillarCard, ManualView, SynergyMatrix, ProfileForm
        └── types/index.ts   # TypeScript interfaces matching Backend JSON