import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const client = new PrismaClient();
  client.$connect()
    .then(() => console.log("✅ PostgreSQL connected"))
    .catch((err: Error) => console.error("❌ PostgreSQL connection failed:", err.message));
  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
