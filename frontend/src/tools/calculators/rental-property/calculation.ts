import {
  calculateCapRate,
  toAnnualIncome,
} from '@/tools/calculators/cap-rate/calculation';
import {
  calculateAnnualCashFlow,
  calculateAnnualDebtService,
  calculateCashOnCashReturn,
  calculateEffectiveRentalIncome,
  calculateNetOperatingIncome,
  calculateVacancyLoss,
} from '@/tools/calculators/cash-on-cash-return/calculation';
import {
  calculateDownPaymentAmount,
  calculateDownPaymentPercentage,
  calculateMortgageAmount,
} from '@/tools/calculators/pmi/calculation';
import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  calculateMonthlyMortgagePayment,
  calculateOutstandingLoanBalance,
  calculateTotalMortgagePayments,
  durationToMonths,
} from '@/tools/shared/mortgage';
import type { MoneyPeriod } from './types';

export {
  calculateCapRate,
  calculateAnnualCashFlow,
  calculateAnnualDebtService,
  calculateCashOnCashReturn,
  calculateDownPaymentAmount,
  calculateDownPaymentPercentage,
  calculateEffectiveRentalIncome,
  calculateMonthlyMortgagePayment,
  calculateMortgageAmount,
  calculateNetOperatingIncome,
  calculateOutstandingLoanBalance,
  calculateTotalMortgagePayments,
  calculateVacancyLoss,
  durationToMonths,
  toAnnualIncome,
};

export function toAnnualExpense(
  amount: number,
  period: MoneyPeriod
): number | null {
  if (!Number.isFinite(amount) || amount < 0) return null;
  return period === 'monthly' ? amount * 12 : amount;
}

/** Preserve economic amount when switching monthly ↔ annual presentation. */
export function convertMoneyPeriodDisplay(
  amount: number,
  from: MoneyPeriod,
  to: MoneyPeriod
): number {
  if (!Number.isFinite(amount) || from === to) return amount;
  const annual = from === 'monthly' ? amount * 12 : amount;
  return to === 'monthly' ? annual / 12 : annual;
}

export function calculateManagementFee(
  effectiveAnnualRental: number,
  managementFeePercent: number
): number | null {
  if (
    !Number.isFinite(effectiveAnnualRental) ||
    !Number.isFinite(managementFeePercent) ||
    effectiveAnnualRental < 0 ||
    managementFeePercent < 0 ||
    managementFeePercent > 100
  ) {
    return null;
  }
  const fee = effectiveAnnualRental * (managementFeePercent / 100);
  return Number.isFinite(fee) ? fee : null;
}

export function calculateAnnualOperatingExpenses(parts: {
  propertyTax: number;
  insurance: number;
  maintenance: number;
  hoa: number;
  other: number;
  managementFee: number;
}): number | null {
  const values = Object.values(parts);
  if (values.some((v) => !Number.isFinite(v) || v < 0)) return null;
  const total = values.reduce((sum, v) => sum + v, 0);
  return Number.isFinite(total) ? total : null;
}

export function calculateProjectedSellingPrice(
  purchasePrice: number,
  annualAppreciationPercent: number,
  holdingYears: number
): number | null {
  if (
    !Number.isFinite(purchasePrice) ||
    purchasePrice < 0 ||
    !Number.isFinite(annualAppreciationPercent) ||
    annualAppreciationPercent <= -100 ||
    !Number.isFinite(holdingYears) ||
    holdingYears < 0
  ) {
    return null;
  }
  const factor = (1 + annualAppreciationPercent / 100) ** holdingYears;
  if (!Number.isFinite(factor)) return null;
  const price = purchasePrice * factor;
  return Number.isFinite(price) ? price : null;
}

export function calculateSellingCosts(
  sellingPrice: number,
  sellingCostPercent: number,
  fixedSellingCosts: number
): number | null {
  if (
    !Number.isFinite(sellingPrice) ||
    sellingPrice < 0 ||
    !Number.isFinite(sellingCostPercent) ||
    sellingCostPercent < 0 ||
    !Number.isFinite(fixedSellingCosts) ||
    fixedSellingCosts < 0
  ) {
    return null;
  }
  const costs = sellingPrice * (sellingCostPercent / 100) + fixedSellingCosts;
  return Number.isFinite(costs) ? costs : null;
}

export function calculateNetSaleProceeds(
  sellingPrice: number,
  sellingCosts: number,
  outstandingLoanBalance: number
): number | null {
  if (
    !Number.isFinite(sellingPrice) ||
    !Number.isFinite(sellingCosts) ||
    !Number.isFinite(outstandingLoanBalance) ||
    outstandingLoanBalance < 0
  ) {
    return null;
  }
  const net = sellingPrice - sellingCosts - outstandingLoanBalance;
  return Number.isFinite(net) ? net : null;
}

export function calculateInitialCashInvestment(
  downPayment: number,
  closingCosts: number,
  renovationCosts: number,
  otherInitialCosts: number
): number | null {
  const parts = [downPayment, closingCosts, renovationCosts, otherInitialCosts];
  if (parts.some((v) => !Number.isFinite(v) || v < 0)) return null;
  const total = parts.reduce((sum, v) => sum + v, 0);
  return Number.isFinite(total) ? total : null;
}

/**
 * Cumulative operating cash flow over the holding period with constant
 * rent/expenses. Mortgage P&I stops after the loan term.
 */
export function calculateHoldingPeriodCashFlow(
  annualEffectiveIncome: number,
  annualOperatingExpenses: number,
  monthlyMortgagePayment: number,
  loanTermMonths: number,
  holdingPeriodMonths: number
): number | null {
  if (
    !Number.isFinite(annualEffectiveIncome) ||
    !Number.isFinite(annualOperatingExpenses) ||
    !Number.isFinite(monthlyMortgagePayment) ||
    monthlyMortgagePayment < 0 ||
    !Number.isFinite(loanTermMonths) ||
    loanTermMonths < 0 ||
    !Number.isFinite(holdingPeriodMonths) ||
    holdingPeriodMonths < 0
  ) {
    return null;
  }
  if (holdingPeriodMonths === 0) return 0;

  const monthlyIncome = annualEffectiveIncome / 12;
  const monthlyOpEx = annualOperatingExpenses / 12;
  const monthsWithDebt = Math.min(holdingPeriodMonths, loanTermMonths);
  const monthsWithoutDebt = Math.max(0, holdingPeriodMonths - loanTermMonths);

  const withDebt =
    monthsWithDebt * (monthlyIncome - monthlyOpEx - monthlyMortgagePayment);
  const withoutDebt = monthsWithoutDebt * (monthlyIncome - monthlyOpEx);
  const total = withDebt + withoutDebt;
  return Number.isFinite(total) ? total : null;
}

export function calculateTotalInvestmentRoi(
  totalInvestmentProfit: number,
  initialCashInvestment: number
): number | null {
  if (
    !Number.isFinite(totalInvestmentProfit) ||
    !Number.isFinite(initialCashInvestment)
  ) {
    return null;
  }
  if (initialCashInvestment <= 0) return null;
  const roi = (totalInvestmentProfit / initialCashInvestment) * 100;
  return Number.isFinite(roi) ? roi : null;
}

export function formatRentalMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatRentalPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
