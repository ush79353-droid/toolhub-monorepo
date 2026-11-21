import type { SupportedCurrency } from '@/tools/shared/currency';

/** Pay-period unit for gross salary (normalize to monthly before proration). */
export type SalaryPayPeriod = 'day' | 'week' | 'month' | 'year';

/** Weekday index matching JS Date.getUTCDay(): 0 = Sunday … 6 = Saturday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Scheduled workdays per week (1–7). Off-days needed = 7 − workdays. */
export type WorkdaysPerWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const SALARY_PAY_PERIOD_OPTIONS: readonly {
  value: SalaryPayPeriod;
  label: string;
}[] = [
  { value: 'day', label: '/ day' },
  { value: 'week', label: '/ wk' },
  { value: 'month', label: '/ mo' },
  { value: 'year', label: '/ yr' },
] as const;

export const WORKDAYS_PER_WEEK_OPTIONS: readonly {
  value: WorkdaysPerWeek;
  label: string;
}[] = [
  { value: 1, label: 'One' },
  { value: 2, label: 'Two' },
  { value: 3, label: 'Three' },
  { value: 4, label: 'Four' },
  { value: 5, label: 'Five' },
  { value: 6, label: 'Six' },
  { value: 7, label: 'Seven' },
] as const;

export const WEEKDAY_OPTIONS: readonly {
  value: Weekday;
  label: string;
}[] = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
] as const;

export const MONTH_OPTIONS: readonly {
  value: number;
  label: string;
}[] = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
] as const;

export interface ProratedSalaryInput {
  year: string;
  /** Calendar month 1–12. */
  month: string;
  grossSalary: string;
  grossSalaryCurrency: SupportedCurrency;
  payPeriod: SalaryPayPeriod;
  daysWorked: string;
  holidays: string;
  approvedLeave: string;
  workdaysPerWeek: WorkdaysPerWeek;
  /**
   * Days off (length = 7 − workdaysPerWeek). Indices 0..n-1 are First / Second / …
   * Unused slots stay filled with defaults for stable form state.
   */
  daysOff: Weekday[];
  /** Independent display currency for prorated salary. */
  resultCurrency: SupportedCurrency;
  scheduleOpen: boolean;
  daysOffOpen: boolean;
}

export interface ProratedSalaryResult {
  calendarDaysInMonth: number;
  scheduledWorkingDays: number;
  payableDays: number;
  monthlySalaryCanonical: number;
  proratedSalaryCanonical: number;
  proratedSalary: number;
  grossSalaryCurrency: SupportedCurrency;
  resultCurrency: SupportedCurrency;
  formattedProratedSalary: string;
}

export type ProratedSalaryFieldErrors = {
  year?: string;
  month?: string;
  grossSalary?: string;
  daysWorked?: string;
  holidays?: string;
  approvedLeave?: string;
  workdaysPerWeek?: string;
  daysOff?: string;
  form?: string;
};

/** Screenshot defaults: Jan 2025 · 2,000 PKR/mo · 10 worked · 1 holiday · 1 leave · Five · Sun/Sat. */
export function createDefaultInput(): ProratedSalaryInput {
  return {
    year: '2025',
    month: '1',
    grossSalary: '2000',
    grossSalaryCurrency: 'PKR',
    payPeriod: 'month',
    daysWorked: '10',
    holidays: '1',
    approvedLeave: '1',
    workdaysPerWeek: 5,
    daysOff: [0, 6, 1, 2, 3, 4],
    resultCurrency: 'PKR',
    scheduleOpen: true,
    daysOffOpen: true,
  };
}
