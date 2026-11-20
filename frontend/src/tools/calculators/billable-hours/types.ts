import type { SupportedCurrency } from '@/tools/shared/currency';

/**
 * Rate denominator and billable-time units.
 * Only SI-exact conversions (60 s/min, 60 min/hr) — no invented workday lengths.
 */
export type BillableTimeUnit = 'seconds' | 'minutes' | 'hours';

export const RATE_TIME_UNITS: readonly {
  value: BillableTimeUnit;
  label: string;
}[] = [
  { value: 'seconds', label: 'sec' },
  { value: 'minutes', label: 'min' },
  { value: 'hours', label: 'hr' },
] as const;

export const BILLABLE_TIME_UNITS: readonly {
  value: BillableTimeUnit;
  label: string;
}[] = [
  { value: 'seconds', label: 'secs' },
  { value: 'minutes', label: 'mins' },
  { value: 'hours', label: 'hrs' },
] as const;

export type BillableHoursSolveTarget = 'rate' | 'time' | 'value';

export interface BillableHoursDraft {
  rate: string;
  rateCurrency: SupportedCurrency;
  rateUnit: BillableTimeUnit;
  time: string;
  timeUnit: BillableTimeUnit;
  value: string;
  valueCurrency: SupportedCurrency;
  /** Which field to solve when exactly one is blank; otherwise last-edited drives refresh. */
  solveFor: BillableHoursSolveTarget;
  lastEdited: BillableHoursSolveTarget;
}

export interface BillableHoursResult {
  solvedField: BillableHoursSolveTarget;
  rate: number;
  time: number;
  value: number;
  rateUnit: BillableTimeUnit;
  timeUnit: BillableTimeUnit;
  /** Currency used for rate/value math after FX normalize (rate currency). */
  calcCurrency: SupportedCurrency;
  valueCurrency: SupportedCurrency;
  formattedRate: string;
  formattedTime: string;
  formattedValue: string;
  summaryText: string;
}

export type BillableHoursFieldErrors = {
  rate?: string;
  time?: string;
  value?: string;
  form?: string;
};

export function createDefaultDraft(): BillableHoursDraft {
  return {
    rate: '',
    rateCurrency: 'PKR',
    rateUnit: 'hours',
    time: '',
    timeUnit: 'hours',
    value: '',
    valueCurrency: 'PKR',
    solveFor: 'value',
    lastEdited: 'rate',
  };
}
