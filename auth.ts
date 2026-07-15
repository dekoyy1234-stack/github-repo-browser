import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

/**
 * Auth.js (NextAuth v5) configuration.
 *
 * We only request the `read:user` scope: it is enough to identify the user and
 * to list their public repositories via the GitHub API, and it avoids asking
 * for access we do not need. The GitHub access token is captured in the JWT
 * callback and exposed on the session so server components can call the API.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      authorization: { params: { scope: "read:user" } },
    }),
  ],
  callbacks: {
    jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
});

// Expose the access token on the session in a type-safe way.
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}
