/** Whole-blood wait model: NHS Blood and Transplant / WHO-style sex intervals. */
export type BloodDonationSexMode = 'male' | 'female' | 'custom';

export type BloodDonationPeriodUnit = 'days' | 'weeks' | 'months';

export interface BloodDonationDueDateInput {
  sexMode: BloodDonationSexMode;
  /** Period magnitude; locked for male/female presets. */
  periodValue: string;
  periodUnit: BloodDonationPeriodUnit;
  /** ISO YYYY-MM-DD (date-only). */
  lastDonationDate: string;
}

export interface BloodDonationDueDateResult {
  sexMode: BloodDonationSexMode;
  periodValue: number;
  periodUnit: BloodDonationPeriodUnit;
  periodDaysEquivalent: number | null;
  lastDonationIso: string;
  nextDonationIso: string;
  formattedLastDonation: string;
  formattedNextDonation: string;
  recommendationText: string;
  scopeNote: string;
  explanation: string;
}

export type BloodDonationDueDateFieldErrors = {
  form?: string;
  periodValue?: string;
  lastDonationDate?: string;
};

/** NHS / WHO whole-blood minimum intervals (weeks). */
export const MALE_INTERVAL_WEEKS = 12;
export const FEMALE_INTERVAL_WEEKS = 16;

export function recommendedWeeksForSex(
  mode: BloodDonationSexMode
): number | null {
  if (mode === 'male') return MALE_INTERVAL_WEEKS;
  if (mode === 'female') return FEMALE_INTERVAL_WEEKS;
  return null;
}

export function recommendationTextForMode(mode: BloodDonationSexMode): string {
  if (mode === 'male') {
    return 'The recommended period between donations is at least 12 weeks for males.';
  }
  if (mode === 'female') {
    return 'The recommended period between donations is at least 16 weeks for females.';
  }
  return 'Enter a custom wait period. Confirm the interval with your blood service for your donation type and jurisdiction.';
}

export function resolvePresetPeriod(
  mode: BloodDonationSexMode
): { periodValue: number; periodUnit: BloodDonationPeriodUnit } | null {
  if (mode === 'male') {
    return { periodValue: MALE_INTERVAL_WEEKS, periodUnit: 'weeks' };
  }
  if (mode === 'female') {
    return { periodValue: FEMALE_INTERVAL_WEEKS, periodUnit: 'weeks' };
  }
  return null;
}

export function createDefaultInput(): BloodDonationDueDateInput {
  return {
    sexMode: 'male',
    periodValue: String(MALE_INTERVAL_WEEKS),
    periodUnit: 'weeks',
    lastDonationDate: '2026-11-21',
  };
}

export function createEmptyInput(): BloodDonationDueDateInput {
  return {
    sexMode: 'male',
    periodValue: String(MALE_INTERVAL_WEEKS),
    periodUnit: 'weeks',
    lastDonationDate: '',
  };
}

export function inputsEqual(
  a: BloodDonationDueDateInput,
  b: BloodDonationDueDateInput
): boolean {
  return (
    a.sexMode === b.sexMode &&
    a.periodValue === b.periodValue &&
    a.periodUnit === b.periodUnit &&
    a.lastDonationDate === b.lastDonationDate
  );
}
