import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { AreaUnit, RentalPeriod } from './types';

/** Exact factor: 1 m² = 10.7639104167 ft². */
export const SQ_FT_PER_M2 = 10.7639104167;

export function areaUnitLabel(unit: AreaUnit): string {
  return unit === 'ft2' ? 'ft²' : 'm²';
}

export function convertArea(
  value: number,
  from: AreaUnit,
  to: AreaUnit
): number {
  if (!Number.isFinite(value) || from === to) return value;
  if (from === 'ft2' && to === 'm2') return value / SQ_FT_PER_M2;
  return value * SQ_FT_PER_M2;
}

/** Keep rate × area constant when switching area units. */
export function convertRentalRateUnits(
  value: number,
  from: AreaUnit,
  to: AreaUnit
): number {
  if (!Number.isFinite(value) || from === to) return value;
  if (from === 'ft2' && to === 'm2') return value * SQ_FT_PER_M2;
  return value / SQ_FT_PER_M2;
}

/** Preserve annual economic value when switching rental period presentation. */
export function convertRentalPeriodDisplay(
  amount: number,
  from: RentalPeriod,
  to: RentalPeriod
): number {
  if (!Number.isFinite(amount) || from === to) return amount;
  const annual = from === 'monthly' ? amount * 12 : amount;
  return to === 'monthly' ? annual / 12 : annual;
}

/**
 * Annual rental income = area × (annualized rate per area).
 * Monthly rate is multiplied by 12 before multiplying by area.
 */
export function calculateAnnualRentalIncome(
  area: number,
  rentalRatePerArea: number,
  rentalPeriod: RentalPeriod
): number | null {
  if (
    !Number.isFinite(area) ||
    !Number.isFinite(rentalRatePerArea) ||
    area < 0 ||
    rentalRatePerArea < 0
  ) {
    return null;
  }
  const annualRate =
    rentalPeriod === 'monthly' ? rentalRatePerArea * 12 : rentalRatePerArea;
  const income = area * annualRate;
  return Number.isFinite(income) ? income : null;
}

export function calculatePotentialGrossIncome(
  annualRentalIncome: number,
  otherAnnualIncome: number
): number | null {
  if (
    !Number.isFinite(annualRentalIncome) ||
    !Number.isFinite(otherAnnualIncome) ||
    annualRentalIncome < 0 ||
    otherAnnualIncome < 0
  ) {
    return null;
  }
  const pgi = annualRentalIncome + otherAnnualIncome;
  return Number.isFinite(pgi) ? pgi : null;
}

export function calculateVacancyRatePercent(
  occupancyRatePercent: number
): number | null {
  if (
    !Number.isFinite(occupancyRatePercent) ||
    occupancyRatePercent < 0 ||
    occupancyRatePercent > 100
  ) {
    return null;
  }
  return 100 - occupancyRatePercent;
}

/**
 * Vacancy loss applies to potential rental income only (not other income).
 * Vacancy Loss = Annual Rental Income × (1 − Occupancy / 100)
 */
export function calculateVacancyLoss(
  annualRentalIncome: number,
  occupancyRatePercent: number
): number | null {
  if (
    !Number.isFinite(annualRentalIncome) ||
    !Number.isFinite(occupancyRatePercent) ||
    annualRentalIncome < 0 ||
    occupancyRatePercent < 0 ||
    occupancyRatePercent > 100
  ) {
    return null;
  }
  // Use vacancy% / 100 rather than (1 − occupancy/100) to reduce float error.
  const vacancyRatePercent = 100 - occupancyRatePercent;
  const loss = annualRentalIncome * (vacancyRatePercent / 100);
  return Number.isFinite(loss) ? loss : null;
}

export function calculateEffectiveGrossIncome(
  potentialGrossIncome: number,
  vacancyLoss: number
): number | null {
  if (
    !Number.isFinite(potentialGrossIncome) ||
    !Number.isFinite(vacancyLoss)
  ) {
    return null;
  }
  const egi = potentialGrossIncome - vacancyLoss;
  return Number.isFinite(egi) ? egi : null;
}

export function calculateTotalOperatingExpenses(
  amounts: readonly number[]
): number | null {
  let total = 0;
  for (const amount of amounts) {
    if (!Number.isFinite(amount) || amount < 0) return null;
    total += amount;
  }
  return Number.isFinite(total) ? total : null;
}

/**
 * NOI = EGI − Operating Expenses.
 * Negative NOI is returned as-is (not clamped to zero).
 * Debt service is excluded from standard property NOI.
 */
export function calculateNetOperatingIncome(
  effectiveGrossIncome: number,
  operatingExpenses: number
): number | null {
  if (
    !Number.isFinite(effectiveGrossIncome) ||
    !Number.isFinite(operatingExpenses) ||
    operatingExpenses < 0
  ) {
    return null;
  }
  const noi = effectiveGrossIncome - operatingExpenses;
  return Number.isFinite(noi) ? noi : null;
}

/** Operating Expense Ratio (%) = (OpEx / EGI) × 100. Unavailable when EGI ≤ 0. */
export function calculateOperatingExpenseRatio(
  operatingExpenses: number,
  effectiveGrossIncome: number
): number | null {
  if (
    !Number.isFinite(operatingExpenses) ||
    !Number.isFinite(effectiveGrossIncome) ||
    operatingExpenses < 0 ||
    effectiveGrossIncome <= 0
  ) {
    return null;
  }
  const ratio = (operatingExpenses / effectiveGrossIncome) * 100;
  return Number.isFinite(ratio) ? ratio : null;
}

/** NOI Margin (%) = (NOI / EGI) × 100. Unavailable when EGI ≤ 0. */
export function calculateNoiMargin(
  noi: number,
  effectiveGrossIncome: number
): number | null {
  if (
    !Number.isFinite(noi) ||
    !Number.isFinite(effectiveGrossIncome) ||
    effectiveGrossIncome <= 0
  ) {
    return null;
  }
  const margin = (noi / effectiveGrossIncome) * 100;
  return Number.isFinite(margin) ? margin : null;
}

export function formatNoiMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatNoiPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
