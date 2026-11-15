import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { initDb } from "./init-db";

let dbInstance: ReturnType<typeof drizzle> | null = null;
let clientInstance: ReturnType<typeof createClient> | null = null;
let dbInitPromise: Promise<void> | null = null;

/**
 * Get a singleton Turso (libSQL) database client.
 * Supports:
 *   - Remote Turso: DATABASE_URL=libsql://<db>.turso.io  + TURSO_AUTH_TOKEN
 *   - Local file:   DATABASE_URL=file:./data/zainpreneur.sqlite (no account needed)
 */
export async function getDb() {
  if (dbInstance) return dbInstance;

  if (!dbInitPromise) {
    dbInitPromise = initDb();
  }
  await dbInitPromise;

  const url = process.env.DATABASE_URL ?? "file:./data/zainpreneur.sqlite";
  clientInstance = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN ?? undefined,
  });

  dbInstance = drizzle(clientInstance, { schema });
  return dbInstance;
}

export function getClient() {
  if (!clientInstance) throw new Error("Call getDb() first");
  return clientInstance!;
}

export type DatabaseSchema = typeof schema;
