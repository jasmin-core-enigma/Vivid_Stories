import { NextResponse } from 'next/server'
import { GraphSchema, type Graph } from '@/server/diagram/schema'
import { compileWithOpenAI } from '@/server/diagram/providers/openai'
import { fallbackCompile } from '@/server/diagram/fallback'

async function providerCompile(text: string): Promise<Graph | null> {
  // Try OpenAI first (env-driven); return null if key missing or failure
  return await compileWithOpenAI(text)
}

export async function POST(req: Request) {
  const { text } = await req.json() as { text?: string }
  if (!text || !text.trim()) return NextResponse.json({ error: 'Missing text' }, { status: 400 })
  const candidate = (await providerCompile(text)) ?? fallbackCompile(text)
  const parsed = GraphSchema.safeParse(candidate)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid graph', issues: parsed.error.issues }, { status: 422 })
  return NextResponse.json(parsed.data)
}
