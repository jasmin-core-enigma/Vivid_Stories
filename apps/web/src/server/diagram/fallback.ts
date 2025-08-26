import type { Graph } from '@/server/diagram/schema'

const COLOR_WORDS = ['blue','red','green','yellow','orange','purple','violet','pink','teal','cyan','gray','grey','black','white']

function slugify(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'node'
}

export function fallbackCompile(text: string): Graph {
  const nodes: { id: string; label: string; type?: string; color?: string }[] = []
  const edges: { source: string; target: string; label?: string }[] = []
  const idByLabel = new Map<string, string>()
  const usedIds = new Set<string>()

  function ensureNode(label: string) {
    label = label.trim()
    if (!label) return null
    const key = label
    const existing = idByLabel.get(key)
    if (existing) return existing
    // create stable-ish id
    let base = slugify(label)
    let id = base
    let i = 2
    while (usedIds.has(id)) { id = `${base}-${i++}` }
    usedIds.add(id)
    nodes.push({ id, label })
    idByLabel.set(key, id)
    return id
  }

  // Prepass: color/type directives like "DB is blue" or "make Cache green" or "DB: database"
  const lines = text.split(/\n+|;+/).map(s => s.trim()).filter(Boolean)
  for (const raw of lines) {
    const s = raw.trim()
    // X: type
    const typeMatch = s.match(/^(.+?):\s*(\w[\w\- ]*)$/i)
    if (typeMatch) {
      const label = typeMatch[1].trim()
      const type = typeMatch[2].trim().toLowerCase()
      const id = ensureNode(label)
      if (id) {
        const n = nodes.find(n => n.id === id)!
        n.type = type
      }
      continue
    }
    // X is color / make X color
    const isColor = s.match(/^(.*?)\s+(?:is|=)\s+(\w+)$/i)
    const makeColor = s.match(/^make\s+(.*?)\s+(\w+)$/i)
    const m = makeColor || isColor
    if (m) {
      const label = (makeColor ? m[1] : m[1]).trim()
      const color = (m[2] || '').toLowerCase()
      if (COLOR_WORDS.includes(color)) {
        const id = ensureNode(label)
        if (id) {
          const n = nodes.find(n => n.id === id)!
          n.color = color
        }
        continue
      }
    }
  }

  // Connections: "A connects to B, C via gRPC" or "A -> B" or "A → B" etc.
  for (const raw of lines) {
    const s = raw.trim()
    // find via/over/through labels
    let label: string | undefined
    const viaMatch = s.match(/\b(?:via|over|through|using)\s+([\w\-\/\.\+ ]+)$/i)
    if (viaMatch) label = viaMatch[1].trim()
    // normalize by removing the trailing label phrase
    const s2 = label ? s.replace(viaMatch![0], '').trim() : s

    let from: string | null = null
    let targets: string[] = []

    // pattern 1: connects to
    const c1 = s2.match(/^(.*?)\s+connects?\s+to\s+(.*)$/i)
    if (c1) {
      from = c1[1].trim()
      targets = c1[2].split(/,|\band\b/i).map(t => t.trim()).filter(Boolean)
    } else {
      // pattern 2: arrows (->, →, —>)
      const c2 = s2.match(/^(.*?)\s*(?:-?>|→|—>)\s*(.*)$/)
      if (c2) {
        from = c2[1].trim()
        targets = c2[2].split(/,|\band\b/i).map(t => t.trim()).filter(Boolean)
      }
    }
    if (from && targets.length) {
      const fromId = ensureNode(from)
      for (const t of targets) {
        const toId = ensureNode(t)
        if (fromId && toId) edges.push({ source: fromId, target: toId, label })
      }
    }
  }

  return { nodes, edges }
}
