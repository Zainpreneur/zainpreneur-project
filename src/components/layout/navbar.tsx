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
  Clock,
  Users,
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
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-input/50 bg-background/70 backdrop-blur-2xl">
      {/* Left: brand + sidebar toggle */}
      <div className="flex items-center gap-3 px-4">
        {/* Mobile hamburger */}
        <button
          onClick={onSidebarToggle}
          className="md:hidden rounded-liquid p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop collapse toggle */}
        {!isCollapsed ? (
          <button
            onClick={onSidebarToggle}
            className="hidden lg:flex rounded-liquid p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={onSidebarToggle}
            className="hidden lg:flex rounded-liquid p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
            aria-label="Expand sidebar"
          >
            <ChevronLeft className="h-4 w-4 -rotate-180" />
          </button>
        )}

        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-liquid bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300 cursor-pointer">
            <GitBranch className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">Zainpreneur</span>
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
            className="pl-10 bg-background/30 border-input/50 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-liquid"
          />
        </div>
      </div>

      {/* Right: stats chip, theme, notifications, user */}
      <div className="flex items-center gap-2 px-4">
        {/* Quick stat chip */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-liquid bg-muted border border-input/50">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          <span className="text-xs font-medium text-muted-foreground">Secure Connection</span>
        </div>

        <button
          onClick={onThemeToggle}
          className="rounded-liquid p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button className="rounded-liquid p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-300 relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 border-2 border-background" aria-hidden="true" />
        </button>

        {user && (
          <div className="flex items-center gap-2 rounded-liquid bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 transition-colors duration-300 group">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt=""
                className="h-7 w-7 rounded-full border-2 border-primary/30 group-hover:scale-105 transition-transform duration-300"
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
