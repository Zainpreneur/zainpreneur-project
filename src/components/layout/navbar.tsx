"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Bell,
  Moon,
  Sun,
  Search,
  GitBranch,
  User as UserIcon,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  user?: { login: string; avatar_url?: string } | null;
  onThemeToggle: () => void;
  theme: "light" | "dark" | "system";
  onSidebarToggle: () => void;
  isCollapsed: boolean;
}

export function Navbar({ user, onThemeToggle, theme, onSidebarToggle, isCollapsed }: NavbarProps) {
  // Use state to avoid hydration mismatch: server renders Moon, client updates after mount
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    if (theme === "dark") {
      setIsDark(true);
    } else if (theme === "system" && typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDark(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-input/50 bg-background/80 backdrop-blur-md">
      {/* Left: brand + mobile menu toggle */}
      <div className="flex items-center gap-4 px-4">
        <button
          onClick={onSidebarToggle}
          className="md:hidden rounded-lg p-1.5 text-muted-foreground hover:bg-accent"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          <span className="text-xl font-bold tracking-tight text-primary">Zainpreneur</span>
        </Link>
      </div>

      {/* Center: search */}
      <div className="hidden md:flex items-center w-96 mx-4">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search repositories, issues, pull requests..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Right: theme, notifications, user */}
      <div className="flex items-center gap-2 px-4">
        <button
          onClick={onThemeToggle}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-accent"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button className="rounded-full p-1.5 text-muted-foreground hover:bg-accent" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" aria-hidden="true" />
        </button>

        {user && (
          <div className="flex items-center gap-2 rounded-full bg-primary px-2.5 py-1 text-xs text-primary-foreground hover:bg-primary/90 transition-colors">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt=""
                className="h-6 w-6 rounded-full border border-primary/30"
              />
            ) : (
              <UserIcon className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{user.login}</span>
          </div>
        )}
      </div>
    </header>
  );
}
