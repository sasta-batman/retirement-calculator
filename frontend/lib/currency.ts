/**
 * Central currency formatting library.
 *
 * To add a new currency:
 *   1. Add an entry to CURRENCIES with its code, symbol, and name.
 *   2. If the currency uses a non-standard numbering system (e.g. South Asian
 *      Lakh/Crore), add an entry to CURRENCY_FORMAT_CONFIG below.
 *   3. That's it — all formatters pick it up automatically.
 */

// ---------------------------------------------------------------------------
// Currency definitions
// ---------------------------------------------------------------------------

export interface CurrencyDefinition {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: CurrencyDefinition[] = [
  { code: "USD", symbol: "$",   name: "US Dollar" },
  { code: "EUR", symbol: "€",   name: "Euro" },
  { code: "GBP", symbol: "£",   name: "British Pound" },
  { code: "JPY", symbol: "¥",   name: "Japanese Yen" },
  { code: "CNY", symbol: "¥",   name: "Chinese Yuan" },
  { code: "INR", symbol: "₹",   name: "Indian Rupee" },
  { code: "AUD", symbol: "A$",  name: "Australian Dollar" },
  { code: "CAD", symbol: "C$",  name: "Canadian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "SGD", symbol: "S$",  name: "Singapore Dollar" },
];

// ---------------------------------------------------------------------------
// Format tier configuration
// ---------------------------------------------------------------------------

/**
 * A single formatting tier: if |value| >= `threshold`, divide by `divisor`
 * and append `suffix`.
 *
 * Tiers must be listed in descending order of threshold.
 */
export interface FormatTier {
  threshold: number;
  divisor: number;
  suffix: string;
}

/**
 * Per-currency format configuration.
 * If a currency code is not listed here, the DEFAULT_TIERS are used.
 */
const CURRENCY_FORMAT_CONFIG: Record<string, FormatTier[]> = {
  // South Asian numbering system: Lakh (1,00,000) and Crore (1,00,00,000)
  INR: [
    { threshold: 1e7, divisor: 1e7, suffix: "Cr" },
    { threshold: 1e5, divisor: 1e5, suffix: "L" },
  ],

  // Japanese Yen: uses Oku (億, 100M) and Man (万, 10K)
  // Uncomment and adjust if you want locale-specific formatting for JPY:
  // JPY: [
  //   { threshold: 1e8, divisor: 1e8, suffix: "億" },
  //   { threshold: 1e4, divisor: 1e4, suffix: "万" },
  // ],
};

/** Default Western tiers: B / M / k */
const DEFAULT_TIERS: FormatTier[] = [
  { threshold: 1e9, divisor: 1e9, suffix: "B" },
  { threshold: 1e6, divisor: 1e6, suffix: "M" },
  { threshold: 1e3, divisor: 1e3, suffix: "k" },
];

// ---------------------------------------------------------------------------
// Core formatting logic
// ---------------------------------------------------------------------------

function getTiers(currencyCode: string): FormatTier[] {
  return CURRENCY_FORMAT_CONFIG[currencyCode] ?? DEFAULT_TIERS;
}

/**
 * Format a numeric value with the appropriate tier for the given currency.
 *
 * @param value        The number to format.
 * @param currency     The CurrencyDefinition (or just its code + symbol).
 * @param decimals     Decimal places to show on the scaled number.
 */
function formatValue(
  value: number,
  currency: Pick<CurrencyDefinition, "code" | "symbol">,
  decimals: number
): string {
  const abs = Math.abs(value);
  const tiers = getTiers(currency.code);

  for (const tier of tiers) {
    if (abs >= tier.threshold) {
      return `${currency.symbol}${(value / tier.divisor).toFixed(decimals)}${tier.suffix}`;
    }
  }

  // Below all tiers — show raw value
  return `${currency.symbol}${value.toFixed(decimals === 0 ? 0 : 2)}`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Short format — used on chart axes and milestone labels.
 * Uses 1 decimal place for scaled values.
 *
 * Example (USD): 1_200_000 → "$1.2M"
 * Example (INR): 1_00_00_000 → "₹1.0Cr"
 */
export function formatCompact(
  value: number,
  currency: Pick<CurrencyDefinition, "code" | "symbol">
): string {
  return formatValue(value, currency, 1);
}

/**
 * Full format — used in tooltips, input hints, narrative text, and stat cards.
 * Uses 2 decimal places for scaled values.
 *
 * Example (USD): 1_200_000 → "$1.20M"
 * Example (INR): 1_00_00_000 → "₹1.00Cr"
 */
export function formatFull(
  value: number,
  currency: Pick<CurrencyDefinition, "code" | "symbol">
): string {
  return formatValue(value, currency, 2);
}

/**
 * Convenience: look up a CurrencyDefinition by code.
 * Falls back to USD if the code is unknown.
 */
export function getCurrency(code: string): CurrencyDefinition {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}
