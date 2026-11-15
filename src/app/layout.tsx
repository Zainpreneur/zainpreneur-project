import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Zainpreneur Project — Internal GitHub Management",
  description: "Internal GitHub repository, issue, and pull request management dashboard for the Zainpreneur team.",
  openGraph: {
    title: "Zainpreneur Project — Internal GitHub Management",
    description: "Manage your team's GitHub repositories, issues, and pull requests from one secure internal place.",
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
