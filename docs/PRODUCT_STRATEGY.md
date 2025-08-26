# Product Strategy — Engineering Diagrams First

Position Vivid Stories as the fastest way for engineers to create and update clean, accurate diagrams from text and light doodles — with the unique ability to edit legacy diagrams by fitting new blocks/lines into the existing image while matching style and layout.

## Who we serve
- Software/Cloud/Infra engineers maintaining architecture diagrams
- Systems/Embedded engineers with block diagrams and signal flows
- Data/ML engineers updating pipelines and lineage
- Network/Security architects managing topology maps

## Core jobs-to-be-done
1) “I have an old diagram image and need to add/adjust a few blocks/lines without hunting down the original tool/file.”
2) “I want to describe a system and get a polished diagram with correct layout and styling.”
3) “I want to keep the diagram consistent across revisions and export to standard formats.”

## Value prop and differentiation
- Edit legacy images: Add blocks/arrows that fit the existing style/layout; no original source needed.
- Deterministic vector output: Crisp, consistent diagrams (SVG/PNG/Mermaid/DOT) — not fuzzy generative art.
- Text → Diagram: Natural language to structured graph with auto-layout and color/style presets.
- Doodle assist: Rough shapes/lines snap to neat nodes/edges.
- Style matching: Infer fonts, line weights, colors from an existing image or brand preset.

## MVP scope
- Input modes: (a) Text, (b) Doodle, (c) Upload existing diagram (SVG preferred; raster supported with assist).
- Diagram pipeline:
  - NL → Graph JSON via LLM with schema validation.
  - Auto-layout (Dagre/ELK) with orthogonal routing and collision avoidance.
  - Render with Cytoscape.js or tldraw, export SVG/PNG/Mermaid/DOT.
- Legacy image edit:
  - If SVG: parse → merge new nodes/edges → re-render.
  - If raster: trace + align + overlay vector layer; optional manual anchors; export combined image.
- Style toolkit: palette, fonts, corner radius, line caps; basic style inference from upload.
- SaaS flow: Try once → Login (Supabase) → Subscribe (Stripe) → higher limits.

## Out-of-scope for MVP
- Heavy diffusion-based image generation for diagrams (not needed for clarity).
- Full automatic reverse-engineering of any raster to perfect vector (provide assist instead).

## Scale roadmap
- Reverse-engineering upgrades: Train lightweight detectors (YOLO/DETR) for boxes/arrows/ports + OCR to auto-reconstruct graph from raster.
- Domain packs: UML, BPMN, AWS/GCP/Azure icons with rules and validators.
- Collaboration: versioning, comments, change tracking, diff view.
- Enterprise: SSO, on-prem, private icon libraries, SLAs.

## Monetization
- Free: view + 1 small export/day, watermark.
- Pro: unlimited edits/exports, brand presets, import SVG, style inference.
- Team/Enterprise: shared libraries, SSO, audit logs, SLAs.

## Why this niche
- High pain point: editing legacy diagrams without source files.
- Clear outputs: vector diagrams with measurable correctness.
- Defensible: reverse-engineering accuracy, style inference, and text→graph quality.
