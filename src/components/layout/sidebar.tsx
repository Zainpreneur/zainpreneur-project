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
  onToggle: () => void;
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 border-r border-input/50 bg-background/80 backdrop-blur-md transition-all duration-300",
        isCollapsed ? "w-16 -ml-60" : "w-64 ml-0",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className={cn("flex items-center justify-between h-14 px-4 border-b border-input/50", isCollapsed && "justify-center")}>
          {!isCollapsed && (
            <>
              <div className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-primary" />
                <span className="text-xl font-bold tracking-tight text-primary">Zainpreneur</span>
              </div>
            </>
          )}
          <button
            onClick={onToggle}
            className="rounded-md p-1.5 md:hidden text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={cn("h-4 w-4", isCollapsed && "-rotate-180")} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  isCollapsed ? "justify-center px-2" : "",
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isCollapsed ? "mx-auto" : "mr-3")} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer - connected status */}
        <div className="p-3 border-t border-input/50">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">Zainpreneur</p>
              <p className="text-xs text-muted-foreground">GitHub • Connected</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
