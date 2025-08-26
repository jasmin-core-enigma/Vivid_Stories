'use client'
import { useEffect, useRef } from 'react'
import type { Graph } from '@ports/diagram'

export function DiagramCanvas({ graph }: { graph: Graph }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const cyRef = useRef<any | null>(null)
  const libsLoadedRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    async function ensureCy() {
      if (!ref.current) return
      if (!libsLoadedRef.current) {
        const [{ default: cytoscape }, { default: dagre }, { default: svg }] = await Promise.all([
          import('cytoscape'),
          import('cytoscape-dagre'),
          import('cytoscape-svg')
        ])
        cytoscape.use(dagre)
        cytoscape.use(svg)
        if (!cancelled && !cyRef.current) {
      cyRef.current = cytoscape({
            container: ref.current!,
            style: [
        { selector: 'node', style: { 'background-color': 'data(color)', label: 'data(label)', 'text-valign': 'center', color: '#0f172a', 'font-size': 12 } },
              { selector: 'edge', style: { width: 2, 'line-color': '#334155', 'target-arrow-color': '#334155', 'target-arrow-shape': 'triangle' } }
            ]
          })
        }
        libsLoadedRef.current = true
      }
      if (!cancelled && cyRef.current) {
        const cy = cyRef.current
        cy.elements().remove()
    cy.add([
          ...graph.nodes.map(n => ({
      data: { id: n.id, label: n.label ?? n.id, color: n.color ?? '#0ea5e9' },
            position: n.position ? { x: n.position.x, y: n.position.y } : undefined
          })),
          ...graph.edges.map(e => ({
            data: { id: e.id ?? `${e.source}-${e.target}`, source: e.source, target: e.target, label: e.label }
          }))
        ] as any)
        cy.layout({ name: 'dagre' }).run()
      }
    }
    ensureCy()
    return () => { cancelled = true }
  }, [graph])

  function exportPng() {
    const png = cyRef.current?.png({ full: true, scale: 2 })
    if (!png) return
    const a = document.createElement('a')
    a.href = png
    a.download = 'diagram.png'
    a.click()
  }

  function exportSvg() {
    const svg = cyRef.current?.svg({ full: true, scale: 1 }) as string | undefined
    if (!svg) return
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'diagram.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div ref={ref} style={{ height: 480, border: '1px solid #e5e7eb', borderRadius: 8 }} />
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <button onClick={exportPng} style={{ padding: '6px 10px' }}>Export PNG</button>
        <button onClick={exportSvg} style={{ padding: '6px 10px' }}>Export SVG</button>
      </div>
    </div>
  )
}
