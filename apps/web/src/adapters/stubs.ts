import type { AuthPort } from '@ports/auth'
import type { BillingPort } from '@ports/billing'
import type { ModelPort } from '@ports/model'
import type { StoragePort } from '@ports/storage'
import type { QueuePort } from '@ports/queue'
import type { PricingPort, Plan } from '@ports/pricing'
import type { DiagramPort, Graph } from '@ports/diagram'

export const StubAuth: AuthPort = {
  async signInWithEmail() {},
  async signOut() {},
  async getSession() { return { userId: 'demo-user' } }
}

export const StubBilling: BillingPort = {
  async createCheckoutSession() { return { url: '/account' } },
  async getPortalUrl() { return { url: '/account' } },
  async getSubscriptionStatus() { return { plan: 'free', status: 'active', quota: 1 } }
}

export const StubModel: ModelPort = {
  async generateImage() { return { imageUrl: 'https://picsum.photos/seed/vivid/960/540' } },
  async generateWithControl() { return { imageUrl: 'https://picsum.photos/seed/vivid2/960/540' } },
  async inpaint() { return { imageUrl: 'https://picsum.photos/seed/vivid3/960/540' } }
}

export const StubStorage: StoragePort = {
  async putObject({ key }) { return { url: `/assets/${key}`, key } },
  async getSignedUrl(key) { return { url: `/assets/${key}` } },
  async deleteObject() { }
}

export const StubQueue: QueuePort = {
  async enqueue() { return { jobId: Math.random().toString(36).slice(2) } },
  async getStatus() { return { status: 'done', progress: 100 } }
}

const plans: Plan[] = [
  { id: 'free', name: 'Free', price: 0, features: ['1 generation/day', 'Watermark'] },
  { id: 'pro', name: 'Pro', price: 15, features: ['Unlimited', 'Priority queue'] }
]

export const StubPricing: PricingPort = {
  async getPlans() { return plans },
  async getQuota() { return { remaining: 1, window: 'day' } },
  async consume() { }
}

export const StubDiagram: DiagramPort = {
  async compile({ text }): Promise<Graph> {
    // naive extraction: split by lines, connect sequentially
    const lines = text.split(/\n+/).map(s => s.trim()).filter(Boolean)
    const nodes = lines.map((label, i) => ({ id: `n${i+1}`, label }))
    const edges = nodes.slice(1).map((n, i) => ({ source: nodes[i].id, target: n.id }))
    return { nodes, edges }
  }
}
