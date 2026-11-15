import type { SupportedCurrency } from '@/tools/shared/currency';

export interface ProfitabilityIndexInput {
  initialInvestment: string;
  pvFutureCashFlow: string;
  pvUnknown: boolean;
  currency: SupportedCurrency;
}

export interface ProfitabilityIndexResult {
  initialInvestment: number;
  pvFutureCashFlow: number;
  pi: number;
  piDisplay: string;
  interpretation: string;
  currency: SupportedCurrency;
}

export type ProfitabilityIndexFieldErrors = {
  initialInvestment?: string;
  pvFutureCashFlow?: string;
  form?: string;
};

export function createDefaultInput(): ProfitabilityIndexInput {
  return {
    initialInvestment: '',
    pvFutureCashFlow: '',
    pvUnknown: false,
    currency: 'PKR',
  };
}
