import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Coast FIRE: The Lazy Path to Financial Independence | Complete Guide",
  description:
    "Coast FIRE is the point where compound interest alone will fund your retirement. Learn how to calculate your Coast FIRE number, understand the math, and see when you'll reach this milestone.",
  openGraph: {
    title: "Coast FIRE: The Lazy Path to Financial Independence | Complete Guide",
    description:
      "Coast FIRE is the point where compound interest alone will fund your retirement. Learn how to calculate your Coast FIRE number, understand the math, and see when you'll reach this milestone.",
    url: "https://retirement-calculator-frontend.vercel.app/blog/coast-fire-guide",
    type: "article",
    publishedTime: "2026-04-21T00:00:00Z",
    authors: ["Atman Patel"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coast FIRE: The Lazy Path to Financial Independence | Complete Guide",
    description:
      "Coast FIRE is the point where compound interest alone will fund your retirement. Learn how to calculate your Coast FIRE number, understand the math, and see when you'll reach this milestone.",
  },
  alternates: {
    canonical:
      "https://retirement-calculator-frontend.vercel.app/blog/coast-fire-guide",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Coast FIRE: The Lazy Path to Financial Independence | Complete Guide",
  description:
    "Coast FIRE is the point where compound interest alone will fund your retirement. Learn how to calculate your Coast FIRE number, understand the math, and see when you'll reach this milestone.",
  author: {
    "@type": "Person",
    name: "Atman Patel",
  },
  datePublished: "2026-04-21",
  dateModified: "2026-04-21",
  url: "https://retirement-calculator-frontend.vercel.app/blog/coast-fire-guide",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://retirement-calculator-frontend.vercel.app/blog/coast-fire-guide",
  },
  publisher: {
    "@type": "Organization",
    name: "Retirement Calculator",
    url: "https://retirement-calculator-frontend.vercel.app",
  },
};

export default function CoastFIREGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2rem 1rem 4rem",
          color: "var(--text-primary)",
        }}
      >
        {/* Header */}
        <header style={{ marginBottom: "2.5rem" }}>
          <nav style={{ marginBottom: "1.5rem" }}>
            <Link
              href="/blog"
              style={{
                color: "var(--accent-cyan)",
                textDecoration: "none",
                fontSize: "0.9rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              ← Back to Blog
            </Link>
          </nav>
          <h1
            className="gradient-text"
            style={{
              fontSize: "clamp(2rem, 5vw, 2.8rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: "1rem",
            }}
          >
            Coast FIRE: The Lazy Path to Financial Independence
          </h1>
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              flexWrap: "wrap",
            }}
          >
            <span>By Atman Patel</span>
            <span>April 21, 2026</span>
            <span>10 min read</span>
          </div>
        </header>

        {/* Introduction */}
        <section style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              fontSize: "1.15rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            What if you could stop aggressively saving for retirement right now — and still retire
            comfortably? That&apos;s not a fantasy. It&apos;s the core idea behind{" "}
            <strong style={{ color: "var(--text-primary)" }}>Coast FIRE</strong>, one of the most
            approachable strategies in the financial independence movement. Instead of grinding
            toward a massive portfolio, Coast FIRE asks a simpler question: &ldquo;Have I saved
            enough that compound interest will do the rest?&rdquo;
          </p>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            For people who feel trapped by the relentless save-more-earn-more treadmill, Coast FIRE
            offers a genuine off-ramp. You still work — but the pressure disappears. Your paycheck
            covers today&apos;s bills. Your investments silently grow to cover tomorrow&apos;s
            retirement. It&apos;s the &ldquo;lazy&rdquo; path not because it requires zero effort,
            but because the hardest part is already behind you.
          </p>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
            }}
          >
            In this guide, we&apos;ll break down exactly what Coast FIRE is, how to calculate your
            Coast FIRE number, the math that makes it work, and whether it&apos;s the right strategy
            for you. We&apos;ll also show you how a{" "}
            <strong style={{ color: "var(--text-primary)" }}>Coast FIRE calculator</strong> can
            pinpoint the exact moment you cross this life-changing threshold.
          </p>
        </section>

        {/* What is Coast FIRE? */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            What Is Coast FIRE?
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            Coast FIRE is the point at which your existing retirement investments will grow to your
            target retirement number entirely through compound interest — without you contributing
            another dollar. Once you reach Coast FIRE, you&apos;ve essentially &ldquo;locked
            in&rdquo; your retirement. Time and market growth handle the rest.
          </p>
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "1.25rem",
            }}
          >
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.7,
                color: "var(--text-secondary)",
                margin: 0,
              }}
            >
              <strong style={{ color: "var(--accent-cyan)" }}>Coast FIRE in one sentence:</strong>{" "}
              It&apos;s the moment your current savings, left untouched and growing at a reasonable
              rate of return, will reach your full retirement goal by your target retirement age.
            </p>
          </div>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            The beauty of this approach is what it unlocks in the present. After reaching your Coast
            FIRE number, your only financial obligation is to cover your current living expenses. You
            don&apos;t need to save for retirement anymore. That means you could take a lower-paying
            job you love, go part-time, freelance, travel, or simply stop stressing about your
            savings rate. You&apos;re coasting — and it&apos;s mathematically sound.
          </p>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
            }}
          >
            The concept relies entirely on the power of{" "}
            <strong style={{ color: "var(--text-primary)" }}>compound interest for retirement</strong>.
            The earlier you start, the less you actually need to save. A 25-year-old who invests
            aggressively for five years might reach Coast FIRE by 30 — and then have 30+ years of
            compounding to do the heavy lifting.
          </p>
        </section>

        {/* Coast FIRE vs Regular FIRE vs Barista FIRE */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            Coast FIRE vs. Regular FIRE vs. Barista FIRE
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.5rem",
            }}
          >
            The FIRE movement has evolved well beyond its original &ldquo;save 70% of your income
            and retire at 35&rdquo; mandate. Today, there are multiple flavors of{" "}
            <strong style={{ color: "var(--text-primary)" }}>financial independence</strong>, each
            with different trade-offs. Here&apos;s how they compare:
          </p>
          <div
            style={{
              overflowX: "auto",
              marginBottom: "1.5rem",
              borderRadius: "12px",
              border: "1px solid var(--glass-border)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.95rem",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "var(--glass-bg)",
                    borderBottom: "1px solid var(--glass-border)",
                  }}
                >
                  <th
                    style={{
                      padding: "0.85rem 1rem",
                      textAlign: "left",
                      color: "var(--accent-cyan)",
                      fontWeight: 600,
                    }}
                  >
                    Aspect
                  </th>
                  <th
                    style={{
                      padding: "0.85rem 1rem",
                      textAlign: "left",
                      color: "var(--accent-cyan)",
                      fontWeight: 600,
                    }}
                  >
                    Traditional FIRE
                  </th>
                  <th
                    style={{
                      padding: "0.85rem 1rem",
                      textAlign: "left",
                      color: "var(--accent-cyan)",
                      fontWeight: 600,
                    }}
                  >
                    Coast FIRE
                  </th>
                  <th
                    style={{
                      padding: "0.85rem 1rem",
                      textAlign: "left",
                      color: "var(--accent-cyan)",
                      fontWeight: 600,
                    }}
                  >
                    Barista FIRE
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Goal",
                    "Full retirement — stop working entirely",
                    "Stop contributing to retirement savings",
                    "Semi-retirement with part-time work",
                  ],
                  [
                    "Savings Required",
                    "25× annual expenses (full FIRE number)",
                    "Enough for compound interest to reach your FIRE number",
                    "Partial savings + part-time income to cover the gap",
                  ],
                  [
                    "Work After Milestone",
                    "Optional — you're fully independent",
                    "Required — but only to cover current expenses",
                    "Required — part-time for income and benefits",
                  ],
                  [
                    "Difficulty",
                    "Hardest — requires highest savings",
                    "Moderate — front-load savings early",
                    "Moderate — requires ongoing part-time income",
                  ],
                  [
                    "Best For",
                    "High earners, extreme savers",
                    "Young savers, career changers, parents",
                    "People seeking work-life balance with benefits",
                  ],
                ].map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      backgroundColor: i % 2 === 0 ? "transparent" : "var(--bg-input)",
                    }}
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        style={{
                          padding: "0.75rem 1rem",
                          color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)",
                          fontWeight: j === 0 ? 600 : 400,
                          lineHeight: 1.5,
                          minWidth: j === 0 ? "100px" : "160px",
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
            }}
          >
            Coast FIRE sits in a sweet spot. It doesn&apos;t demand the extreme frugality of
            traditional FIRE, and it doesn&apos;t require you to find a specific part-time job with
            benefits like Barista FIRE often does. You simply need to reach a savings threshold, and
            then you&apos;re free to design your working life however you want — as long as you can
            cover your current bills.
          </p>
        </section>

        {/* The Math Behind Coast FIRE */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            The Math Behind Coast FIRE
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            Coast FIRE works because of one of the most powerful forces in personal finance:{" "}
            <strong style={{ color: "var(--text-primary)" }}>compound interest</strong>. When your
            investments earn returns, those returns themselves start earning returns. Over decades,
            this snowball effect transforms modest savings into substantial wealth.
          </p>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            The core formula is the future value equation:
          </p>
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "1.2rem",
                fontWeight: 600,
                color: "var(--accent-blue)",
                margin: "0 0 0.75rem",
                fontFamily: "monospace",
              }}
            >
              Future Value = Present Value × (1 + r)<sup>n</sup>
            </p>
            <p
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.7,
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              Where <strong>r</strong> = annual real rate of return (adjusted for inflation) and{" "}
              <strong>n</strong> = number of years until retirement
            </p>
          </div>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            Let&apos;s walk through a concrete example. Imagine you&apos;re 30 years old and
            you&apos;ve accumulated <strong style={{ color: "var(--text-primary)" }}>$170,000</strong>{" "}
            in retirement investments. You plan to retire at 60, giving you 30 years of growth. Using
            a 7% real return (the historical average for a diversified stock portfolio, adjusted for
            inflation):
          </p>
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "var(--accent-cyan)",
                marginBottom: "0.75rem",
              }}
            >
              Example Calculation
            </h3>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "1rem",
                lineHeight: 2,
                color: "var(--text-secondary)",
              }}
            >
              <p style={{ margin: "0.25rem 0" }}>FV = $170,000 × (1.07)<sup>30</sup></p>
              <p style={{ margin: "0.25rem 0" }}>FV = $170,000 × 7.612</p>
              <p
                style={{
                  margin: "0.5rem 0 0",
                  fontSize: "1.1rem",
                  color: "var(--accent-blue)",
                  fontWeight: 700,
                }}
              >
                FV ≈ $1,294,000
              </p>
            </div>
          </div>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            If your target retirement number is $1.3 million (based on $52,000 in annual spending ×
            25), then this 30-year-old has effectively reached Coast FIRE. They never need to
            contribute another cent to their retirement accounts. Their $170,000 will grow to cover
            their entire retirement through compound interest alone.
          </p>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
            }}
          >
            What changes after reaching this milestone? Everything about your relationship with work.
            You could switch to a lower-paying passion job — teaching, writing, non-profit work,
            part-time consulting — and as long as your paycheck covers your monthly expenses, your
            retirement is already handled. That&apos;s the transformative power of understanding{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              compound interest and retirement planning
            </strong>
            .
          </p>
        </section>

        {/* How to Calculate Your Coast FIRE Number */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            How to Calculate Your Coast FIRE Number
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.5rem",
            }}
          >
            Calculating your Coast FIRE number is a two-step process. You need to know where
            you&apos;re going (your full FIRE number) and then work backward to figure out what you
            need today.
          </p>

          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "0.75rem",
            }}
          >
            Step 1: Determine Your Full FIRE Number
          </h3>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            Your full FIRE number is the total portfolio value you&apos;d need to retire and live off
            your investments indefinitely. The standard formula uses the 4% safe withdrawal rate:
          </p>
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "1.15rem",
                fontWeight: 600,
                color: "var(--accent-blue)",
                margin: "0 0 0.5rem",
                fontFamily: "monospace",
              }}
            >
              FIRE Number = Annual Spending × 25
            </p>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              Example: $50,000/year × 25 = <strong>$1,250,000</strong>
            </p>
          </div>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.5rem",
            }}
          >
            Be honest with your annual spending estimate. Include everything: housing, food,
            healthcare, insurance, travel, hobbies, and a buffer for unexpected expenses. Many
            Coast FIRE seekers target somewhere between $1 million and $2 million, but your number
            is personal.
          </p>

          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "0.75rem",
            }}
          >
            Step 2: Calculate What You Need Today
          </h3>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            Now reverse the future value equation. Instead of asking &ldquo;what will my money grow
            to?&rdquo;, ask &ldquo;what do I need right now for compound interest to reach my FIRE
            number?&rdquo;
          </p>
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "1.15rem",
                fontWeight: 600,
                color: "var(--accent-blue)",
                margin: "0 0 0.5rem",
                fontFamily: "monospace",
              }}
            >
              Coast FIRE Number = FIRE Number ÷ (1 + r)<sup>n</sup>
            </p>
          </div>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            Let&apos;s walk through this with real numbers. Say you&apos;re 28 years old, you spend
            $45,000 per year, and you want to retire at 60. Using a 7% real return:
          </p>
          <div
            className="glass-card"
            style={{
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                fontSize: "1rem",
                lineHeight: 2,
                color: "var(--text-secondary)",
              }}
            >
              <p style={{ margin: "0.25rem 0" }}>
                <strong>FIRE Number:</strong> $45,000 × 25 = $1,125,000
              </p>
              <p style={{ margin: "0.25rem 0" }}>
                <strong>Years until retirement:</strong> 60 − 28 = 32 years
              </p>
              <p style={{ margin: "0.25rem 0" }}>
                <strong>Growth multiplier:</strong> (1.07)<sup>32</sup> = 8.715
              </p>
              <p
                style={{
                  margin: "0.75rem 0 0",
                  fontSize: "1.1rem",
                  color: "var(--accent-cyan)",
                  fontWeight: 700,
                }}
              >
                Coast FIRE Number: $1,125,000 ÷ 8.715 ≈ $129,100
              </p>
            </div>
          </div>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
            }}
          >
            That means if this 28-year-old has $129,100 invested today, they&apos;ve hit Coast FIRE.
            They could stop all retirement contributions and their portfolio would still grow to
            $1.125 million by age 60. Notice how youth is the most powerful variable here — the more
            years of compounding you have, the lower your Coast FIRE number becomes. A{" "}
            <strong style={{ color: "var(--text-primary)" }}>Coast FIRE calculator</strong> automates
            these calculations instantly and lets you experiment with different ages, spending levels,
            and return assumptions.
          </p>
        </section>

        {/* The Psychology of Coast FIRE */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            The Psychology of Coast FIRE
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            The financial math of Coast FIRE is compelling, but the psychological shift might be even
            more powerful. Reaching this milestone fundamentally changes your relationship with money,
            work, and stress.
          </p>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            <strong style={{ color: "var(--text-primary)" }}>Reduced financial anxiety.</strong> When
            you know your retirement is mathematically secured, a weight lifts. You stop obsessively
            checking your portfolio. Market downturns feel less catastrophic because you have decades
            for recovery. The anxiety loop of &ldquo;am I saving enough?&rdquo; simply
            dissolves.
          </p>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            <strong style={{ color: "var(--text-primary)" }}>Career flexibility.</strong> Coast FIRE
            gives you something invaluable: the ability to choose work based on meaning rather than
            money. You might take a 40% pay cut to do work that excites you. You might go freelance.
            You might start a business with a longer runway because you don&apos;t need it to fund
            your retirement — just your current lifestyle.
          </p>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
            }}
          >
            <strong style={{ color: "var(--text-primary)" }}>The &ldquo;enough&rdquo; mindset.</strong>{" "}
            Perhaps the most underrated benefit is learning to internalize that you have enough.
            Consumer culture constantly pushes the goalpost — a bigger house, a nicer car, another
            upgrade. Coast FIRE forces you to define your number and then believe it. That clarity
            is liberating. You shift from accumulation mode to living mode, and that transition is
            where the real quality of life improvement happens.
          </p>
        </section>

        {/* Who Is Coast FIRE Best For? */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            Who Is Coast FIRE Best For?
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            Coast FIRE isn&apos;t for everyone, but it&apos;s ideal for several groups:
          </p>
          <div
            style={{
              display: "grid",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            {[
              {
                title: "People who want work flexibility",
                desc: "If you love the idea of working but hate being chained to a high-stress, high-paying job, Coast FIRE gives you permission to downshift. You can pursue teaching, coaching, creative work, or part-time consulting.",
              },
              {
                title: "Career changers",
                desc: "Switching careers often means taking an entry-level salary again. Coast FIRE means that pay cut doesn't jeopardize your retirement — it only affects your current spending, which is a much more manageable problem.",
              },
              {
                title: "Parents and caregivers",
                desc: "If you want to work fewer hours to be present for your family, Coast FIRE makes that financially viable. You can go part-time or take years off without the guilt of \"falling behind\" on retirement savings.",
              },
              {
                title: "Young savers with time on their side",
                desc: "The younger you are, the more compounding works in your favor. Someone who saves aggressively from 22 to 30 could reach Coast FIRE before they turn 30 and have 30-35 years of growth ahead.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "1.25rem",
                  backgroundColor: "var(--bg-input)",
                  borderRadius: "10px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    color: "var(--accent-cyan)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                    color: "var(--text-secondary)",
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* The Downsides of Coast FIRE */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            The Downsides of Coast FIRE
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            No financial strategy is perfect, and Coast FIRE has real risks you should understand
            before committing.
          </p>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            <strong style={{ color: "var(--text-primary)" }}>
              Sequence of returns risk.
            </strong>{" "}
            The 7% average return is exactly that — an average. Markets don&apos;t deliver smooth,
            consistent returns. A major crash early in your coasting period (especially one lasting
            several years) can significantly reduce your projected final portfolio. Unlike someone
            still contributing, you have no new capital flowing in to buy discounted shares during
            downturns.
          </p>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            <strong style={{ color: "var(--text-primary)" }}>
              Delayed full financial independence.
            </strong>{" "}
            Coast FIRE doesn&apos;t mean you&apos;re financially independent today. You still need
            earned income to cover expenses. If you lose your job or face a health crisis that
            prevents you from working, you don&apos;t have a fully funded portfolio to fall back on.
            You&apos;re coasting toward independence, not yet there.
          </p>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            <strong style={{ color: "var(--text-primary)" }}>Healthcare gaps.</strong> In the
            United States especially, leaving a full-time corporate job often means losing
            employer-sponsored health insurance. If you&apos;re coasting in a part-time or freelance
            role, you&apos;ll need to factor in the cost of marketplace insurance — which can be
            substantial, particularly for families.
          </p>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
            }}
          >
            <strong style={{ color: "var(--text-primary)" }}>Inflation uncertainty.</strong> While
            we use &ldquo;real&rdquo; returns (after inflation) in our calculations, actual
            inflation can be unpredictable. Extended periods of higher-than-expected inflation
            could erode your purchasing power more than the model assumes. Building in a margin of
            safety — say, targeting 10-15% above your Coast FIRE number — helps mitigate this
            concern.
          </p>
        </section>

        {/* Building a Margin of Safety */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            Building a Margin of Safety
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            Smart Coast FIRE practitioners don&apos;t just hit their number and stop. They build a
            buffer. Here are a few strategies to make your Coast FIRE plan more resilient:
          </p>
          <ul
            style={{
              paddingLeft: "1.5rem",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            <li style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: "var(--text-primary)" }}>Use a conservative return rate.</strong>{" "}
              Calculate with 5-6% real returns instead of 7%. If markets outperform, great — you end
              up with more than you need.
            </li>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: "var(--text-primary)" }}>Overshoot your number by 15-20%.</strong>{" "}
              If your Coast FIRE number is $130,000, aim for $150,000-$156,000 before you ease off
              contributions.
            </li>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: "var(--text-primary)" }}>Continue small contributions.</strong>{" "}
              Even contributing $200-$300/month after reaching Coast FIRE adds up. It&apos;s not the
              aggressive savings of before, but it provides a meaningful cushion against bad sequences
              of returns.
            </li>
            <li style={{ marginBottom: "0.75rem" }}>
              <strong style={{ color: "var(--text-primary)" }}>Monitor annually.</strong> Check your
              projections once a year. If a major market crash sets you back, you can temporarily
              increase contributions to get back on track. Flexibility is the key advantage of
              this strategy.
            </li>
          </ul>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
            }}
          >
            The goal isn&apos;t to obsess over the numbers again — it&apos;s to stay informed. A
            quick annual check-in with a{" "}
            <strong style={{ color: "var(--text-primary)" }}>Coast FIRE calculator</strong> takes
            five minutes and gives you the confidence that you&apos;re still on track.
          </p>
        </section>

        {/* CTA Section */}
        <section
          className="glass-card"
          style={{
            padding: "2rem",
            borderRadius: "16px",
            textAlign: "center",
            marginBottom: "2.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "0.75rem",
            }}
          >
            Find Your Coast FIRE Number
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "var(--text-secondary)",
              marginBottom: "1.5rem",
              maxWidth: "600px",
              margin: "0 auto 1.5rem",
            }}
          >
            Our retirement calculator tracks your Coast FIRE milestone automatically. Enter your
            age, savings, and spending to see exactly when you&apos;ll reach the point where
            compound interest handles the rest.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "0.85rem 2rem",
              background: "linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))",
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "1.05rem",
              transition: "opacity 0.2s",
            }}
          >
            Calculate Your Coast FIRE Number →
          </Link>
        </section>

        {/* Related Articles */}
        <section>
          <h2
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            Related Articles
          </h2>
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            <Link
              href="/blog/fire-movement-explained"
              className="glass-card"
              style={{
                display: "block",
                padding: "1.25rem",
                borderRadius: "12px",
                textDecoration: "none",
                transition: "border-color 0.2s",
              }}
            >
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                The FIRE Movement Explained
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                A comprehensive guide to Financial Independence, Retire Early — from Lean FIRE to
                Fat FIRE and everything in between.
              </p>
            </Link>
            <Link
              href="/blog/how-inflation-affects-retirement"
              className="glass-card"
              style={{
                display: "block",
                padding: "1.25rem",
                borderRadius: "12px",
                textDecoration: "none",
                transition: "border-color 0.2s",
              }}
            >
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                How Inflation Affects Your Retirement Plan
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                Why using &ldquo;real&rdquo; returns matters and how inflation silently erodes your
                purchasing power over decades.
              </p>
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
