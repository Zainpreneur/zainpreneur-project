"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsMobileMenuOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  return (
    <Providers>
      <Navbar
        user={null}
        onThemeToggle={() => {}}
        theme="system"
        onSidebarToggle={toggleSidebar}
        isCollapsed={isCollapsed}
      />
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-49 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="flex flex-1 min-h-[calc(100vh-3.5rem)]">
        <Sidebar
          isCollapsed={isCollapsed}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggle={toggleSidebar}
        />
        <main
          className={cn(
            "flex-1 overflow-y-auto p-6 lg:p-8 transition-all duration-300",
            isCollapsed ? "lg:pl-0" : "lg:pl-20",
          )}
        >
          {children}
        </main>
      </div>
    </Providers>
  );
}
