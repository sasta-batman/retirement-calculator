import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://retirement-calculator-frontend.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Free Retirement Calculator — Plan Your Financial Future",
    template: "%s | Retirement Planner",
  },
  description:
    "Interactive retirement planner with compound interest, inflation modeling, FIRE presets (Lean/Chubby/Fat), and 10-currency support. Visualize your path to financial independence — completely free.",
  keywords: [
    "retirement calculator",
    "retirement planner",
    "FIRE calculator",
    "compound interest calculator",
    "financial independence",
    "retirement planning tool",
    "coast FIRE calculator",
    "lean FIRE",
    "fat FIRE",
    "inflation calculator",
    "retirement savings calculator",
    "when can I retire",
    "how much to retire",
    "4% rule calculator",
    "financial freedom calculator",
  ],
  authors: [{ name: "Atman Patel" }],
  creator: "Atman Patel",
  publisher: "Atman Patel",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Free Retirement Calculator — Plan Your Financial Future",
    description:
      "Interactive retirement planner with compound interest, inflation, FIRE presets, and 10-currency support. Visualize your path to financial independence.",
    type: "website",
    url: BASE_URL,
    siteName: "Retirement Planner",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Retirement Planner — Interactive Financial Calculator",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Retirement Calculator — Plan Your Financial Future",
    description:
      "Visualize your retirement projections with compound interest, inflation, and FIRE presets. Free, no sign-up required.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
