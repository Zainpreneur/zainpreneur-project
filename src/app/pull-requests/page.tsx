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
import { GitPullRequest, RefreshCw, Filter } from "lucide-react";

export default function PullRequestsPage() {
  const [prs, setPRs] = React.useState<any[]>([]);
  const [repos, setRepos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<{ state: string; repositoryId: string }>({
    state: "all",
    repositoryId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [prRes, repoRes] = await Promise.all([
        api.getPullRequests({ state: filter.state, repositoryId: filter.repositoryId }),
        api.getRepos(),
      ]);
      setPRs(prRes.pullRequests ?? []);
      setRepos(repoRes.repositories ?? []);
    } catch (error: any) {
      toast({ title: "Error", description: error?.message ?? "Failed to load pull requests" });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (prs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <GitPullRequest className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">No pull requests</h2>
        <p className="text-muted-foreground mb-6">
          Sync your repositories to see pull requests here.
        </p>
        <Button onClick={() => loadData()}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pull Requests</h1>
          <p className="text-muted-foreground">
            Monitor and manage pull requests across all repositories
          </p>
        </div>
        <Button onClick={() => loadData()}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
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
                  setFilter({
                    ...filter,
                    state:
                      filter.state === "all" ? "open" : filter.state === "open" ? "merged" : "all",
                  })
                }
                className="h-9 px-3"
              >
                {filter.state === "all" ? "Open Only" : filter.state === "open" ? "Merged" : "All"}
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
                  <option key={r.id} value={r.id}>{r.fullName}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PRs List */}
      <Card className="rounded-xl">
        <CardContent>
          <div className="divide-y divide-input">
            {prs.map((pr) => (
              <div key={pr.id} className="flex flex-col gap-2 p-3 hover:bg-accent transition-colors">
                <div className="flex flex-row items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          pr.state === "open"
                            ? "default"
                            : pr.state === "merged"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {pr.state}
                      </Badge>
                      {pr.draft && (
                        <Badge variant="outline" className="text-xs">
                          Draft
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold">{pr.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      #{pr.number ?? "-"} • {pr.repositoryId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                  <span>{pr.author ?? "unknown"}</span>
                  <span>{pr.baseBranch} ← {pr.headBranch}</span>
                </div>
              </div>
            ))}
          </div>
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
