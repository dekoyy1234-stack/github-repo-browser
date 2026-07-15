/**
 * A tiny typed wrapper around the two GitHub REST endpoints we need.
 * Docs: https://docs.github.com/en/rest
 */

const GITHUB_API = "https://api.github.com";

export interface GitHubUser {
  login: string;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
}

export interface Repo {
  id: number;
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  isFork: boolean;
  isPrivate: boolean;
  updatedAt: string;
}

function headers(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function ghFetch(path: string, token: string): Promise<Response> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: headers(token),
    // The token is short-lived per session; never cache the response.
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res;
}

/** The authenticated user's profile. */
export async function getAuthenticatedUser(token: string): Promise<GitHubUser> {
  const res = await ghFetch("/user", token);
  const data = await res.json();
  return {
    login: data.login,
    name: data.name ?? null,
    avatarUrl: data.avatar_url,
    htmlUrl: data.html_url,
  };
}

/**
 * Every repository owned by the authenticated user, most recently pushed first.
 * We follow pagination so users with more than 100 repositories are fully covered.
 */
export async function getUserRepos(token: string): Promise<Repo[]> {
  const repos: Repo[] = [];

  for (let page = 1; ; page += 1) {
    const res = await ghFetch(
      `/user/repos?per_page=100&page=${page}&sort=pushed&affiliation=owner`,
      token,
    );
    const batch = (await res.json()) as unknown[];
    for (const raw of batch) {
      const r = raw as Record<string, any>;
      repos.push({
        id: r.id,
        name: r.name,
        fullName: r.full_name,
        htmlUrl: r.html_url,
        description: r.description ?? null,
        language: r.language ?? null,
        stars: r.stargazers_count ?? 0,
        forks: r.forks_count ?? 0,
        isFork: Boolean(r.fork),
        isPrivate: Boolean(r.private),
        updatedAt: r.pushed_at ?? r.updated_at,
      });
    }
    if (batch.length < 100) break;
  }

  return repos;
}
