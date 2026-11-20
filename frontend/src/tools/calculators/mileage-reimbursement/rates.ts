import type { MileageRatePeriodId } from './types';

export interface OfficialMileageRates {
  id: MileageRatePeriodId;
  /** Dropdown / share label. */
  label: string;
  /** Calendar tax year for disclosure copy. */
  taxYear: number;
  effectiveFrom: string;
  effectiveTo: string;
  /** USD per mile. */
  business: number;
  medical: number;
  charity: number;
  /** IRS newsroom / notice citation. */
  source: string;
  sourceUrl: string;
}

/**
 * Verified IRS standard mileage rates (USD per mile).
 * Sources: https://www.irs.gov/tax-professionals/standard-mileage-rates
 * and the cited IR news releases / notices.
 *
 * Charitable rate is statutory 14¢/mile under I.R.C. §170(i).
 */
export const OFFICIAL_MILEAGE_RATES: readonly OfficialMileageRates[] = [
  {
    id: '2024',
    label: '2024',
    taxYear: 2024,
    effectiveFrom: '2024-01-01',
    effectiveTo: '2024-12-31',
    business: 0.67,
    medical: 0.21,
    charity: 0.14,
    source: 'IR-2023-239 / Notice 2024-08',
    sourceUrl: 'https://www.irs.gov/pub/irs-drop/n-24-08.pdf',
  },
  {
    id: '2025',
    label: '2025',
    taxYear: 2025,
    effectiveFrom: '2025-01-01',
    effectiveTo: '2025-12-31',
    business: 0.7,
    medical: 0.21,
    charity: 0.14,
    source: 'IR-2024-312 / Notice 2025-05',
    sourceUrl: 'https://www.irs.gov/pub/irs-drop/n-25-05.pdf',
  },
  {
    id: '2026-h1',
    label: '2026 (Jan 1 – Jun 30)',
    taxYear: 2026,
    effectiveFrom: '2026-01-01',
    effectiveTo: '2026-06-30',
    business: 0.725,
    medical: 0.205,
    charity: 0.14,
    source: 'IR-2025-128 / Notice 2026-10 (H1)',
    sourceUrl: 'https://www.irs.gov/newsroom/irs-sets-2026-business-standard-mileage-rate-at-725-cents-per-mile-up-25-cents',
  },
  {
    id: '2026-h2',
    label: '2026 (Jul 1 – Dec 31)',
    taxYear: 2026,
    effectiveFrom: '2026-07-01',
    effectiveTo: '2026-12-31',
    business: 0.76,
    medical: 0.235,
    charity: 0.14,
    source: 'IR-2026-29',
    sourceUrl: 'https://www.irs.gov/tax-professionals/standard-mileage-rates',
  },
] as const;

export function getMileageRates(
  id: MileageRatePeriodId
): OfficialMileageRates | null {
  return OFFICIAL_MILEAGE_RATES.find((row) => row.id === id) ?? null;
}
