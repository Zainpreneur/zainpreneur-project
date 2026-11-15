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
  Download,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
  User as UserIcon,
  FileText as FileTextIcon,
  Folder as FolderIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  user?: { login: string; avatar_url?: string } | null;
  onThemeToggle: () => void;
  theme: "light" | "dark" | "system";
}

export function Navbar({ user, onThemeToggle, theme }: NavbarProps) {
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-input/50 bg-background/80 backdrop-blur-md">
      {/* Left: brand */}
      <div className="flex items-center gap-4 px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          <span className="text-xl font-bold tracking-tight text-primary">
            Zainpreneur
          </span>
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

        {user ? (
          <UserMenu user={user} />
        ) : (
          <Button variant="outline" size="sm" asChild>
            <a href="/settings">Connect GitHub</a>
          </Button>
        )}
      </div>
    </header>
  );
}

function UserMenu({ user }: { user: { login: string; avatar_url?: string } }) {
  return (
    <div className="relative inline-block">
      <button className="flex items-center gap-2 rounded-full bg-primary px-2.5 py-1 text-xs text-primary-foreground hover:bg-primary/90 transition-colors">
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
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-popover border border-input rounded-xl shadow-lg p-1 animate-in fade-in slide-in-from-right-2 z-50">
        <div className="flex items-center gap-3 px-3 py-2 border-b border-input/50">
          <img src={user.avatar_url || ""} alt="" className="h-8 w-8 rounded-full" />
          <div>
            <p className="text-sm font-medium">{user.login}</p>
            <p className="text-xs text-muted-foreground">GitHub Account</p>
          </div>
        </div>
        <div className="py-1">
          <a
            href="/settings"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
          >
            <SettingsIcon className="h-4 w-4" /> Settings
          </a>
          <a
            href="/api/auth/signout"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            <LogOutIcon className="h-4 w-4" /> Sign Out
          </a>
        </div>
      </div>
    </div>
  );
}
