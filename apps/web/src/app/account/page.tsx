'use client'
import { useEffect, useState } from 'react'
import { container } from '@lib/container'

export default function AccountPage() {
  const [status, setStatus] = useState<{ plan: string; status: string; quota: number } | null>(null)
  useEffect(() => {
    container.auth.getSession().then((s) => {
      if (s.userId) container.billing.getSubscriptionStatus(s.userId).then(setStatus)
    })
  }, [])
  async function openPortal() {
    const sess = await container.auth.getSession()
    if (!sess.userId) return
    const { url } = await container.billing.getPortalUrl(sess.userId)
    window.location.href = url
  }
  return (
    <section style={{ maxWidth: 720, margin: '32px auto', padding: '0 16px' }}>
      <h1>Account</h1>
      <pre style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>{JSON.stringify(status, null, 2)}</pre>
      <button onClick={openPortal} style={{ padding: '8px 12px' }}>Open billing portal</button>
    </section>
  )
}
