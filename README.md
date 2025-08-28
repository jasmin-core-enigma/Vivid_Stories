# Vivid Stories — Text + Doodle → Visuals

A high-end, dual-pane web app where you write on the left and generate visuals on the right. Text guides the content; simple doodles or masks correct layout, composition, and structure. Designed for writers (books/comics) and engineers (diagrams/blocks) to turn ideas into precise, clean visuals with minimal hallucinations.


## Why this exists
- Writers: Turn scenes into consistent, high-quality images or storyboards without over-describing.
- Engineers: Describe components and relationships to get neat block/architecture diagrams; optionally doodle rough shapes and let the system clean them up.
- Art direction: Use lightweight doodles, references, and constraints to reduce hallucinations while retaining creative flexibility.


## Feasibility (yes)
Modern text-to-image, controllable generation, and diagram libraries make this feasible:
- Image generation: SDXL/Flux-class diffusion (local or API), inpainting, and ControlNet (Canny/Scribble/Depth) for doodle guidance; IP-Adapter for style/reference images.
- Diagramming: Convert text → graph JSON with an LLM, auto-layout via Dagre/ELK/Graphviz; render via Cytoscape.js, Elk.js, or tldraw; export SVG/PNG.
- Hallucination control: Negative prompts, control strength, masks, layout constraints, style locks, and semantic “scene graph” validation.
- Multi-scene: Chunk text into scenes and generate a slideshow or panel sequence.


## Product overview
- Left pane: Rich text editor for story/scene/diagram descriptions.
- Right pane: Visual stage
  - Scenes/images: Generate single image or slideshow from detected scenes.
  - Doodle: Sketch layout/contours; use it as ControlNet “scribble” or a mask for inpainting.
  - Diagrams: Natural language → nodes/edges/colors; auto-layout and smoothing.
- Controls: Strength (text vs. doodle), style presets, negative prompts, seed, size, palette lock.
- Corrections: Click-to-nudge constraints (e.g., “hat is red”, “block A connects to B”).
- Export: PNG/JPEG/WebP, SVG (for diagrams), JSON scene/graph data.


## UX notes
- Split-view; generate button; per-scene thumbnails; next/prev.
- Doodle layer supports pen/eraser/colors, shape hints, quick mask mode.
- Engineers switch: “Diagram mode” switches the generator and palette to structured outputs.


## Architecture (proposed)
- Frontend (Next.js/React + TypeScript)
  - Editor: ProseMirror/TipTap (rich text) or simpler markdown editor to start.
  - Canvas: tldraw or Konva/Fabric for doodles and diagram overlays.
  - Diagram render: Cytoscape.js + Dagre/ELK for layout; export to SVG.
  - State: Zustand/Redux for generation state; WebSocket/SSE for job updates.
- Backend API (FastAPI or Node/Express+TypeScript)
  - Endpoints: prompt parse → scene graph; image job create; diagram compile; inpaint/control; job status; asset upload.
  - Workers/queue: Redis + RQ/Celery (Python) or BullMQ (Node) for GPU-bound jobs.
  - Image models: SDXL/Flux with ControlNet-Scribble/Canny; IP-Adapter; InstructPix2Pix or img2img for refinements.
  - Diagram pipeline: NL → JSON schema (LLM), validate, layout, render.
  - Storage: S3-compatible buckets for artifacts; Postgres for projects/scenes/graphs.


## Data contracts (first pass)
- Text → Scenes
  - Input: { text, mode: "image|diagram", options: { sceneSplit: auto|n, stylePreset, palette, seed, negativePrompt, controlStrength } }
  - Output: { scenes: [{ id, title?, prompt, negativePrompt?, constraints: { palette?, characters?, layout? } }] }
- Doodle upload
  - Input: { sceneId, image (rgba/png), mask?, controlType: "scribble|canny|inpaint", strength }
  - Output: { controlId }
- Generate images
  - Input: { sceneId, promptOverride?, controlId?, size, steps, guidance, seed }
  - Output: { jobId }
- Job status
  - Output: { jobId, status: queued|running|done|error, progress, images: [url], metadata }
- Diagram compile
  - Input: { text, doodleSvg?, constraints?, style?, layout: "dagre|elk|dot" }
  - Output: { graphJson, svgUrl, pngUrl }


## Minimizing hallucinations (core design)
- Explicit constraints: Extract a scene graph (entities, attributes, relationships) from text; validate generations against it.
- Control signals: Doodle/Mask → ControlNet or Inpainting with adjustable strength.
- Style/Palette locks: Enforce palette and style embedding (IP-Adapter) for consistency.
- Negative prompts: Default, plus auto-generated negatives from constraints.
- Determinism: Expose seed; allow “lock subject” to maintain character consistency across scenes.
- Feedback loop: "Mismatch" hints when output violates constraints; quick fix buttons.


## Diagram mode specifics
- Parse text like: "Blue DB connects to API via gRPC; API → Auth → Dashboard".
- Normalize to Graph JSON: { nodes: [{id,label,type,color}], edges: [{from,to,label,style}] }.
- Auto-layout via Dagre/ELK/Graphviz; render in Cytoscape/tldraw; snap/straighten/rounded corners.
- Doodle assist: Rough boxes/lines vectorized (Potrace) → snapping to canonical nodes/edges; color/style applied from text.
- Export: SVG (clean), PNG, Mermaid/Graphviz DOT export for portability.


## Milestones
- M0: Repo bootstrap + README (this). Decide stack (Next.js + FastAPI or all-Node) and license.
- M1: Frontend shell: split view, editor, canvas, basic job polling.
- M2: Text → single image via hosted API (for speed). Seed, size, negatives.
- M3: Doodle → ControlNet Scribble/Canny guidance. Inpainting with mask erase.
- M4: Multi-scene parsing → slideshow with thumbnails. Per-scene state.
- M5: Diagram mode: NL → Graph JSON → auto-layout render + export.
- M6: Quality pass: scene graph extraction, palette/style locks, character consistency.
- M7: Collaboration, project save/load, S3 storage, auth.


## Tech choices (baseline)
- Frontend: Next.js 14, React 18, TypeScript; tldraw for drawing; Tailwind for UI.
- Backend: FastAPI (Python) for model tooling; Redis queue; Postgres; S3.
- Models: SDXL/Flux + ControlNet-Scribble/Canny; IP-Adapter; optional InstructPix2Pix.
- Diagram: LLM (provider-pluggable) → JSON; Cytoscape + Dagre/ELK; Potrace for vectorization.


## Security, cost, ops
- Sensitive text/images: store privately; signed URLs, expiring links.
- Rate-limits and quotas per user; GPU job queue with timeouts.
- Moderation/NSFW filters; safe negative prompts.
- Local mode: optional on-device model runner; swap endpoints via config.


## Quick contract + edge cases
- Inputs: text (1–2k tokens typical), optional doodle/mask, options.
- Outputs: images (1024–2048 px), diagrams (SVG), JSON state.
- Edge cases: overly long/ambiguous prompts; conflicting constraints; missing doodle; heavy detail → long runtimes; model style drift; batch timeouts.


## Development plan (next steps)
1) Scaffold app:
   - Frontend: Next.js app with split-view, basic editor and canvas (tldraw), dummy generate button.
   - Backend: FastAPI with /health and placeholder /generate endpoint returning sample images.
2) Wire job model:
   - Queue + status polling (fake first), then real worker.
3) Add hosted image generation:
   - Pluggable provider interface (env-configured). Seed/size/negatives.
4) Add doodle control:
   - PNG upload, run via ControlNet-Scribble; add strength slider.
5) Add multi-scene parsing + slideshow UI.
6) Add Diagram mode (NL → Graph JSON → render → export).
7) Quality layer: scene graph checks, palette/style locks, character consistency.


## Modularity and SaaS flows
- Architecture overview: see docs/ARCHITECTURE.md
- Modules (swappable): Auth (Supabase), Billing (Stripe), Models (generation), Diagrams, Storage, Queue, Pricing. See docs/MODULES/* for each port and adapter guidance.
- SaaS funnel: Home → Try once (anonymous) → Login (Supabase) → Subscribe (Stripe) → Unlimited per plan; quotas enforced server-side via Pricing module.

## Product strategy and pipelines
  - Editing existing diagrams (SVG + raster): docs/PIPELINES/DIAGRAM_EDITING.md
  - Text → Diagram graph: docs/PIPELINES/TEXT_TO_GRAPH.md
  - Roadmap: docs/ROADMAP/ROADMAP.md
  - MVP UML Workflow: docs/ROADMAP/MVP_UML_WORKFLOW.md

- Home: value prop + "Try it" button.
- Try: one-page text input + doodle canvas; single generation (rate-limited).
- App/Editor: split view, slideshow, save/load.
- Pricing: plans + CTA.
- Account/Billing: manage subscription (Stripe portal).


## Repo structure (proposed)
- app/ (Next.js) — UI, editor, canvas, diagram view
- server/ (FastAPI) — API, workers, model runners
- packages/ — shared types and schemas
- infra/ — IaC, docker-compose (GPU optional), deployment
- docs/ — specs, API contracts, model configs


## Open questions
- Preferred stack: Python backend (model-rich) vs. all-Node? Defaulting to FastAPI.
- Hosted vs. local models for v1? Likely hosted to move fast, local later.
- Authentication needs? Anonymous to start, then email/OAuth.


## How to collaborate with Copilot/Agents
- Keep prompts and constraints in text; prefer small doodles for layout.
- Save/export scene JSON to preserve state and enable iterative refinement.
- Use the seed to reproduce results; lock style/palette early for consistency.


---
Maintainer notes: This README is the living spec. We’ll iterate milestone by milestone; tasks will be derived from the Development plan. PRs should link the milestone and include brief screenshots or artifacts.
