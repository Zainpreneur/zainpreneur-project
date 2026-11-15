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

const issueSchema = z.object({
  repositoryId: z.number(),
  title: z.string().min(1).max(200),
  body: z.string().optional(),
  labels: z.array(z.string()).optional(),
  assignees: z.array(z.string()).optional(),
});

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
    loadData();
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Issues</h1>
          <p className="text-muted-foreground">
            Track and manage issues across all repositories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setOpenCreate(true)} disabled={repos.length === 0}>
            <Plus className="h-4 w-4 mr-2" /> New Issue
          </Button>
          <Button onClick={() => loadData()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex items-center gap-3">
              <Label className="text-xs font-medium">State</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilter({ ...filter, state: filter.state === "all" ? "open" : "closed" })
                }
                className="h-9 px-3"
              >
                {filter.state === "all" ? "Show Open" : "Show All"}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-xs font-medium">Repository</Label>
              <select
                value={filter.repositoryId}
                onChange={(e) => setFilter({ ...filter, repositoryId: e.target.value })}
                className="border rounded-md px-3 py-2 text-sm bg-background"
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
          <Card className="relative w-full max-w-md p-6">
            <CardHeader>
              <CardTitle>Create New Issue</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateIssue} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repositoryId">Repository</Label>
                  <select
                    id="repositoryId"
                    className="border rounded-md px-3 py-2 text-sm bg-background"
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Body</Label>
                  <textarea
                    id="body"
                    placeholder="Description..."
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    className="border rounded-md px-3 py-2 text-sm bg-background h-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="labels">Labels (comma-separated)</Label>
                  <Input
                    id="labels"
                    placeholder="bug, enhancement"
                    value={form.labels}
                    onChange={(e) => setForm({ ...form, labels: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignees">Assignees (comma-separated)</Label>
                  <Input
                    id="assignees"
                    placeholder="user1, user2"
                    value={form.assignees}
                    onChange={(e) => setForm({ ...form, assignees: e.target.value })}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenCreate(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateIssue} disabled={createLoading}>
                {createLoading ? "Creating..." : "Create Issue"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Issues List */}
      <Card className="rounded-xl">
        <CardContent>
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : issues.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-sm font-semibold">No issues</h3>
              <p className="text-muted-foreground text-sm">
                No issues match your current filters.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-input">
              {issues.map((issue) => (
                <div key={issue.id} className="flex flex-col gap-2 p-3 hover:bg-accent transition-colors cursor-pointer group">
                  <div className="flex flex-row items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={issue.state === "open" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {issue.state}
                        </Badge>
                        {issue.source === "local" && (
                          <Badge variant="outline" className="text-xs">
                            Local
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold">{issue.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        #{issue.number ?? "-"} • {issue.repositoryId}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleIssue(issue.id, issue.state)}
                      className="h-8 px-2"
                    >
                      {issue.state === "open" ? "Close" : "Reopen"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span>{issue.author ?? "unknown"}</span>
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4">
          <a href="/" className="text-sm text-primary hover:underline">
            View Dashboard →
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
