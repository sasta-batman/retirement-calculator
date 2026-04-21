import RetirementCalculator from "./components/RetirementCalculator";
import FAQ from "./components/FAQ";
import { FAQ_DATA } from "@/lib/faq-data";

// JSON-LD Structured Data — rendered server-side for crawlers
function StructuredData() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Retirement Planner",
    url: "https://retirement-calculator-frontend.vercel.app",
    description:
      "Interactive retirement calculator with compound interest, inflation modeling, FIRE presets, and 10-currency support.",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Compound interest calculations",
      "Inflation-adjusted projections",
      "FIRE presets (Lean, Chubby, Fat)",
      "10-currency support (USD, EUR, GBP, JPY, CNY, INR, AUD, CAD, CHF, SGD)",
      "Interactive wealth projection chart",
      "Coast FIRE milestone tracking",
      "Multiple spending models (Flat, Smile, Rising)",
      "Real-time calculations",
      "Dark and light theme",
    ],
    author: {
      "@type": "Person",
      name: "Atman Patel",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

// Server-rendered footer with links and SEO value
function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        maxWidth: "72rem",
        margin: "0 auto",
        padding: "2rem 1rem",
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <nav
        style={{
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
        aria-label="Footer navigation"
      >
        <a
          href="#faq"
          style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none" }}
        >
          FAQ
        </a>
        <a
          href="/blog"
          style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none" }}
        >
          Blog
        </a>
        <a
          href="https://github.com/atmanpatel"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none" }}
        >
          GitHub
        </a>
      </nav>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "12px",
          margin: 0,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        Free retirement planning calculator. No sign-up required. Your data stays in your browser.
      </p>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "11px",
          margin: 0,
          opacity: 0.6,
        }}
      >
        © {new Date().getFullYear()} Retirement Planner. Built with Next.js.
      </p>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <StructuredData />
      <main
        className="min-h-screen flex flex-col items-center p-4 pt-8 gap-8"
        style={{
          background:
            "linear-gradient(180deg, var(--page-bg-from) 0%, var(--page-bg-to) 100%)",
          transition: "background 0.3s ease",
        }}
      >
        {/* Server-rendered SEO hero text — visible to crawlers even without JS */}
        <section className="w-full max-w-6xl" aria-label="Introduction">
          <noscript>
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
                Free Retirement Calculator
              </h1>
              <p style={{ fontSize: "1.1rem", lineHeight: 1.7, maxWidth: "600px", margin: "0 auto" }}>
                Plan your financial future with our interactive retirement planner.
                Model compound interest, inflation, FIRE strategies, and more across
                10 currencies. No sign-up required.
              </p>
            </div>
          </noscript>
        </section>

        {/* Interactive calculator — client-rendered */}
        <RetirementCalculator />

        {/* FAQ section — client-rendered for interactivity but content is indexable */}
        <FAQ />

        {/* Footer — server-rendered */}
        <Footer />
      </main>
    </>
  );
}
