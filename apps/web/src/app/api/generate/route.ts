import { NextResponse } from 'next/server'
import { container } from '@lib/container'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as { text?: string }
  const prompt = body.text ?? 'A vivid scene'
  const { imageUrl } = await container.model.generateImage({ prompt, size: { width: 960, height: 540 } })
  return NextResponse.json({ imageUrl })
}
