/**
 * Veltra seed script — generates realistic INSERT SQL for all 7 tables.
 *
 * Usage:
 *   npm run db:seed          # generate SQL and execute against DB
 *   npm run db:seed:dry      # generate SQL only, print to console + seed-output.sql
 */

import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { Client } from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const DRY_RUN = process.argv.includes("--dry-run");

// Optional single-table mode: generateSample.ts <table> <amount>
// e.g. ts-node ... scripts/generateSample.ts products 10
const ARG_TABLE  = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : null;
const ARG_AMOUNT = ARG_TABLE && process.argv[3] ? parseInt(process.argv[3], 10) : null;

// How many rows to insert per table
const COUNTS = {
  users: 20,
  products: 20,
  employees: 8,
  friendships: 15,
  messages: 40,
  contacts: 10,
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/'/g, "''");
}

// ─── generators ───────────────────────────────────────────────────────────────

/**
 * Core export.
 * Returns a valid SQL INSERT string for the given table and row count.
 */
export function generateSample(tableName: string, amount: number): string {
  switch (tableName) {
    case "categories":  return genCategories();
    case "users":       return genUsers(amount);
    case "products":    return genProducts(amount);
    case "employees":   return genEmployees(amount);
    case "friendships": return genFriendships(amount);
    case "messages":    return genMessages(amount);
    case "contacts":    return genContacts(amount);
    default: throw new Error(`Unknown table: "${tableName}". Valid tables: categories, users, products, employees, friendships, messages, contacts`);
  }
}

function genCategories(): string {
  const names = ["Electronics", "Furniture", "Lighting", "Accessories", "Outdoor"];
  const vals = names.map((n) => `('${n}')`).join(",\n  ");
  return `INSERT INTO categories (name) VALUES\n  ${vals}\nON CONFLICT (name) DO NOTHING;`;
}

function genUsers(n: number): string {
  // Pre-compute one hash — bcrypt is slow per-call, all seed users share the same password
  const hash = bcrypt.hashSync("password123", 10);
  const vals = Array.from({ length: n }, () => {
    const name  = esc(faker.person.fullName());
    const email = faker.internet
      .email({ firstName: faker.person.firstName(), provider: "veltra.dev" })
      .toLowerCase();
    return `('${email}', '${hash}', '${name}')`;
  }).join(",\n  ");
  return `INSERT INTO users (email, password_hash, name) VALUES\n  ${vals}\nON CONFLICT (email) DO NOTHING;`;
}

function genProducts(n: number): string {
  const adjectives = ["Premium", "Essential", "Classic", "Modern", "Compact", "Sleek", "Portable", "Smart"];
  const bases = [
    "Desk Lamp", "Standing Desk", "Pendant Light", "Wireless Charger",
    "Accent Chair", "Humidifier", "Wall Clock", "Portable Speaker",
    "Monitor Stand", "Desk Mat", "Cable Organizer", "Smart Plug",
  ];
  const vals = Array.from({ length: n }, () => {
    const adj   = adjectives[faker.number.int({ min: 0, max: adjectives.length - 1 })];
    const base  = bases[faker.number.int({ min: 0, max: bases.length - 1 })];
    const name  = esc(`${adj} ${base}`);
    const desc  = esc(faker.commerce.productDescription());
    const seed  = faker.string.alphanumeric(8);
    const url   = `https://picsum.photos/seed/${seed}/600/400`;
    const catId = faker.number.int({ min: 1, max: 5 });
    return `('${name}', '${desc}', '${url}', ${catId})`;
  }).join(",\n  ");
  return `INSERT INTO products (name, description, image_url, category_id) VALUES\n  ${vals};`;
}

function genEmployees(n: number): string {
  const roles = [
    "General Manager", "Head of Sales", "Product Designer", "Warehouse Lead",
    "Customer Support", "Marketing Manager", "Finance Officer", "Operations Lead",
  ];
  const vals = Array.from({ length: n }, () => {
    const name  = esc(faker.person.fullName());
    const role  = roles[faker.number.int({ min: 0, max: roles.length - 1 })];
    const phone = faker.phone.number({ style: "international" });
    return `('${name}', '${role}', '${phone}')`;
  }).join(",\n  ");
  return `INSERT INTO employees (name, role, phone) VALUES\n  ${vals};`;
}

function genFriendships(n: number): string {
  const pairs = new Set<string>();
  const vals: string[] = [];
  let attempts = 0;
  const maxId = COUNTS.users;

  while (vals.length < n && attempts < n * 20) {
    attempts++;
    const u = faker.number.int({ min: 1, max: maxId });
    const f = faker.number.int({ min: 1, max: maxId });
    if (u === f) continue;
    const key = `${Math.min(u, f)}-${Math.max(u, f)}`;
    if (pairs.has(key)) continue;
    pairs.add(key);
    vals.push(`(${u}, ${f}, 'accepted')`);
  }
  return `INSERT INTO friendships (user_id, friend_id, status) VALUES\n  ${vals.join(",\n  ")}\nON CONFLICT (user_id, friend_id) DO NOTHING;`;
}

function genMessages(n: number): string {
  const maxId = COUNTS.users;
  const vals = Array.from({ length: n }, () => {
    const sender = faker.number.int({ min: 1, max: maxId });
    let recv = faker.number.int({ min: 1, max: maxId });
    while (recv === sender) recv = faker.number.int({ min: 1, max: maxId });
    const content = esc(faker.lorem.sentence());
    return `(${sender}, ${recv}, '${content}')`;
  }).join(",\n  ");
  return `INSERT INTO messages (sender_id, receiver_id, content) VALUES\n  ${vals};`;
}

function genContacts(n: number): string {
  const vals = Array.from({ length: n }, () => {
    const name    = esc(faker.person.fullName());
    const message = esc(faker.lorem.paragraph());
    return `('${name}', '${message}')`;
  }).join(",\n  ");
  return `INSERT INTO contacts (name, message) VALUES\n  ${vals};`;
}

// ─── all-tables helper ────────────────────────────────────────────────────────

/**
 * Generates INSERT SQL for every table in FK-safe order.
 * Optionally override the row count per table via the second argument.
 *
 * @param counts - optional overrides, e.g. { products: 50, messages: 100 }
 * @returns combined SQL string ready to pipe into psql or pg.query()
 */
export function generateAllSamples(counts: Partial<typeof COUNTS> = {}): string {
  const c = { ...COUNTS, ...counts };
  return [
    { table: "categories",  sql: generateSample("categories",  5)              },
    { table: "users",       sql: generateSample("users",       c.users)        },
    { table: "products",    sql: generateSample("products",    c.products)     },
    { table: "employees",   sql: generateSample("employees",   c.employees)    },
    { table: "friendships", sql: generateSample("friendships", c.friendships)  },
    { table: "messages",    sql: generateSample("messages",    c.messages)     },
    { table: "contacts",    sql: generateSample("contacts",    c.contacts)     },
  ]
    .map(({ table, sql }) => `-- ${table}\n${sql}`)
    .join("\n\n");
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const mode = ARG_TABLE ? `table: ${ARG_TABLE} (${ARG_AMOUNT} rows)` : "all tables";
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Veltra Seed Generator");
  console.log(`  Scope: ${mode}`);
  console.log(`  Mode:  ${DRY_RUN ? "dry-run (no DB writes)" : "live"}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Single-table or all-tables
  const statements = ARG_TABLE
    ? [{ table: ARG_TABLE, sql: generateSample(ARG_TABLE, ARG_AMOUNT ?? COUNTS[ARG_TABLE as keyof typeof COUNTS] ?? 10) }]
    : generateAllSamples()
        .split(/\n(?=-- )/)
        .map((block) => ({
          table: block.match(/^-- (\w+)/)?.[1] ?? "unknown",
          sql:   block.replace(/^-- \w+\n/, ""),
        }));

  const fullSQL = statements.map((s) => `-- ${s.table}\n${s.sql}`).join("\n\n");

  // Print to stdout
  console.log(fullSQL);

  // Write to file — named after table when in single-table mode
  const filename = ARG_TABLE ? `${ARG_TABLE}-output.sql` : "seed-output.sql";
  const outputPath = path.join(__dirname, filename);
  fs.writeFileSync(outputPath, fullSQL, "utf8");
  console.log(`\n✓ SQL written to ${outputPath}`);

  if (DRY_RUN) {
    console.log("\n[dry-run] Skipping database execution.\n");
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.error("\nERROR: DATABASE_URL not set. Check your .env file.");
    process.exit(1);
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log("\nConnected to PostgreSQL. Inserting rows...\n");

  for (const { table, sql } of statements) {
    await client.query(sql);
    console.log(`  ✓ ${table}`);
  }

  await client.end();
  console.log("\n✅ Database seeded successfully.\n");
}

main().catch((err) => {
  console.error("\n❌ Seed failed:", err.message);
  process.exit(1);
});
