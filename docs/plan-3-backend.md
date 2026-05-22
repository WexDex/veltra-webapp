# Plan 3 — Backend Complete

## What was built

Full backend wired to PostgreSQL via Prisma. Custom JWT authentication with `jose`. Route protection via `proxy.ts` (Next.js 16 convention). All frontend pages replaced mock data with live API calls.

## Stack decisions

| Decision | Choice | Reason |
|---|---|---|
| Auth library | Custom JWT with `jose` | `next-auth` not compatible with Next.js 16; `jose` is framework-agnostic, no runtime restrictions |
| Route protection | `proxy.ts` (not `middleware.ts`) | Next.js 16 renamed middleware to proxy — `middleware.ts` is deprecated |
| Session storage | `httpOnly` cookie `veltra_session` | Secure, no client JS access, works with SSR |
| JWT expiry | 7 days | Standard session length |
| params in route handlers | `await params` | Next.js 16 breaking change — params is now a Promise |
| cookies() | `await cookies()` | Next.js 16 breaking change — async only |
| API docs | Swagger UI at `/api-docs` | Dev-only (returns 403 in production) |

## Files created

| File | Purpose |
|---|---|
| `lib/session.ts` | JWT sign/verify, cookie helpers, getServerSession |
| `lib/types.ts` | TypeScript types matching DB schema (number IDs) |
| `proxy.ts` | Route protection — redirects unauthenticated/unauthorized requests |
| `app/api/auth/login/route.ts` | POST — credential check, sets JWT cookie |
| `app/api/auth/register/route.ts` | POST — creates user with role 'user' |
| `app/api/auth/logout/route.ts` | POST — clears JWT cookie |
| `app/api/auth/me/route.ts` | GET — returns current session or 401 |
| `app/api/products/route.ts` | GET (public), POST (admin) |
| `app/api/products/[id]/route.ts` | GET (public), PUT/DELETE (admin) |
| `app/api/categories/route.ts` | GET (public) |
| `app/api/employees/route.ts` | GET/POST (admin only) |
| `app/api/employees/[id]/route.ts` | PUT/DELETE (admin only) |
| `app/api/users/route.ts` | GET (logged-in, excludes self) |
| `app/api/messages/route.ts` | GET `?with=[userId]`, POST (logged-in) |
| `app/api/contact/route.ts` | POST (public) |
| `app/api/admin/stats/route.ts` | GET (admin only) — dashboard counts |
| `app/api/docs/route.ts` | GET — OpenAPI JSON spec (dev only) |
| `app/api-docs/page.tsx` | Swagger UI at `/api-docs` |

## DB change

```sql
-- Run on existing database to add role column
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin'));

-- Promote a user to admin
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## Auth flow

```
POST /api/auth/login
  → bcrypt.compare(password, hash)
  → signToken({ id, name, email, role })
  → Set-Cookie: veltra_session=<JWT>; HttpOnly; SameSite=Lax; MaxAge=7d

proxy.ts (every request to /admin/* or /chat/*)
  → reads veltra_session cookie
  → verifyToken() → SessionPayload | null
  → /admin/* requires role === 'admin'
  → /chat/* requires any authenticated session
  → redirect to /auth/login if check fails
```

## Session reading patterns

```ts
// In API Route Handlers (server-side):
import { getServerSession } from "@/lib/session";
const session = await getServerSession(); // reads cookies() async

// In proxy.ts (request-level):
import { verifyToken } from "@/lib/session";
const token = request.cookies.get("veltra_session")?.value;
const session = token ? await verifyToken(token) : null;

// In Client Components:
// Fetch GET /api/auth/me from useEffect → returns { id, name, email, role }
```

## API summary

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/login` | POST | public | Login, sets cookie |
| `/api/auth/register` | POST | public | Register new user |
| `/api/auth/logout` | POST | any | Clear cookie |
| `/api/auth/me` | GET | any | Current session |
| `/api/products` | GET | public | List products (filterable) |
| `/api/products` | POST | admin | Create product |
| `/api/products/[id]` | GET | public | Single product |
| `/api/products/[id]` | PUT | admin | Update product |
| `/api/products/[id]` | DELETE | admin | Delete product |
| `/api/categories` | GET | public | All categories |
| `/api/employees` | GET | admin | All employees |
| `/api/employees` | POST | admin | Create employee |
| `/api/employees/[id]` | PUT | admin | Update employee |
| `/api/employees/[id]` | DELETE | admin | Delete employee |
| `/api/users` | GET | logged-in | Users (excluding self) |
| `/api/messages` | GET | logged-in | Conversation `?with=[id]` |
| `/api/messages` | POST | logged-in | Send message |
| `/api/contact` | POST | public | Contact form submission |
| `/api/admin/stats` | GET | admin | Dashboard counts |
| `/api/docs` | GET | dev only | OpenAPI spec JSON |

## How to set up from scratch

```bash
# 1. Set DATABASE_URL and JWT_SECRET in .env
# 2. Run schema + add role column
psql -U postgres -d veltra -f docs/schema.sql
psql -U postgres -d veltra -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'));"

# 3. Seed database
npm run db:seed

# 4. Promote a user to admin
psql -U postgres -d veltra -c "UPDATE users SET role = 'admin' WHERE email = 'your@email.com';"

# 5. Start dev server
npm run dev

# 6. Login at /auth/login with the admin email and password 'password123'
```
