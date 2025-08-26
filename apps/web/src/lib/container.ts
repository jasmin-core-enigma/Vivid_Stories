import { StubAuth, StubBilling, StubModel, StubQueue, StubStorage, StubPricing } from '@adapters/stubs'
import { DiagramApiAdapter } from '@adapters/diagramApi'
import type { AuthPort } from '@ports/auth'
import type { BillingPort } from '@ports/billing'
import type { ModelPort } from '@ports/model'
import type { QueuePort } from '@ports/queue'
import type { StoragePort } from '@ports/storage'
import type { PricingPort } from '@ports/pricing'
import type { DiagramPort } from '@ports/diagram'

export const container: {
  auth: AuthPort
  billing: BillingPort
  model: ModelPort
  queue: QueuePort
  storage: StoragePort
  pricing: PricingPort
  diagram: DiagramPort
} = {
  auth: StubAuth,
  billing: StubBilling,
  model: StubModel,
  queue: StubQueue,
  storage: StubStorage,
  pricing: StubPricing,
  diagram: DiagramApiAdapter,
}
