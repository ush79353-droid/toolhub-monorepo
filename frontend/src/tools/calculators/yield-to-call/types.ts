import type { SupportedCurrency } from '@/tools/shared/currency';

export interface YieldToCallInput {
  currency: SupportedCurrency;
  /** Annual coupon / interest payment amount (not a percent). */
  annualInterest: string;
  callPrice: string;
  marketPrice: string;
  yearsUntilCall: string;
}

export type CallPriceRelation = 'discount' | 'par' | 'premium';

export interface YieldToCallResult {
  currency: SupportedCurrency;
  annualInterest: number;
  callPrice: number;
  marketPrice: number;
  yearsUntilCall: number;
  yieldToCallPercent: number;
  currentYieldPercent: number | null;
  totalCouponIncome: number;
  totalCashReceived: number;
  capitalGainOrLoss: number;
  relation: CallPriceRelation;
  formattedAnnualInterest: string;
  formattedCallPrice: string;
  formattedMarketPrice: string;
  formattedYtc: string;
  formattedCurrentYield: string;
  formattedTotalCoupons: string;
  formattedTotalCash: string;
  formattedCapitalGainLoss: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type YieldToCallFieldErrors = {
  form?: string;
  annualInterest?: string;
  callPrice?: string;
  marketPrice?: string;
  yearsUntilCall?: string;
};

export function createDefaultInput(): YieldToCallInput {
  return {
    currency: 'PKR',
    annualInterest: '',
    callPrice: '',
    marketPrice: '',
    yearsUntilCall: '',
  };
}

export function createEmptyInput(): YieldToCallInput {
  return createDefaultInput();
}

/** Reference: C=80, Call=1000, P=950, 5y → YTC ≈ 9.30%. */
export function createExampleInput(): YieldToCallInput {
  return {
    currency: 'USD',
    annualInterest: '80',
    callPrice: '1000',
    marketPrice: '950',
    yearsUntilCall: '5',
  };
}
