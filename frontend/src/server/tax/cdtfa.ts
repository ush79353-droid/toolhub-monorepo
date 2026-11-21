/**
 * CDTFA Tax Rate API client (server-only).
 *
 * Docs: https://services.maps.cdtfa.ca.gov/
 * Endpoint: GET /api/taxrate/GetRateByAddress?address=&city=&zip=
 * Terms: https://www.cdtfa.ca.gov/dataportal/policy.htm
 *
 * `rate` is a decimal fraction (0.0875 = 8.75%).
 * Multiple taxRateInfo entries mean an ambiguous boundary — do not auto-pick.
 */

export const CDTFA_GET_RATE_BY_ADDRESS_URL =
  'https://services.maps.cdtfa.ca.gov/api/taxrate/GetRateByAddress';

export const CDTFA_TERMS_URL =
  'https://www.cdtfa.ca.gov/dataportal/policy.htm';

export interface CdtfaTaxRateInfo {
  rate: number;
  jurisdiction: string;
  city: string;
  county: string;
  tac: string;
}

export interface CdtfaGeocodeInfo {
  matchCodes?: string[];
  formattedAddress?: string;
  confidence?: string;
  calcMethod?: string;
  bufferDistance?: number;
}

export interface CdtfaRateResponse {
  taxRateInfo: CdtfaTaxRateInfo[] | null;
  geocodeInfo?: CdtfaGeocodeInfo | null;
  termsOfUse?: string;
  disclaimer?: string;
}

export type CdtfaLookupOutcome =
  | {
      status: 'ok';
      match: CdtfaTaxRateInfo;
      formattedAddress: string | null;
      lookedUpAt: string;
    }
  | {
      status: 'ambiguous';
      matches: CdtfaTaxRateInfo[];
      formattedAddress: string | null;
      lookedUpAt: string;
    }
  | {
      status: 'no_match';
      lookedUpAt: string;
    }
  | {
      status: 'error';
      message: string;
      lookedUpAt: string;
    };

const cache = new Map<
  string,
  { expiresAt: number; outcome: CdtfaLookupOutcome }
>();

/** Cache successful/ambiguous/no_match outcomes for 1 hour (rates update quarterly). */
const CACHE_TTL_MS = 60 * 60 * 1000;

function cacheKey(address: string, city: string, zip: string): string {
  return `${address.trim().toLowerCase()}|${city.trim().toLowerCase()}|${zip.trim()}`;
}

function encodeParam(value: string): string {
  return encodeURIComponent(value.trim()).replace(/%20/g, '+');
}

export async function lookupCdtfaRateByAddress(
  address: string,
  city: string,
  zip: string
): Promise<CdtfaLookupOutcome> {
  const lookedUpAt = new Date().toISOString();
  const key = cacheKey(address, city, zip);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return { ...cached.outcome, lookedUpAt };
  }

  const url =
    `${CDTFA_GET_RATE_BY_ADDRESS_URL}` +
    `?address=${encodeParam(address)}` +
    `&city=${encodeParam(city)}` +
    `&zip=${encodeParam(zip)}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      // Fresh enough for quarterly rates; Next may still cache at edge if configured.
      cache: 'no-store',
    });
  } catch {
    return {
      status: 'error',
      message: 'Unable to reach the CDTFA Tax Rate API.',
      lookedUpAt,
    };
  }

  if (!response.ok) {
    return {
      status: 'error',
      message: `CDTFA Tax Rate API returned HTTP ${response.status}.`,
      lookedUpAt,
    };
  }

  let body: CdtfaRateResponse;
  try {
    body = (await response.json()) as CdtfaRateResponse;
  } catch {
    return {
      status: 'error',
      message: 'CDTFA Tax Rate API returned an unreadable response.',
      lookedUpAt,
    };
  }

  const info = Array.isArray(body.taxRateInfo) ? body.taxRateInfo : [];
  const valid = info.filter(
    (row) =>
      row &&
      typeof row.rate === 'number' &&
      Number.isFinite(row.rate) &&
      row.rate >= 0
  );

  const formattedAddress =
    body.geocodeInfo?.formattedAddress?.trim() || null;

  let outcome: CdtfaLookupOutcome;
  if (valid.length === 0) {
    outcome = { status: 'no_match', lookedUpAt };
  } else if (valid.length > 1) {
    // Distinct rates or jurisdictions → ambiguous; never auto-choose.
    outcome = {
      status: 'ambiguous',
      matches: valid,
      formattedAddress,
      lookedUpAt,
    };
  } else {
    outcome = {
      status: 'ok',
      match: valid[0]!,
      formattedAddress,
      lookedUpAt,
    };
  }

  if (outcome.status !== 'error') {
    cache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, outcome });
  }

  return outcome;
}
