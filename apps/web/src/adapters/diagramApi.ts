import type { DiagramPort, Graph } from '@ports/diagram'

export const DiagramApiAdapter: DiagramPort = {
  async compile({ text }): Promise<Graph> {
    const res = await fetch('/api/diagram/compile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
    if (!res.ok) throw new Error('Compile failed')
    return res.json()
  }
}
