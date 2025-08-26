# Queue/Jobs Module (Swappable)

Queues GPU/model jobs and reports progress.

## Port interface
- enqueue({ type, payload }) → jobId
- getStatus(jobId) → { status, progress, result?, error? }
- subscribe(jobId, cb) → unsubscribe

## Default providers
- Redis-backed (BullMQ for Node; RQ/Celery for Python).

## Replaceability
- Abstract the queue; workers call into the Models module only.
