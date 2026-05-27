import { PrismaClient } from "@prisma/client";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
declare global {
  // eslint-disable-next-line no-var
  var __narratrackPrisma__: PrismaClient | undefined;
}

export function getPrisma() {
  if (!globalThis.__narratrackPrisma__) {
    globalThis.__narratrackPrisma__ = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" }) });
  }

  return globalThis.__narratrackPrisma__;
}
