import {
  calculateMileageReimbursement,
  formatUsdMoney,
  formatUsdRate,
} from './calculation';
import { getMileageRates } from './rates';
import type {
  DistanceUnit,
  MileageReimbursementFieldErrors,
  MileageReimbursementInput,
  MileageReimbursementResult,
  MileageRatePeriodId,
} from './types';

export interface MileageReimbursementValidation {
  isValid: boolean;
  errors: MileageReimbursementFieldErrors;
  result: MileageReimbursementResult | null;
}

const UNITS: readonly DistanceUnit[] = ['mi', 'km'];
const PERIODS: readonly MileageRatePeriodId[] = [
  '2024',
  '2025',
  '2026-h1',
  '2026-h2',
];

function parseDistance(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

function parseUnit(raw: DistanceUnit): boolean {
  return UNITS.includes(raw);
}

export function validateMileageReimbursementInput(
  input: MileageReimbursementInput
): MileageReimbursementValidation {
  const errors: MileageReimbursementFieldErrors = {};

  if (!PERIODS.includes(input.periodId) || !getMileageRates(input.periodId)) {
    errors.periodId = 'Select a supported IRS rate period.';
  }

  const business = parseDistance(input.businessDistance);
  const medical = parseDistance(input.medicalDistance);
  const charity = parseDistance(input.charityDistance);

  if (business.blank || business.invalid || business.value === null) {
    errors.businessDistance = 'Enter a valid business distance (0 or greater).';
  } else if (!(business.value >= 0)) {
    errors.businessDistance = 'Business distance must be zero or greater.';
  }

  if (medical.blank || medical.invalid || medical.value === null) {
    errors.medicalDistance = 'Enter a valid medical distance (0 or greater).';
  } else if (!(medical.value >= 0)) {
    errors.medicalDistance = 'Medical distance must be zero or greater.';
  }

  if (charity.blank || charity.invalid || charity.value === null) {
    errors.charityDistance = 'Enter a valid charity distance (0 or greater).';
  } else if (!(charity.value >= 0)) {
    errors.charityDistance = 'Charity distance must be zero or greater.';
  }

  if (!parseUnit(input.businessUnit)) {
    errors.businessDistance = 'Choose mi or km.';
  }
  if (!parseUnit(input.medicalUnit)) {
    errors.medicalDistance = 'Choose mi or km.';
  }
  if (!parseUnit(input.charityUnit)) {
    errors.charityDistance = 'Choose mi or km.';
  }

  if (
    Boolean(errors.periodId) ||
    Boolean(errors.businessDistance) ||
    Boolean(errors.medicalDistance) ||
    Boolean(errors.charityDistance)
  ) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateMileageReimbursement({
    periodId: input.periodId,
    businessDistance: business.value!,
    businessUnit: input.businessUnit,
    medicalDistance: medical.value!,
    medicalUnit: input.medicalUnit,
    charityDistance: charity.value!,
    charityUnit: input.charityUnit,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const result: MileageReimbursementResult = {
    ...computed,
    formattedBusinessRate: formatUsdRate(computed.businessRatePerMile),
    formattedMedicalRate: formatUsdRate(computed.medicalRatePerMile),
    formattedCharityRate: formatUsdRate(computed.charityRatePerMile),
    formattedTotal: formatUsdMoney(computed.totalDeduction),
  };

  return { isValid: true, errors, result };
}
