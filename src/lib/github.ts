import { Octokit } from "@octokit/rest";
import { decrypt } from "./crypto";
import { getDb } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Resolve the GitHub access token.
 * Priority: GITHUB_TOKEN env var > decrypted token stored in SQLite.
 */
export async function resolveGitHubToken(): Promise<string> {
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN;
  }

  const [user] = await (await getDb()).select().from(users).limit(1);
  if (user?.tokenEncrypted) {
    return decrypt(user.tokenEncrypted);
  }

  throw new Error(
    "No GitHub token available. Set GITHUB_TOKEN in .env.local or authenticate via Settings.",
  );
}

/**
 * Create an authenticated Octokit client.
 */
export async function getOctokit(): Promise<Octokit> {
  const token = await resolveGitHubToken();
  return new Octokit({ auth: token, userAgent: "zainpreneur-github-manager" });
}

/**
 * Fetch the authenticated user.
 */
export async function fetchAuthenticatedUser() {
  const octokit = await getOctokit();
  const { data } = await octokit.rest.users.getAuthenticated();
  return data;
}

/**
 * List repositories for the authenticated user.
 */
export async function fetchRepositories(options?: { per_page?: number; page?: number }) {
  const octokit = await getOctokit();
  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    per_page: options?.per_page ?? 100,
    page: options?.page ?? 1,
    sort: "updated",
    direction: "desc",
  });
  return data;
}

/**
 * Get a single repository.
 */
export async function fetchRepository(owner: string, repo: string) {
  const octokit = await getOctokit();
  const { data } = await octokit.rest.repos.get({ owner, repo });
  return data;
}

/**
 * List issues for a repository.
 */
export async function fetchIssues(owner: string, repo: string, options?: { state?: string; per_page?: number; page?: number }) {
  const octokit = await getOctokit();
  const { data } = await octokit.rest.issues.listForRepo({
    owner,
    repo,
    state: (options?.state ?? "all") as "open" | "closed" | "all",
    per_page: options?.per_page ?? 100,
    page: options?.page ?? 1,
    sort: "updated",
    direction: "desc",
  });
  return data.filter((i: any) => !("pull_request" in i));
}

/**
 * List pull requests for a repository.
 */
export async function fetchPullRequests(owner: string, repo: string, options?: { state?: string; per_page?: number; page?: number }) {
  const octokit = await getOctokit();
  const { data } = await octokit.rest.pulls.list({
    owner,
    repo,
    state: (options?.state ?? "all") as "open" | "closed" | "all",
    per_page: options?.per_page ?? 100,
    page: options?.page ?? 1,
    sort: "updated",
    direction: "desc",
  });
  return data;
}

/**
 * Create an issue in a repository.
 */
export async function createIssue(owner: string, repo: string, input: {
  title: string;
  body?: string;
  labels?: string[];
  assignees?: string[];
}) {
  const octokit = await getOctokit();
  const { data } = await octokit.rest.issues.create({
    owner,
    repo,
    title: input.title,
    body: input.body,
    labels: input.labels,
    assignees: input.assignees,
  });
  return data;
}

/**
 * Update an issue state (close/reopen).
 */
export async function updateIssue(owner: string, repo: string, issue_number: number, input: { state?: "open" | "closed"; title?: string; body?: string }) {
  const octokit = await getOctokit();
  const { data } = await octokit.rest.issues.update({
    owner,
    repo,
    issue_number,
    ...(input.state ? { state: input.state } : {}),
    ...(input.title ? { title: input.title } : {}),
    ...(input.body !== undefined ? { body: input.body } : {}),
  });
  return data;
}

/**
 * List branches for a repository.
 */
export async function fetchBranches(owner: string, repo: string) {
  const octokit = await getOctokit();
  const { data } = await octokit.rest.repos.listBranches({
    owner,
    repo,
    per_page: 100,
  });
  return data;
}

/**
 * Get repository contributors.
 */
export async function fetchContributors(owner: string, repo: string) {
  const octokit = await getOctokit();
  const { data } = await octokit.rest.repos.listContributors({
    owner,
    repo,
    per_page: 100,
  });
  return data;
}

/**
 * Test the token by fetching the authenticated user (used for validation).
 */
export async function validateToken(token: string) {
  const octokit = new Octokit({ auth: token, userAgent: "zainpreneur-github-manager" });
  const { data } = await octokit.rest.users.getAuthenticated();
  return data;
}
