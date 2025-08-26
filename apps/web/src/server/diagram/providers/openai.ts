import type { Graph } from '@/server/diagram/schema'

function buildPrompt() {
  return `You convert natural language descriptions of diagrams into a strict JSON graph.
Return ONLY a JSON object with this exact shape:
{
  "nodes": [{ "id": string, "label"?: string, "type"?: string, "color"?: string }...],
  "edges": [{ "id"?: string, "source": string, "target": string, "label"?: string }...]
}
Rules:
- Create unique, short ids for nodes (e.g., n1, n2...).
- Use labels from the text.
- Only include edges between existing node ids.
- Do NOT include comments or explanations; JSON only.`
}

export async function compileWithOpenAI(text: string): Promise<Graph | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null
  const model = process.env.DIAGRAM_MODEL || 'gpt-4o-mini'
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildPrompt() },
          { role: 'user', content: text }
        ]
      })
    })
    if (!res.ok) return null
    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content) return null
    const json = JSON.parse(content)
    return json as Graph
  } catch {
    return null
  }
}
