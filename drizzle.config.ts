import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/schema.ts",
  driver: "d1-http",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:./data/zainpreneur.sqlite",
    authToken: process.env.TURSO_AUTH_TOKEN,
  } as any,
  verbose: true,
  strict: true,
} satisfies Config;
