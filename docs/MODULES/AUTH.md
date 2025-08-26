# Auth Module (Swappable)

Encapsulates all authentication and user identity. Default provider: Supabase Auth. Can be swapped for Auth0, Cognito, Firebase, etc.

## Port interface
- signIn(email|oauth)
- signOut()
- getSession()
- getUser()
- onAuthStateChanged(cb)

## Supabase adapter
- Uses supabase-js client in the web app.
- Server side reads service role key only where needed (avoid in browser).

## Replaceability
- Implement the same port for another provider and wire in the container.

## Pages & flows
- Anonymous trial: allow 1 free generate (rate-limited by IP + cookie).
- Login/signup: email magic link, OAuth (GitHub/Google) via Supabase.
- Post-login redirect to /app/editor; session fetched via AuthPort.

## Notes
- Store minimal user profile in DB; authority comes from the provider.
