# Vivid Stories — Product Roadmap

This document captures why this app wins (vs. "just prompt an LLM") and how we deliver a higher‑quality, enterprise‑ready diagramming experience. It also outlines the MVP and phased milestones.

## Why this app (business value)

- Structured, verifiable output: Enforced typed graph/DSL, validated and auto‑fixed.
- Org‑specific grounding: Use your service catalog, repos, and docs to match reality.
- Superior layout/readability: Deterministic layout optimization (ELK/Dagre) with quality scoring.
- Round‑trip editing & source of truth: Live editable graph, import/export, maintainability.
- Legacy import/modernize: Mermaid/PlantUML/SVG ingest and cleanup.
- Quality gates & collaboration: Lints, policy checks, PR previews, approvals.
- Privacy & compliance: Zero‑retention, on‑prem providers, audit trails.
- Toolchain integration: Link to code, tickets, runbooks, IaC.

## Technical pillars

1. Domain DSL & schema with exporters/importers (Mermaid, PlantUML, SVG, JSON)
2. Dual compiler: deterministic parser + model provider with strict schema validation
3. Grounding: RAG over org assets; canonical naming; style presets
4. Validation & linting: policy rules and auto‑fixers
5. Layout optimization: ELK/Dagre, multi‑pass search, quality scoring
6. Aesthetic/semantic polish: theming, clustering, accessibility
7. Exports & round‑trip: SVG/PDF/PNG/Mermaid/PlantUML; canonical JSON persisted
8. Import & modernization: round‑trip editing of legacy diagrams
9. CI & collaboration: CLI, PR diagrams, approvals, versioning

---

## MVP scope

Goal: Generate, validate, layout, and export engineering diagrams from natural language, with round‑trip editing.

MVP must-haves:
- Input → Graph: deterministic compiler + optional provider; Zod validation; auto‑fix basics
- Layout: ELK.js (preferred) or Dagre; quality scoring; readable defaults
- Canvas: Cytoscape rendering; export SVG/PNG + Mermaid/PlantUML text
- Import: Mermaid/PlantUML → internal Graph JSON → re‑layout
- Round‑trip: always persist canonical graph JSON; re-generate exports deterministically
- No paid key required: fallback compiler is functional out of the box

Out of scope (MVP): raster vectorization, VSDX/PPTX export, deep CI workflows, auth/billing

---

## First MVP slice: UML workflow use case

Prompt example (customer workflows):

> "Create an UML diagram depicting a workflow of my tools for the customer. The customer has 3 types of workflows, use case 1 is adding one or more new errors directly into the error list and running the workflow. use case 2 is adding one or more new errors and specifying within the invariant files which error IDs will these errors have. the third use case is overwriting the static configuration with the dataset configuration which means specifying errors that will have same names as in static configuration but different attributes (aka reactions) in the dataset configuration. Error IDs are the same for both configurations."

MVP interpretation:
- Diagram family: UML Activity Diagram (primary) or UML Component + Activity split (if complex)
- Output: Valid internal Graph JSON + Mermaid/PlantUML export
- Quality: Must produce readable, labeled paths for the three use cases; ensure deduped nodes and clear gateways/decisions
- Round‑trip: Import the Mermaid/PlantUML back into the app and reconstruct the same Graph JSON

Key rules for this slice:
- Map “use case 1/2/3” to distinct activity flows
- Model configuration artifacts (static config, dataset config, invariant files) as nodes with types
- Enforce: Error IDs are consistent; avoid dangling flows; label decisions (“IDs predefined?”)
- Choose auto‑layout tuned for flow readability (layered, left→right)

---

## Milestones

1) Quality core (2–3 weeks)
- Add ELK layout + quality scoring and selection
- Implement lint rules and auto‑fix for dedupe, labels, forbidden edges
- Add Mermaid/PlantUML exporters and importers
- Multi‑pass compile (deterministic first; provider optional; strict validation)

2) UML workflow MVP (1–2 weeks)
- Add UML activity shapes/types (action, decision, merge, start/end)
- Prompt → flows for the 3 use cases; export + import round‑trip
- UX: export buttons; import dialog; re‑layout and theme

3) Grounding (1–2 weeks)
- Add small glossary and synonyms; style presets; naming normalization hooks

4) Collaboration/CI (later)
- CLI for compile/lint/layout/export; PR previews; approval flow

---

## Risks & mitigations
- Ambiguity in prompts → Show a review step with suggested fixes; provide templates
- Large/complex diagrams → Auto-cluster and split into sub‑diagrams; pagination
- Provider variability → Strict schema validation + auto‑repair + deterministic fallback

## Success criteria
- Given the prompt above, system outputs a readable UML activity (or split set) that round‑trips via Mermaid/PlantUML with no loss, and passes quality score threshold.
