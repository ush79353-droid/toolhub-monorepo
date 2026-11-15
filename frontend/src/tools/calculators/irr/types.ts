import type { SupportedCurrency } from '@/tools/shared/currency';

export const INITIAL_YEARS = 3;
export const MAX_YEARS = 30;

export interface IrrInput {
  initialInvestment: string;
  cashFlows: string[];
  currency: SupportedCurrency;
}

export interface IrrResult {
  irrPercent: number;
  formattedIrr: string;
  yearsUsed: number;
}

export type IrrFieldErrors = {
  initialInvestment?: string;
  form?: string;
  [key: `year${number}`]: string | undefined;
};

export function emptyCashFlow(): string {
  return '';
}

export function createDefaultInput(): IrrInput {
  return {
    initialInvestment: '',
    cashFlows: Array.from({ length: INITIAL_YEARS }, () => emptyCashFlow()),
    currency: 'PKR',
  };
}
