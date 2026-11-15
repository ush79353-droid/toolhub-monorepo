import type { SupportedCurrency } from '@/tools/shared/currency';

export type RoceMethod = 'assets' | 'equity';

export interface RoceInput {
  method: RoceMethod;
  ebit: string;
  totalAssets: string;
  currentLiabilities: string;
  totalEquity: string;
  nonCurrentLiabilities: string;
  currency: SupportedCurrency;
}

export interface RoceResult {
  method: RoceMethod;
  capitalEmployed: number;
  rocePercent: number;
  currency: SupportedCurrency;
  formattedCapitalEmployed: string;
  formattedRoce: string;
}

export type RoceFieldErrors = {
  ebit?: string;
  totalAssets?: string;
  currentLiabilities?: string;
  totalEquity?: string;
  nonCurrentLiabilities?: string;
  form?: string;
};

export function createDefaultInput(): RoceInput {
  return {
    method: 'assets',
    ebit: '',
    totalAssets: '',
    currentLiabilities: '',
    totalEquity: '',
    nonCurrentLiabilities: '',
    currency: 'PKR',
  };
}
