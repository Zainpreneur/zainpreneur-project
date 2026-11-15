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
import { GitBranch, Star, RefreshCw, Folder, Code2, Search, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ReposPage() {
  const [repos, setRepos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [syncing, setSyncing] = React.useState(false);

  useEffect(() => {
    api.syncRepos()
      .then((res) => {
        toast({ title: "Auto-synced", description: `${res.syncedRepos} repos synced` });
        loadRepos();
      })
      .catch((err: any) => {
        toast({ title: "Sync failed", description: err?.message ?? "Failed to sync" });
        loadRepos();
      });
  }, []);

  async function loadRepos() {
    try {
      setLoading(true);
      const res = await api.getRepos();
      setRepos(res.repositories ?? []);
    } catch (error: any) {
      toast({ title: "Error", description: error?.message ?? "Failed to load repositories" });
    } finally {
      setLoading(false);
    }
  }

  const filtered = repos.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-800 animate-pulse shrink-0" />
          <p className="text-sm text-slate-400">Loading repositories…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-[#F8FAFC]">Repositories</h1>
          <p className="text-slate-400 mt-1">
            All your team's GitHub repositories synced locally
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-3 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
            </div>
            <Input
              placeholder="Search repositories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 input-pro"
            />
          </div>
          <Button
            onClick={() => {
              setSyncing(true);
              api.syncRepos()
                .then((res) => {
                  toast({ title: "Synced", description: `${res.syncedRepos} repos synced` });
                  loadRepos();
                })
                .catch((err: any) => toast({ title: "Sync failed", description: err?.message ?? "Failed to sync" }))
                .finally(() => setSyncing(false));
            }}
            className="btn-professional"
          >
            {syncing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin shrink-0" /> : <RefreshCw className="h-4 w-4 mr-2 shrink-0" />} {syncing ? "Syncing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <Card className="card-elevated-dark shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-gray-800/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-6">Repository</th>
                  <th className="p-6 text-right">Stars</th>
                  <th className="p-6 text-right">Forks</th>
                  <th className="p-6 text-right">Issues</th>
                  <th className="p-6 text-right">Size</th>
                  <th className="p-6">Language</th>
                  <th className="p-6">Visibility</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-16 flex flex-col items-center justify-center text-center space-y-3 py-12">
                      <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-slate-400 shrink-0 mb-4">
                        <Folder className="h-10 w-10 shrink-0" />
                      </div>
                      <h3 className="text-sm font-semibold text-[#F8FAFC]">No repositories match</h3>
                      <p className="text-xs text-slate-400">Try adjusting your search or wait for auto-sync to complete.</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((repo) => (
                    <tr
                      key={repo.id}
                      className="border-b border-white/10 hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-medium shrink-0">
                            {repo.language?.[0] ?? "?"}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <a
                              href={repo.htmlUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold truncate text-[#F8FAFC] hover:text-indigo-400"
                            >
                              {repo.fullName}
                            </a>
                            <span className="text-xs text-slate-400 truncate">
                              {repo.description ?? "No description"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <span className="text-sm font-semibold text-[#F8FAFC]">{repo.stars}</span>
                        <Star className="h-3 w-3 shrink-0 text-yellow-400 ml-1" />
                      </td>
                      <td className="p-6 text-right text-slate-400">
                        {repo.forks}
                      </td>
                      <td className="p-6 text-right text-slate-400">
                        {repo.openIssues}
                      </td>
                      <td className="p-6 text-right text-slate-400">
                        {(repo.size / 1024).toFixed(1)} MB
                      </td>
                      <td className="p-6">
                        <span className="text-xs font-medium text-slate-400">
                          {repo.language ?? "Unknown"}
                        </span>
                      </td>
                      <td className="p-6">
                        <Badge
                          variant={repo.isPrivate ? "destructive" : "secondary"}
                          className="text-xs font-medium rounded-full px-2.5 py-1 shrink-0"
                        >
                          {repo.isPrivate ? "Private" : "Public"}
                        </Badge>
                      </td>
                      <td className="p-6 text-right">
                        <a
                          href={repo.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          View on GitHub <ChevronRight className="h-3 w-3 shrink-0" />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="border-t border-white/10 bg-gray-800/50 p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              {filtered.length} of {repos.length} repositories
            </span>
            <span className="text-xs text-slate-400 text-right">
              Total stars: <span className="text-yellow-400 font-semibold">{repos.reduce((sum: number, r: any) => sum + (r.stars ?? 0), 0)}</span>
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
