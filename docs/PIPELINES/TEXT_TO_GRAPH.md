# Pipeline — Text → Diagram Graph

Convert natural language to a structured, valid graph with auto-layout and export.

## Inputs
- Text description of components and relations
- Optional constraints: colors, shapes, grouping, lanes
- Optional doodle (anchors)

## Outputs
- Graph JSON: { nodes: [...], edges: [...], styles: {...}, layout: {...} }
- SVG/PNG
- Optional Mermaid/DOT export

## Steps
1) Extract entities and relations
   - Use LLM with a constrained JSON schema (Zod/JSON Schema) for nodes and edges.
   - Validate and normalize (ids, labels, types, colors).
2) Apply constraints
   - Colors/palette, shapes, icons, grouping, swimlanes.
3) Layout
   - Run ELK/Dagre; grid snap; reserve margins; avoid overlaps; orthogonal routing.
4) Render
   - Cytoscape or tldraw with rounded/straight edges.
   - Export as SVG; render PNG for previews.
5) Corrections
   - Quick commands: “make DB blue”, “connect A to B”, “align auth under API”.
   - Apply small patches and re-render.

## Error handling
- Ambiguity detection: request clarification or pick sensible defaults.
- Conflicts: highlight and suggest fixes.
