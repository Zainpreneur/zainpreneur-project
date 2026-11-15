import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import * as schema from "./schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "data", "zainpreneur.sqlite");

// Ensure the data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create the better-sqlite3 database (synchronous)
const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// Auto-create tables if they don't exist
const TABLES = [
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    github_id INTEGER NOT NULL UNIQUE,
    login TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    email TEXT,
    token_encrypted TEXT NOT NULL,
    token_updated_at INTEGER,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  )`,
  `CREATE TABLE IF NOT EXISTS repositories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    github_id INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    owner TEXT NOT NULL,
    description TEXT,
    html_url TEXT NOT NULL,
    clone_url TEXT,
    default_branch TEXT DEFAULT 'main',
    is_private INTEGER DEFAULT 0,
    is_fork INTEGER DEFAULT 0,
    is_archived INTEGER DEFAULT 0,
    stars INTEGER DEFAULT 0,
    forks INTEGER DEFAULT 0,
    watchers INTEGER DEFAULT 0,
    open_issues INTEGER DEFAULT 0,
    open_pulls INTEGER DEFAULT 0,
    size INTEGER DEFAULT 0,
    language TEXT,
    last_synced_at INTEGER,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  )`,
  `CREATE TABLE IF NOT EXISTS issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    github_id INTEGER UNIQUE,
    repository_id INTEGER NOT NULL REFERENCES repositories(id),
    number INTEGER NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    state TEXT NOT NULL DEFAULT 'open',
    state_reason TEXT,
    html_url TEXT,
    author TEXT,
    assignee TEXT,
    labels TEXT DEFAULT '[]',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    closed_at INTEGER,
    source TEXT DEFAULT 'github'
  )`,
  `CREATE TABLE IF NOT EXISTS pull_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    github_id INTEGER UNIQUE,
    repository_id INTEGER NOT NULL REFERENCES repositories(id),
    number INTEGER NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    state TEXT NOT NULL DEFAULT 'open',
    draft INTEGER DEFAULT 0,
    mergeable INTEGER,
    html_url TEXT,
    author TEXT,
    base_branch TEXT,
    head_branch TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    merged_at INTEGER,
    source TEXT DEFAULT 'github'
  )`,
  `CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details TEXT DEFAULT '{}',
    actor TEXT NOT NULL DEFAULT 'system',
    ip_address TEXT,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  )`,
  `CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_issues_repo ON issues(repository_id)`,
  `CREATE INDEX IF NOT EXISTS idx_issues_state ON issues(state)`,
  `CREATE INDEX IF NOT EXISTS idx_prs_repo ON pull_requests(repository_id)`,
  `CREATE INDEX IF NOT EXISTS idx_prs_state ON pull_requests(state)`,
  `CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action)`,
  `CREATE INDEX IF NOT EXISTS idx_repos_owner ON repositories(owner)`,
];

for (const stmt of TABLES) {
  sqlite.exec(stmt);
}

// Create the drizzle ORM instance (better-sqlite3 is synchronous — no await needed)
export const db = drizzle(sqlite, { schema });

export type DatabaseSchema = typeof schema;
export { DB_PATH, sqlite };
