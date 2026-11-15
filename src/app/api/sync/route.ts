import { NextResponse } from "next/server";
import { getOctokit } from "@/lib/github";
import { getDb } from "@/lib/db";
import {
  repositories,
  issues,
  pullRequests,
} from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { auditLog } from "@/lib/audit";

const NOW = new Date();

async function upsertRepo(db: any, repo: any): Promise<number> {
  const [existing] = await db
    .select()
    .from(repositories)
    .where(eq(repositories.githubId, repo.id))
    .limit(1);

  const payload = {
    githubId: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    owner: repo.owner.login,
    description: repo.description ?? null,
    htmlUrl: repo.html_url,
    cloneUrl: repo.clone_url ?? null,
    defaultBranch: repo.default_branch ?? "main",
    isPrivate: repo.private ?? false,
    isFork: repo.fork ?? false,
    isArchived: repo.archived ?? false,
    stars: repo.stargazers_count ?? 0,
    forks: repo.forks_count ?? 0,
    watchers: repo.watchers_count ?? 0,
    openIssues: repo.open_issues_count ?? 0,
    size: repo.size ?? 0,
    language: repo.language ?? null,
    lastSyncedAt: NOW,
    updatedAt: NOW,
  };

  if (existing) {
    await db.update(repositories).set(payload).where(eq(repositories.id, existing.id));
    return existing.id;
  } else {
    const [inserted] = await db.insert(repositories).values(payload).returning();
    return inserted.id;
  }
}

async function upsertIssues(db: any, repoId: number, issueList: any[]) {
  for (const issue of issueList) {
    const [existing] = await db
      .select()
      .from(issues)
      .where(eq(issues.githubId, issue.id))
      .limit(1);

    const payload = {
      githubId: issue.id,
      repositoryId: repoId,
      number: issue.number,
      title: issue.title,
      body: issue.body ?? null,
      state: issue.state,
      stateReason: issue.state_reason ?? null,
      htmlUrl: issue.html_url,
      author: issue.user?.login ?? null,
      assignee: issue.assignee?.login ?? null,
      labels: JSON.stringify((issue.labels ?? []).map((l: any) => l.name)),
      createdAt: new Date(issue.created_at),
      updatedAt: new Date(issue.updated_at),
      closedAt: issue.closed_at ? new Date(issue.closed_at) : null,
      source: "github" as const,
    };

    if (existing) {
      await db.update(issues).set(payload).where(eq(issues.id, existing.id));
    } else {
      await db.insert(issues).values(payload);
    }
  }
}

async function upsertPullRequests(db: any, repoId: number, prList: any[]) {
  for (const pr of prList) {
    const [existing] = await db
      .select()
      .from(pullRequests)
      .where(eq(pullRequests.githubId, pr.id))
      .limit(1);

    const payload = {
      githubId: pr.id,
      repositoryId: repoId,
      number: pr.number,
      title: pr.title,
      body: pr.body ?? null,
      state: pr.merged ? "merged" : pr.state,
      draft: pr.draft ?? false,
      mergeable: pr.mergeable ?? null,
      htmlUrl: pr.html_url,
      author: pr.user?.login ?? null,
      baseBranch: pr.base.ref ?? null,
      headBranch: pr.head.ref ?? null,
      createdAt: new Date(pr.created_at),
      updatedAt: new Date(pr.updated_at),
      mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
      source: "github" as const,
    };

    if (existing) {
      await db.update(pullRequests).set(payload).where(eq(pullRequests.id, existing.id));
    } else {
      await db.insert(pullRequests).values(payload);
    }
  }
}

export async function POST() {
  try {
    // Ensure token is available
    const octokit = await getOctokit();

    const db = await getDb();
    const repos = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: 100,
      sort: "updated",
      direction: "desc",
    });

    let syncedRepos = 0;
    let syncedIssues = 0;
    let syncedPRs = 0;

    for (const repo of repos.data) {
      const repoId = await upsertRepo(db, repo);
      syncedRepos++;

      // Sync issues (filter out pull requests - GitHub issues endpoint includes PRs)
      const issueRes = await octokit.rest.issues.listForRepo({
        owner: repo.owner.login,
        repo: repo.name,
        state: "all",
        per_page: 100,
      });
      const onlyIssues = issueRes.data.filter(
        (i: any) => !(i as any).pull_request,
      );
      await upsertIssues(db, repoId, onlyIssues);
      syncedIssues += onlyIssues.length;

      // Sync pull requests
      const prRes = await octokit.rest.pulls.list({
        owner: repo.owner.login,
        repo: repo.name,
        state: "all",
        per_page: 100,
      });
      await upsertPullRequests(db, repoId, prRes.data);
      syncedPRs += prRes.data.length;
    }

    await auditLog({
      action: "repos.sync",
      entityType: "repository",
      details: JSON.stringify({ syncedRepos, syncedIssues, syncedPRs }),
      actor: "system",
    });

    return NextResponse.json({
      ok: true,
      syncedRepos,
      syncedIssues,
      syncedPRs,
    });
  } catch (error: any) {
    console.error("sync error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Sync failed" },
      { status: 500 },
    );
  }
}
