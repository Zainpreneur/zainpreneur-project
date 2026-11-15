import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GitBranch,
  FileText,
  GitPullRequest,
  ChevronLeft,
  User,
  Folder,
  Activity,
  X,
  ShieldCheck,
  Star,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Repositories", href: "/repos", icon: Folder },
  { name: "Issues", href: "/issues", icon: FileText },
  { name: "Pull Requests", href: "/pull-requests", icon: GitPullRequest },
  { name: "Activity", href: "/dashboard", icon: Activity },
] as const;

interface SidebarProps {
  isCollapsed?: boolean;
  isMobileMenuOpen?: boolean;
  onToggle: () => void;
  currentPath?: string;
}

export function Sidebar({ isCollapsed = false, isMobileMenuOpen = false, onToggle, currentPath }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-50 border-r border-white/10 bg-[#0B0F17]/95 backdrop-blur-2xl transition-all duration-300 ease-in-out",
        isMobileMenuOpen
          ? "w-72 transform translate-x-0 md:translate-x-0 shadow-xl"
          : isCollapsed
            ? "w-20 transform translate-x-0 md:translate-x-0 shadow-lg"
            : "w-72 ml-0 shadow-lg",
      )}
    >
      <div className="flex h-full flex-col pb-8">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
                <GitBranch className="h-5 w-5 shrink-0" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#F8FAFC] group-hover:text-indigo-400/80 transition-colors">
                Zainpreneur
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="rounded-lg p-2 md:hidden text-slate-400 hover:bg-white/[0.05] hover:text-white transition-colors"
            aria-label="Toggle sidebar"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 shrink-0" /> : <ChevronLeft className="h-5 w-5 shrink-0" />}
          </button>
          {/* Desktop collapse toggle */}
          {!isMobileMenuOpen && (
            <button
              onClick={onToggle}
              className={cn(
                "ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/[0.05] hover:text-white transition-colors",
                isCollapsed ? "rotate-180" : "",
              )}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className={cn("h-4 w-4 shrink-0", isCollapsed && "-rotate-180")} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href || currentPath === "/";
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (typeof window !== "undefined" && window.innerWidth < 768) {
                    onToggle();
                  }
                }}
                className={cn(
                  "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/[0.08] text-white border border-white/10"
                    : "text-slate-400 hover:bg-white/[0.03] hover:text-white",
                  isCollapsed ? "justify-center px-2" : "",
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200",
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "bg-transparent text-slate-400 hover:bg-white/[0.03] hover:text-white",
                )}>
                  <Icon className="h-5 w-5 shrink-0" />
                </div>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        {!isCollapsed && (
          <div className="mx-4 my-4 h-[1px] border-white/10" />
        )}

        {/* Quick Stats - Desktop only */}
        {!isCollapsed && (
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="h-5 w-5 shrink-0" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">GitHub Status</p>
                <p className="text-xs text-lime-400 font-medium">Connected & Secure</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-lime-400/10 flex items-center justify-center text-lime-400">
                <Star className="h-5 w-5 shrink-0" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Stars</p>
                <p className="text-xs text-[#F8FAFC] font-medium">—</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer - connected status */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-slate-400 overflow-hidden border border-white/10">
              <User className="h-5 w-5 shrink-0" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#F8FAFC] truncate">Zainpreneur</p>
              <p className="text-xs text-slate-400">Internal Team Platform</p>
            </div>
          </div>
          {!isCollapsed && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Zainpreneur OS
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
