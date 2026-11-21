import type { SupportedCurrency } from '@/tools/shared/currency';

export type DayCountBasis = 360 | 365;

export interface CarryTradeInput {
  initialExchangeRate: string;
  settlementExchangeRate: string;
  days: string;
  lendingRatePercent: string;
  borrowingRatePercent: string;
  amountInvested: string;
  dayCountBasis: DayCountBasis;
  currency: SupportedCurrency;
}

export interface CarryTradeResult {
  spotRateDifferentialPercent: number;
  lendingPeriodReturnPercent: number;
  borrowingPeriodCostPercent: number;
  netInterestDifferentialPercent: number;
  investmentProceeds: number;
  borrowingRepayment: number;
  carryTradeProfit: number;
  totalReturnPercent: number;
  approximateReturnPercent: number;
  dayCountBasis: DayCountBasis;
  currency: SupportedCurrency;
  formattedSpotRateDifferential: string;
  formattedLendingPeriodReturn: string;
  formattedBorrowingPeriodCost: string;
  formattedNetInterestDifferential: string;
  formattedInvestmentProceeds: string;
  formattedBorrowingRepayment: string;
  formattedCarryTradeProfit: string;
  formattedTotalReturn: string;
  formattedApproximateReturn: string;
  formattedAmountInvested: string;
  interpretation: string;
  explanation: string;
  quoteConventionNote: string;
}

export type CarryTradeFieldErrors = {
  form?: string;
  initialExchangeRate?: string;
  settlementExchangeRate?: string;
  days?: string;
  lendingRatePercent?: string;
  borrowingRatePercent?: string;
  amountInvested?: string;
  dayCountBasis?: string;
};

/** Documented defaults: empty inputs; 365-day basis; denomination PKR (no FX). */
export function createDefaultInput(): CarryTradeInput {
  return {
    initialExchangeRate: '',
    settlementExchangeRate: '',
    days: '',
    lendingRatePercent: '',
    borrowingRatePercent: '',
    amountInvested: '',
    dayCountBasis: 365,
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): CarryTradeInput {
  return {
    initialExchangeRate: '',
    settlementExchangeRate: '',
    days: '',
    lendingRatePercent: '',
    borrowingRatePercent: '',
    amountInvested: '',
    dayCountBasis: 365,
    currency,
  };
}

/** Illustrative worked example from the guide (not live market quotes). */
export function createExampleInput(
  currency: SupportedCurrency = 'PKR'
): CarryTradeInput {
  return {
    initialExchangeRate: '0.85',
    settlementExchangeRate: '0.83',
    days: '180',
    lendingRatePercent: '6',
    borrowingRatePercent: '2',
    amountInvested: '5000',
    dayCountBasis: 365,
    currency,
  };
}
