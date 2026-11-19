import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { KM_PER_MILE, type DistanceUnit } from './types';

export function toMonths(years: number, months: number): number {
  return years * 12 + months;
}

export function distanceToKm(amount: number, unit: DistanceUnit): number {
  if (!Number.isFinite(amount)) return Number.NaN;
  return unit === 'km' ? amount : amount * KM_PER_MILE;
}

export function kmToDistance(km: number, unit: DistanceUnit): number {
  if (!Number.isFinite(km)) return Number.NaN;
  return unit === 'km' ? km : km / KM_PER_MILE;
}

/** Normalize a fee quoted per km or per mi into fee per km. */
export function feeToPerKm(fee: number, unit: DistanceUnit): number {
  if (!Number.isFinite(fee)) return Number.NaN;
  return unit === 'km' ? fee : fee / KM_PER_MILE;
}

export interface LeaseMileageEngineInput {
  totalMonths: number;
  remainingMonths: number;
  currentDistanceKm: number;
  annualAllowanceKm: number;
  /** Fee per km in fee currency. */
  feePerKm: number;
}

export type LeaseMileageEngineResult =
  | {
      availability: 'ok';
      totalMonths: number;
      remainingMonths: number;
      elapsedMonths: number;
      predictedExcessKm: number;
      predictedCharge: number;
      monthlySavings: number;
    }
  | {
      availability: 'no_elapsed';
      totalMonths: number;
      remainingMonths: number;
      elapsedMonths: number;
    };

/**
 * Constant-rate lease mileage projection.
 * Predicted total = D × T / elapsed; allowed = A × T / 12;
 * excess = max(0, predicted − allowed); charge = excess × fee/km;
 * monthly savings = charge / R.
 */
export function calculateLeaseMileage(
  input: LeaseMileageEngineInput
): LeaseMileageEngineResult | null {
  const {
    totalMonths,
    remainingMonths,
    currentDistanceKm,
    annualAllowanceKm,
    feePerKm,
  } = input;

  if (
    ![
      totalMonths,
      remainingMonths,
      currentDistanceKm,
      annualAllowanceKm,
      feePerKm,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (totalMonths <= 0) return null;
  if (remainingMonths <= 0 || remainingMonths > totalMonths) return null;
  if (currentDistanceKm < 0 || annualAllowanceKm < 0 || feePerKm < 0) return null;

  const elapsedMonths = totalMonths - remainingMonths;
  // Remaining equals total → nothing elapsed; cannot divide by zero.
  if (elapsedMonths <= 0) {
    return {
      availability: 'no_elapsed',
      totalMonths,
      remainingMonths,
      elapsedMonths: 0,
    };
  }

  const predictedTotalKm = (currentDistanceKm * totalMonths) / elapsedMonths;
  const totalAllowedKm = (annualAllowanceKm * totalMonths) / 12;
  const predictedExcessKm = Math.max(0, predictedTotalKm - totalAllowedKm);
  const predictedCharge = predictedExcessKm * feePerKm;
  const monthlySavings = predictedCharge / remainingMonths;

  if (![predictedExcessKm, predictedCharge, monthlySavings].every(Number.isFinite)) {
    return null;
  }

  return {
    availability: 'ok',
    totalMonths,
    remainingMonths,
    elapsedMonths,
    predictedExcessKm,
    predictedCharge,
    monthlySavings,
  };
}

export function formatDistanceAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatLeaseMileageMoney(
  amount: number,
  _currency: SupportedCurrency
): string {
  // Symbol shown separately in the form; always two display decimals.
  void _currency;
  return formatDistanceAmount(amount);
}

export const ASSUMPTION_NOTE =
  'Projection assumes future driving continues at the historical average rate (current distance × 12 ÷ elapsed months). No other lease penalties or taxes are included.';

export function shareLeaseMileageText(input: {
  title: string;
  formattedExcess: string;
  excessUnit: DistanceUnit;
  formattedCharge: string;
  chargeCurrency: SupportedCurrency;
  formattedSavings: string;
  savingsCurrency: SupportedCurrency;
  fxNote: string;
}): string {
  return [
    `${input.title} — Omega Calculators`,
    `Predicted excess: ${input.formattedExcess} ${input.excessUnit}`,
    `Lease-end charge: ${input.chargeCurrency} ${input.formattedCharge}`,
    `Monthly savings: ${input.savingsCurrency} ${input.formattedSavings} / mo`,
    ASSUMPTION_NOTE,
    input.fxNote,
  ].join('\n');
}
