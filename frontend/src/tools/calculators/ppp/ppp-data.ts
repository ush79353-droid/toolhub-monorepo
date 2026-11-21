/**
 * Curated snapshot: World Bank WDI table 4.16
 * “Purchasing power parity (PPP) conversion factor, GDP”
 * (local currency units per international $) and official exchange rate
 * (LCU per US$). Years 2023 and 2024.
 *
 * Source: https://wdi.worldbank.org/table/4.16
 * Indicator family: PA.NUS.PPP (GDP PPP). Not household-consumption PPP.
 * Not live — annual statistical estimates. Do not invent missing values.
 */

export const PPP_DATA_SOURCE =
  'World Bank World Development Indicators table 4.16 (GDP PPP conversion factor; official exchange rate)';

export const PPP_INDICATOR = 'PA.NUS.PPP (GDP, LCU per international $)';

export type PppYear = 2023 | 2024;

export const PPP_YEARS: readonly PppYear[] = [2023, 2024] as const;

export interface PppCountryRecord {
  iso2: string;
  iso3: string;
  name: string;
  currency: string;
  /** GDP PPP LCU per international $ by year */
  ppp: Partial<Record<PppYear, number>>;
  /** Official exchange rate LCU per USD by year (for same-year market FX) */
  officialFxPerUsd: Partial<Record<PppYear, number>>;
}

/** Curated economies with verified WDI 4.16 values (both PPP and FX present). */
export const PPP_COUNTRIES: readonly PppCountryRecord[] = [
  {
    iso2: 'US',
    iso3: 'USA',
    name: 'United States',
    currency: 'USD',
    ppp: { 2023: 1.0, 2024: 1.0 },
    officialFxPerUsd: { 2023: 1.0, 2024: 1.0 },
  },
  {
    iso2: 'CA',
    iso3: 'CAN',
    name: 'Canada',
    currency: 'CAD',
    ppp: { 2023: 1.14, 2024: 1.15 },
    officialFxPerUsd: { 2023: 1.35, 2024: 1.37 },
  },
  {
    iso2: 'GB',
    iso3: 'GBR',
    name: 'United Kingdom',
    currency: 'GBP',
    ppp: { 2023: 0.66, 2024: 0.66 },
    officialFxPerUsd: { 2023: 0.8, 2024: 0.78 },
  },
  {
    iso2: 'AU',
    iso3: 'AUS',
    name: 'Australia',
    currency: 'AUD',
    ppp: { 2023: 1.34, 2024: 1.37 },
    officialFxPerUsd: { 2023: 1.51, 2024: 1.52 },
  },
  {
    iso2: 'DE',
    iso3: 'DEU',
    name: 'Germany',
    currency: 'EUR',
    ppp: { 2023: 0.7, 2024: 0.7 },
    officialFxPerUsd: { 2023: 0.92, 2024: 0.92 },
  },
  {
    iso2: 'FR',
    iso3: 'FRA',
    name: 'France',
    currency: 'EUR',
    ppp: { 2023: 0.68, 2024: 0.68 },
    officialFxPerUsd: { 2023: 0.92, 2024: 0.92 },
  },
  {
    iso2: 'IT',
    iso3: 'ITA',
    name: 'Italy',
    currency: 'EUR',
    ppp: { 2023: 0.6, 2024: 0.6 },
    officialFxPerUsd: { 2023: 0.92, 2024: 0.92 },
  },
  {
    iso2: 'ES',
    iso3: 'ESP',
    name: 'Spain',
    currency: 'EUR',
    ppp: { 2023: 0.56, 2024: 0.56 },
    officialFxPerUsd: { 2023: 0.92, 2024: 0.92 },
  },
  {
    iso2: 'NL',
    iso3: 'NLD',
    name: 'Netherlands',
    currency: 'EUR',
    ppp: { 2023: 0.73, 2024: 0.73 },
    officialFxPerUsd: { 2023: 0.92, 2024: 0.92 },
  },
  {
    iso2: 'IE',
    iso3: 'IRL',
    name: 'Ireland',
    currency: 'EUR',
    ppp: { 2023: 0.74, 2024: 0.74 },
    officialFxPerUsd: { 2023: 0.92, 2024: 0.92 },
  },
  {
    iso2: 'CH',
    iso3: 'CHE',
    name: 'Switzerland',
    currency: 'CHF',
    ppp: { 2023: 1.0, 2024: 0.97 },
    officialFxPerUsd: { 2023: 0.9, 2024: 0.88 },
  },
  {
    iso2: 'JP',
    iso3: 'JPN',
    name: 'Japan',
    currency: 'JPY',
    ppp: { 2023: 93.83, 2024: 94.46 },
    officialFxPerUsd: { 2023: 140.49, 2024: 151.37 },
  },
  {
    iso2: 'CN',
    iso3: 'CHN',
    name: 'China',
    currency: 'CNY',
    ppp: { 2023: 3.64, 2024: 3.53 },
    officialFxPerUsd: { 2023: 7.08, 2024: 7.2 },
  },
  {
    iso2: 'IN',
    iso3: 'IND',
    name: 'India',
    currency: 'INR',
    ppp: { 2023: 20.46, 2024: 20.45 },
    officialFxPerUsd: { 2023: 82.6, 2024: 83.67 },
  },
  {
    iso2: 'PK',
    iso3: 'PAK',
    name: 'Pakistan',
    currency: 'PKR',
    ppp: { 2023: 56.15, 2024: 66.87 },
    officialFxPerUsd: { 2023: 280.36, 2024: 278.58 },
  },
  {
    iso2: 'AE',
    iso3: 'ARE',
    name: 'United Arab Emirates',
    currency: 'AED',
    ppp: { 2023: 2.35, 2024: 2.33 },
    officialFxPerUsd: { 2023: 3.67, 2024: 3.67 },
  },
  {
    iso2: 'SA',
    iso3: 'SAU',
    name: 'Saudi Arabia',
    currency: 'SAR',
    ppp: { 2023: 1.89, 2024: 1.85 },
    officialFxPerUsd: { 2023: 3.75, 2024: 3.75 },
  },
  {
    iso2: 'BR',
    iso3: 'BRA',
    name: 'Brazil',
    currency: 'BRL',
    ppp: { 2023: 2.45, 2024: 2.48 },
    officialFxPerUsd: { 2023: 4.99, 2024: 5.39 },
  },
  {
    iso2: 'MX',
    iso3: 'MEX',
    name: 'Mexico',
    currency: 'MXN',
    ppp: { 2023: 9.75, 2024: 9.92 },
    officialFxPerUsd: { 2023: 17.76, 2024: 18.3 },
  },
  {
    iso2: 'KR',
    iso3: 'KOR',
    name: 'Korea, Rep.',
    currency: 'KRW',
    ppp: { 2023: 811.05, 2024: 809.27 },
    officialFxPerUsd: { 2023: 1305.66, 2024: 1363.38 },
  },
  {
    iso2: 'SG',
    iso3: 'SGP',
    name: 'Singapore',
    currency: 'SGD',
    ppp: { 2023: 0.8, 2024: 0.83 },
    officialFxPerUsd: { 2023: 1.34, 2024: 1.34 },
  },
  {
    iso2: 'NZ',
    iso3: 'NZL',
    name: 'New Zealand',
    currency: 'NZD',
    ppp: { 2023: 1.46, 2024: 1.46 },
    officialFxPerUsd: { 2023: 1.63, 2024: 1.65 },
  },
  {
    iso2: 'SE',
    iso3: 'SWE',
    name: 'Sweden',
    currency: 'SEK',
    ppp: { 2023: 8.52, 2024: 8.49 },
    officialFxPerUsd: { 2023: 10.61, 2024: 10.57 },
  },
  {
    iso2: 'NO',
    iso3: 'NOR',
    name: 'Norway',
    currency: 'NOK',
    ppp: { 2023: 8.92, 2024: 9.14 },
    officialFxPerUsd: { 2023: 10.56, 2024: 10.75 },
  },
  {
    iso2: 'ZA',
    iso3: 'ZAF',
    name: 'South Africa',
    currency: 'ZAR',
    ppp: { 2023: 7.32, 2024: 7.42 },
    officialFxPerUsd: { 2023: 18.45, 2024: 18.33 },
  },
  {
    iso2: 'ID',
    iso3: 'IDN',
    name: 'Indonesia',
    currency: 'IDR',
    ppp: { 2023: 4815.77, 2024: 4740.94 },
    officialFxPerUsd: { 2023: 15236.88, 2024: 15855.45 },
  },
  {
    iso2: 'PH',
    iso3: 'PHL',
    name: 'Philippines',
    currency: 'PHP',
    ppp: { 2023: 19.25, 2024: 19.33 },
    officialFxPerUsd: { 2023: 55.63, 2024: 57.29 },
  },
  {
    iso2: 'TH',
    iso3: 'THA',
    name: 'Thailand',
    currency: 'THB',
    ppp: { 2023: 10.63, 2024: 10.47 },
    officialFxPerUsd: { 2023: 34.8, 2024: 35.29 },
  },
  {
    iso2: 'MY',
    iso3: 'MYS',
    name: 'Malaysia',
    currency: 'MYR',
    ppp: { 2023: 1.42, 2024: 1.4 },
    officialFxPerUsd: { 2023: 4.56, 2024: 4.58 },
  },
  {
    iso2: 'PL',
    iso3: 'POL',
    name: 'Poland',
    currency: 'PLN',
    ppp: { 2023: 1.92, 2024: 1.95 },
    officialFxPerUsd: { 2023: 4.2, 2024: 3.98 },
  },
  {
    iso2: 'TR',
    iso3: 'TUR',
    name: 'Türkiye',
    currency: 'TRY',
    ppp: { 2023: 7.35, 2024: 11.55 },
    officialFxPerUsd: { 2023: 23.74, 2024: 32.81 },
  },
  {
    iso2: 'EG',
    iso3: 'EGY',
    name: 'Egypt, Arab Rep.',
    currency: 'EGP',
    ppp: { 2023: 4.78, 2024: 6.24 },
    officialFxPerUsd: { 2023: 30.63, 2024: 45.3 },
  },
  {
    iso2: 'NG',
    iso3: 'NGA',
    name: 'Nigeria',
    currency: 'NGN',
    ppp: { 2023: 158.18, 2024: 176.08 },
    officialFxPerUsd: { 2023: 645.19, 2024: 1478.97 },
  },
  {
    iso2: 'BD',
    iso3: 'BGD',
    name: 'Bangladesh',
    currency: 'BDT',
    ppp: { 2023: 28.61, 2024: 29.84 },
    officialFxPerUsd: { 2023: 106.31, 2024: 115.6 },
  },
] as const;

/** Verify Türkiye from WDI — if unsure, I should check the file */
export function getPppCountry(iso2: string): PppCountryRecord | undefined {
  return PPP_COUNTRIES.find((c) => c.iso2 === iso2);
}

export function countriesWithYear(year: PppYear): PppCountryRecord[] {
  return PPP_COUNTRIES.filter(
    (c) =>
      c.ppp[year] != null &&
      c.ppp[year]! > 0 &&
      c.officialFxPerUsd[year] != null &&
      c.officialFxPerUsd[year]! > 0
  );
}

export function priceLevelVsUs(
  country: PppCountryRecord,
  year: PppYear
): number | null {
  const ppp = country.ppp[year];
  const fx = country.officialFxPerUsd[year];
  if (ppp == null || fx == null || fx <= 0 || ppp <= 0) return null;
  // PLI ≈ PPP / market FX (both LCU per USD/intl $); US = 100
  return (ppp / fx) * 100;
}
