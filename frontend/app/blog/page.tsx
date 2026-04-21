import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
}

const POSTS: BlogPost[] = [
  {
    slug: "fire-movement-explained",
    title: "FIRE Movement Explained: Lean, Chubby, and Fat FIRE",
    description:
      "Discover the different flavors of Financial Independence, Retire Early — from frugal Lean FIRE to luxurious Fat FIRE — and learn which path suits your lifestyle.",
    date: "2026-04-21",
    readTime: "8 min read",
    tags: ["FIRE", "Financial Independence", "Retirement"],
  },
  {
    slug: "how-inflation-affects-retirement",
    title: "How Inflation Affects Your Retirement Savings",
    description:
      "Learn why a million dollars in 30 years won't feel like a million today, and how to inflation-proof your retirement plan.",
    date: "2026-04-21",
    readTime: "7 min read",
    tags: ["Inflation", "Retirement Planning", "Investing"],
  },
  {
    slug: "coast-fire-guide",
    title: "Coast FIRE: The Lazy Path to Financial Independence",
    description:
      "Coast FIRE lets you stop saving aggressively and let compound interest do the heavy lifting. Here's exactly how it works and when you'll reach it.",
    date: "2026-04-21",
    readTime: "6 min read",
    tags: ["Coast FIRE", "Compound Interest", "FIRE"],
  },
];

export default function BlogIndex() {
  return (
    <div>
      <div className="mb-10">
        <h1
          className="text-3xl font-bold mb-3"
          style={{
            background: "linear-gradient(135deg, #6366f1, #a78bfa, #22d3ee)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Blog
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: 1.7 }}>
          Deep dives into retirement planning, the FIRE movement, and the math
          behind financial independence.
        </p>
      </div>

      <div className="space-y-6">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{ textDecoration: "none", display: "block" }}
          >
            <article
              className="glass-card p-6 transition-all duration-300"
              style={{ cursor: "pointer" }}
            >
              <div
                className="flex items-center gap-3 mb-3"
                style={{ fontSize: "12px", color: "var(--text-muted)" }}
              >
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                  lineHeight: 1.3,
                }}
              >
                {post.title}
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: "12px",
                }}
              >
                {post.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: "rgba(99, 102, 241, 0.12)",
                      color: "var(--accent-blue)",
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* CTA to calculator */}
      <div
        className="glass-card p-6 mt-10 text-center"
        style={{ borderColor: "rgba(99, 102, 241, 0.3)" }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "8px",
          }}
        >
          Ready to Plan Your Retirement?
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            marginBottom: "16px",
          }}
        >
          Use our free interactive calculator to visualize your financial future
          with compound interest, inflation modeling, and FIRE presets.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "10px 24px",
            background: "var(--accent-blue)",
            color: "white",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "14px",
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
        >
          Open Calculator →
        </Link>
      </div>
    </div>
  );
}
