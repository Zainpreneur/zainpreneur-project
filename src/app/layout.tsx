import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Zainpreneur Project — GitHub Management System",
  description: "Comprehensive GitHub repository, issue, and pull request management dashboard.",
  openGraph: {
    title: "Zainpreneur Project — GitHub Management System",
    description: "Manage your GitHub repositories, issues, and pull requests from one beautiful place.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-background text-foreground antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
