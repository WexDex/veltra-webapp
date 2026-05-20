# Plan 2 — Database Complete

## What was set up

Prisma 5 connected to local PostgreSQL. Full CREATE TABLE SQL written. Standalone seed script executable via ts-node outside of Next.js runtime.

## Stack decisions

| Decision | Choice | Reason |
|---|---|---|
| Prisma version | 5.x (not 7) | Prisma 7 removed `url` from datasource — breaking change. v5 is stable standard. |
| DB connection | Local PostgreSQL, no SSL | Developer local setup |
| Script runner | ts-node | Runs TypeScript directly without compile step |
| Password hashing | bcryptjs | Same lib used in Plan 3 NextAuth credentials provider |
| FK seed order | categories → users → products → employees → friendships → messages → contacts | Respects all foreign key constraints |

## Files created

| File | Purpose |
|---|---|
| `.env` | `DATABASE_URL` — update with your actual credentials |
| `docs/schema.sql` | Full CREATE TABLE SQL — run once in psql to create all 7 tables |
| `prisma/schema.prisma` | Prisma model definitions mapping to existing tables |
| `lib/db.ts` | Singleton PrismaClient — prevents connection exhaustion in Next.js hot-reload |
| `tsconfig.scripts.json` | ts-node compatible tsconfig (commonjs + node moduleResolution) |
| `scripts/generateSample.ts` | Standalone seed generator — core export + CLI entry point |
| `scripts/seed-output.sql` | Written on each run — full INSERT SQL for manual inspection |

## Table schema (columns + constraints)

### categories
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL, UNIQUE |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

### users
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| password_hash | TEXT | NOT NULL |
| name | VARCHAR(100) | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

### products
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(255) | NOT NULL |
| description | TEXT | nullable |
| image_url | TEXT | nullable |
| category_id | INTEGER | NOT NULL, FK → categories(id) ON DELETE CASCADE |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

### employees
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| role | VARCHAR(100) | NOT NULL |
| phone | VARCHAR(50) | nullable |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

### friendships
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | NOT NULL, FK → users(id) ON DELETE CASCADE |
| friend_id | INTEGER | NOT NULL, FK → users(id) ON DELETE CASCADE |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending', CHECK IN ('pending','accepted') |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| — | — | UNIQUE(user_id, friend_id) |

### messages
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| sender_id | INTEGER | NOT NULL, FK → users(id) ON DELETE CASCADE |
| receiver_id | INTEGER | NOT NULL, FK → users(id) ON DELETE CASCADE |
| content | TEXT | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |
| read_at | TIMESTAMPTZ | nullable |

### contacts
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| message | TEXT | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

## How to run the seed script

### Full setup (first time)

```bash
# 1. Create the database
createdb -U postgres veltra
# or: psql -U postgres -c "CREATE DATABASE veltra;"

# 2. Run the schema SQL
psql -U postgres -d veltra -f docs/schema.sql

# 3. Update .env with your credentials
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/veltra"

# 4. Seed the database
npm run db:seed
```

### Running the seed script

```bash
# Execute against the DB (inserts rows into all 7 tables)
npm run db:seed

# Dry run — print SQL + write seed-output.sql, no DB writes
npm run db:seed:dry

# Direct ts-node call (same as npm run db:seed)
npx ts-node --project tsconfig.scripts.json scripts/generateSample.ts

# Dry run direct
npx ts-node --project tsconfig.scripts.json scripts/generateSample.ts --dry-run
```

### Using generateSample as a function

```ts
import { generateSample } from "./scripts/generateSample"

// Returns a valid INSERT SQL string for any table
const sql = generateSample("products", 10)
console.log(sql)
// INSERT INTO products (name, description, image_url, category_id) VALUES
//   ('Modern Desk Lamp', '...', 'https://picsum.photos/...', 3),
//   ...;
```

Supported table names: `categories`, `users`, `products`, `employees`, `friendships`, `messages`, `contacts`

## Seed data amounts

| Table | Rows |
|---|---|
| categories | 5 (fixed: Electronics, Furniture, Lighting, Accessories, Outdoor) |
| users | 20 (password for all: `password123`) |
| products | 20 |
| employees | 8 |
| friendships | 15 |
| messages | 40 |
| contacts | 10 |

## Next: Plan 3 — Backend

Before starting, confirm:
1. Prisma client working (`npx prisma studio` — all tables visible with seeded rows)
2. Any rate limiting needed on public `GET /api/products`?
3. Contact form: store in DB only, or also `console.log`?
