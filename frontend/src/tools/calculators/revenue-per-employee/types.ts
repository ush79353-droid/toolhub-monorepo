import type { SupportedCurrency } from '@/tools/shared/currency';

export interface RevenuePerEmployeeInput {
  revenue: string;
  employeeCount: string;
  currency: SupportedCurrency;
}

export interface RevenuePerEmployeeResult {
  revenue: number;
  employeeCount: number;
  revenuePerEmployee: number;
  currency: SupportedCurrency;
  formattedRevenuePerEmployee: string;
}

export type RevenuePerEmployeeFieldErrors = {
  revenue?: string;
  employeeCount?: string;
  currency?: string;
  form?: string;
};

export function createDefaultInput(): RevenuePerEmployeeInput {
  return {
    revenue: '',
    employeeCount: '',
    currency: 'PKR',
  };
}
