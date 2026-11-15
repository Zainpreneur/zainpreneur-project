import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getClient } from "./db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

let initialized = false;

export async function initDb() {
  if (initialized) return;
  initialized = true;

  const client = getClient();
  const sql = fs.readFileSync(SCHEMA_PATH, "utf8");

  // Split by semicolons and execute each statement
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    await client.execute(stmt);
  }
}
