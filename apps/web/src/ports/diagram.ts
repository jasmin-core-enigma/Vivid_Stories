export interface GraphNode {
  id: string
  label?: string
  type?: string
  color?: string
  position?: { x: number; y: number }
}

export interface GraphEdge {
  id?: string
  source: string
  target: string
  label?: string
}

export interface Graph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface DiagramPort {
  compile(input: { text: string }): Promise<Graph>
}
