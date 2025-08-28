# MVP Spec — UML Workflow Diagram (Customer Errors Use Cases)

This spec defines the first implementation slice to prove value on a realistic UML workflow.

## Objective
Generate a valid, readable UML activity (workflow) diagram for the three customer use cases and support round‑trip import/export.

## Inputs
- Natural language prompt (as provided in the roadmap)
- Optional: glossary/synonyms ("static configuration", "dataset configuration", "invariant files", "error IDs")
- Optional: diagram family hint ("UML Activity")

## Outputs
- Canonical Graph JSON (internal)
- Exports: Mermaid (flowchart or sequence/activity flavor) and PlantUML (activity)
- Visual: SVG/PNG; rendered in canvas with Cytoscape
- Import: Mermaid/PlantUML back to Graph JSON

## Diagram semantics
- Nodes: Action, Decision/Gateway, Merge, Start, End; Artifacts (Config, Dataset, Invariant)
- Edges: Directed flows; labels for decisions and transitions
- Types: { action, decision, merge, start, end, artifact }

## Parsing strategy
- Deterministic pass extracts entities: "error list", "invariant files", "static configuration", "dataset configuration"
- Identify three flows (use cases) from enumerations in the prompt
- Decisions:
  - For use case 2: are IDs specified in invariant files? → branch to error ID assignment → continue
  - For use case 3: overwrite static config with dataset config (same IDs, different attributes)
- Normalize names via glossary; ensure consistent node IDs

## Validation rules
- No dangling nodes/edges
- Start and End present per flow
- Ensure unique labels per decision; dedupe repeated artifacts across flows
- Enforce same Error IDs for static/dataset where stated

## Layout
- ELK.js layered (left→right), minimize crossings, enforce spacing for readability
- Multi‑pass: try 2–3 configs and pick highest quality score

## Export/Import
- Export to Mermaid (flowchart TD/LR) and PlantUML activity
- Import parsers reconstruct nodes/edges/types from syntax
- Round‑trip test: export → import → compare normalized Graph JSON (tolerate id changes)

## UI/UX
- On /diagram page: “Diagram family: UML Activity” dropdown; prompt textarea; Compile button
- Export buttons: Mermaid, PlantUML, SVG, PNG
- Import modal: paste Mermaid/PlantUML → parse → re‑layout → render

## Tests
- Unit tests for parser: entity extraction, flows, decisions, ID consistency
- Snapshot tests for exporter strings (Mermaid, PlantUML)
- Round‑trip test: Graph → PlantUML → Graph equality (shape‑wise)

## Milestone acceptance
- Given the provided prompt, the app renders a clear activity diagram with three flows, passes validation, exports Mermaid/PlantUML without errors, and re‑imports to equivalent Graph JSON.
