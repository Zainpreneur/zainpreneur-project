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
  ShieldCheck,
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
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-input bg-background/80 backdrop-blur-md">
      {/* Left: brand + sidebar toggle */}
      <div className="flex items-center gap-3 px-4">
        {/* Mobile hamburger */}
        <button
          onClick={onSidebarToggle}
          className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop collapse toggle */}
        {!isCollapsed ? (
          <button
            onClick={onSidebarToggle}
            className="hidden lg:flex rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={onSidebarToggle}
            className="hidden lg:flex rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronLeft className="h-4 w-4 -rotate-180" />
          </button>
        )}

        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm shadow-primary/20">
            <GitBranch className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Zainpreneur</span>
        </Link>
      </div>

      {/* Center: search */}
      <div className="hidden lg:flex items-center w-96 mx-4">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-3 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            placeholder="Search repositories, issues, pull requests..."
            className="pl-10 bg-background border-input rounded-lg focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Right: stats chip, theme, notifications, user */}
      <div className="flex items-center gap-2 px-4">
        {/* Quick stat chip */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-input">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          <span className="text-xs font-medium text-muted-foreground">Secure Connection</span>
        </div>

        <button
          onClick={onThemeToggle}
          className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 border-2 border-background" aria-hidden="true" />
        </button>

        {user && (
          <div className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 transition-colors group">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt=""
                className="h-7 w-7 rounded-full border-2 border-primary/30 group-hover:scale-105 transition-transform duration-200"
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

