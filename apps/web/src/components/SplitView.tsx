export function SplitView({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 60px)' }}>
      <div style={{ borderRight: '1px solid #e5e7eb', padding: 12 }}>{left}</div>
      <div style={{ padding: 12 }}>{right}</div>
    </div>
  )
}
