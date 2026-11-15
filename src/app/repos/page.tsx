"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GitBranch,
  Star,
  RefreshCw,
  Folder,
  List,
  Calendar,
  Timeline,
  GanttChart,
  ChevronRight,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";

const VIEW_TYPES = [
  { id: "table", label: "Table", icon: GitBranch },
  { id: "list", label: "List", icon: List },
  { id: "gallery", label: "Gallery", icon: GalleryCards },
  { id: "kanban", label: "Kanban", icon: Folder },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "timeline", label: "Timeline", icon: Timeline },
  { id: "gantt", label: "Gantt", icon: GanttChart },
];

function TableView({ repos }: { repos: any[] }) {
  if (repos.length === 0) return <EmptyState />;
  return (
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
          {repos.map((repo) => (
            <tr key={repo.id} className="border-b border-white/10 hover:bg-white/[0.02] transition-colors group">
              <td className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-medium shrink-0">
                    {repo.language?.[0] ?? "?"}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold truncate text-[#F8FAFC] hover:text-indigo-400">
                      {repo.fullName}
                    </a>
                    <span className="text-xs text-slate-400 truncate">{repo.description ?? "No description"}</span>
                  </div>
                </div>
              </td>
              <td className="p-6 text-right">
                <span className="text-sm font-semibold text-[#F8FAFC]">{repo.stars}</span>
                <Star className="h-3 w-3 shrink-0 text-yellow-400 ml-1" />
              </td>
              <td className="p-6 text-right text-slate-400">{repo.forks}</td>
              <td className="p-6 text-right text-slate-400">{repo.openIssues}</td>
              <td className="p-6 text-right text-slate-400">{(repo.size / 1024).toFixed(1)} MB</td>
              <td className="p-6"><span className="text-xs font-medium text-slate-400">{repo.language ?? "Unknown"}</span></td>
              <td className="p-6"><Badge variant={repo.isPrivate ? "destructive" : "secondary"} className="text-xs font-medium rounded-full px-2.5 py-1 shrink-0">{repo.isPrivate ? "Private" : "Public"}</Badge></td>
              <td className="p-6 text-right"><a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">View on GitHub <ChevronRight className="h-3 w-3 shrink-0" /></a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListView({ repos }: { repos: any[] }) {
  if (repos.length === 0) return <EmptyState />;
  return (
    <div className="space-y-2">
      {repos.map((repo) => (
        <div key={repo.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] rounded-lg transition-colors border-b border-white/5 group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-medium shrink-0">
              {repo.language?.[0] ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold truncate text-[#F8FAFC] hover:text-indigo-400">
                {repo.fullName}
              </a>
              <p className="text-xs text-slate-400 truncate">{repo.description ?? "No description"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400 shrink-0" /> {repo.stars}</span>
            <span>{repo.forks}</span>
            <Badge variant={repo.isPrivate ? "destructive" : "secondary"} className="text-xs">{repo.isPrivate ? "Private" : "Public"}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function GalleryCards({ repos }: { repos: any[] }) {
  if (repos.length === 0) return <EmptyState />;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {repos.map((repo) => (
        <div key={repo.id} className="rounded-xl border border-white/10 bg-[#111827] p-4 shadow-sm hover:bg-white/[0.03] transition-colors cursor-pointer group">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-xs font-medium shrink-0">{repo.language?.[0] ?? "?"}</div>
            <span className="text-xs font-semibold text-[#F8FAFC] truncate">{repo.fullName.split("/")[1]}</span>
          </div>
          <p className="text-xs text-slate-400 line-clamp-2 mb-3">{repo.description ?? "No description"}</p>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400 shrink-0" /> {repo.stars}</div>
            <Badge variant={repo.isPrivate ? "destructive" : "secondary"} className="text-xs">{repo.isPrivate ? "Private" : "Public"}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function KanbanView({ repos }: { repos: any[] }) {
  if (repos.length === 0) return <EmptyState />;
  const columns = [
    { id: "private", label: "Private", color: "bg-red-500/10 text-red-400 border-red-500/20" },
    { id: "public", label: "Public", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  ];
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((col) => {
        const colRepos = repos.filter((r) => r.isPrivate === (col.id === "private"));
        return (
          <div key={col.id} className="flex-1 min-w-[320px] rounded-xl border border-white/10 bg-gray-800/50 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-500/10 shrink-0" />
              <span className="text-sm font-semibold text-[#F8FAFC]">{col.label}</span>
              <span className="ml-auto text-xs text-slate-400">{colRepos.length}</span>
            </div>
            <div className="space-y-3">
              {colRepos.map((repo) => (
                <div key={repo.id} className="p-3 rounded-lg bg-gray-900/50 border border-transparent hover:border-indigo-400/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md bg-gray-700 flex items-center justify-center text-[10px] font-medium shrink-0">{repo.language?.[0] ?? "?"}</div>
                    <span className="text-sm font-semibold text-[#F8FAFC] truncate">{repo.fullName.split("/")[1]}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mb-2">{repo.description ?? "No description"}</p>
                  <div className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400 shrink-0" /> {repo.stars}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CalendarView({ repos }: { repos: any[] }) {
  if (repos.length === 0) return <EmptyState />;
  return (
    <div className="grid grid-cols-7 gap-2 p-4">
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
        <div key={day} className="text-center py-2">
          <div className="text-xs font-semibold text-slate-400 mb-2">{day}</div>
          <div className="h-8 w-8 rounded-lg bg-gray-800 flex items-center justify-center text-[10px] font-medium text-slate-300">{day.charAt(0)}</div>
        </div>
      ))}
    </div>
  );
}

function TimelineView({ repos }: { repos: any[] }) {
  if (repos.length === 0) return <EmptyState />;
  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />
      {repos.map((repo) => (
        <div key={repo.id} className="relative pl-8 mb-6">
          <div className="absolute left-3 top-2 w-2 h-2 rounded-full bg-indigo-400" />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
              {repo.language?.[0] ?? "?"}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-[#F8FAFC]">{repo.fullName}</div>
              <div className="text-xs text-slate-400">{repo.description ?? "No description"}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function GanttView({ repos }: { repos: any[] }) {
  if (repos.length === 0) return <EmptyState />;
  return (
    <div className="relative h-64 border-t border-white/10 pt-4">
      {repos.map((repo, idx) => (
        <div key={repo.id} className="flex items-center gap-3 mb-4">
          <div className="w-40 text-xs text-slate-400 truncate">{repo.fullName}</div>
          <div className="flex-1 h-2 bg-gray-800 rounded-full relative">
            <div className="h-full bg-indigo-400/30 rounded-full" style={{ width: "60%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-slate-400 shrink-0 mb-4">
        <Folder className="h-10 w-10 shrink-0" />
      </div>
      <h3 className="text-sm font-semibold text-[#F8FAFC]">No repositories match</h3>
      <p className="text-xs text-slate-400">Try adjusting your search or wait for auto-sync to complete.</p>
    </div>
  );
}

export default function ReposPage() {
  const [repos, setRepos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [syncing, setSyncing] = React.useState(false);
  const [view, setView] = React.useState("table");

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
          {/* View Toggle */}
          <div className="flex items-center gap-2 p-4 border-b border-white/10 bg-gray-800/50">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">View</span>
            <div className="flex gap-1">
              {VIEW_TYPES.map((v) => {
                const Icon = v.icon as React.ComponentType<any>;
                return (
                  <Button
                    key={v.id}
                    variant={view === v.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setView(v.id)}
                    className="px-3 py-1.5 text-xs"
                  >
                    <Icon className="h-3 w-3 shrink-0 mr-1" />
                    {v.label}
                  </Button>
                );
              })}
            </div>
          </div>
          {view === "table" && (
            <TableView repos={filtered} />
          )}
          {view === "list" && (
            <ListView repos={filtered} />
          )}
          {view === "gallery" && (
            <GalleryCards repos={filtered} />
          )}
          {view === "kanban" && (
            <KanbanView repos={filtered} />
          )}
          {view === "calendar" && (
            <CalendarView repos={filtered} />
          )}
          {view === "timeline" && (
            <TimelineView repos={filtered} />
          )}
          {view === "gantt" && (
            <GanttView repos={filtered} />
          )}
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
