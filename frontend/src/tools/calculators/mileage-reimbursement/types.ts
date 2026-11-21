/** International mile (exact). */
export const KM_PER_MILE = 1.609344;

export type DistanceUnit = 'mi' | 'km';

/**
 * Supported IRS rate periods. 2026 is split because official rates change
 * mid-year (IR-2025-128 / IR-2026-29) and this UI has no travel-date field.
 */
export type MileageRatePeriodId =
  | '2024'
  | '2025'
  | '2026-h1'
  | '2026-h2';

export interface MileageReimbursementInput {
  periodId: MileageRatePeriodId;
  businessDistance: string;
  businessUnit: DistanceUnit;
  medicalDistance: string;
  medicalUnit: DistanceUnit;
  charityDistance: string;
  charityUnit: DistanceUnit;
}

export interface MileageReimbursementResult {
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
  formattedBusinessRate: string;
  formattedMedicalRate: string;
  formattedCharityRate: string;
  formattedTotal: string;
  periodLabel: string;
  sourceNote: string;
}

export type MileageReimbursementFieldErrors = {
  businessDistance?: string;
  medicalDistance?: string;
  charityDistance?: string;
  periodId?: string;
  form?: string;
};

export function createDefaultInput(): MileageReimbursementInput {
  return {
    periodId: '2026-h1',
    businessDistance: '0',
    businessUnit: 'mi',
    medicalDistance: '0',
    medicalUnit: 'mi',
    charityDistance: '0',
    charityUnit: 'mi',
  };
}
