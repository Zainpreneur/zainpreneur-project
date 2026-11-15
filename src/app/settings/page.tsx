"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, User, RefreshCw, LogOut, CheckCircle2, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = React.useState<{
    id: number;
    login: string;
    name: string | null;
    avatarUrl: string | null;
    email: string | null;
    tokenUpdatedAt: number | null;
  } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [token, setToken] = React.useState("");
  const [connectLoading, setConnectLoading] = React.useState(false);
  const [envTokenConfigured, setEnvTokenConfigured] = React.useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      setLoading(true);
      const res = await api.getUser();
      if (res.user) {
        setUser(res.user);
      } else {
        // Check if env token is configured - try auto-connect
        const envRes = await fetch("/api/auth/env-status");
        const envData = await envRes.json();
        setEnvTokenConfigured(!!envData.configured);
      }
    } catch (error: any) {
      console.error("load user error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) {
      toast({ title: "Error", description: "Please enter a GitHub token" });
      return;
    }
    setConnectLoading(true);
    try {
      const res = await api.connectToken(token);
      setUser(res.user);
      setToken("");
      toast({ title: "Connected", description: "GitHub account connected successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.message ?? "Failed to connect" });
    } finally {
      setConnectLoading(false);
    }
  }

  async function handleAutoConnect() {
    setConnectLoading(true);
    try {
      const res = await fetch("/api/auth/auto-connect", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Auto-connect failed");
      setUser(data.user);
      toast({ title: "Auto-connected", description: "GitHub account connected via environment token" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.message ?? "Auto-connect failed" });
    } finally {
      setConnectLoading(false);
    }
  }

  async function handleDisconnect() {
    try {
      await api.disconnect();
      setUser(null);
      setEnvTokenConfigured(false);
      toast({ title: "Disconnected", description: "GitHub account disconnected" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.message ?? "Failed to disconnect" });
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your GitHub connection and account preferences
          </p>
        </div>
      </div>

      {/* Connection Status Card */}
      <Card className="rounded-2xl shadow-sm border border-input/50">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" /> GitHub Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={user.avatarUrl || "https://github.com/identicons/" + user.login}
                    alt=""
                    className="w-14 h-14 rounded-full border-2 border-primary bg-muted object-cover"
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white border border-white">
                    <CheckCircle2 className="h-3 w-3" />
                  </span>
                </div>
                <div>
                  <div className="text-lg font-semibold">{user.login}</div>
                  {user.name && (
                    <div className="text-sm text-muted-foreground">{user.name}</div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    GitHub ID: {user.id}
                  </div>
                  {user.tokenUpdatedAt && (
                    <div className="text-xs text-muted-foreground">
                      Token updated: {new Date(user.tokenUpdatedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <Button variant="destructive" onClick={handleDisconnect} size="sm" className="ml-auto">
                  <LogOut className="h-4 w-4 mr-1.5" /> Disconnect
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 rounded-lg p-3">
                <CheckCircle2 className="h-3 w-3" />
                <span>Connected and ready to manage repositories</span>
              </div>
            </div>
          ) : envTokenConfigured ? (
            <div className="flex flex-col gap-3 text-center py-8">
              <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <h3 className="text-sm font-semibold">GitHub token configured</h3>
              <p className="text-xs text-muted-foreground">
                A GitHub token is available in your environment. Click below to connect automatically.
              </p>
              <Button onClick={handleAutoConnect} disabled={connectLoading} className="w-full">
                {connectLoading ? "Connecting..." : "Connect via Environment Token"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 text-center py-8">
              <ShieldAlert className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-sm font-semibold">Not connected</h3>
              <p className="text-xs text-muted-foreground">
                Connect your GitHub account to manage repositories, issues, and pull requests.
              </p>
            </div>
          )}
        </CardContent>
        {!loading && !user && !envTokenConfigured && (
          <CardFooter className="pt-4">
            <form onSubmit={handleConnect} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="githubToken">GitHub Personal Access Token</Label>
                <Input
                  id="githubToken"
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxx"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="font-mono text-xs"
                />
                <CardDescription className="text-xs">
                  Your token is encrypted with AES-256-GCM and stored locally. Never shared with third parties.
                </CardDescription>
              </div>
              <Button type="submit" disabled={connectLoading} className="w-full">
                {connectLoading ? "Connecting..." : "Connect GitHub Account"}
              </Button>
            </form>
          </CardFooter>
        )}
      </Card>

      {/* Security Info */}
      <Card className="rounded-2xl border border-input/50 bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Security Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 text-xs text-muted-foreground">
            <span className="text-amber-500">⚠</span>
            <div>
              <strong className="text-sm text-foreground">Token Storage:</strong><br />
              Your GitHub token is encrypted using AES-256-GCM before being stored in the local SQLite database.
            </div>
          </div>
          <div className="flex items-start gap-3 text-xs text-muted-foreground">
            <span className="text-amber-500">⚠</span>
            <div>
              <strong className="text-sm text-foreground">Encryption Key:</strong><br />
              Stored in your environment variables. Never commit this key to version control.
            </div>
          </div>
          <div className="flex items-start gap-3 text-xs text-muted-foreground">
            <span className="text-amber-500">⚠</span>
            <div>
              <strong className="text-sm text-foreground">Database:</strong><br />
              SQLite file stored locally at <code className="font-mono text-xs">./data/zainpreneur.sqlite</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
