import { getMileageRates } from './rates';
import {
  KM_PER_MILE,
  type DistanceUnit,
  type MileageRatePeriodId,
} from './types';

export function distanceToMiles(amount: number, unit: DistanceUnit): number {
  if (!(Number.isFinite(amount) && amount >= 0)) return NaN;
  return unit === 'mi' ? amount : amount / KM_PER_MILE;
}

/** Preserve physical distance when switching mi ↔ km. */
export function convertDistanceAmount(
  amount: number,
  from: DistanceUnit,
  to: DistanceUnit
): number {
  if (from === to) return amount;
  if (!(Number.isFinite(amount) && amount >= 0)) return NaN;
  const miles = distanceToMiles(amount, from);
  if (!Number.isFinite(miles)) return NaN;
  return to === 'mi' ? miles : miles * KM_PER_MILE;
}

export interface MileageCalculationInput {
  periodId: MileageRatePeriodId;
  businessDistance: number;
  businessUnit: DistanceUnit;
  medicalDistance: number;
  medicalUnit: DistanceUnit;
  charityDistance: number;
  charityUnit: DistanceUnit;
}

export interface MileageCalculationResult {
  businessRatePerMile: number;
  medicalRatePerMile: number;
  charityRatePerMile: number;
  businessMiles: number;
  medicalMiles: number;
  charityMiles: number;
  businessAmount: number;
  medicalAmount: number;
  charityAmount: number;
  totalDeduction: number;
  periodLabel: string;
  sourceNote: string;
}

/**
 * Nominal combined IRS standard-mileage amount:
 * Total = B_mi×Rb + M_mi×Rm + C_mi×Rc
 *
 * Educational estimate — not an automatic Schedule A / Schedule C deduction
 * and not an employer reimbursement policy.
 */
export function calculateMileageReimbursement(
  input: MileageCalculationInput
): MileageCalculationResult | null {
  const rates = getMileageRates(input.periodId);
  if (!rates) return null;

  const businessMiles = distanceToMiles(
    input.businessDistance,
    input.businessUnit
  );
  const medicalMiles = distanceToMiles(
    input.medicalDistance,
    input.medicalUnit
  );
  const charityMiles = distanceToMiles(
    input.charityDistance,
    input.charityUnit
  );

  if (
    ![businessMiles, medicalMiles, charityMiles].every(
      (v) => Number.isFinite(v) && v >= 0
    )
  ) {
    return null;
  }

  const businessAmount = businessMiles * rates.business;
  const medicalAmount = medicalMiles * rates.medical;
  const charityAmount = charityMiles * rates.charity;
  const totalDeduction = businessAmount + medicalAmount + charityAmount;

  if (
    ![businessAmount, medicalAmount, charityAmount, totalDeduction].every(
      Number.isFinite
    )
  ) {
    return null;
  }

  return {
    businessRatePerMile: rates.business,
    medicalRatePerMile: rates.medical,
    charityRatePerMile: rates.charity,
    businessMiles,
    medicalMiles,
    charityMiles,
    businessAmount,
    medicalAmount,
    charityAmount,
    totalDeduction,
    periodLabel: rates.label,
    sourceNote: `${rates.source} (${rates.effectiveFrom}–${rates.effectiveTo})`,
  };
}

export function formatUsdRate(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(rate);
}

export function formatUsdMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
