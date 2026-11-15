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
  Bell,
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
}

export function Sidebar({ isCollapsed = false, isMobileMenuOpen = false, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-50 border-r border-input/50 bg-background/85 backdrop-blur-xl transition-all duration-500 ease-in-out",
        isMobileMenuOpen
          ? "w-64 transform translate-x-0 md:translate-x-0 shadow-2xl"
          : isCollapsed
            ? "w-20 -ml-full transform translate-x-0 md:translate-x-0 shadow-lg"
            : "w-72 ml-0 shadow-lg",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className={cn("flex items-center justify-between h-16 px-4 border-b border-input/50", isCollapsed && "justify-center")}>
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                <GitBranch className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-primary group-hover:text-primary/80 transition-colors">
                Zainpreneur
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="rounded-xl p-2 md:hidden text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Toggle sidebar"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
          {/* Desktop collapse toggle - always visible */}
          {!isMobileMenuOpen && (
            <button
              onClick={onToggle}
              className={cn(
                "absolute right-2.5 top-1/2 -translate-y-1/2 rounded-xl p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all",
                isCollapsed ? "ml-1 rotate-180" : "",
              )}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className={cn("h-4 w-4", isCollapsed && "-rotate-180")} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
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
                  "flex items-center rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  isCollapsed ? "justify-center px-2" : "",
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200",
                  isCollapsed ? "" : "text-muted-foreground hover:text-accent-foreground",
                )}>
                  <Icon className={cn("h-5 w-5", isCollapsed ? "mx-auto" : "mr-3")} />
                </div>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        {!isCollapsed && (
          <div className="mx-4 my-3 h-px bg-input/30" />
        )}

        {/* Quick Stats - Desktop only */}
        {!isCollapsed && (
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">GitHub Status</p>
                <p className="text-xs text-green-600 font-medium">Connected & Secure</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground">
                <Star className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Total Stars</p>
                <p className="text-xs font-medium text-foreground">—</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer - connected status */}
        <div className="p-4 border-t border-input/50 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground overflow-hidden">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">Zainpreneur</p>
              <p className="text-xs text-muted-foreground">Internal Team Platform</p>
            </div>
          </div>
          {!isCollapsed && (
            <div className="mt-3 pt-3 border-t border-input/30">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Zainpreneur OS
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
