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
import {
  GitBranch,
  FileText,
  GitPullRequest,
  Star,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Activity,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  trend: "up" | "down" | "neutral";
}) {
  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-muted-foreground",
  };
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4 text-muted-foreground", trendColors[trend])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="text-xs {trendColors[trend]} mt-1">
            {trend === "up" ? "▲" : trend === "down" ? "▼" : "—"} {change}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [repos, setRepos] = React.useState<any[]>([]);
  const [issues, setIssues] = React.useState<any[]>([]);
  const [prs, setPRs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [healthScore, setHealthScore] = React.useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [repoRes, issueRes, prRes] = await Promise.all([
        api.getRepos(),
        api.getIssues({ state: "all" }),
        api.getPullRequests({ state: "all" }),
      ]);
      setRepos(repoRes.repositories ?? []);
      setIssues(issueRes.issues ?? []);
      setPRs(prRes.pullRequests ?? []);

      // Calculate health score
      const total = repos.length || 1;
      const openIssues = issues.filter((i) => i.state === "open").length;
      const openPRs = prs.filter((p) => p.state === "open").length;
      const avgStars =
        repos.reduce((sum, r) => sum + (r.stars ?? 0), 0) / total;
      const score = Math.round(
        Math.min(
          100,
          (avgStars / 10) * 30 +
            (100 - (openIssues / total) * 10) * 30 +
            (100 - (openPRs / total) * 10) * 20 +
            (repos.length > 0 ? 20 : 0),
        ),
      );
      setHealthScore(score);
    } catch (error: any) {
      toast({ title: "Error", description: error?.message ?? "Failed to load data" });
    } finally {
      setLoading(false);
    }
  }

  const openIssues = issues.filter((i) => i.state === "open").length;
  const openPRs = prs.filter((p) => p.state === "open").length;
  const totalStars = repos.reduce((sum, r) => sum + (r.stars ?? 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your GitHub repositories and activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              api.syncRepos().then(() => {
                toast({ title: "Synced", description: "Repositories synced successfully" });
                loadData();
              });
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Sync Now
          </Button>
        </div>
      </div>

      {/* Health Score Card - Creative Feature */}
      <Card className="rounded-2xl border-primary bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-lg font-bold">Repository Health Score</CardTitle>
              <CardDescription>
                Composite score based on activity, issues, PRs, and community engagement
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary">{healthScore}</div>
            <div className="text-xs text-muted-foreground">
              {healthScore >= 80 ? "Excellent" : healthScore >= 60 ? "Good" : healthScore >= 40 ? "Fair" : "Needs Attention"}
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="flex flex-col items-center text-center">
            <Activity className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm font-semibold">{repos.length}</span>
            <span className="text-xs text-muted-foreground">Repositories</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Star className="h-5 w-5 text-yellow-500 mb-1" />
            <span className="text-sm font-semibold">{totalStars}</span>
            <span className="text-xs text-muted-foreground">Total Stars</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <FileText className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-sm font-semibold">{openIssues}</span>
            <span className="text-xs text-muted-foreground">Open Issues</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <GitPullRequest className="h-5 w-5 text-purple-500 mb-1" />
            <span className="text-sm font-semibold">{openPRs}</span>
            <span className="text-xs text-muted-foreground">Open Pulls</span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Repositories"
          value={repos.length}
          icon={GitBranch}
          trend="neutral"
        />
        <StatCard
          title="Open Issues"
          value={openIssues}
          icon={FileText}
          trend={openIssues > 0 ? "down" : "neutral"}
        />
        <StatCard
          title="Open Pull Requests"
          value={openPRs}
          icon={GitPullRequest}
          trend={openPRs > 0 ? "down" : "neutral"}
        />
        <StatCard
          title="Total Stars"
          value={totalStars}
          icon={Star}
          trend="up"
        />
      </div>

      {/* Recent Activity */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : repos.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No repositories found. Connect your GitHub account and sync.</p>
              <Button onClick={() => window.location.href = "/settings"} className="mt-4">
                Connect GitHub
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {repos
                .slice(0, 6)
                .map((repo) => (
                  <div key={repo.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                        {repo.language?.[0] ?? "?"}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{repo.fullName}</div>
                        <div className="text-xs text-muted-foreground">
                          {repo.description ?? "No description"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Star className="h-3 w-3" />
                      <span>{repo.stars}</span>
                      <Badge variant="outline">{repo.isPrivate ? "Private" : "Public"}</Badge>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4">
          <a href="/repos" className="text-sm text-primary hover:underline">
            View all repositories →
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
