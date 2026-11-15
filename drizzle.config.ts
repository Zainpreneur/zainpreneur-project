import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:./data/zainpreneur.sqlite",
  } as any,
  verbose: true,
  strict: true,
} satisfies Config;
