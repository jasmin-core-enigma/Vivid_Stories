# Architecture Blueprint (Modular, Swappable, SaaS-ready)

This document describes a clean, modular architecture for Vivid Stories, designed so product logic and infrastructure choices (auth, billing, hosting, model providers) are encapsulated and can be swapped with minimal code changes.


## Goals
- Separation of concerns: UI, application services, domain, adapters, infra.
- Swappable providers: Supabase (auth/db), Stripe (billing), Vercel (hosting), model providers.
- SaaS-ready: free trial, paywall, plans/quotas, receipts; anonymous trial → login → subscribe.
- Testable: providers behind interfaces; use mocks/fakes in tests.
- Incremental: start small, scale to workers/queues, S3, CDNs.


## High-level layout
- apps/
  - web/ (Next.js + TS): pages, UI, hooks, feature modules
  - server/ (FastAPI or Node svc): API for generation jobs, webhook handlers (billing), queues
- packages/
  - core-domain/: pure types, schemas, domain services (no external deps)
  - core-ui/: shared UI lib (buttons, panes, canvas wrappers)
  - core-adapters/: provider interfaces and reference implementations
  - core-utils/: logging, config, errors, observability
- infra/
  - docker/, k8s/, terraform/ (optional), vercel.json, nginx.conf, etc.
- docs/: specs, modules, API contracts


## Hexagonal/Ports-and-Adapters
- Domain (core-domain): scene graph, diagram graph, prompt constraints, quotas.
- Application services (use cases): GenerateImage, ParseScenes, CompileDiagram, ManageQuota.
- Ports (interfaces): AuthPort, BillingPort, StoragePort, QueuePort, ModelPort, DBPort.
- Adapters (providers): SupabaseAuthAdapter, StripeBillingAdapter, S3StorageAdapter, RedisQueueAdapter, Flux/SDXLModelAdapter, PostgresAdapter.


## Runtime views
- Next.js (app router) handles public pages, login, pricing, dashboard, editor.
- API routes:
  - /api/ping (health)
  - /api/generate (enqueues job) → returns jobId
  - /api/jobs/:id (status)
  - /api/diagrams/compile
  - /api/billing/webhook (Stripe)
  - /api/auth/* (proxied to Supabase or custom interface)
- Worker service consumes queue for GPU/model tasks.


## Environment and config
- Single config layer reads env and builds provider instances.
- Feature flags for hosted vs local models, diagram layout engine, etc.
- All secrets via environment; local .env.development, prod via platform secrets.


## Data and persistence
- DB (Postgres): users, projects, scenes, jobs, quotas, subscriptions.
- Object storage (S3/Supabase storage): doodles, generated images, exports.
- Caching (Redis): job progress, rate limits.


## Security & compliance
- Stripe webhooks signed; customer portal for billing.
- RBAC: normal user, admin; per-user quotas and limits enforced server-side.
- Content moderation toggles; request logging and audit trails.


## Migration path
- Phase 1: web app only + hosted generation provider.
- Phase 2: separate worker + queue, signed storage URLs.
- Phase 3: GPU runners and model fine-tuning hooks, multi-tenant scaling.
