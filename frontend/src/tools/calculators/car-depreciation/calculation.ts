import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { CAR_DEPRECIATION_ANNUAL_RATE } from './content';

/** One minute as a fraction of a Gregorian mean year (365.25 days). */
export const ONE_MINUTE_IN_YEARS = 1 / (365.25 * 24 * 60);

/**
 * Constant annual declining-balance car depreciation:
 *   Value after t years = Initial × (1 − r)^t
 *   Reduced value = Initial × (1 − r)^age
 *   Future from now = Reduced × (1 − r)^Δt
 *
 * Floors results at 0. Full precision; round only for display.
 */
export function calculateCarDepreciation(input: {
  initialValue: number;
  carAgeYears: number;
  annualRate?: number;
}): {
  reducedValue: number;
  after1Minute: number;
  after1Year: number;
  after2Years: number;
  after3Years: number;
  after4Years: number;
  after5Years: number;
  totalDepreciationToDate: number;
  annualRate: number;
} | null {
  const annualRate = input.annualRate ?? CAR_DEPRECIATION_ANNUAL_RATE;
  const { initialValue, carAgeYears } = input;

  if (![initialValue, carAgeYears, annualRate].every(Number.isFinite)) {
    return null;
  }
  if (initialValue < 0 || carAgeYears < 0) return null;
  if (annualRate < 0 || annualRate > 1) return null;

  const retention = 1 - annualRate;
  if (!(retention >= 0) || !Number.isFinite(retention)) return null;

  const valueAt = (yearsFromPurchase: number): number | null => {
    if (!Number.isFinite(yearsFromPurchase) || yearsFromPurchase < 0) {
      return null;
    }
    const raw = initialValue * Math.pow(retention, yearsFromPurchase);
    if (!Number.isFinite(raw)) return null;
    return Math.max(0, raw);
  };

  const reducedValue = valueAt(carAgeYears);
  if (reducedValue === null) return null;

  const projectFromNow = (deltaYears: number): number | null => {
    if (!Number.isFinite(deltaYears) || deltaYears < 0) return null;
    const raw = reducedValue * Math.pow(retention, deltaYears);
    if (!Number.isFinite(raw)) return null;
    return Math.max(0, raw);
  };

  const after1Minute = projectFromNow(ONE_MINUTE_IN_YEARS);
  const after1Year = projectFromNow(1);
  const after2Years = projectFromNow(2);
  const after3Years = projectFromNow(3);
  const after4Years = projectFromNow(4);
  const after5Years = projectFromNow(5);

  if (
    after1Minute === null ||
    after1Year === null ||
    after2Years === null ||
    after3Years === null ||
    after4Years === null ||
    after5Years === null
  ) {
    return null;
  }

  const totalDepreciationToDate = initialValue - reducedValue;
  if (!Number.isFinite(totalDepreciationToDate)) return null;

  return {
    reducedValue,
    after1Minute,
    after1Year,
    after2Years,
    after3Years,
    after4Years,
    after5Years,
    totalDepreciationToDate,
    annualRate,
  };
}

/** Display rounding only — never used inside the formulas. */
export function formatCarDepreciationMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
