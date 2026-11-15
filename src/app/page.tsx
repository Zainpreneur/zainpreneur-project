import Link from "next/link";
import { GitBranch, Star, FileText, GitPullRequest, ShieldAlert, Rocket } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background border-b border-input overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto py-20 px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
            <Rocket className="h-4 w-4" /> v1.0.0 — Live
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
            GitHub Management,<br />
            <span className="text-primary">Reimagined.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            The comprehensive GitHub repository, issue, and pull request
            management dashboard for Zainpreneur. Sync, track, and manage all
            your repositories from one beautiful place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:-translate-y-1 hover:shadow-lg"
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
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto py-20 px-6">
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
            <div
              key={feature.title}
              className="p-6 rounded-xl border border-input bg-card text-card-foreground hover:bg-accent transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-primary/5 border-t border-input">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to manage your GitHub?</h2>
          <p className="text-muted-foreground mb-8">
            Connect your GitHub token and start managing your repositories in seconds.
          </p>
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Connect GitHub Account
            <GitBranch className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
