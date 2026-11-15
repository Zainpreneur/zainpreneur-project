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
  Activity,
  ShieldCheck,
  Clock,
  Folder,
  Code,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
  description,
  color,
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  trend: "up" | "down" | "neutral";
  description?: string;
  color?: string;
}) {
  const trendColors = {
    up: "text-emerald-500 bg-emerald-50",
    down: "text-rose-500 bg-rose-50",
    neutral: "text-muted-foreground bg-muted",
  } as const;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "rounded-3xl border border-input/50 bg-gradient-to-b from-background to-card p-6 shadow-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300",
        color && `border-${color}/20`,
      )}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
          <Icon className={cn("h-6 w-6", trendColors[trend].split(" ")[1])} />
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center gap-1">
          <span className={cn("text-xs font-medium", trendColors[trend].split(" ")[0])}>
            {trend === "up" ? "▲" : trend === "down" ? "▼" : "—"} {change}
          </span>
        </div>
      )}
    </motion.div>
  );
}

function HealthGauge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 80) return "text-emerald-500 bg-emerald-50 border-emerald-100";
    if (s >= 60) return "text-blue-500 bg-blue-50 border-blue-100";
    if (s >= 40) return "text-amber-500 bg-amber-50 border-amber-100";
    return "text-rose-500 bg-rose-50 border-rose-100";
  };

  const colorClass = getColor(score);
  const label =
    score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs Attention";

  return (
    <Card className="rounded-3xl border border-input/50 shadow-lg overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-lg font-bold">Repository Health Score</CardTitle>
            <CardDescription>
              Composite score based on stars, activity, issues, and PRs
            </CardDescription>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold tracking-tight">{score}</div>
          <div className={cn("text-xs font-semibold uppercase tracking-wider", colorClass.split(" ")[0])}>
            {label}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Repositories"
            value={0}
            icon={GitBranch}
            trend="neutral"
            description="Total synced"
          />
          <StatCard
            title="Total Stars"
            value={0}
            icon={Star}
            trend="up"
            description="Across repos"
          />
          <StatCard
            title="Open Issues"
            value={0}
            icon={FileText}
            trend="down"
            description="Needs attention"
          />
          <StatCard
            title="Open Pulls"
            value={0}
            icon={GitPullRequest}
            trend="down"
            description="Pending review"
          />
        </div>
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
      const allRepos = repoRes.repositories ?? [];
      setRepos(allRepos);
      setIssues(issueRes.issues ?? []);
      setPRs(prRes.pullRequests ?? []);

      const total = allRepos.length || 1;
      const openIssues = issues.filter((i) => i.state === "open").length;
      const openPRs = prs.filter((p) => p.state === "open").length;
      const avgStars =
        allRepos.reduce((sum: number, r: any) => sum + (r.stars ?? 0), 0) / total;
      const score = Math.round(
        Math.min(
          100,
          (avgStars / 10) * 25 +
            Math.max(0, 100 - (openIssues / total) * 10) * 25 +
            Math.max(0, 100 - (openPRs / total) * 10) * 25 +
            (allRepos.length > 0 ? 25 : 0),
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
  const totalForks = repos.reduce((sum, r) => sum + (r.forks ?? 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your team's GitHub repositories and activity
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
      </motion.div>

      {/* Health Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <HealthGauge score={healthScore} />
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4 md:grid-cols-4"
      >
        <StatCard
          title="Total Repositories"
          value={repos.length}
          icon={GitBranch}
          trend="neutral"
          color="blue"
        />
        <StatCard
          title="Total Stars"
          value={totalStars}
          icon={Star}
          trend="up"
          color="yellow"
        />
        <StatCard
          title="Open Issues"
          value={openIssues}
          icon={FileText}
          trend={openIssues > 0 ? "down" : "neutral"}
          color={openIssues > 0 ? "rose" : "emerald"}
        />
        <StatCard
          title="Open Pulls"
          value={openPRs}
          icon={GitPullRequest}
          trend={openPRs > 0 ? "down" : "neutral"}
          color={openPRs > 0 ? "amber" : "emerald"}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="rounded-3xl border border-input hover:border-primary/50 transition-all cursor-pointer group shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Folder className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">Browse Repositories</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">View all synced repositories</p>
          </CardContent>
          <CardFooter className="pt-3">
            <a
              href="/repos"
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
            >
              Explore →
              <ChevronRight className="h-3 w-3" />
            </a>
          </CardFooter>
        </Card>
        <Card className="rounded-3xl border border-input hover:border-blue-500/50 transition-all cursor-pointer group shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">Manage Issues</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">Track and create issues</p>
          </CardContent>
          <CardFooter className="pt-3">
            <a
              href="/issues"
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
            >
              View Issues →
              <ChevronRight className="h-3 w-3" />
            </a>
          </CardFooter>
        </Card>
        <Card className="rounded-3xl border border-input hover:border-purple-500/50 transition-all cursor-pointer group shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <GitPullRequest className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">Review Pull Requests</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">Monitor open PRs</p>
          </CardContent>
          <CardFooter className="pt-3">
            <a
              href="/pull-requests"
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
            >
              View PRs →
              <ChevronRight className="h-3 w-3" />
            </a>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="rounded-3xl shadow-sm border border-input">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
            <a href="/repos" className="text-xs text-primary hover:underline">
              View all
            </a>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                ))}
              </div>
            ) : repos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <Clock className="h-10 w-10 text-muted-foreground" />
                <h3 className="text-sm font-semibold">No activity yet</h3>
                <p className="text-xs text-muted-foreground">
                  Sync your repositories to see recent activity here.
                </p>
                <Button onClick={() => api.syncRepos().then(() => loadData())} className="mt-4">
                  <RefreshCw className="h-4 w-4 mr-2" /> Sync Repositories
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-input/50">
                {repos.slice(0, 6).map((repo) => (
                  <div
                    key={repo.id}
                    className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-2xl transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-medium">
                        {repo.language?.[0] ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{repo.fullName}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {repo.description ?? "No description"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="font-medium">{repo.stars}</span>
                      <Badge variant="outline" className="h-6 px-2">
                        {repo.isPrivate ? "Private" : "Public"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-4 border-t border-input/50">
            <a href="/repos" className="text-sm text-primary hover:underline">
              View all repositories →
            </a>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
