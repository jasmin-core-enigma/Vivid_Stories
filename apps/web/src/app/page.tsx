export default function HomePage() {
  return (
    <section style={{ maxWidth: 960, margin: '32px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 36, marginBottom: 12 }}>Vivid Stories</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Write scenes on the left, visualize on the right. Guide results with doodles. For writers and engineers.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <a href="/try" style={{ background: '#111827', color: 'white', padding: '10px 14px', borderRadius: 8 }}>Try it</a>
        <a href="/pricing" style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb' }}>Pricing</a>
      </div>
    </section>
  )
}
