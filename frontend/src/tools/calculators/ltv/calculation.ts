import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { LtvDriver } from './types';

export function formatLtvMoney(amount: number, currency: SupportedCurrency): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatLtvPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  }).format(value);
}

export interface LtvCanonical {
  purchasePrice: number;
  downPayment: number;
  loanAmount: number;
  ltvPercent: number;
}

/**
 * Resolve LTV triad in one currency.
 * Driver selects which dependent value is authoritative with purchase price.
 */
export function calculateLtvCanonical(input: {
  purchasePrice: number;
  downPayment: number | null;
  loanAmount: number | null;
  ltvPercent: number | null;
  driver: LtvDriver;
}): LtvCanonical | null {
  const { purchasePrice, driver } = input;
  if (!Number.isFinite(purchasePrice) || !(purchasePrice > 0)) return null;

  let down: number;
  let loan: number;
  let ltv: number;

  if (driver === 'downPayment') {
    if (input.downPayment === null || !Number.isFinite(input.downPayment)) return null;
    if (input.downPayment < 0 || input.downPayment > purchasePrice) return null;
    down = input.downPayment;
    loan = purchasePrice - down;
    ltv = (loan / purchasePrice) * 100;
  } else if (driver === 'loanAmount') {
    if (input.loanAmount === null || !Number.isFinite(input.loanAmount)) return null;
    if (input.loanAmount < 0 || input.loanAmount > purchasePrice) return null;
    loan = input.loanAmount;
    down = purchasePrice - loan;
    ltv = (loan / purchasePrice) * 100;
  } else {
    if (input.ltvPercent === null || !Number.isFinite(input.ltvPercent)) return null;
    if (input.ltvPercent < 0 || input.ltvPercent > 100) return null;
    ltv = input.ltvPercent;
    loan = purchasePrice * (ltv / 100);
    down = purchasePrice - loan;
  }

  if (![down, loan, ltv].every(Number.isFinite)) return null;
  if (down < 0 || loan < 0) return null;

  return {
    purchasePrice,
    downPayment: down,
    loanAmount: loan,
    ltvPercent: ltv,
  };
}
