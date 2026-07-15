import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHub Repo Browser",
  description: "Log in with GitHub and see all your repositories on one page.",
};

// Update these two links to point at your own account and this repository.
const AUTHOR_URL = "https://github.com/dekoyy1234-stack";
const AUTHOR_NAME = "Maxim Belik";
const SOURCE_URL = "https://github.com/dekoyy1234-stack/github-repo-browser";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="page">
          <main>{children}</main>
          <footer className="footer">
            Created by{" "}
            <a href={AUTHOR_URL} target="_blank" rel="noreferrer">
              {AUTHOR_NAME}
            </a>
            , source code:{" "}
            <a href={SOURCE_URL} target="_blank" rel="noreferrer">
              {SOURCE_URL.replace("https://", "")}
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
