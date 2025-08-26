# Pricing & Plans Module

Defines plans/limits, integrates with Billing, and enforces quotas.

## Port interface
- getPlans() → [{ id, name, price, features }]
- getQuota(userId) → { remaining, window }
- consume(userId, amount=1)

## Notes
- Domain defines what counts as a unit (image generation, diagram compile).
- Billing updates subscription; Pricing maps subscription → limits.
