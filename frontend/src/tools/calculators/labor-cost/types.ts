import type { SupportedCurrency } from '@/tools/shared/currency';

export interface LaborCostInput {
  weeklyHours: number;
  payRate: number;
  absentDays: number;
  taxes: number;
  insurance: number;
  benefits: number;
  overtime: number;
  supplies: number;
  revenue: number;
  currency: SupportedCurrency;
}

export interface LaborCostResult {
  grossHoursPerYear: number | null;
  grossPay: number | null;
  hoursNotWorked: number | null;
  netHoursWorked: number | null;
  additionalAnnualCosts: number;
  annualPayrollLaborCost: number | null;
  hourlyLaborCost: number | null;
  laborCostPercent: number | null;
  currency: SupportedCurrency;
  grossHoursPerYearDisplay: string;
  grossPayDisplay: string;
  hoursNotWorkedDisplay: string;
  netHoursWorkedDisplay: string;
  annualPayrollLaborCostDisplay: string;
  hourlyLaborCostDisplay: string;
  laborCostPercentDisplay: string;
}

export type LaborCostFieldErrors = Record<string, string>;

export function createDefaultInput(): LaborCostInput {
  return {
    weeklyHours: 40,
    payRate: 10,
    absentDays: 15,
    taxes: Number.NaN,
    insurance: Number.NaN,
    benefits: Number.NaN,
    overtime: Number.NaN,
    supplies: Number.NaN,
    revenue: Number.NaN,
    currency: 'PKR',
  };
}
