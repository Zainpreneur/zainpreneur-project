"use client";

import * as React from "react";
import { Toaster } from "@/components/ui/sonner";

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "zainpreneur-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  const resolvedTheme = React.useMemo(() => {
    if (theme === "system") {
      if (typeof window === "undefined") return "light";
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  }, [theme]);

  React.useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(storageKey, theme);
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [theme, resolvedTheme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : prev === "dark" ? "system" : "light";
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, toggleTheme }}>
      {children}
      <Toaster />
    </ThemeContext.Provider>
  );
}

const ThemeContext = React.createContext<{
  theme: Theme;
  resolvedTheme: "light" | "dark";
  toggleTheme: () => void;
}>({ theme: "system", resolvedTheme: "light", toggleTheme: () => {} });

export function useTheme() {
  return React.useContext(ThemeContext);
}

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
