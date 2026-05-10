/**
 * Tests for lib/locationDefaults.ts
 *
 * Coverage:
 *  - getLocationDefaults() for every explicitly supported country
 *  - Fallback behaviour for unknown countries
 *  - isSupportedCountry() helper
 *  - getSupportedCountryCodes() helper
 *  - Currency resolution via getCurrency
 *  - Data sanity: all numeric fields are positive / in a sensible range
 */

import {
  getLocationDefaults,
  isSupportedCountry,
  getSupportedCountryCodes,
} from "@/lib/locationDefaults";

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function isPositive(n: number) {
  return typeof n === "number" && n > 0;
}

// ---------------------------------------------------------------------------
// India — the primary non-US locale (from the user requirement)
// ---------------------------------------------------------------------------

describe("getLocationDefaults('IN') — India", () => {
  const d = getLocationDefaults("IN");

  it("sets currency to INR", () => {
    expect(d.currencyCode).toBe("INR");
    expect(d.currency.code).toBe("INR");
    expect(d.currency.symbol).toBe("₹");
  });

  it("sets inflation to 6%", () => {
    expect(d.inflationRate).toBe(6);
  });

  it("sets annualReturn to 12% (Nifty 50 10-yr CAGR)", () => {
    expect(d.annualReturn).toBe(12);
  });

  it("sets currentSavings to 10 lakh (₹10,00,000)", () => {
    expect(d.currentSavings).toBe(1_000_000);
  });

  it("sets monthlyContribution to ₹50,000", () => {
    expect(d.monthlyContribution).toBe(50_000);
  });

  it("sets currentYearlySpending to ₹6,00,000 (lean FIRE)", () => {
    expect(d.currentYearlySpending).toBe(600_000);
  });

  it("sets countryCode to 'IN'", () => {
    expect(d.countryCode).toBe("IN");
  });
});

// ---------------------------------------------------------------------------
// Case-insensitive lookup
// ---------------------------------------------------------------------------

describe("getLocationDefaults — case-insensitive lookup", () => {
  it("accepts lowercase 'in'", () => {
    const d = getLocationDefaults("in");
    expect(d.currencyCode).toBe("INR");
  });

  it("accepts mixed-case 'iN'", () => {
    const d = getLocationDefaults("iN");
    expect(d.currencyCode).toBe("INR");
  });

  it("accepts lowercase 'us'", () => {
    const d = getLocationDefaults("us");
    expect(d.currencyCode).toBe("USD");
  });
});

// ---------------------------------------------------------------------------
// United States defaults
// ---------------------------------------------------------------------------

describe("getLocationDefaults('US') — United States", () => {
  const d = getLocationDefaults("US");

  it("sets currency to USD", () => {
    expect(d.currencyCode).toBe("USD");
    expect(d.currency.symbol).toBe("$");
  });

  it("sets inflation to 3%", () => {
    expect(d.inflationRate).toBe(3);
  });

  it("sets annualReturn to 10% (S&P 500 long-run)", () => {
    expect(d.annualReturn).toBe(10);
  });

  it("sets currentSavings to $50,000", () => {
    expect(d.currentSavings).toBe(50_000);
  });

  it("sets monthlyContribution to $2,000", () => {
    expect(d.monthlyContribution).toBe(2_000);
  });
});

// ---------------------------------------------------------------------------
// Other explicitly supported countries — spot checks
// ---------------------------------------------------------------------------

describe.each([
  ["GB", "GBP", "£"],
  ["DE", "EUR", "€"],
  ["FR", "EUR", "€"],
  ["JP", "JPY", "¥"],
  ["CN", "CNY", "¥"],
  ["AU", "AUD", "A$"],
  ["CA", "CAD", "C$"],
  ["CH", "CHF", "CHF"],
  ["SG", "SGD", "S$"],
])("getLocationDefaults('%s')", (countryCode, expectedCurrencyCode, expectedSymbol) => {
  const d = getLocationDefaults(countryCode);

  it(`sets currency to ${expectedCurrencyCode}`, () => {
    expect(d.currencyCode).toBe(expectedCurrencyCode);
    expect(d.currency.symbol).toBe(expectedSymbol);
  });

  it("has a positive inflationRate", () => {
    expect(isPositive(d.inflationRate)).toBe(true);
  });

  it("has an annualReturn between 1% and 30%", () => {
    expect(d.annualReturn).toBeGreaterThanOrEqual(1);
    expect(d.annualReturn).toBeLessThanOrEqual(30);
  });

  it("has positive currentSavings", () => {
    expect(isPositive(d.currentSavings)).toBe(true);
  });

  it("has positive monthlyContribution", () => {
    expect(isPositive(d.monthlyContribution)).toBe(true);
  });

  it("has positive currentYearlySpending", () => {
    expect(isPositive(d.currentYearlySpending)).toBe(true);
  });

  it("sets countryCode correctly", () => {
    expect(d.countryCode).toBe(countryCode);
  });
});

// ---------------------------------------------------------------------------
// Unknown / unsupported country — fallback to US defaults
// ---------------------------------------------------------------------------

describe("getLocationDefaults — unknown country fallback", () => {
  it("falls back to USD for 'ZZ'", () => {
    const d = getLocationDefaults("ZZ");
    expect(d.currencyCode).toBe("USD");
  });

  it("falls back for empty string", () => {
    const d = getLocationDefaults("");
    expect(d.currencyCode).toBe("USD");
  });

  it("falls back for numeric-like string '001'", () => {
    const d = getLocationDefaults("001");
    expect(d.currencyCode).toBe("USD");
  });

  it("returns all positive numeric defaults on fallback", () => {
    const d = getLocationDefaults("XY");
    expect(isPositive(d.inflationRate)).toBe(true);
    expect(isPositive(d.annualReturn)).toBe(true);
    expect(isPositive(d.currentSavings)).toBe(true);
    expect(isPositive(d.monthlyContribution)).toBe(true);
    expect(isPositive(d.currentYearlySpending)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// isSupportedCountry()
// ---------------------------------------------------------------------------

describe("isSupportedCountry()", () => {
  it("returns true for IN", () => expect(isSupportedCountry("IN")).toBe(true));
  it("returns true for US", () => expect(isSupportedCountry("US")).toBe(true));
  it("returns true for GB", () => expect(isSupportedCountry("GB")).toBe(true));
  it("returns true for DE", () => expect(isSupportedCountry("DE")).toBe(true));
  it("returns true for JP", () => expect(isSupportedCountry("JP")).toBe(true));
  it("returns true for CN", () => expect(isSupportedCountry("CN")).toBe(true));
  it("returns true for AU", () => expect(isSupportedCountry("AU")).toBe(true));
  it("returns true for CA", () => expect(isSupportedCountry("CA")).toBe(true));
  it("returns true for CH", () => expect(isSupportedCountry("CH")).toBe(true));
  it("returns true for SG", () => expect(isSupportedCountry("SG")).toBe(true));
  it("returns false for ZZ", () => expect(isSupportedCountry("ZZ")).toBe(false));
  it("returns false for empty string", () => expect(isSupportedCountry("")).toBe(false));
  it("is case-insensitive — 'in' → true", () => expect(isSupportedCountry("in")).toBe(true));
});

// ---------------------------------------------------------------------------
// getSupportedCountryCodes()
// ---------------------------------------------------------------------------

describe("getSupportedCountryCodes()", () => {
  const codes = getSupportedCountryCodes();

  it("returns an array of strings", () => {
    expect(Array.isArray(codes)).toBe(true);
    codes.forEach((c) => expect(typeof c).toBe("string"));
  });

  it("includes the required top countries", () => {
    const required = ["IN", "US", "GB", "DE", "JP", "CN", "AU", "CA", "CH", "SG"];
    required.forEach((c) => expect(codes).toContain(c));
  });

  it("all codes are 2 uppercase letters", () => {
    codes.forEach((c) => {
      expect(c).toMatch(/^[A-Z]{2}$/);
    });
  });

  it("has at least 10 entries", () => {
    expect(codes.length).toBeGreaterThanOrEqual(10);
  });
});

// ---------------------------------------------------------------------------
// Currency object integrity
// ---------------------------------------------------------------------------

describe("getLocationDefaults — resolved currency object", () => {
  it("every supported country has a non-null currency", () => {
    const codes = getSupportedCountryCodes();
    codes.forEach((code) => {
      const d = getLocationDefaults(code);
      expect(d.currency).toBeDefined();
      expect(d.currency.code).toBeTruthy();
      expect(d.currency.symbol).toBeTruthy();
      expect(d.currency.name).toBeTruthy();
    });
  });
});

// ---------------------------------------------------------------------------
// Data consistency: yearlySpending ≥ monthlyContribution * 12 is NOT required
// but annualReturn > inflationRate should generally hold (real return > 0)
// ---------------------------------------------------------------------------

describe("getLocationDefaults — financial sanity checks", () => {
  const codes = getSupportedCountryCodes();

  it("every country has annualReturn > inflationRate (positive real return)", () => {
    codes.forEach((code) => {
      const d = getLocationDefaults(code);
      expect(d.annualReturn).toBeGreaterThan(d.inflationRate);
    });
  });

  it("every country has inflationRate < 15%", () => {
    codes.forEach((code) => {
      const d = getLocationDefaults(code);
      expect(d.inflationRate).toBeLessThan(15);
    });
  });
});
