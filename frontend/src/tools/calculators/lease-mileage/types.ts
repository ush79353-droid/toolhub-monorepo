import type { SupportedCurrency } from '@/tools/shared/currency';

/** International mile ↔ km (exact). */
export const KM_PER_MILE = 1.609344;

export type DistanceUnit = 'km' | 'mi';

export interface LeaseMileageInput {
  totalYears: string;
  totalMonths: string;
  remainingYears: string;
  remainingMonths: string;
  currentDistance: string;
  currentDistanceUnit: DistanceUnit;
  annualAllowance: string;
  annualAllowanceUnit: DistanceUnit;
  excessFee: string;
  excessFeeCurrency: SupportedCurrency;
  excessFeeDistanceUnit: DistanceUnit;
  /** Display unit for predicted excess distance. */
  excessResultUnit: DistanceUnit;
  chargeCurrency: SupportedCurrency;
  savingsCurrency: SupportedCurrency;
  leaseDetailsOpen: boolean;
  resultsOpen: boolean;
}

export type LeaseMileageAvailability = 'ok' | 'no_elapsed';

export interface LeaseMileageResult {
  availability: LeaseMileageAvailability;
  totalMonths: number;
  remainingMonths: number;
  elapsedMonths: number;
  /** Canonical km. */
  predictedExcessKm: number;
  /** Canonical fee currency = excessFeeCurrency before output FX. */
  feeCurrency: SupportedCurrency;
  predictedChargeCanonical: number;
  monthlySavingsCanonical: number;
  excessDisplay: number;
  excessDisplayUnit: DistanceUnit;
  chargeDisplay: number;
  chargeCurrency: SupportedCurrency;
  savingsDisplay: number;
  savingsCurrency: SupportedCurrency;
  formattedExcess: string;
  formattedCharge: string;
  formattedSavings: string;
  assumptionNote: string;
}

export type LeaseMileageFieldErrors = {
  totalTerm?: string;
  remainingTerm?: string;
  currentDistance?: string;
  annualAllowance?: string;
  excessFee?: string;
  form?: string;
};

export function createDefaultInput(): LeaseMileageInput {
  return {
    totalYears: '',
    totalMonths: '',
    remainingYears: '',
    remainingMonths: '',
    currentDistance: '',
    currentDistanceUnit: 'km',
    annualAllowance: '',
    annualAllowanceUnit: 'km',
    excessFee: '',
    excessFeeCurrency: 'PKR',
    excessFeeDistanceUnit: 'km',
    excessResultUnit: 'km',
    chargeCurrency: 'PKR',
    savingsCurrency: 'PKR',
    leaseDetailsOpen: true,
    resultsOpen: true,
  };
}

export function inputsEqual(a: LeaseMileageInput, b: LeaseMileageInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
