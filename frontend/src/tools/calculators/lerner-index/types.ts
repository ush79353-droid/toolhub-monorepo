import type { SupportedCurrency } from '@/tools/shared/currency';

export interface LernerIndexInput {
  price: string;
  marginalCost: string;
  currency: SupportedCurrency;
}

export interface LernerIndexResult {
  price: number;
  marginalCost: number;
  lernerIndex: number;
  currency: SupportedCurrency;
  formattedIndex: string;
}

export type LernerIndexFieldErrors = {
  price?: string;
  marginalCost?: string;
  currency?: string;
  form?: string;
};

export function createDefaultInput(): LernerIndexInput {
  return {
    price: '',
    marginalCost: '',
    currency: 'PKR',
  };
}
