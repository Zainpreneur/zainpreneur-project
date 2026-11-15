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
    // Auto-sync on mount
    api.syncRepos()
      .then((res) => {
        toast({ title: "Auto-synced", description: `${res.syncedRepos} repos synced` });
        loadRepos();
      })
      .catch((err: any) => {
        toast({ title: "Sync failed", description: err?.message ?? "Failed to sync" });
        loadRepos(); // Still try to load existing data
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
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Repositories</h1>
          <p className="text-muted-foreground mt-1">
            All your team's GitHub repositories synced locally
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-3 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
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
            {syncing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />} {syncing ? "Syncing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <Card className="card-professional shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-input/50 bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="p-6 font-medium">Repository</th>
                  <th className="p-6 font-medium text-right">Stars</th>
                  <th className="p-6 font-medium text-right">Forks</th>
                  <th className="p-6 font-medium text-right">Issues</th>
                  <th className="p-6 font-medium text-right">Size</th>
                  <th className="p-6 font-medium">Language</th>
                  <th className="p-6 font-medium">Visibility</th>
                  <th className="p-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-16 text-center text-muted-foreground">
                      <Folder className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-sm font-semibold">No repositories match</h3>
                      <p className="text-xs">Try adjusting your search or wait for auto-sync to complete.</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((repo) => (
                    <tr
                      key={repo.id}
                      className="border-b border-input/50 hover:bg-accent/30 transition-colors group"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs font-medium">
                            {repo.language?.[0] ?? "?"}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <a
                              href={repo.htmlUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium truncate hover:underline"
                            >
                              {repo.fullName}
                            </a>
                            <span className="text-xs text-muted-foreground truncate">
                              {repo.description ?? "No description"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <span className="text-sm font-medium">{repo.stars}</span>
                        <Star className="h-3 w-3 text-yellow-500 ml-1" />
                      </td>
                      <td className="p-6 text-right text-muted-foreground">
                        {repo.forks}
                      </td>
                      <td className="p-6 text-right text-muted-foreground">
                        {repo.openIssues}
                      </td>
                      <td className="p-6 text-right text-muted-foreground">
                        {(repo.size / 1024).toFixed(1)} MB
                      </td>
                      <td className="p-6">
                        <span className="text-xs font-medium text-muted-foreground">
                          {repo.language ?? "Unknown"}
                        </span>
                      </td>
                      <td className="p-6">
                        <Badge
                          variant={repo.isPrivate ? "destructive" : "secondary"}
                          className="text-xs font-medium rounded-full px-2.5 py-1"
                        >
                          {repo.isPrivate ? "Private" : "Public"}
                        </Badge>
                      </td>
                      <td className="p-6 text-right">
                        <a
                          href={repo.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          View on GitHub <ChevronRight className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="border-t border-input/50 bg-muted/30 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {filtered.length} of {repos.length} repositories
            </span>
            <span className="text-xs text-muted-foreground">
              Total stars:
              <span className="text-yellow-500 font-medium">{repos.reduce((sum: number, r: any) => sum + (r.stars ?? 0), 0)}</span>
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

