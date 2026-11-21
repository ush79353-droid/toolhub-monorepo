/**
 * Currency carry trade (simple interest), quote convention:
 * S = units of investment currency per 1 unit of funding currency.
 *
 * Spot differential d% = (S0/S1 − 1) × 100
 * Rl = rl × D/B ; Rb = rb × D/B
 * Profit = P × [(S0/S1)×(1+Rl) − (1+Rb)]
 */
import {
  getCurrencyFractionDigits,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { DayCountBasis } from './types';

export interface CarryTradeMathResult {
  spotRateDifferentialPercent: number;
  lendingPeriodReturn: number;
  borrowingPeriodCost: number;
  netInterestDifferential: number;
  investmentProceeds: number;
  borrowingRepayment: number;
  carryTradeProfit: number;
  totalReturn: number;
  approximateReturn: number;
}

export function calculateCarryTrade(
  initialExchangeRate: number,
  settlementExchangeRate: number,
  days: number,
  lendingRateDecimal: number,
  borrowingRateDecimal: number,
  amountInvested: number,
  dayCountBasis: DayCountBasis
): CarryTradeMathResult | null {
  if (
    ![
      initialExchangeRate,
      settlementExchangeRate,
      days,
      lendingRateDecimal,
      borrowingRateDecimal,
      amountInvested,
      dayCountBasis,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (initialExchangeRate <= 0 || settlementExchangeRate <= 0) return null;
  if (days <= 0 || dayCountBasis <= 0) return null;
  if (amountInvested < 0) return null;

  const spotRatio = initialExchangeRate / settlementExchangeRate;
  const spotRateDifferentialPercent = (spotRatio - 1) * 100;
  const lendingPeriodReturn = lendingRateDecimal * (days / dayCountBasis);
  const borrowingPeriodCost = borrowingRateDecimal * (days / dayCountBasis);
  const netInterestDifferential = lendingPeriodReturn - borrowingPeriodCost;

  const investmentProceeds =
    amountInvested * spotRatio * (1 + lendingPeriodReturn);
  const borrowingRepayment = amountInvested * (1 + borrowingPeriodCost);
  const carryTradeProfit = investmentProceeds - borrowingRepayment;
  const totalReturn =
    amountInvested === 0
      ? spotRatio * (1 + lendingPeriodReturn) - (1 + borrowingPeriodCost)
      : carryTradeProfit / amountInvested;
  const approximateReturn =
    spotRateDifferentialPercent / 100 +
    lendingPeriodReturn -
    borrowingPeriodCost;

  if (
    ![
      spotRateDifferentialPercent,
      lendingPeriodReturn,
      borrowingPeriodCost,
      netInterestDifferential,
      investmentProceeds,
      borrowingRepayment,
      carryTradeProfit,
      totalReturn,
      approximateReturn,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  return {
    spotRateDifferentialPercent,
    lendingPeriodReturn,
    borrowingPeriodCost,
    netInterestDifferential,
    investmentProceeds,
    borrowingRepayment,
    carryTradeProfit,
    totalReturn,
    approximateReturn,
  };
}

export function formatCarryMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatCarryMoneySigned(
  amount: number,
  currency: SupportedCurrency
): string {
  const symbol = getCurrencySymbol(currency);
  const body = formatCarryMoney(Math.abs(amount), currency);
  if (amount > 0) return `+${symbol}${body}`;
  if (amount < 0) return `−${symbol}${body}`;
  return `${symbol}${body}`;
}

export function formatCarryPercent(value: number, digits = 2): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Math.abs(value))}%`;
}

export function formatExchangeRate(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(value);
}

export function interpretCarryTrade(
  profit: number,
  totalReturnPercent: number
): string {
  if (!Number.isFinite(profit) || !Number.isFinite(totalReturnPercent)) {
    return 'Carry trade result is unavailable.';
  }
  if (Math.abs(profit) < 1e-9) {
    return 'Under the selected assumptions, estimated carry trade profit is zero — investment proceeds equal the borrowing repayment.';
  }
  if (profit > 0) {
    return 'Under the selected assumptions, the estimated carry trade is profitable after interest differentials and exchange-rate movement. This is an estimate, not a guaranteed trading return.';
  }
  return 'Under the selected assumptions, the estimated carry trade produces a loss — exchange-rate and/or interest effects outweigh the interest advantage. This is an estimate, not a guaranteed trading return.';
}

export function explainCarryTrade(
  profit: number,
  totalReturnPercent: number,
  currency: SupportedCurrency
): string {
  const symbol = getCurrencySymbol(currency);
  return `Estimated carry trade profit is ${formatCarryMoneySigned(profit, currency)} (${formatCarryPercent(totalReturnPercent)}) in ${symbol}-denominated funding-currency units, using manual exchange rates and simple interest on a stated day-count basis. Transaction costs, spreads, leverage, and live FX are not included.`;
}

export const QUOTE_CONVENTION_NOTE =
  'Exchange rates are units of investment currency per one unit of funding currency (S). Spot differential d% = (S₀/S₁ − 1) × 100. Manual rates only — not live market quotes.';
