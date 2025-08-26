# Pipeline — Editing Existing Diagrams (SVG + Raster)

Goal: Let users upload a legacy diagram and add/edit blocks/lines so the new content fits the style and layout.

## Inputs
- File: SVG preferred; PNG/JPEG supported
- Instructions: natural language like “Add an API block connected to DB via gRPC; make the DB blue”
- Optional doodle overlay: user draws rough placement

## Outputs
- Updated diagram: SVG (preferred) and PNG export
- Change set: JSON patch of nodes/edges/styles applied

## Steps
1) Detect format
   - SVG: parse DOM, extract nodes/edges, styles, and layout bounds.
   - Raster: run preprocessing (denoise, threshold) → vectorize hints (Potrace) → detect boxes/lines via simple heuristics or a detector → produce initial graph with confidence scores.
2) Style inference
   - Extract font family/size, stroke width, corner radius, color palette from existing elements.
   - Build a style preset to apply to new nodes/edges.
3) Placement & routing
   - If doodle provided: use doodle positions as anchors.
   - Else: suggest placement via heuristic (nearest open space, grid snap); ensure no overlaps.
   - Route edges orthogonally with minimal crossings (ELK/Dagre + router).
4) Graph merge
   - Represent the existing diagram as graph JSON (nodes/edges with positions/styles).
   - Apply a change set derived from text (LLM → validated JSON) + doodle anchors.
5) Render & export
   - Render graph in Cytoscape/tldraw with exact positions.
   - For SVG input: merge back into original SVG (preserving groups/ids where safe) or re-render clean SVG; keep a mapping table.
   - Export SVG/PNG; provide a visual diff layer.

## Error handling & UX
- Low-confidence detections: surface to user with suggestions.
- Collision or route failures: fallback to manual nudge tools (drag/snap).
- Keep undo/redo stack; save change set separately for auditability.

## Implementation notes
- Prefer keeping a canonical graph JSON + style preset as the source of truth.
- For raster-only: store the base image and render vector overlay above it; export combined image when needed.
- When merging back to SVG, preserve original metadata and group structure if possible; otherwise attach original as a background layer.
