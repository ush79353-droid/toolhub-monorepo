import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { DiscountMode, OfferStatus } from './types';

/** Discount amount from fixed currency or % of FMV. */
export function calculateDesiredDiscountAmount(
  fairMarketValue: number,
  desiredDiscount: number,
  discountMode: DiscountMode
): number | null {
  if (
    !Number.isFinite(fairMarketValue) ||
    fairMarketValue <= 0 ||
    !Number.isFinite(desiredDiscount) ||
    desiredDiscount < 0
  ) {
    return null;
  }
  if (discountMode === 'percentage') {
    if (desiredDiscount > 100) return null;
    const amount = fairMarketValue * (desiredDiscount / 100);
    return Number.isFinite(amount) ? amount : null;
  }
  return desiredDiscount;
}

export function calculateTotalOfferDeductions(
  renovationCost: number,
  discountAmount: number,
  desiredProfit: number
): number | null {
  if (
    !Number.isFinite(renovationCost) ||
    renovationCost < 0 ||
    !Number.isFinite(discountAmount) ||
    discountAmount < 0 ||
    !Number.isFinite(desiredProfit) ||
    desiredProfit < 0
  ) {
    return null;
  }
  const total = renovationCost + discountAmount + desiredProfit;
  return Number.isFinite(total) ? total : null;
}

/**
 * O = FMV − CoR − DD − DP.
 * Signed result is preserved (may be negative).
 */
export function calculateOfferAmount(
  fairMarketValue: number,
  renovationCost: number,
  discountAmount: number,
  desiredProfit: number
): number | null {
  if (
    !Number.isFinite(fairMarketValue) ||
    fairMarketValue <= 0 ||
    !Number.isFinite(renovationCost) ||
    renovationCost < 0 ||
    !Number.isFinite(discountAmount) ||
    discountAmount < 0 ||
    !Number.isFinite(desiredProfit) ||
    desiredProfit < 0
  ) {
    return null;
  }
  const offer =
    fairMarketValue - renovationCost - discountAmount - desiredProfit;
  return Number.isFinite(offer) ? offer : null;
}

export function calculateOfferToValueRatio(
  offerAmount: number,
  fairMarketValue: number
): number | null {
  if (
    !Number.isFinite(offerAmount) ||
    !Number.isFinite(fairMarketValue) ||
    fairMarketValue <= 0
  ) {
    return null;
  }
  const ratio = (offerAmount / fairMarketValue) * 100;
  return Number.isFinite(ratio) ? ratio : null;
}

export function calculateTotalOfferReductionPercentage(
  fairMarketValue: number,
  offerAmount: number
): number | null {
  if (
    !Number.isFinite(fairMarketValue) ||
    fairMarketValue <= 0 ||
    !Number.isFinite(offerAmount)
  ) {
    return null;
  }
  const pct = ((fairMarketValue - offerAmount) / fairMarketValue) * 100;
  return Number.isFinite(pct) ? pct : null;
}

export function validateOfferScenario(rawOfferAmount: number): {
  status: OfferStatus;
  actionableOfferAmount: number | null;
  warningMessage: string | null;
} {
  if (!Number.isFinite(rawOfferAmount)) {
    return {
      status: 'invalid',
      actionableOfferAmount: null,
      warningMessage: 'Offer amount could not be calculated.',
    };
  }
  if (rawOfferAmount < 0) {
    return {
      status: 'negativeOffer',
      actionableOfferAmount: null,
      warningMessage:
        'Deductions exceed fair market value, so the mathematical offer is negative. These assumptions do not support a positive purchase offer.',
    };
  }
  if (rawOfferAmount === 0) {
    return {
      status: 'zeroOffer',
      actionableOfferAmount: null,
      warningMessage:
        'Total deductions equal fair market value, so the calculated offer is zero. Review renovation, discount, and profit assumptions.',
    };
  }
  return {
    status: 'valid',
    actionableOfferAmount: rawOfferAmount,
    warningMessage: null,
  };
}

export function formatOfferMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatOfferPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
