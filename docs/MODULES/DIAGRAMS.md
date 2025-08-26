# Diagrams Module (Swappable)

Converts natural language + optional doodle into structured diagrams.

## Port interface
- compile({ text, constraints?, doodleSvg?, layout }) → { graphJson, svgUrl }
- export({ graphJson, format: svg|png|mermaid|dot }) → url

## Default stack
- Text → Graph JSON via LLM
- Auto-layout via Dagre/ELK
- Render via Cytoscape.js or tldraw; export as SVG

## Replaceability
- Swap LLM provider or layout engine; keep the graph schema stable.

## Notes
- Support style/colors per node/edge.
- Vectorize doodles (Potrace) to snap to nodes/edges.
