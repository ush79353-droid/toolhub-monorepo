import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { CarAffordabilityResult } from './types';

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

/** Present value of an annuity (maximum loan principal). */
export function calculateMaximumLoanAmount(
  monthlyPayment: number,
  annualInterestRatePercent: number,
  loanTermMonths: number,
): number | null {
  if (
    !Number.isFinite(monthlyPayment) ||
    monthlyPayment < 0 ||
    !Number.isFinite(annualInterestRatePercent) ||
    annualInterestRatePercent < 0 ||
    !Number.isFinite(loanTermMonths) ||
    loanTermMonths <= 0 ||
    !Number.isInteger(loanTermMonths)
  ) {
    return null;
  }
  if (monthlyPayment === 0) return 0;

  const r = annualInterestRatePercent / 100 / 12;
  if (r === 0) return monthlyPayment * loanTermMonths;
  return monthlyPayment * ((1 - (1 + r) ** -loanTermMonths) / r);
}

export function calculateTotalInterest(
  monthlyPayment: number,
  loanTermMonths: number,
  loanAmount: number,
): number | null {
  if (
    ![monthlyPayment, loanTermMonths, loanAmount].every(Number.isFinite) ||
    monthlyPayment < 0 ||
    loanTermMonths <= 0 ||
    loanAmount < 0
  ) {
    return null;
  }
  return Math.max(0, monthlyPayment * loanTermMonths - loanAmount);
}

/**
 * Maximum sticker price so loan + cash + trade-in covers price + % tax + fixed fees.
 * Basic mode: taxRate=0, fixedFees=0 → price = budget.
 */
export function calculateMaximumCarPrice(
  totalBudget: number,
  salesTaxRateDecimal: number,
  fixedFees: number,
): number | null {
  if (
    !Number.isFinite(totalBudget) ||
    !Number.isFinite(salesTaxRateDecimal) ||
    !Number.isFinite(fixedFees) ||
    salesTaxRateDecimal < 0 ||
    fixedFees < 0
  ) {
    return null;
  }
  const denom = 1 + salesTaxRateDecimal;
  if (!(denom > 0)) return null;
  const price = (totalBudget - fixedFees) / denom;
  if (!Number.isFinite(price)) return null;
  return Math.max(0, price);
}

export function calculateCarAffordability(input: {
  monthlyPayment: number;
  availableMoney: number;
  tradeInValue: number;
  annualInterestRate: number;
  loanTermMonths: number;
  includeAdditionalCosts: boolean;
  salesTaxRatePercent: number;
  dealerFees: number;
  registrationFees: number;
  otherUpfrontCosts: number;
  /** When set, replaces availableMoney as cash contribution (no double-count). */
  downPayment: number | null;
  currency: SupportedCurrency;
}): CarAffordabilityResult | null {
  const loanRaw = calculateMaximumLoanAmount(
    input.monthlyPayment,
    input.annualInterestRate,
    input.loanTermMonths,
  );
  if (loanRaw === null) return null;

  const usedDownPaymentAllocation =
    input.includeAdditionalCosts &&
    input.downPayment !== null &&
    Number.isFinite(input.downPayment);

  const cashContribution = usedDownPaymentAllocation
    ? (input.downPayment as number)
    : input.availableMoney;

  if (!(cashContribution >= 0) || !(input.tradeInValue >= 0)) return null;

  const loanAmount = roundMoney(loanRaw, input.currency);
  const totalBudget = loanAmount + cashContribution + input.tradeInValue;

  const taxRate = input.includeAdditionalCosts
    ? input.salesTaxRatePercent / 100
    : 0;
  const fixedFees = input.includeAdditionalCosts
    ? input.dealerFees + input.registrationFees + input.otherUpfrontCosts
    : 0;

  if (taxRate < 0 || fixedFees < 0) return null;

  const maxPriceRaw = calculateMaximumCarPrice(totalBudget, taxRate, fixedFees);
  if (maxPriceRaw === null) return null;

  const maximumCarValue = roundMoney(maxPriceRaw, input.currency);
  const salesTaxAmount = roundMoney(maximumCarValue * taxRate, input.currency);
  const totalUpfrontCosts = roundMoney(salesTaxAmount + fixedFees, input.currency);
  const totalPurchaseCost = roundMoney(
    maximumCarValue + totalUpfrontCosts,
    input.currency,
  );

  const interestRaw = calculateTotalInterest(
    input.monthlyPayment,
    input.loanTermMonths,
    loanAmount,
  );
  if (interestRaw === null) return null;

  const totalLoanPayments = roundMoney(
    input.monthlyPayment * input.loanTermMonths,
    input.currency,
  );

  return {
    monthlyPayment: roundMoney(input.monthlyPayment, input.currency),
    loanAmount,
    totalLoanPayments,
    totalInterestPaid: roundMoney(interestRaw, input.currency),
    availableMoney: roundMoney(input.availableMoney, input.currency),
    cashContribution: roundMoney(cashContribution, input.currency),
    tradeInValue: roundMoney(input.tradeInValue, input.currency),
    totalUpfrontCosts,
    salesTaxAmount,
    maximumCarValue,
    totalPurchaseCost,
    loanTermMonths: input.loanTermMonths,
    monthlyInterestRate: input.annualInterestRate / 100 / 12,
    annualInterestRate: input.annualInterestRate,
    usedDownPaymentAllocation,
    currency: input.currency,
  };
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

export function shareCarAffordabilityText(result: CarAffordabilityResult): string {
  const lines = [
    'Car Affordability Calculator | Omega Calculators',
    `Monthly payment: ${formatMoney(result.monthlyPayment, result.currency)}`,
    `Cash toward purchase: ${formatMoney(result.cashContribution, result.currency)}`,
    `Trade-in: ${formatMoney(result.tradeInValue, result.currency)}`,
    `Interest rate: ${result.annualInterestRate}%`,
    `Loan term: ${result.loanTermMonths} months`,
    `Maximum car value: ${formatMoney(result.maximumCarValue, result.currency)}`,
    `Loan amount: ${formatMoney(result.loanAmount, result.currency)}`,
    `Interest paid: ${formatMoney(result.totalInterestPaid, result.currency)}`,
  ];
  if (result.totalUpfrontCosts > 0) {
    lines.push(
      `Upfront tax & fees: ${formatMoney(result.totalUpfrontCosts, result.currency)}`,
    );
  }
  return lines.join('\n');
}
