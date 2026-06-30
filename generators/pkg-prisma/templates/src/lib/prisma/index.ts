import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var _prismaClient: PrismaClient | undefined;
}

// Reuse a single PrismaClient instance in development to avoid exhausting
// database connections during hot-reloading. In production a new client is
// created per server instance (works well with serverless Postgres like Neon).
export const prisma: PrismaClient =
  global._prismaClient ?? new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global._prismaClient = prisma;
}

export default prisma;
