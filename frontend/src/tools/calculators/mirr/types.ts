import type { SupportedCurrency } from '@/tools/shared/currency';

export const INITIAL_YEARS = 5;
export const MAX_YEARS = 30;

export interface MirrInput {
  financingRatePercent: string;
  reinvestmentRatePercent: string;
  initialInvestment: string;
  cashFlows: string[];
  currency: SupportedCurrency;
}

export interface MirrResult {
  mirrPercent: number;
  formattedMirr: string;
  yearsUsed: number;
}

export type MirrFieldErrors = {
  financingRatePercent?: string;
  reinvestmentRatePercent?: string;
  initialInvestment?: string;
  form?: string;
  [key: `year${number}`]: string | undefined;
};

export function createDefaultInput(): MirrInput {
  return {
    financingRatePercent: '10',
    reinvestmentRatePercent: '8',
    initialInvestment: '',
    cashFlows: Array.from({ length: INITIAL_YEARS }, () => '0'),
    currency: 'PKR',
  };
}
