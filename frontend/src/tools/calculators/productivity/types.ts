import type { SupportedCurrency } from '@/tools/shared/currency';

/** Elapsed labor-time units only — avoids ambiguous workday/week conversions. */
export type WorkingTimeUnit = 'seconds' | 'minutes' | 'hours';

export const WORKING_TIME_UNITS: readonly {
  value: WorkingTimeUnit;
  label: string;
}[] = [
  { value: 'seconds', label: 'seconds' },
  { value: 'minutes', label: 'minutes' },
  { value: 'hours', label: 'hours' },
] as const;

export type ProductivityStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'partial';

export interface ProductivityInput {
  revenue: string;
  numberOfEmployees: string;
  workingHours: string;
  workingHoursUnit: WorkingTimeUnit;
  currency: SupportedCurrency;
}

export interface ProductivityResult {
  revenue: number;
  numberOfEmployees: number | null;
  workingTimeEntered: number | null;
  totalWorkingHours: number | null;
  revenuePerEmployee: number | null;
  revenuePerWorkingHour: number | null;
  status: ProductivityStatus;
  employeeUnavailableReason: string | null;
  hourlyUnavailableReason: string | null;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  workingHoursUnit: WorkingTimeUnit;
  formattedRevenue: string;
  formattedEmployees: string | null;
  formattedWorkingTimeEntered: string | null;
  formattedTotalWorkingHours: string | null;
  formattedRevenuePerEmployee: string | null;
  formattedRevenuePerWorkingHour: string | null;
}

export type ProductivityFieldErrors = {
  revenue?: string;
  numberOfEmployees?: string;
  workingHours?: string;
  form?: string;
};

export function createDefaultInput(): ProductivityInput {
  return {
    revenue: '',
    numberOfEmployees: '',
    workingHours: '',
    workingHoursUnit: 'hours',
    currency: 'PKR',
  };
}
