/**
 * Versioned HRA city / regime rules (educational model).
 *
 * Historical: metro 50% cities = Delhi, Mumbai, Kolkata, Chennai.
 * From FY 2026–27: expanded list under Income-tax Rules, 2026 educational
 * mapping — verify official notifications before treating as legal advice.
 */

export type TaxRegime = 'old' | 'new';
export type InputFrequency = 'monthly' | 'annual';

export type TaxYearId =
  | '2024-25'
  | '2025-26'
  | '2026-27'
  | '2027-28';

export interface HraTaxYearRules {
  id: TaxYearId;
  label: string;
  /** Cities receiving the 50% of salary ceiling */
  metroFiftyPercentCities: readonly string[];
  /** Rule note shown in UI */
  cityRuleNote: string;
  hraAvailableUnderOldRegime: boolean;
  hraAvailableUnderNewRegime: boolean;
}

const CLASSIC_METROS = [
  'Delhi',
  'Mumbai',
  'Kolkata',
  'Chennai',
] as const;

const EXPANDED_METROS_2026 = [
  ...CLASSIC_METROS,
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
] as const;

export const HRA_TAX_YEAR_RULES: readonly HraTaxYearRules[] = [
  {
    id: '2024-25',
    label: 'FY 2024–25 (AY 2025–26)',
    metroFiftyPercentCities: CLASSIC_METROS,
    cityRuleNote:
      '50% of qualifying salary applies to Delhi, Mumbai, Kolkata, and Chennai; other cities use 40%.',
    hraAvailableUnderOldRegime: true,
    hraAvailableUnderNewRegime: false,
  },
  {
    id: '2025-26',
    label: 'FY 2025–26 (AY 2026–27)',
    metroFiftyPercentCities: CLASSIC_METROS,
    cityRuleNote:
      '50% of qualifying salary applies to Delhi, Mumbai, Kolkata, and Chennai; other cities use 40%.',
    hraAvailableUnderOldRegime: true,
    hraAvailableUnderNewRegime: false,
  },
  {
    id: '2026-27',
    label: 'FY 2026–27 (AY 2027–28)',
    metroFiftyPercentCities: EXPANDED_METROS_2026,
    cityRuleNote:
      'Educational mapping for FY 2026–27+: 50% cities include Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune, and Ahmedabad; others use 40%. Confirm official Income-tax Rules notifications.',
    hraAvailableUnderOldRegime: true,
    hraAvailableUnderNewRegime: false,
  },
  {
    id: '2027-28',
    label: 'FY 2027–28 (AY 2028–29)',
    metroFiftyPercentCities: EXPANDED_METROS_2026,
    cityRuleNote:
      'Educational mapping continuing expanded 50% city list from FY 2026–27 rules. Confirm official notifications for the selected year.',
    hraAvailableUnderOldRegime: true,
    hraAvailableUnderNewRegime: false,
  },
] as const;

export const CITY_OPTIONS = [
  'Delhi',
  'Mumbai',
  'Kolkata',
  'Chennai',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Other city (40%)',
] as const;

export type CityOption = (typeof CITY_OPTIONS)[number];

export function getHRATaxRules(taxYear: string): HraTaxYearRules | null {
  return HRA_TAX_YEAR_RULES.find((r) => r.id === taxYear) ?? null;
}

export function isSupportedTaxYear(taxYear: string): taxYear is TaxYearId {
  return HRA_TAX_YEAR_RULES.some((r) => r.id === taxYear);
}

/** Resolve city percentage (0.40 or 0.50) for a tax year. */
export function getCitySalaryPercentage(
  taxYear: string,
  city: string,
): { percent: number; isMetroFifty: boolean; rules: HraTaxYearRules } | null {
  const rules = getHRATaxRules(taxYear);
  if (!rules) return null;
  const normalized = city.trim();
  if (normalized === '' || normalized === 'Other city (40%)') {
    return { percent: 0.4, isMetroFifty: false, rules };
  }
  const isMetroFifty = rules.metroFiftyPercentCities.some(
    (c) => c.toLowerCase() === normalized.toLowerCase(),
  );
  return {
    percent: isMetroFifty ? 0.5 : 0.4,
    isMetroFifty,
    rules,
  };
}

export function isHraExemptClaimable(
  taxYear: string,
  regime: TaxRegime,
): boolean {
  const rules = getHRATaxRules(taxYear);
  if (!rules) return false;
  if (regime === 'new') return rules.hraAvailableUnderNewRegime;
  return rules.hraAvailableUnderOldRegime;
}
