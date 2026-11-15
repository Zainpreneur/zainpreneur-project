"use client";

import * as React from "react";
import { useEffect, useState, useRef } from "react";
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
    up: "text-lime-400 bg-lime-400/10",
    down: "text-rose-400 bg-rose-400/10",
    neutral: "text-slate-400 bg-slate-700",
  } as const;

  const colorMap: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    yellow: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
    rose: "bg-rose-400/10 text-rose-400 border-rose-400/20",
    emerald: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    amber: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "rounded-xl border border-white/10 bg-[#111827] p-6 shadow-lg shadow-black/20 transition-all duration-300",
        color && `border-${color}/20`,
      )}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-[#F8FAFC]">{value}</p>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
          <div className={`w-full h-full rounded-lg ${colorMap[color as keyof typeof colorMap] ?? "bg-blue-500/10 text-blue-400 border-blue-500/20"} flex items-center justify-center shadow-sm`}>
            <Icon className={cn("h-5 w-5 shrink-0", trendColors[trend].split(" ")[1])} />
          </div>
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
  const isEmpty = score === 0;

  const colorClass = isEmpty
    ? "text-slate-500 bg-slate-700 border-white/10"
    : score >= 80
      ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
      : score >= 60
        ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
        : score >= 40
          ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
          : "text-rose-400 bg-rose-400/10 border-rose-400/20";

  const label = isEmpty
    ? "Awaiting Sync"
    : score >= 80
      ? "Excellent"
      : score >= 60
        ? "Good"
        : score >= 40
          ? "Fair"
          : "Needs Attention";

  const displayValue = isEmpty ? "—" : score;

  return (
    <Card className="card-elevated-dark relative group overflow-hidden">
      <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 shrink-0 text-indigo-400" />
          <div>
            <CardTitle className="text-lg font-bold tracking-tight text-[#F8FAFC]">Repository Health Score</CardTitle>
            <CardDescription className="text-slate-400">Composite score based on stars, activity, issues, and PRs</CardDescription>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold tracking-tighter text-[#F8FAFC]">{displayValue}</div>
          <div className={cn("text-xs font-semibold uppercase tracking-wider", colorClass.split(" ")[0])}>
            {label}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

// Skeleton components for loading states
function StatCardSkeleton() {
  return (
    <motion.div className="rounded-xl border border-white/10 bg-[#111827] p-6 shadow-lg shadow-black/20">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="h-4 w-1/3 rounded-md bg-gray-800 shrink-0" />
          <div className="h-6 w-3/4 rounded-md bg-gray-800 shrink-0 mt-2" />
          <div className="h-3 w-1/2 rounded-md bg-gray-800 shrink-0 mt-2" />
        </div>
        <div className="w-10 h-10 rounded-lg bg-gray-800 shrink-0" />
      </div>
    </motion.div>
  );
}

function HealthGaugeSkeleton() {
  return (
    <Card className="card-elevated-dark relative">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-lg bg-gray-800 shrink-0" />
          <div>
            <div className="h-4 w-1/3 rounded-md bg-gray-800 shrink-0" />
            <div className="h-3 w-1/2 rounded-md bg-gray-800 shrink-0 mt-1" />
          </div>
        </div>
        <div className="text-right">
          <div className="h-8 w-20 rounded-md bg-gray-800 shrink-0" />
          <div className="h-4 w-1/3 rounded-md bg-gray-800 shrink-0 mt-1" />
        </div>
      </CardHeader>
    </Card>
  );
}

export default function DashboardPage() {
  const [repos, setRepos] = React.useState<any[]>([]);
  const [issues, setIssues] = React.useState<any[]>([]);
  const [prs, setPRs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [healthScore, setHealthScore] = React.useState(0);
  const [syncStatus, setSyncStatus] = React.useState<{
    lastSynced: string | null;
    syncing: boolean;
  }>({ lastSynced: null, syncing: false });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

  async function performSync() {
    setSyncStatus((prev) => ({ ...prev, syncing: true }));
    try {
      const res = await api.syncRepos();
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setSyncStatus({ lastSynced: now, syncing: false });
      toast({ title: "Auto-synced", description: `${res.syncedRepos} repos, ${res.syncedIssues} issues, ${res.syncedPRs} PRs` });
    } catch (error: any) {
      setSyncStatus((prev) => ({ ...prev, syncing: false }));
      toast({ title: "Sync failed", description: error?.message ?? "Failed to sync" });
    }
  }

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

  useEffect(() => {
    performSync().then(() => loadData());

    intervalRef.current = setInterval(performSync, SYNC_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const openIssues = issues.filter((i) => i.state === "open").length;
  const openPRs = prs.filter((p) => p.state === "open").length;
  const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stars ?? 0), 0);
  const totalForks = repos.reduce((sum: number, r: any) => sum + (r.forks ?? 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-[#F8FAFC]">Dashboard</h1>
          <p className="text-slate-400">
            Overview of your team's GitHub repositories and activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-white/10 text-xs">
            <RefreshCw className="h-3 w-3 shrink-0 {syncStatus.syncing ? 'animate-spin' : ''}" />
            <span className={syncStatus.syncing ? "text-indigo-400" : "text-slate-400"}>
              {syncStatus.syncing ? "Syncing..." : syncStatus.lastSynced ? `Last synced ${syncStatus.lastSynced}` : "Auto-sync enabled"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Health Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? <HealthGaugeSkeleton /> : <HealthGauge score={healthScore} />}
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid gap-4 md:grid-cols-4"
      >
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
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
          </>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="card-elevated-dark hover:border-indigo-400/30 transition-all cursor-pointer group shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                <Folder className="h-5 w-5 shrink-0" />
              </div>
              <span className="text-sm font-semibold text-[#F8FAFC]">Browse Repositories</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-slate-400">View all synced repositories</p>
          </CardContent>
          <CardFooter className="pt-4">
            <a
              href="/repos"
              className="text-xs text-indigo-400 font-medium hover:underline flex items-center gap-1"
            >
              Explore →
              <ChevronRight className="h-3 w-3 shrink-0" />
            </a>
          </CardFooter>
        </Card>
        <Card className="card-elevated-dark hover:border-blue-400/30 transition-all cursor-pointer group shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-400/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-400/20 transition-colors">
                <FileText className="h-5 w-5 shrink-0" />
              </div>
              <span className="text-sm font-semibold text-[#F8FAFC]">Manage Issues</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-slate-400">Track and create issues</p>
          </CardContent>
          <CardFooter className="pt-4">
            <a
              href="/issues"
              className="text-xs text-indigo-400 font-medium hover:underline flex items-center gap-1"
            >
              View Issues →
              <ChevronRight className="h-3 w-3 shrink-0" />
            </a>
          </CardFooter>
        </Card>
        <Card className="card-elevated-dark hover:border-purple-400/30 transition-all cursor-pointer group shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-400/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-400/20 transition-colors">
                <GitPullRequest className="h-5 w-5 shrink-0" />
              </div>
              <span className="text-sm font-semibold text-[#F8FAFC]">Review Pull Requests</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-slate-400">Monitor open PRs</p>
          </CardContent>
          <CardFooter className="pt-4">
            <a
              href="/pull-requests"
              className="text-xs text-indigo-400 font-medium hover:underline flex items-center gap-1"
            >
              View PRs →
              <ChevronRight className="h-3 w-3 shrink-0" />
            </a>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="card-elevated-dark shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-semibold text-[#F8FAFC]">Recent Activity</CardTitle>
            <a href="/repos" className="text-xs text-indigo-400 hover:underline">
              View all
            </a>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3 py-4">
                <div className="h-4 w-full rounded-md bg-gray-800 shrink-0" />
                <div className="h-4 w-3/4 rounded-md bg-gray-800 shrink-0 mt-2" />
                <div className="h-4 w-1/2 rounded-md bg-gray-800 shrink-0 mt-2" />
              </div>
            ) : repos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-slate-500 shrink-0 mb-4">
                  <Clock className="h-8 w-8 shrink-0" />
                </div>
                <h3 className="text-sm font-semibold text-[#F8FAFC]">No activity yet</h3>
                <p className="text-xs text-slate-400">
                  Repositories are being synced automatically. Please wait a moment.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {repos.slice(0, 6).map((repo) => (
                  <div
                    key={repo.id}
                    className="flex items-center justify-between p-4 hover:bg-white/[0.02] rounded-lg transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-medium shrink-0">
                        {repo.language?.[0] ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate text-[#F8FAFC]">{repo.fullName}</div>
                        <div className="text-xs text-slate-400 truncate">
                          {repo.description ?? "No description"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Star className="h-3 w-3 shrink-0 text-yellow-400" />
                      <span className="font-semibold text-[#F8FAFC]">{repo.stars}</span>
                      <Badge variant={repo.isPrivate ? "destructive" : "secondary"} className="h-6 px-2 text-xs font-medium shrink-0">
                        {repo.isPrivate ? "Private" : "Public"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-4 border-t border-white/10">
            <a href="/repos" className="text-xs text-indigo-400 hover:underline">
              View all repositories →
            </a>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
