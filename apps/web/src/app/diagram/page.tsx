'use client'
import { useState } from 'react'
import { SplitView } from '@components/SplitView'
import { DiagramCanvas } from '@components/DiagramCanvas'
import { container } from '@lib/container'
import type { Graph } from '@ports/diagram'

export const dynamic = 'force-dynamic'

export default function DiagramPage() {
  const [text, setText] = useState('API connects to Auth; Auth connects to DB; Dashboard reads from API')
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] })
  const [loading, setLoading] = useState(false)

  async function compile() {
    setLoading(true)
    try {
      const g = await container.diagram.compile({ text })
      setGraph(g)
    } finally {
      setLoading(false)
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(graph, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'diagram.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportMermaid() {
    // Simple flowchart direction top-down
    const lines = ["flowchart TD"]
    for (const n of graph.nodes) lines.push(`${n.id}[${n.label ?? n.id}]`)
    for (const e of graph.edges) lines.push(`${e.source} --> ${e.target}`)
    const blob = new Blob([lines.join("\n")], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'diagram.mmd'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <SplitView
      left={(
        <div>
          <h2>Describe your diagram</h2>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={18} style={{ width: '100%', padding: 8 }} />
          <div style={{ marginTop: 8 }}>
            <button onClick={compile} disabled={loading} style={{ padding: '8px 12px' }}>{loading ? 'Compiling…' : 'Compile'}</button>
          </div>
        </div>
      )}
      right={(
        <div>
          <h2>Diagram</h2>
          <div style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
            <button onClick={exportJson} style={{ padding: '6px 10px' }}>Export JSON</button>
            <button onClick={exportMermaid} style={{ padding: '6px 10px' }}>Export Mermaid</button>
          </div>
          <DiagramCanvas graph={graph} />
        </div>
      )}
    />
  )
}
