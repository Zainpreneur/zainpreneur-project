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
import { GitBranch, Star, RefreshCw, Folder, Code2 } from "lucide-react";

export default function ReposPage() {
  const [repos, setRepos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    loadRepos();
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

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Folder className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">No repositories</h2>
        <p className="text-muted-foreground mb-6">
          Connect your GitHub account and sync to see your repositories here.
        </p>
        <Button onClick={() => api.syncRepos().then(() => loadRepos())}>
          <RefreshCw className="h-4 w-4 mr-2" /> Sync Repositories
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Repositories</h1>
          <p className="text-muted-foreground">
            All your GitHub repositories synced locally
          </p>
        </div>
        <Button onClick={() => loadRepos()}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {repos.map((repo) => (
          <Card key={repo.id} className="rounded-2xl hover:shadow-md transition-shadow group">
            <CardHeader className="pb-3">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold truncate">{repo.name}</CardTitle>
                <Badge variant={repo.isPrivate ? "destructive" : "secondary"} className="h-7 text-xs">
                  {repo.isPrivate ? "Private" : "Public"}
                </Badge>
              </div>
              {repo.description && (
                <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {repo.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Code2 className="h-3 w-3" /> {repo.language ?? "Unknown"}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Folder className="h-3 w-3" /> {repo.owner}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="font-medium">{repo.stars}</span>
                  <span className="text-muted-foreground ml-1">stars</span>
                </div>
                <a
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  View on GitHub
                </a>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
