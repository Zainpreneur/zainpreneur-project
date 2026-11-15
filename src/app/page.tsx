"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GitBranch, Star, FileText, GitPullRequest, ShieldAlert, Rocket, Activity } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto py-24 px-6 text-center overflow-hidden">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-input/30 bg-background/50 text-primary text-sm font-medium mb-10"
          >
            <Rocket className="h-4 w-4" /> Internal — Team Access Only
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-8 leading-tight"
          >
            GitHub Management,<br />
            <span className="text-primary">Built for Zainpreneur.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            The internal GitHub repository, issue, and pull request management
            dashboard for Zainpreneur and team. Sync, track, and manage all your
            repositories from one secure place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/dashboard"
              className="btn-professional group relative px-8 py-4 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-lg font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30"
            >
              Open Dashboard
              <Star className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/repos"
              className="px-8 py-4 rounded-lg border border-input bg-background text-foreground font-semibold hover:bg-accent transition-all duration-300"
            >
              Browse Repositories
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative max-w-7xl mx-auto py-24 px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: GitBranch,
              title: "Repository Sync",
              desc: "One-click sync of all team GitHub repositories with full metadata, stars, forks, and language stats stored locally.",
            },
            {
              icon: FileText,
              title: "Issue Tracking",
              desc: "Create, view, and update issues across all repositories. Local and GitHub-synced issues with full audit trail.",
            },
            {
              icon: GitPullRequest,
              title: "Pull Requests",
              desc: "Monitor all pull requests across repos. Track draft status, mergeability, and review progress.",
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -8 }}
              className="p-8 rounded-xl border border-input/50 bg-card shadow-sm hover:bg-accent/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-sm shadow-primary/10 group-hover:shadow-primary/20 transition-shadow duration-300">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Note */}
      <section className="relative max-w-3xl mx-auto py-24 px-6">
        <div className="card-professional p-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-foreground mb-4"
          >
            Internal Platform — Zainpreneur Team Only
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed"
          >
            This is a private, self-hosted GitHub management system. Access is
            restricted to the Zainpreneur team. Your GitHub token is encrypted
            at rest and never leaves your environment.
          </motion.p>
        </div>
      </section>
    </div>
  );
}

