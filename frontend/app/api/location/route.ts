/**
 * GET /api/location
 *
 * Returns the detected country code and the corresponding financial defaults
 * for the retirement calculator.
 *
 * Country detection priority (highest to lowest):
 *  1. `?country=XX` query param  — for local testing / overrides
 *  2. `CF-IPCountry` header      — set by Cloudflare in production
 *  3. `X-Vercel-IP-Country`      — set by Vercel's edge network
 *  4. Fallback: "US"
 *
 * Response shape:
 *  {
 *    countryCode: string,        // ISO 3166-1 alpha-2
 *    source: string,             // which detection method was used
 *    isSupported: boolean,       // true if we have explicit defaults
 *    defaults: ResolvedLocationDefaults
 *  }
 */

import { NextRequest, NextResponse } from "next/server";
import { getLocationDefaults, isSupportedCountry } from "@/lib/locationDefaults";

export const runtime = "edge"; // Run at the edge for lowest latency

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // 1. Explicit override via query param (useful for local testing)
  const queryCountry = searchParams.get("country");
  if (queryCountry) {
    const countryCode = queryCountry.toUpperCase();
    const defaults = getLocationDefaults(countryCode);
    return NextResponse.json({
      countryCode,
      source: "query_param",
      isSupported: isSupportedCountry(countryCode),
      defaults,
    });
  }

  // 2. Cloudflare header
  const cfCountry = request.headers.get("CF-IPCountry");
  if (cfCountry && cfCountry !== "XX") {
    const countryCode = cfCountry.toUpperCase();
    const defaults = getLocationDefaults(countryCode);
    return NextResponse.json({
      countryCode,
      source: "cf_header",
      isSupported: isSupportedCountry(countryCode),
      defaults,
    });
  }

  // 3. Vercel edge header
  const vercelCountry = request.headers.get("X-Vercel-IP-Country");
  if (vercelCountry) {
    const countryCode = vercelCountry.toUpperCase();
    const defaults = getLocationDefaults(countryCode);
    return NextResponse.json({
      countryCode,
      source: "vercel_header",
      isSupported: isSupportedCountry(countryCode),
      defaults,
    });
  }

  // 4. Fallback to US
  const fallbackCode = "US";
  return NextResponse.json({
    countryCode: fallbackCode,
    source: "fallback",
    isSupported: true,
    defaults: getLocationDefaults(fallbackCode),
  });
}
