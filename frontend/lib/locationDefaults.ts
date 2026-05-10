/**
 * Location-based financial defaults.
 *
 * Maps ISO 3166-1 alpha-2 country codes to sensible default parameters
 * for the retirement calculator. Values are sourced from:
 *  - Central bank / government inflation targets
 *  - 10-year average index returns (Nifty 50, S&P 500, etc.)
 *  - Country-specific FIRE community benchmarks for savings
 *
 * To add a new country:
 *  1. Add an entry to LOCATION_DEFAULTS below.
 *  2. That's it — the lookup helpers pick it up automatically.
 */

import { getCurrency } from "./currency";
import type { CurrencyDefinition } from "./currency";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LocationDefaults {
  /** ISO 4217 currency code */
  currencyCode: string;
  /** Annual inflation rate in % (e.g. 6 means 6%) */
  inflationRate: number;
  /** Expected annual portfolio return in % */
  annualReturn: number;
  /** Current savings in local currency */
  currentSavings: number;
  /** Monthly contribution in local currency */
  monthlyContribution: number;
  /** Annual spending (for FIRE baseline) in local currency */
  currentYearlySpending: number;
}

export interface ResolvedLocationDefaults extends LocationDefaults {
  currency: CurrencyDefinition;
  countryCode: string;
}

// ---------------------------------------------------------------------------
// Country → defaults mapping
// ---------------------------------------------------------------------------

/**
 * Defaults for supported countries.
 * Countries are listed in rough order of traffic priority.
 *
 * Annual return sources:
 *  - IN: Nifty 50 ~10-yr CAGR ≈ 12–13% (using 12 as conservative)
 *  - US: S&P 500 ~10-yr CAGR ≈ 13% (using 10 as long-run average)
 *  - GB: FTSE 100 ~10-yr ≈ 7%
 *  - EU: Euro Stoxx 50 ~10-yr ≈ 8%
 *  - JP: Nikkei 225 ~10-yr ≈ 10%
 *  - CN: CSI 300 ~10-yr ≈ 9%
 *  - AU: ASX 200 ~10-yr ≈ 9%
 *  - CA: TSX ~10-yr ≈ 9%
 *  - CH: SMI ~10-yr ≈ 8%
 *  - SG: STI ~10-yr ≈ 7%
 */
const LOCATION_DEFAULTS: Record<string, LocationDefaults> = {
  // ── India ─────────────────────────────────────────────────────────────────
  IN: {
    currencyCode: "INR",
    inflationRate: 6,          // RBI long-run target ~4–6%
    annualReturn: 12,          // Nifty 50 10-yr CAGR
    currentSavings: 1_000_000, // ₹10 lakh
    monthlyContribution: 50_000,
    currentYearlySpending: 600_000, // ₹50k/mo → lean FIRE
  },

  // ── United States ─────────────────────────────────────────────────────────
  US: {
    currencyCode: "USD",
    inflationRate: 3,           // Fed long-run average
    annualReturn: 10,           // S&P 500 long-run CAGR
    currentSavings: 50_000,
    monthlyContribution: 2_000,
    currentYearlySpending: 40_000,
  },

  // ── United Kingdom ────────────────────────────────────────────────────────
  GB: {
    currencyCode: "GBP",
    inflationRate: 3,           // BoE long-run average
    annualReturn: 7,            // FTSE 100 10-yr CAGR
    currentSavings: 40_000,
    monthlyContribution: 1_500,
    currentYearlySpending: 30_000,
  },

  // ── European Union (Germany, France, etc.) ────────────────────────────────
  DE: {
    currencyCode: "EUR",
    inflationRate: 2.5,
    annualReturn: 8,
    currentSavings: 40_000,
    monthlyContribution: 1_500,
    currentYearlySpending: 30_000,
  },
  FR: {
    currencyCode: "EUR",
    inflationRate: 2.5,
    annualReturn: 8,
    currentSavings: 40_000,
    monthlyContribution: 1_500,
    currentYearlySpending: 30_000,
  },
  IT: {
    currencyCode: "EUR",
    inflationRate: 2.5,
    annualReturn: 8,
    currentSavings: 35_000,
    monthlyContribution: 1_200,
    currentYearlySpending: 28_000,
  },
  ES: {
    currencyCode: "EUR",
    inflationRate: 2.5,
    annualReturn: 8,
    currentSavings: 35_000,
    monthlyContribution: 1_200,
    currentYearlySpending: 27_000,
  },
  NL: {
    currencyCode: "EUR",
    inflationRate: 2.5,
    annualReturn: 8,
    currentSavings: 45_000,
    monthlyContribution: 1_600,
    currentYearlySpending: 32_000,
  },

  // ── Japan ─────────────────────────────────────────────────────────────────
  JP: {
    currencyCode: "JPY",
    inflationRate: 2,           // BoJ target
    annualReturn: 10,           // Nikkei 225 10-yr CAGR
    currentSavings: 6_000_000,  // ¥6M
    monthlyContribution: 200_000,
    currentYearlySpending: 3_600_000,
  },

  // ── China ─────────────────────────────────────────────────────────────────
  CN: {
    currencyCode: "CNY",
    inflationRate: 3,
    annualReturn: 9,            // CSI 300 10-yr CAGR
    currentSavings: 300_000,    // ¥300k
    monthlyContribution: 10_000,
    currentYearlySpending: 120_000,
  },

  // ── Australia ─────────────────────────────────────────────────────────────
  AU: {
    currencyCode: "AUD",
    inflationRate: 3,           // RBA target 2–3%
    annualReturn: 9,            // ASX 200 10-yr CAGR
    currentSavings: 80_000,
    monthlyContribution: 3_000,
    currentYearlySpending: 55_000,
  },

  // ── Canada ────────────────────────────────────────────────────────────────
  CA: {
    currencyCode: "CAD",
    inflationRate: 2.5,         // BoC target 2%
    annualReturn: 9,            // TSX 10-yr CAGR
    currentSavings: 60_000,
    monthlyContribution: 2_500,
    currentYearlySpending: 45_000,
  },

  // ── Switzerland ───────────────────────────────────────────────────────────
  CH: {
    currencyCode: "CHF",
    inflationRate: 1.5,         // SNB target
    annualReturn: 8,            // SMI 10-yr CAGR
    currentSavings: 80_000,
    monthlyContribution: 3_000,
    currentYearlySpending: 65_000,
  },

  // ── Singapore ─────────────────────────────────────────────────────────────
  SG: {
    currencyCode: "SGD",
    inflationRate: 2.5,         // MAS average
    annualReturn: 7,            // STI 10-yr CAGR
    currentSavings: 80_000,
    monthlyContribution: 3_000,
    currentYearlySpending: 50_000,
  },
};

// ---------------------------------------------------------------------------
// Fallback defaults (USD)
// ---------------------------------------------------------------------------

const FALLBACK_DEFAULTS: LocationDefaults = LOCATION_DEFAULTS["US"];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns the financial defaults for a given ISO 3166-1 alpha-2 country code.
 * Falls back to USD/US defaults for unknown countries.
 */
export function getLocationDefaults(countryCode: string): ResolvedLocationDefaults {
  const code = countryCode.toUpperCase();
  const raw = LOCATION_DEFAULTS[code] ?? FALLBACK_DEFAULTS;
  return {
    ...raw,
    currency: getCurrency(raw.currencyCode),
    countryCode: code,
  };
}

/**
 * Returns true if we have explicit defaults for the given country code.
 */
export function isSupportedCountry(countryCode: string): boolean {
  return countryCode.toUpperCase() in LOCATION_DEFAULTS;
}

/**
 * Returns all explicitly supported ISO country codes.
 */
export function getSupportedCountryCodes(): string[] {
  return Object.keys(LOCATION_DEFAULTS);
}
