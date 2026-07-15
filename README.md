# GitHub Repo Browser

A small third-party service: **log in with your GitHub account and see your
avatar, username and all of your repositories on one page.**

Built as the test assignment for [wemake.services](https://github.com/wemake-services/meta/issues/7).

## Tech stack

- **Next.js 15** (App Router, React Server Components)
- **TypeScript** (strict)
- **Auth.js / NextAuth v5** — GitHub OAuth
- **GitHub REST API** — `/user` and `/user/repos` (with pagination)
- No CSS framework — a single hand-written `globals.css`

The GitHub access token is captured in the Auth.js JWT callback and used only on
the server (in React Server Components) to call the GitHub API — it never reaches
the browser. We request the minimal `read:user` scope.

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a GitHub OAuth App at https://github.com/settings/developers →
   *New OAuth App*:

   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`

3. Copy `.env.example` to `.env.local` and fill in the values:

   ```bash
   cp .env.example .env.local
   # AUTH_GITHUB_ID / AUTH_GITHUB_SECRET  from the OAuth App above
   # AUTH_SECRET                          run: npx auth secret
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000 and click **Sign in with GitHub**.

## Deploy (Vercel)

1. Push this folder to a new GitHub repository.
2. Import it on [vercel.com](https://vercel.com) → New Project.
3. Add the same three environment variables (`AUTH_GITHUB_ID`,
   `AUTH_GITHUB_SECRET`, `AUTH_SECRET`) in the Vercel project settings.
4. In the GitHub OAuth App, **add the production callback URL**:
   `https://YOUR-DOMAIN.vercel.app/api/auth/callback/github`
5. Redeploy. Done.

## Notes

- Scoped to ~2–3 hours as the assignment suggests.
- `getUserRepos` follows pagination, so accounts with more than 100 repositories
  are fully listed.
- Update the footer links in `app/layout.tsx` (`AUTHOR_URL` / `SOURCE_URL`) to
  point at your account and this repository.
