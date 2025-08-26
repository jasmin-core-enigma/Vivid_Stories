'use client'
import { useState } from 'react'
import { SplitView } from '@components/SplitView'

export default function TryPage() {
  const [text, setText] = useState('A serene forest clearing at dawn...')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onGenerate() {
    setLoading(true)
    try {
      // Stub: call local API that returns a placeholder image
      const res = await fetch('/api/generate', { method: 'POST', body: JSON.stringify({ text }), headers: { 'Content-Type': 'application/json' } })
      const data = await res.json()
      setImageUrl(data.imageUrl)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SplitView
      left={(
        <div>
          <h2>Describe your scene</h2>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={16} style={{ width: '100%', padding: 8 }} />
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button onClick={onGenerate} disabled={loading} style={{ padding: '8px 12px' }}>{loading ? 'Generating…' : 'Generate'}</button>
          </div>
        </div>
      )}
      right={(
        <div>
          <h2>Preview</h2>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid #e5e7eb' }} />
          ) : (
            <div style={{ height: 360, border: '1px dashed #cbd5e1', borderRadius: 8, display: 'grid', placeItems: 'center', color: '#64748b' }}>
              Generated image will appear here
            </div>
          )}
        </div>
      )}
    />
  )
}
