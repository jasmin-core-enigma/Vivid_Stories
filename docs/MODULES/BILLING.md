# Billing Module (Swappable)

Handles plans, checkout, and subscriptions. Default provider: Stripe.

## Port interface
- createCheckoutSession({ planId, userId }) → url
- getPortalUrl(userId) → url
- handleWebhook(payload, signature) → events
- getSubscriptionStatus(userId) → { plan, status, quota }

## Stripe adapter
- Uses Stripe SDK on server only.
- Webhook endpoint verifies signature; updates DB subscription records.
- Customer portal for self-service.

## Replaceability
- Implement the same port for other billing providers; reuse the domain model for plans and quotas.

## Plans & quotas
- Free: 1–3 generations/day, small image size, watermark.
- Pro: Unlimited or higher caps, larger sizes, priority queue.
- Team: Shared projects, collaboration.
