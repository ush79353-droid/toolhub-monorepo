export type DurationUnit = 'years' | 'months' | 'days';

export interface TenureDraft {
  employeeCount: string;
  combinedDuration: string;
  combinedUnit: DurationUnit;
  startDate: string;
  endDate: string;
}

export interface AverageTenureResult {
  averageYears: number;
  display: string;
}

export interface SpecificTenureResult {
  years: number;
  months: number;
  days: number;
  display: string;
}

export interface TenureResult {
  average: AverageTenureResult | null;
  specific: SpecificTenureResult | null;
}

export type TenureField =
  | 'employeeCount'
  | 'combinedDuration'
  | 'startDate'
  | 'endDate';

export type TenureFieldErrors = Partial<Record<TenureField | 'form', string>>;

export const DURATION_UNITS: readonly { value: DurationUnit; label: string }[] = [
  { value: 'years', label: 'yrs' },
  { value: 'months', label: 'mos' },
  { value: 'days', label: 'days' },
];

export function emptyTenureDraft(): TenureDraft {
  return {
    employeeCount: '',
    combinedDuration: '',
    combinedUnit: 'years',
    startDate: '',
    endDate: '',
  };
}
