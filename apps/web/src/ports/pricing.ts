export interface Plan { id: string; name: string; price: number; features: string[] }

export interface PricingPort {
  getPlans(): Promise<Plan[]>
  getQuota(userId: string): Promise<{ remaining: number; window: string }>
  consume(userId: string, amount?: number): Promise<void>
}
