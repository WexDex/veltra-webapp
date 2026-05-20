# Veltra — Architecture & Tech Communication

## Stack Overview

```
Browser
  └─ Next.js 16 App Router (React Server Components + Client Components)
       ├─ Server Components      → data fetched server-side, zero client JS
       ├─ Client Components      → interactivity, state, forms ("use client")
       └─ API Routes (app/api/*) → REST endpoints, Next.js Route Handlers
            └─ Prisma Client (lib/db.ts)
                 └─ PostgreSQL (hosted DB, tables pre-created)
```

## Auth Flow

```
Login form ("use client")
  → POST /api/auth/[...nextauth]   (NextAuth credentials provider)
      → prisma.user.findUnique({ where: { email } })
      → bcrypt.compare(password, user.password_hash)
      → JWT token issued, stored in HTTP-only cookie
      → middleware.ts intercepts every request:
            /admin/*    → requires session.user.role === "admin"
            /chat/*     → requires any valid session
            everything else → public
```

## Message Polling (Plan 1 → Plan 3)

```
Chat conversation page ("use client")
  → setInterval(3000ms)
      → GET /api/messages?with=[userId]
          → prisma.message.findMany({ where: { OR: [sender/receiver pair] } })
          → JSON response
          → React state update → re-render bubbles

WebSocket upgrade path (deferred):
  Same data layer (Prisma query unchanged).
  Replace setInterval + fetch with a WebSocket connection or Pusher channel.
  Only the transport changes — the query and render logic stay identical.
```

## Image Storage (Current vs Future)

```
Current (Plan 1–3):
  Product form → image_url string (e.g. picsum.photos URL or manual URL)
  → stored in products.image_url (VARCHAR) in PostgreSQL
  → rendered with next/image using remotePatterns

Future (post-MVP):
  Product form → file <input type="file">
  → POST to Cloudinary API → returns CDN URL
  → URL stored in products.image_url (same column, same rendering)
  No schema change needed — only the upload UI and API route change.
```

## Route Groups

| Group | URL prefix | Layout |
|---|---|---|
| `(public)` | `/`, `/catalogue`, `/about`, `/contact`, `/auth/*` | Navbar + Footer |
| `(admin)` | `/admin/*` | AdminSidebar only |
| `(protected)` | `/chat/*` | Navbar only |

Route groups `(name)` are Next.js App Router folders that organize code without affecting the URL path.

## API Route Conventions (Plan 3)

```
GET    /api/products          → list all (public)
POST   /api/products          → create (admin only)
GET    /api/products/[id]     → single product (public)
PUT    /api/products/[id]     → update (admin only)
DELETE /api/products/[id]     → delete (admin only)

All routes:
  - Validate input with manual checks (no Zod in scope)
  - Return 400 { error, field } on validation failure
  - Return 401/403 on auth failure
  - Return 404 on missing resource
  - Return 200/201 with JSON body on success
```

## API Docs (Swagger)

```
/api/docs       → OpenAPI JSON spec (generated from JSDoc @swagger annotations)
/api-docs       → Swagger UI page (admin/dev-only in production)
```

## Prisma Usage Rules

Prisma is used **for queries only**. Tables are pre-created in PostgreSQL.

```
NEVER run: prisma migrate, prisma db push, prisma migrate deploy
ALWAYS run after schema changes: prisma generate

Singleton client (lib/db.ts):
  import { PrismaClient } from "@prisma/client"
  const globalForPrisma = global as unknown as { prisma: PrismaClient }
  export const prisma = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```
