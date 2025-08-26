import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vivid Stories',
  description: 'Write and visualize with text + doodles',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: 12 }}>
          <a href="/" style={{ fontWeight: 700 }}>Vivid Stories</a>
          <nav style={{ display: 'flex', gap: 12 }}>
            <a href="/try">Try</a>
            <a href="/diagram">Diagram</a>
            <a href="/pricing">Pricing</a>
            <a href="/account">Account</a>
          </nav>
        </header>
        <main style={{ minHeight: 'calc(100vh - 60px)' }}>{children}</main>
      </body>
    </html>
  )
}
