"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Plus, RefreshCw, Filter, ChevronRight } from "lucide-react";
import { z } from "zod";
import { motion } from "framer-motion";

const issueSchema = z.object({
  repositoryId: z.number(),
  title: z.string().min(1).max(200),
  body: z.string().optional(),
  labels: z.array(z.string()).optional(),
  assignees: z.array(z.string()).optional(),
});

function IssueRowSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-row items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-20 rounded-lg bg-muted shrink-0" />
            <div className="h-8 w-6 rounded-lg bg-muted shrink-0" />
          </div>
          <div className="h-4 w-3/4 rounded-md bg-muted shrink-0 mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            <span className="h-3 w-12 rounded-md bg-muted shrink-0" />
            <span className="h-3 w-4 rounded-md bg-muted shrink-0" />
          </p>
        </div>
        <div className="h-8 w-8 rounded-md bg-muted shrink-0" />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span className="h-3 w-1/3 rounded-md bg-muted shrink-0" />
        <span className="h-3 w-6 rounded-md bg-muted shrink-0" />
      </div>
    </div>
  );
}

export default function IssuesPage() {
  const [issues, setIssues] = React.useState<any[]>([]);
  const [repos, setRepos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<{ state: string; repositoryId: string }>({
    state: "all",
    repositoryId: "",
  });
  const [openCreate, setOpenCreate] = React.useState(false);
  const [createLoading, setCreateLoading] = React.useState(false);
  const [syncing, setSyncing] = React.useState(false);
  const [form, setForm] = React.useState<{
    repositoryId: string;
    title: string;
    body: string;
    labels: string;
    assignees: string;
  }>({
    repositoryId: "",
    title: "",
    body: "",
    labels: "",
    assignees: "",
  });

  useEffect(() => {
    // Auto-sync on mount
    api.syncRepos()
      .then((res) => {
        toast({ title: "Auto-synced", description: `${res.syncedIssues} issues synced` });
        loadData();
      })
      .catch((err: any) => {
        toast({ title: "Sync failed", description: err?.message ?? "Failed to sync" });
        loadData(); // Still try to load existing data
      });
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [issueRes, repoRes] = await Promise.all([
        api.getIssues({ state: filter.state, repositoryId: filter.repositoryId }),
        api.getRepos(),
      ]);
      setIssues(issueRes.issues ?? []);
      setRepos(repoRes.repositories ?? []);
    } catch (error: any) {
      toast({ title: "Error", description: error?.message ?? "Failed to load issues" });
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateIssue(e: React.FormEvent) {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const labels = form.labels
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const assignees = form.assignees
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const parsed = issueSchema.safeParse({
        repositoryId: Number(form.repositoryId),
        title: form.title,
        body: form.body || undefined,
        labels,
        assignees,
      });

      if (!parsed.success) {
        toast({ title: "Validation Error", description: "Please check your inputs" });
        return;
      }

      await api.createIssue(parsed.data);
      setOpenCreate(false);
      setForm({ repositoryId: "", title: "", body: "", labels: "", assignees: "" });
      await loadData();
      toast({ title: "Created", description: "Issue created successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.message ?? "Failed to create issue" });
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleToggleIssue(id: number, currentState: string) {
    try {
      await api.updateIssue(id, { state: currentState === "open" ? "closed" : "open" });
      await loadData();
      toast({ title: "Updated", description: "Issue status changed" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.message ?? "Failed to update issue" });
    }
  }

  const filtered = issues.filter((i) => {
    if (filter.state !== "all" && i.state !== filter.state) return false;
    if (filter.repositoryId && i.repositoryId !== Number(filter.repositoryId)) return false;
    return true;
  });

  if (loading) {
    return (
      <>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button onClick={() => setOpenCreate(true)} disabled={repos.length === 0} className="btn-professional">
              <Plus className="h-4 w-4 shrink-0 mr-2" /> New Issue
            </Button>
            <Button className="btn-professional">
              <RefreshCw className="h-4 w-4 shrink-0 mr-2" /> Refresh
            </Button>
          </div>
          <Card className="card-professional shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex items-center gap-3">
                  <Label className="text-xs font-medium">State</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFilter({
                        ...filter,
                        state: filter.state === "all" ? "open" : "closed",
                      })
                    }
                    className="h-9 px-4 rounded-lg"
                  >
                    {filter.state === "all" ? "Show Open" : "Show All"}
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs font-medium">Repository</Label>
                  <select
                    value={filter.repositoryId}
                    onChange={(e) => setFilter({ ...filter, repositoryId: e.target.value })}
                    className="select-pro"
                  >
                    <option value="">All Repositories</option>
                    {repos.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-professional shadow-sm">
            <CardContent>
              <div className="divide-y divide-input/50">
                {[1, 2, 3, 4, 5].map((i) => (
                  <IssueRowSkeleton key={i} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Issues</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage issues across all repositories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setOpenCreate(true)} disabled={repos.length === 0} className="btn-professional">
            <Plus className="h-4 w-4 shrink-0 mr-2" /> New Issue
          </Button>
          <Button onClick={() => {
            setSyncing(true);
            api.syncRepos()
              .then((res) => {
                toast({ title: "Synced", description: `${res.syncedIssues} issues synced` });
                loadData();
              })
              .catch((err: any) => toast({ title: "Sync failed", description: err?.message ?? "Failed to sync" }))
              .finally(() => setSyncing(false));
          }} className="btn-professional">
            {syncing ? <RefreshCw className="h-4 w-4 shrink-0 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 shrink-0 mr-2" />} {syncing ? "Syncing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="card-professional shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex items-center gap-3">
              <Label className="text-xs font-medium">State</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilter({
                    ...filter,
                    state: filter.state === "all" ? "open" : "closed",
                  })
                }
                className="h-9 px-4 rounded-lg"
              >
                {filter.state === "all" ? "Show Open" : "Show All"}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-xs font-medium">Repository</Label>
              <select
                value={filter.repositoryId}
                onChange={(e) => setFilter({ ...filter, repositoryId: e.target.value })}
                className="select-pro"
              >
                <option value="">All Repositories</option>
                {repos.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Issue Modal */}
      {openCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpenCreate(false)} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-md p-6"
          >
            <Card className="card-professional shadow-xl">
              <CardHeader>
                <CardTitle>Create New Issue</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateIssue} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="repositoryId">Repository</Label>
                    <select
                      id="repositoryId"
                      className="select-pro"
                      value={form.repositoryId}
                      onChange={(e) => setForm({ ...form, repositoryId: e.target.value })}
                    >
                      <option value="">Select repository</option>
                      {repos.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Issue title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="input-pro"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body">Body</Label>
                    <textarea
                      id="body"
                      placeholder="Description..."
                      value={form.body}
                      onChange={(e) => setForm({ ...form, body: e.target.value })}
                      className="input-pro h-32"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="labels">Labels (comma-separated)</Label>
                    <Input
                      id="labels"
                      placeholder="bug, enhancement"
                      value={form.labels}
                      onChange={(e) => setForm({ ...form, labels: e.target.value })}
                      className="input-pro"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignees">Assignees (comma-separated)</Label>
                    <Input
                      id="assignees"
                      placeholder="user1, user2"
                      value={form.assignees}
                      onChange={(e) => setForm({ ...form, assignees: e.target.value })}
                      className="input-pro"
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 p-6">
                <Button variant="outline" onClick={() => setOpenCreate(false)} className="btn-professional">
                  Cancel
                </Button>
                <Button onClick={handleCreateIssue} disabled={createLoading} className="btn-professional px-6">
                  {createLoading ? "Creating..." : "Create Issue"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Issues List */}
      <Card className="card-professional shadow-sm">
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-12 w-12 shrink-0 text-muted-foreground mb-4" />
              <h3 className="text-sm font-semibold">No issues</h3>
              <p className="text-muted-foreground text-sm">
                No issues match your current filters.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-input/50">
              {filtered.map((issue) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col gap-2 p-4 hover:bg-accent/30 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="flex flex-row items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={issue.state === "open" ? "default" : "secondary"}
                          className="text-xs font-medium"
                        >
                          {issue.state}
                        </Badge>
                        {issue.source === "local" && (
                          <Badge variant="outline" className="text-xs font-medium">
                            Local
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold">{issue.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        #{issue.number ?? "-"} • Repository #{issue.repositoryId}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleIssue(issue.id, issue.state)}
                      className="h-8 px-2 rounded-lg"
                    >
                      {issue.state === "open" ? "Close" : "Reopen"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span>{issue.author ?? "unknown"}</span>
                    <ChevronRight className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 border-t border-input/50">
          <a href="/" className="text-sm text-primary hover:underline">
            View Dashboard →
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
