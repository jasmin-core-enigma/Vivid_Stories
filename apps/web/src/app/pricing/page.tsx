'use client'
import { useEffect, useState } from 'react'
import { container } from '@lib/container'

export default function PricingPage() {
  const [plans, setPlans] = useState<{ id: string; name: string; price: number; features: string[] }[]>([])
  useEffect(() => {
    container.pricing.getPlans().then(setPlans)
  }, [])
  return (
    <section style={{ maxWidth: 960, margin: '32px auto', padding: '0 16px' }}>
      <h1>Pricing</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        {plans.map((p) => (
          <div key={p.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
            <h3>{p.name}</h3>
            <div style={{ fontSize: 28, fontWeight: 700 }}>${p.price}/mo</div>
            <ul>
              {p.features.map((f, i) => (<li key={i}>{f}</li>))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
