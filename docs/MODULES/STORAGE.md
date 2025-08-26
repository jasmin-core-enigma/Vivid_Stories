# Storage Module (Swappable)

Manages assets (doodles, generated images, exports) and signed URLs.

## Port interface
- putObject({ key, contentType, data|stream }) → { url, key }
- getSignedUrl(key, ttl) → url
- deleteObject(key)

## Default providers
- S3-compatible (AWS S3, MinIO, Supabase Storage) with the same API.

## Replaceability
- Keep S3-like semantics; change only the adapter.
