"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GitBranch, Star, FileText, GitPullRequest, ShieldAlert, Rocket, Activity } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background border-b border-input overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto py-24 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8"
          >
            <Rocket className="h-4 w-4" /> v1.0.0 — Live
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6"
          >
            GitHub Management,<br />
            <span className="text-primary">Reimagined.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            The comprehensive GitHub repository, issue, and pull request
            management dashboard for Zainpreneur. Sync, track, and manage all
            your repositories from one beautiful place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/dashboard"
              className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:-translate-y-1 hover:shadow-lg shadow-primary/20"
            >
              Open Dashboard
              <Star className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/settings"
              className="px-8 py-4 rounded-xl border border-input bg-background text-foreground font-semibold hover:bg-accent transition-colors"
            >
              Connect GitHub
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: GitBranch,
              title: "Repository Sync",
              desc: "One-click sync of all your GitHub repositories with full metadata, stars, forks, and language stats stored locally.",
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
              className="p-8 rounded-2xl border border-input bg-card text-card-foreground hover:bg-accent transition-colors shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
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

      {/* CTA */}
      <section className="py-24 px-6 bg-primary/5 border-t border-input">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground mb-4"
          >
            Ready to manage your GitHub?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-muted-foreground mb-8"
          >
            Connect your GitHub token and start managing your repositories in seconds.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Connect GitHub Account
            <GitBranch className="h-4 w-4" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
