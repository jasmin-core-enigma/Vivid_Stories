'use client'
import { useState } from 'react'
import { SplitView } from '@components/SplitView'

export default function EditorPage() {
  const [text, setText] = useState('Scene 1: ...\n\nScene 2: ...')
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
      const data = await res.json()
      setImages((prev) => [data.imageUrl, ...prev])
    } finally {
      setLoading(false)
    }
  }

  return (
    <SplitView
      left={(
        <div>
          <h2>Editor</h2>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={20} style={{ width: '100%', padding: 8 }} />
          <div style={{ marginTop: 8 }}>
            <button onClick={generate} disabled={loading} style={{ padding: '8px 12px' }}>{loading ? 'Generating…' : 'Generate'}</button>
          </div>
        </div>
      )}
      right={(
        <div>
          <h2>Slideshow</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt={`Scene ${i + 1}`} style={{ width: '100%', borderRadius: 8, border: '1px solid #e5e7eb' }} />
            ))}
          </div>
        </div>
      )}
    />
  )
}
