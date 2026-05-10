import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __narratrackPrisma__: PrismaClient | undefined;
}

export function getPrisma() {
  if (!globalThis.__narratrackPrisma__) {
    globalThis.__narratrackPrisma__ = new PrismaClient();
  }

  return globalThis.__narratrackPrisma__;
}
