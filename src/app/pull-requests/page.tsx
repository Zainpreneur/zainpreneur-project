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
import { motion } from "framer-motion";

function PRRowSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-row items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="h-6 w-12 rounded-lg bg-gray-800 shrink-0" />
            <div className="h-6 w-6 rounded-lg bg-gray-800 shrink-0" />
          </div>
          <div className="h-4 w-3/4 rounded-md bg-gray-800 shrink-0 mt-2" />
          <p className="text-xs text-slate-400 mt-1">
            <span className="h-3 w-10 rounded-md bg-gray-800 shrink-0" />
            <span className="h-3 w-4 rounded-md bg-gray-800 shrink-0" />
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
        <span className="h-3 w-1/4 rounded-md bg-gray-800 shrink-0" />
        <span className="flex items-center gap-1">
          <span className="h-3 w-12 rounded-md bg-gray-800 shrink-0" />
          <span className="h-3 w-2 rounded-md bg-gray-800 shrink-0" />
          <span className="h-3 w-12 rounded-md bg-gray-800 shrink-0" />
        </span>
      </div>
    </div>
  );
}

export default function PullRequestsPage() {
  const [prs, setPRs] = React.useState<any[]>([]);
  const [repos, setRepos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<{ state: string; repositoryId: string }>({
    state: "all",
    repositoryId: "",
  });
  const [syncing, setSyncing] = React.useState(false);

  useEffect(() => {
    api.syncRepos()
      .then((res) => {
        toast({ title: "Auto-synced", description: `${res.syncedPRs} PRs synced` });
        loadData();
      })
      .catch((err: any) => {
        toast({ title: "Sync failed", description: err?.message ?? "Failed to sync" });
        loadData();
      });
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

  const filtered = prs.filter((p) => {
    if (filter.state !== "all" && p.state !== filter.state) return false;
    if (filter.repositoryId && p.repositoryId !== Number(filter.repositoryId)) return false;
    return true;
  });

  if (loading) {
    return (
      <>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter text-[#F8FAFC]">Pull Requests</h1>
              <p className="text-slate-400 mt-1">
                Monitor and manage pull requests across all repositories
              </p>
            </div>
            <Button className="btn-professional">
              <RefreshCw className="h-4 w-4 shrink-0 mr-2" /> Refresh
            </Button>
          </div>
        </div>
        <Card className="card-elevated-dark shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex items-center gap-3">
                <Label className="text-xs font-semibold text-slate-400">State</Label>
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
                  className="h-9 px-4 rounded-lg"
                >
                  {filter.state === "all" ? "Open Only" : filter.state === "open" ? "Merged" : "All"}
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Label className="text-xs font-semibold text-slate-400">Repository</Label>
                <select
                  value={filter.repositoryId}
                  onChange={(e) => setFilter({ ...filter, repositoryId: e.target.value })}
                  className="select-pro"
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
        <Card className="card-elevated-dark shadow-sm">
          <CardContent>
            <div className="divide-y divide-white/10">
              {[1, 2, 3, 4, 5].map((i) => (
                <PRRowSkeleton key={i} />
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-slate-400 shrink-0 mb-4">
          <GitPullRequest className="h-8 w-8 shrink-0" />
        </div>
        <h2 className="text-xl font-semibold text-[#F8FAFC]">No pull requests</h2>
        <p className="text-slate-400 max-w-sm mx-auto">
          Sync your repositories to see pull requests here.
        </p>
        <Button onClick={() => {
          setSyncing(true);
          api.syncRepos()
            .then((res) => {
              toast({ title: "Synced", description: `${res.syncedPRs} PRs synced` });
              loadData();
            })
            .catch((err: any) => toast({ title: "Sync failed", description: err?.message ?? "Failed to sync" }))
            .finally(() => setSyncing(false));
        }} className="btn-professional">
          <RefreshCw className="h-4 w-4 shrink-0 mr-2" /> Sync Now
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-[#F8FAFC]">Pull Requests</h1>
          <p className="text-slate-400 mt-1">
            Monitor and manage pull requests across all repositories
          </p>
        </div>
        <Button onClick={() => {
          setSyncing(true);
          api.syncRepos()
            .then((res) => {
              toast({ title: "Synced", description: `${res.syncedPRs} PRs synced` });
              loadData();
            })
            .catch((err: any) => toast({ title: "Sync failed", description: err?.message ?? "Failed to sync" }))
            .finally(() => setSyncing(false));
        }} className="btn-professional">
          {syncing ? <RefreshCw className="h-4 w-4 shrink-0 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 shrink-0 mr-2" />} {syncing ? "Syncing..." : "Refresh"}
        </Button>
      </div>

      {/* Filters */}
      <Card className="card-elevated-dark shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex items-center gap-3">
              <Label className="text-xs font-semibold text-slate-400">State</Label>
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
                className="h-9 px-4 rounded-lg"
              >
                {filter.state === "all" ? "Open Only" : filter.state === "open" ? "Merged" : "All"}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-xs font-semibold text-slate-400">Repository</Label>
              <select
                value={filter.repositoryId}
                onChange={(e) => setFilter({ ...filter, repositoryId: e.target.value })}
                className="select-pro"
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
      <Card className="card-elevated-dark shadow-sm">
        <CardContent>
          <div className="divide-y divide-white/10">
            {filtered.map((pr) => (
              <motion.div
                key={pr.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-2 p-4 hover:bg-white/[0.02] rounded-lg transition-colors"
              >
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
                        className="text-xs font-semibold"
                      >
                        {pr.state}
                      </Badge>
                      {pr.draft && (
                        <Badge variant="outline" className="text-xs font-semibold">
                          Draft
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-[#F8FAFC]">{pr.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      #{pr.number ?? "-"} • Repository #{pr.repositoryId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                  <span>{pr.author ?? "unknown"}</span>
                  <span className="flex items-center gap-1">
                    <span className="font-semibold text-[#F8FAFC]">{pr.baseBranch}</span>
                    <span className="text-indigo-400">←</span>
                    <span className="font-semibold text-[#F8FAFC]">{pr.headBranch}</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-4 border-t border-white/10">
          <a href="/" className="text-xs text-indigo-400 hover:underline">
            View Dashboard →
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
