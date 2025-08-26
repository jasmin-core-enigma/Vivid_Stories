import { z } from 'zod'

export const GraphNodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().optional(),
  type: z.string().optional(),
  color: z.string().optional(),
  position: z.object({ x: z.number(), y: z.number() }).optional(),
})

export const GraphEdgeSchema = z.object({
  id: z.string().optional(),
  source: z.string().min(1),
  target: z.string().min(1),
  label: z.string().optional(),
})

export const GraphSchema = z.object({
  nodes: z.array(GraphNodeSchema).min(1),
  edges: z.array(GraphEdgeSchema).optional().default([]),
})

export type Graph = z.infer<typeof GraphSchema>
