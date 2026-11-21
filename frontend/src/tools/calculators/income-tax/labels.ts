import type { FilingStatus, TaxYear } from './types';

export const FILING_STATUS_OPTIONS: ReadonlyArray<{
  value: FilingStatus;
  label: string;
}> = [
  { value: 'single', label: 'Single' },
  { value: 'married-joint', label: 'Married Filing Jointly' },
  { value: 'married-separate', label: 'Married Filing Separately' },
  { value: 'head-of-household', label: 'Head of Household' },
  {
    value: 'qualifying-surviving-spouse',
    label: 'Qualifying Surviving Spouse',
  },
];

export const TAX_YEAR_OPTIONS: ReadonlyArray<{
  year: TaxYear;
  label: string;
}> = [
  { year: 2026, label: '2026 (return filed in 2027)' },
  { year: 2025, label: '2025 (return filed in 2026)' },
];

export function formatFilingStatusLabel(status: FilingStatus): string {
  return FILING_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}
