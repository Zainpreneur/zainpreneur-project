const BASE = "";

async function request(input: RequestInfo | URL, init?: RequestInit) {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  // Auth
  getUser: () => request(`${BASE}/api/auth/user`),
  connectToken: (token: string) =>
    request(`${BASE}/api/auth/connect`, {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  disconnect: () => request(`${BASE}/api/auth/disconnect`, { method: "DELETE" }),
  signout: () => request(`${BASE}/api/auth/signout`, { method: "POST" }),

  // Repos
  getRepos: () => request(`${BASE}/api/repos`),
  syncRepos: () => request(`${BASE}/api/sync`, { method: "POST" }),

  // Issues
  getIssues: (params?: { state?: string; repositoryId?: string; q?: string }) => {
    const url = new URL(`${BASE}/api/issues`);
    if (params?.state) url.searchParams.set("state", params.state);
    if (params?.repositoryId) url.searchParams.set("repositoryId", params.repositoryId);
    if (params?.q) url.searchParams.set("q", params.q);
    return request(url);
  },
  createIssue: (body: any) =>
    request(`${BASE}/api/issues`, { method: "POST", body: JSON.stringify(body) }),
  updateIssue: (id: number, body: any) =>
    request(`${BASE}/api/issues/${id}`, { method: "PATCH", body: JSON.stringify(body) }),

  // Pull Requests
  getPullRequests: (params?: { state?: string; repositoryId?: string; q?: string }) => {
    const url = new URL(`${BASE}/api/pull-requests`);
    if (params?.state) url.searchParams.set("state", params.state);
    if (params?.repositoryId) url.searchParams.set("repositoryId", params.repositoryId);
    if (params?.q) url.searchParams.set("q", params.q);
    return request(url);
  },

  // Audit logs
  getAuditLogs: () => request(`${BASE}/api/audit-logs`),
};
