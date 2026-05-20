# Plan 1 — Frontend Complete

## What was built

Full Next.js 16 (App Router) frontend with Tailwind CSS. All pages use hardcoded mock data from `lib/mock-data.ts`. No API calls. All routing functional.

## Design System

| Token | Value |
|---|---|
| Background | `gray-950` (`rgb(3 7 18)`) |
| Surface (cards) | `gray-900` with `gray-800` border |
| Text primary | `gray-100` |
| Text secondary | `gray-400` |
| Accent | `blue-700` (`#1d4ed8`) |
| Font | Inter (via `next/font/google`) |
| Border radius | `rounded-2xl` for cards/modals, `rounded-xl` for buttons/inputs |

## File Map

```
lib/
  mock-data.ts          — all types + mock data (products, users, employees, messages, contacts)
  utils.ts              — cn() utility for class merging

components/
  ui/
    VeltraLogo.tsx      — SVG V-chevron logo
    Button.tsx          — variants: primary, ghost, danger | sizes: sm, md, lg
    Input.tsx           — label + input + error state
    Card.tsx            — gray-900 surface wrapper
    Badge.tsx           — pill: default, blue, green, red, yellow
    Avatar.tsx          — initials fallback, color-coded by name
    Modal.tsx           — overlay + ESC close + portal-style panel
  layout/
    Navbar.tsx          — sticky, mobile-responsive, logo + nav + auth CTAs
    Footer.tsx          — minimal: logo, links, copyright
    AdminSidebar.tsx    — fixed left sidebar with active state highlighting
  products/
    ProductCard.tsx     — image + name + category badge + description
    ProductForm.tsx     — controlled form for add/edit
  employees/
    EmployeeCard.tsx    — table row with edit/delete
    EmployeeForm.tsx    — controlled form for add/edit
  chat/
    UserListItem.tsx    — user row + add friend / message button
    MessageBubble.tsx   — left/right bubble with timestamp
    MessageInput.tsx    — textarea + send button (Enter to send)

app/
  layout.tsx                      — root shell (Inter font, gray-950 bg)
  globals.css                     — Tailwind v4 + @theme + base dark styles
  (public)/
    layout.tsx                    — Navbar + Footer wrapper
    page.tsx                      — Home: hero + featured products
    catalogue/page.tsx            — Category filter + search + product grid
    catalogue/[id]/page.tsx       — Product detail (server component, awaits params)
    about/page.tsx                — Stats + company story
    contact/page.tsx              — Contact form with success state
    auth/login/page.tsx           — Login form
    auth/register/page.tsx        — Register form
  (admin)/
    layout.tsx                    — AdminSidebar wrapper
    dashboard/page.tsx            — Stat cards + recent contacts table
    products/page.tsx             — Products table + add/edit/delete modal
    employees/page.tsx            — Employees table + add/edit/delete modal
  (protected)/
    layout.tsx                    — Navbar wrapper
    chat/page.tsx                 — User list with search + add friend
    chat/[userId]/page.tsx        — Conversation: message thread + input bar
```

## Key Decisions

- **Tailwind v4** — `@theme` in CSS instead of `tailwind.config.ts`. No config file needed.
- **Dark-first** — Base colors set directly in `globals.css`, not via `dark:` prefix.
- **Mock data** — All types exported from `lib/mock-data.ts`, ready for Prisma replacement in Plan 3.
- **Client components** — Pages with interactivity (catalogue filter, chat, modals) are `"use client"`. Static pages (home, about, product detail) are server components.
- **params** — Dynamic server components use `async/await params` (Next.js 15+ pattern).

## What's intentionally missing

- No API calls (Plan 3)
- No auth state (NextAuth in Plan 3)
- No image upload (Cloudinary deferred)
- No real form submission (backend in Plan 3)

## Next: Plan 2 — Database

Before starting, confirm:
1. PostgreSQL connection string format (local or remote, SSL?)
2. Column names exactly as in brief, or any differences?
3. Any DB constraints/defaults already set?
