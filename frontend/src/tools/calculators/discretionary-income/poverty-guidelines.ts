/**
 * Official HHS poverty guidelines (annual).
 * Sources:
 * - 2024: https://www.federalregister.gov/documents/2024/01/17/2024-00796/annual-update-of-the-hhs-poverty-guidelines
 * - 2025: https://www.federalregister.gov/documents/2025/01/17/2025-01377/annual-update-of-the-hhs-poverty-guidelines
 */
export type PovertyRegion = 'contiguous' | 'alaska' | 'hawaii';

export interface PovertyYearTable {
  year: number;
  sourceUrl: string;
  sourceLabel: string;
  contiguous: { base: number[]; increment: number };
  alaska: { base: number[]; increment: number };
  hawaii: { base: number[]; increment: number };
}

/** base[i] = guideline for household size i+1 (sizes 1–8). */
export const POVERTY_GUIDELINE_YEARS: readonly PovertyYearTable[] = [
  {
    year: 2025,
    sourceUrl:
      'https://www.federalregister.gov/documents/2025/01/17/2025-01377/annual-update-of-the-hhs-poverty-guidelines',
    sourceLabel: 'HHS Federal Register (Jan 17, 2025)',
    contiguous: {
      base: [15650, 21150, 26650, 32150, 37650, 43150, 48650, 54150],
      increment: 5500,
    },
    alaska: {
      base: [19550, 26430, 33310, 40190, 47070, 53950, 60830, 67710],
      increment: 6880,
    },
    hawaii: {
      base: [17990, 24320, 30650, 36980, 43310, 49640, 55970, 62300],
      increment: 6330,
    },
  },
  {
    year: 2024,
    sourceUrl:
      'https://www.federalregister.gov/documents/2024/01/17/2024-00796/annual-update-of-the-hhs-poverty-guidelines',
    sourceLabel: 'HHS Federal Register (Jan 17, 2024)',
    contiguous: {
      base: [15060, 20440, 25820, 31200, 36580, 41960, 47340, 52720],
      increment: 5380,
    },
    alaska: {
      base: [18810, 25540, 32270, 39000, 45730, 52460, 59190, 65920],
      increment: 6730,
    },
    hawaii: {
      base: [17310, 23500, 29690, 35880, 42070, 48260, 54450, 60640],
      increment: 6190,
    },
  },
] as const;

export const LATEST_POVERTY_YEAR = POVERTY_GUIDELINE_YEARS[0]!.year;

export function getPovertyYearTable(year: number): PovertyYearTable | null {
  return POVERTY_GUIDELINE_YEARS.find((y) => y.year === year) ?? null;
}

export function lookupPovertyGuideline(
  year: number,
  region: PovertyRegion,
  householdSize: number
): { annualAmount: number; sourceUrl: string; sourceLabel: string } | null {
  if (!Number.isInteger(householdSize) || householdSize < 1) return null;
  const table = getPovertyYearTable(year);
  if (!table) return null;
  const regionTable = table[region];
  const { base, increment } = regionTable;
  let amount: number;
  if (householdSize <= 8) {
    amount = base[householdSize - 1]!;
  } else {
    amount = base[7]! + (householdSize - 8) * increment;
  }
  if (!Number.isFinite(amount) || amount < 0) return null;
  return {
    annualAmount: amount,
    sourceUrl: table.sourceUrl,
    sourceLabel: table.sourceLabel,
  };
}

export type UsStateCode =
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'DC' | 'FL'
  | 'GA' | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME'
  | 'MD' | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH'
  | 'NJ' | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI'
  | 'SC' | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI'
  | 'WY';

export const US_STATES: readonly { code: UsStateCode; name: string }[] = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
] as const;

export function regionForState(state: UsStateCode): PovertyRegion {
  if (state === 'AK') return 'alaska';
  if (state === 'HI') return 'hawaii';
  return 'contiguous';
}
