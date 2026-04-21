import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on retirement planning, FIRE movement, compound interest, inflation, and personal finance strategies.",
  openGraph: {
    title: "Blog | Retirement Planner",
    description:
      "Articles on retirement planning, FIRE movement, compound interest, inflation, and personal finance strategies.",
    type: "website",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, var(--page-bg-from) 0%, var(--page-bg-to) 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Blog header */}
        <nav
          className="mb-8 flex items-center justify-between"
          aria-label="Blog navigation"
        >
          <a
            href="/"
            style={{
              color: "var(--accent-blue)",
              textDecoration: "none",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "opacity 0.2s",
            }}
          >
            ← Back to Calculator
          </a>
          <a
            href="/blog"
            className="gradient-text"
            style={{
              fontWeight: 700,
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            All Articles
          </a>
        </nav>
        {children}
      </div>
    </div>
  );
}
