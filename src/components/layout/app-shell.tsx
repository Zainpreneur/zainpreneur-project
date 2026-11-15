"use client";

import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <Providers>
      <Navbar user={null} onThemeToggle={() => {}} theme="system" />
      <div className="flex flex-1 min-h-[calc(100vh-3.5rem)]">
        <Sidebar user={null} isCollapsed={false} onToggle={() => {}} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </Providers>
  );
}
