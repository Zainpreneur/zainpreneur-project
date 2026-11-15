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
import { ShieldAlert, User, RefreshCw, LogOut } from "lucide-react";

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

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      setLoading(true);
      const res = await api.getUser();
      setUser(res.user ?? null);
    } catch (error: any) {
      toast({ title: "Error", description: error?.message ?? "Failed to load user" });
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
      await loadUser();
      toast({ title: "Connected", description: "GitHub account connected successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.message ?? "Failed to connect" });
    } finally {
      setConnectLoading(false);
    }
  }

  async function handleDisconnect() {
    try {
      await api.disconnect();
      setUser(null);
      toast({ title: "Disconnected", description: "GitHub account disconnected" });
    } catch (error: any) {
      toast({ title: "Error", description: error?.message ?? "Failed to disconnect" });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your GitHub connection and account preferences
          </p>
        </div>
      </div>

      {/* Connection Status */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" /> GitHub Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm font-medium border border-input">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="w-12 h-12 rounded-full" />
                ) : (
                  <User className="h-6 w-6" />
                )}
              </div>
              <div>
                <div className="text-sm font-semibold">{user.login}</div>
                {user.name && (
                  <div className="text-sm text-muted-foreground">{user.name}</div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  GitHub ID: {user.id}
                </div>
                {user.tokenUpdatedAt && (
                  <div className="text-xs text-muted-foreground">
                    Token updated: {new Date(user.tokenUpdatedAt).toLocaleString()}
                  </div>
                )}
              </div>
              <div className="ml-auto">
                <Button variant="destructive" onClick={handleDisconnect} size="sm">
                  <LogOut className="h-4 w-4 mr-1" /> Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShieldAlert className="h-8 w-8 text-muted-foreground mb-3" />
              <h3 className="text-sm font-semibold">Not connected</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Connect your GitHub account to manage repositories
              </p>
            </div>
          )}
        </CardContent>
        {!loading && !user && (
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
                  Your token is encrypted at rest and stored locally. It is never shared with any third party.
                </CardDescription>
              </div>
              <Button type="submit" disabled={connectLoading} className="w-full">
                {connectLoading ? "Connecting..." : "Connect GitHub Account"}
              </Button>
            </form>
          </CardFooter>
        )}
      </Card>

      {/* Token Security Info */}
      <Card className="rounded-xl border border-input/50 bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Security Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 text-xs text-muted-foreground">
            <span className="text-yellow-500">⚠</span>
            <div>
              <strong>Token Storage:</strong> Your GitHub token is encrypted using AES-256-GCM
              before being stored in the local SQLite database.
            </div>
          </div>
          <div className="flex items-start gap-3 text-xs text-muted-foreground">
            <span className="text-yellow-500">⚠</span>
            <div>
              <strong>Encryption Key:</strong> Stored in your environment variables. Never commit
              this key to version control.
            </div>
          </div>
          <div className="flex items-start gap-3 text-xs text-muted-foreground">
            <span className="text-yellow-500">⚠</span>
            <div>
              <strong>Database:</strong> SQLite file stored locally at
              <code className="font-mono">./data/zainpreneur.sqlite</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
