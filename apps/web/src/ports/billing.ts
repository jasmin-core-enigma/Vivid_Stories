export interface BillingPort {
  createCheckoutSession(input: { planId: string; userId: string }): Promise<{ url: string }>
  getPortalUrl(userId: string): Promise<{ url: string }>
  getSubscriptionStatus(userId: string): Promise<{ plan: string; status: 'inactive'|'active'|'past_due'; quota: number }>
}
