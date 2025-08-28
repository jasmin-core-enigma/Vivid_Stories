import { describe, it, expect } from 'vitest'
import { fallbackCompile } from './fallback'

describe('fallbackCompile', () => {
  it('parses simple arrow', () => {
    const g = fallbackCompile('A -> B')
  expect(g.nodes.map((n: any) => n.label)).toEqual(['A','B'])
    expect(g.edges).toHaveLength(1)
    expect(g.edges[0].label).toBeUndefined()
  })

  it('supports multiple targets with via label', () => {
    const g = fallbackCompile('API connects to DB, Cache via gRPC')
  expect(g.nodes.find((n: any) => n.label === 'API')).toBeTruthy()
  expect(g.nodes.find((n: any) => n.label === 'DB')).toBeTruthy()
  expect(g.nodes.find((n: any) => n.label === 'Cache')).toBeTruthy()
    expect(g.edges).toHaveLength(2)
    for (const e of g.edges) expect(e.label).toBe('gRPC')
  })

  it('captures types and colors', () => {
    const g = fallbackCompile('DB: database; make Cache green; API is blue; API -> DB')
  const db = g.nodes.find((n: any) => n.label === 'DB')!
  const cache = g.nodes.find((n: any) => n.label === 'Cache')!
  const api = g.nodes.find((n: any) => n.label === 'API')!
    expect(db.type).toBe('database')
    expect(cache.color).toBe('green')
    expect(api.color).toBe('blue')
  })

  it('produces stable ids for duplicate labels', () => {
    const g = fallbackCompile('A -> B; A -> C; A -> D')
  const ids = g.nodes.filter((n: any) => n.label === 'A').map((n: any) => n.id)
    expect(new Set(ids).size).toBe(1)
  })
})
