import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { CostFrequency, DurationUnit } from './types';

/**
 * Omni-style rent vs buy (screenshot fields).
 *
 * Rent: total = rent payments + agent + other − deposit interest on "money you have".
 * Buy: total = down payment + buying commission + mortgage payments + other fees
 *      + realtor commission + mortgage left − future property value.
 * Negative total buy cost means buying earns over the staying period.
 */

export function durationToMonths(
  amount: number,
  unit: DurationUnit
): number | null {
  if (!Number.isFinite(amount) || amount < 0) return null;
  if (unit === 'years') return amount * 12;
  return amount;
}

export function toMonthlyRent(
  amount: number,
  frequency: CostFrequency
): number | null {
  if (!Number.isFinite(amount) || amount < 0) return null;
  switch (frequency) {
    case 'week':
      return (amount * 52) / 12;
    case 'month':
      return amount;
    case 'year':
      return amount / 12;
    default:
      return null;
  }
}

export function fromMonthlyCost(
  monthly: number,
  frequency: CostFrequency
): number | null {
  if (!Number.isFinite(monthly)) return null;
  switch (frequency) {
    case 'week':
      return (monthly * 12) / 52;
    case 'month':
      return monthly;
    case 'year':
      return monthly * 12;
    default:
      return null;
  }
}

export function amortizingPayment(
  principal: number,
  monthlyRate: number,
  termMonths: number
): number | null {
  if (![principal, monthlyRate, termMonths].every(Number.isFinite)) return null;
  if (!(principal > 0) || !(termMonths > 0) || monthlyRate < 0) return null;
  if (monthlyRate === 0) {
    const m = principal / termMonths;
    return Number.isFinite(m) ? m : null;
  }
  const growth = Math.pow(1 + monthlyRate, termMonths);
  if (!Number.isFinite(growth) || growth === 0) return null;
  const m = (principal * monthlyRate) / (1 - 1 / growth);
  return Number.isFinite(m) ? m : null;
}

export function remainingBalanceAfterPayments(input: {
  principal: number;
  monthlyRate: number;
  termMonths: number;
  elapsedMonths: number;
  monthlyPayment: number;
}): number | null {
  const { principal, monthlyRate, termMonths, elapsedMonths, monthlyPayment } =
    input;
  if (
    ![principal, monthlyRate, termMonths, elapsedMonths, monthlyPayment].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (!(principal >= 0) || !(termMonths > 0) || monthlyRate < 0) return null;
  if (elapsedMonths < 0 || !(monthlyPayment >= 0)) return null;
  if (principal === 0) return 0;
  if (elapsedMonths === 0) return principal;
  if (elapsedMonths >= termMonths) return 0;

  let balance: number;
  if (monthlyRate === 0) {
    balance = principal * (1 - elapsedMonths / termMonths);
  } else {
    const growth = Math.pow(1 + monthlyRate, elapsedMonths);
    if (!Number.isFinite(growth)) return null;
    balance =
      principal * growth - monthlyPayment * ((growth - 1) / monthlyRate);
  }
  if (!Number.isFinite(balance)) return null;
  if (Math.abs(balance) < 1e-9) return 0;
  if (balance < 0) return 0;
  return balance;
}

/** Compound monthly interest earned on a deposit over n months. */
export function depositInterestEarned(
  principal: number,
  annualPercent: number,
  months: number
): number | null {
  if (![principal, annualPercent, months].every(Number.isFinite)) return null;
  if (principal < 0 || annualPercent < 0 || months < 0) return null;
  if (months === 0 || principal === 0) return 0;
  const r = annualPercent / 100 / 12;
  const interest = principal * (Math.pow(1 + r, months) - 1);
  return Number.isFinite(interest) ? interest : null;
}

export function calculateRentVsBuy(input: {
  stayingMonths: number;
  moneyYouHave: number;
  monthlyRent: number;
  agentCommission: number;
  otherRentCosts: number;
  depositInterestPercent: number;
  propertyCost: number;
  mortgageRatePercent: number;
  loanTermMonths: number;
  buyingCommissionPercent: number;
  sellingCommissionPercent: number;
  otherFeesPercent: number;
  appreciationPercent: number;
}): {
  depositInterestEarned: number;
  totalRentCost: number;
  rentCostMonthly: number;
  loanAmount: number;
  monthlyMortgagePayment: number;
  mortgageLeft: number;
  futurePropertyValue: number;
  buyingCommissionAmount: number;
  sellingCommissionAmount: number;
  otherFeesTotal: number;
  totalMortgagePayments: number;
  totalBuyCost: number;
  buyCostMonthly: number;
} | null {
  const {
    stayingMonths,
    moneyYouHave,
    monthlyRent,
    agentCommission,
    otherRentCosts,
    depositInterestPercent,
    propertyCost,
    mortgageRatePercent,
    loanTermMonths,
    buyingCommissionPercent,
    sellingCommissionPercent,
    otherFeesPercent,
    appreciationPercent,
  } = input;

  if (
    ![
      stayingMonths,
      moneyYouHave,
      monthlyRent,
      agentCommission,
      otherRentCosts,
      depositInterestPercent,
      propertyCost,
      mortgageRatePercent,
      loanTermMonths,
      buyingCommissionPercent,
      sellingCommissionPercent,
      otherFeesPercent,
      appreciationPercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(stayingMonths > 0)) return null;
  if (
    moneyYouHave < 0 ||
    monthlyRent < 0 ||
    agentCommission < 0 ||
    otherRentCosts < 0 ||
    propertyCost < 0
  ) {
    return null;
  }
  if (
    depositInterestPercent < 0 ||
    mortgageRatePercent < 0 ||
    buyingCommissionPercent < 0 ||
    sellingCommissionPercent < 0 ||
    otherFeesPercent < 0
  ) {
    return null;
  }
  if (!(loanTermMonths > 0)) return null;

  const interest = depositInterestEarned(
    moneyYouHave,
    depositInterestPercent,
    stayingMonths
  );
  if (interest === null) return null;

  const totalRentPayments = monthlyRent * stayingMonths;
  const totalRentCost =
    totalRentPayments + agentCommission + otherRentCosts - interest;
  if (!Number.isFinite(totalRentCost)) return null;
  const rentCostMonthly = totalRentCost / stayingMonths;
  if (!Number.isFinite(rentCostMonthly)) return null;

  const downPayment = Math.min(moneyYouHave, propertyCost);
  const loanAmount = Math.max(0, propertyCost - downPayment);
  const buyingCommissionAmount =
    (propertyCost * buyingCommissionPercent) / 100;
  if (!Number.isFinite(buyingCommissionAmount)) return null;

  const monthlyRate = mortgageRatePercent / 100 / 12;
  let monthlyMortgagePayment = 0;
  let mortgageLeft = 0;
  let totalMortgagePayments = 0;

  if (loanAmount > 0) {
    const payment = amortizingPayment(loanAmount, monthlyRate, loanTermMonths);
    if (payment === null) return null;
    monthlyMortgagePayment = payment;
    const paidMonths = Math.min(stayingMonths, loanTermMonths);
    totalMortgagePayments = payment * paidMonths;
    const left = remainingBalanceAfterPayments({
      principal: loanAmount,
      monthlyRate,
      termMonths: loanTermMonths,
      elapsedMonths: paidMonths,
      monthlyPayment: payment,
    });
    if (left === null) return null;
    mortgageLeft = left;
  }

  const years = stayingMonths / 12;
  const futurePropertyValue =
    propertyCost * Math.pow(1 + appreciationPercent / 100, years);
  if (!Number.isFinite(futurePropertyValue)) return null;

  const sellingCommissionAmount =
    (futurePropertyValue * sellingCommissionPercent) / 100;
  if (!Number.isFinite(sellingCommissionAmount)) return null;

  const otherFeesTotal =
    ((propertyCost * otherFeesPercent) / 100) * years;
  if (!Number.isFinite(otherFeesTotal)) return null;

  /**
   * Omni: payments during stay + unpaid mortgage − ending property value.
   * Buying/realtor commissions and ownership fees are included as payments;
   * down payment is the cash used at purchase (not double-counted with loan).
   */
  const totalBuyCost =
    downPayment +
    buyingCommissionAmount +
    totalMortgagePayments +
    otherFeesTotal +
    sellingCommissionAmount +
    mortgageLeft -
    futurePropertyValue;
  if (!Number.isFinite(totalBuyCost)) return null;

  const buyCostMonthly = totalBuyCost / stayingMonths;
  if (!Number.isFinite(buyCostMonthly)) return null;

  return {
    depositInterestEarned: interest,
    totalRentCost,
    rentCostMonthly,
    loanAmount,
    monthlyMortgagePayment,
    mortgageLeft,
    futurePropertyValue,
    buyingCommissionAmount,
    sellingCommissionAmount,
    otherFeesTotal,
    totalMortgagePayments,
    totalBuyCost,
    buyCostMonthly,
  };
}

export function formatRentVsBuyMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
