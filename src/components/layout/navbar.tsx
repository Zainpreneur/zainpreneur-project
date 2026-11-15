"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Bell,
  Moon,
  Sun,
  Search,
  User as UserIcon,
  Menu,
  ChevronLeft,
  ShieldCheck,
  Command, // fallback icon if lucide doesn't have it; we'll render text instead
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
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-white/10 bg-[#0B0F17]/80 backdrop-blur-2xl">
      {/* Left: sidebar toggle only (brand lives in Sidebar) */}
      <div className="flex items-center gap-3 px-4">
        {/* Mobile hamburger */}
        <button
          onClick={onSidebarToggle}
          className="md:hidden rounded-lg p-2 text-slate-400 hover:bg-white/[0.05] hover:text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 shrink-0" />
        </button>

        {/* Desktop collapse toggle */}
        {!isCollapsed ? (
          <button
            onClick={onSidebarToggle}
            className="hidden lg:flex rounded-lg p-2 text-slate-400 hover:bg-white/[0.05] hover:text-white transition-colors"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" />
          </button>
        ) : (
          <button
            onClick={onSidebarToggle}
            className="hidden lg:flex rounded-lg p-2 text-slate-400 hover:bg-white/[0.05] hover:text-white transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronLeft className="h-4 w-4 shrink-0 -rotate-180" />
          </button>
        )}
      </div>

      {/* Center: search */}
      <div className="hidden lg:flex items-center w-96 mx-4">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-3 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors shrink-0" />
          </div>
          <Input
            placeholder="Search repositories, issues, pull requests..."
            className="pl-10 bg-gray-800 border border-white/10 rounded-lg focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-sm text-slate-100 dark:text-slate-100"
          />
          {/* ⌘K shortcut badge */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-slate-400">
            <kbd className="font-mono text-slate-300">⌘</kbd>
            <kbd className="font-mono text-slate-300">K</kbd>
          </div>
        </div>
      </div>

      {/* Right: stats chip, theme, notifications, user */}
      <div className="flex items-center gap-2 px-4">
        {/* Quick stat chip */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10">
          <ShieldCheck className="h-4 w-4 text-lime-400 shrink-0" />
          <span className="text-xs font-medium text-slate-300">Secure Connection</span>
        </div>

        <button
          onClick={onThemeToggle}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.05] hover:text-white transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
        </button>

        <button className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.05] hover:text-white transition-colors relative" aria-label="Notifications">
          <Bell className="h-5 w-5 shrink-0" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-lime-400 border-2 border-[#0B0F17]" aria-hidden="true" />
        </button>

        {user && (
          <div className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-slate-900 hover:bg-indigo-500 transition-colors group">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt=""
                className="h-7 w-7 rounded-full border-2 border-indigo-400 group-hover:scale-105 transition-transform duration-200 shrink-0"
              />
            ) : (
              <UserIcon className="h-4 w-4 shrink-0" />
            )}
            <span className="hidden sm:inline">{user.login}</span>
          </div>
        )}
      </div>
    </header>
  );
}
