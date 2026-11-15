import {
  sqliteTable,
  text,
  integer,
  real,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Authenticated GitHub user profile + encrypted access token.
 * Token is encrypted at rest using ENCRYPTION_KEY (see src/lib/crypto.ts).
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  githubId: integer("github_id").notNull().unique(),
  login: text("login").notNull(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  email: text("email"),
  // Encrypted GitHub Personal Access Token (AES-256-GCM)
  tokenEncrypted: text("token_encrypted").notNull(),
  tokenUpdatedAt: integer("token_updated_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(new Date()),
});

export const usersInsertSchema = createInsertSchema(users);
export const usersSelectSchema = createSelectSchema(users);

/**
 * Repositories synced from GitHub (and managed locally).
 */
export const repositories = sqliteTable("repositories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  githubId: integer("github_id").notNull().unique(),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  owner: text("owner").notNull(),
  description: text("description"),
  htmlUrl: text("html_url").notNull(),
  cloneUrl: text("clone_url"),
  defaultBranch: text("default_branch").default("main"),
  isPrivate: integer("is_private", { mode: "boolean" }).default(false),
  isFork: integer("is_fork", { mode: "boolean" }).default(false),
  isArchived: integer("is_archived", { mode: "boolean" }).default(false),
  stars: integer("stars").default(0),
  forks: integer("forks").default(0),
  watchers: integer("watchers").default(0),
  openIssues: integer("open_issues").default(0),
  openPulls: integer("open_pulls").default(0),
  size: integer("size").default(0),
  language: text("language"),
  lastSyncedAt: integer("last_synced_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(new Date()),
});

export const repositoriesInsertSchema = createInsertSchema(repositories);
export const repositoriesSelectSchema = createSelectSchema(repositories);

/**
 * Issues (synced from GitHub + locally managed).
 */
export const issues = sqliteTable("issues", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  githubId: integer("github_id").unique(), // null for locally-created issues
  repositoryId: integer("repository_id")
    .notNull()
    .references(() => repositories.id),
  number: integer("number").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  state: text("state").notNull().default("open"), // open | closed
  stateReason: text("state_reason"),
  htmlUrl: text("html_url"),
  author: text("author"),
  assignee: text("assignee"),
  labels: text("labels").default("[]"), // JSON array of label strings
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  closedAt: integer("closed_at", { mode: "timestamp_ms" }),
  source: text("source").default("github"), // github | local
});

export const issuesInsertSchema = createInsertSchema(issues);
export const issuesSelectSchema = createSelectSchema(issues);

/**
 * Pull Requests (synced from GitHub).
 */
export const pullRequests = sqliteTable("pull_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  githubId: integer("github_id").unique(),
  repositoryId: integer("repository_id")
    .notNull()
    .references(() => repositories.id),
  number: integer("number").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  state: text("state").notNull().default("open"), // open | closed | merged
  draft: integer("draft", { mode: "boolean" }).default(false),
  mergeable: integer("mergeable", { mode: "boolean" }),
  htmlUrl: text("html_url"),
  author: text("author"),
  baseBranch: text("base_branch"),
  headBranch: text("head_branch"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  mergedAt: integer("merged_at", { mode: "timestamp_ms" }),
  source: text("source").default("github"),
});

export const pullRequestsInsertSchema = createInsertSchema(pullRequests);
export const pullRequestsSelectSchema = createSelectSchema(pullRequests);

/**
 * Audit log — every action taken in the app (who, what, when).
 */
export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  action: text("action").notNull(), // e.g. "repo.sync", "issue.create", "pr.close"
  entityType: text("entity_type").notNull(), // repository | issue | pull_request | user | setting
  entityId: text("entity_id"),
  details: text("details").default("{}"), // JSON blob
  actor: text("actor").notNull().default("system"),
  ipAddress: text("ip_address"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(new Date()),
});

export const auditLogsInsertSchema = createInsertSchema(auditLogs);
export const auditLogsSelectSchema = createSelectSchema(auditLogs);

/**
 * Generic key/value app settings.
 */
export const appSettings = sqliteTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(new Date()),
});

export const appSettingsInsertSchema = createInsertSchema(appSettings);
export const appSettingsSelectSchema = createSelectSchema(appSettings);

// Re-export types for convenience
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Repository = typeof repositories.$inferSelect;
export type NewRepository = typeof repositories.$inferInsert;
export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;
export type PullRequest = typeof pullRequests.$inferSelect;
export type NewPullRequest = typeof pullRequests.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
export type AppSetting = typeof appSettings.$inferSelect;
export type NewAppSetting = typeof appSettings.$inferInsert;
