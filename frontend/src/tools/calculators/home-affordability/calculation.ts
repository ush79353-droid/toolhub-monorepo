import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { BindingLimit, HomeAffordabilityResult } from './types';

const PRICE_TOLERANCE = 0.01;
const MAX_BINARY_ITERATIONS = 80;

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

/** Numeric formatting only — UI prepends the currency symbol. */
export function formatHomeMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Monthly interest rate from nominal annual percent. */
export function monthlyInterestRate(annualPercent: number): number {
  return annualPercent / 100 / 12;
}

export function loanTermToMonths(
  value: number,
  unit: 'years' | 'months'
): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  const months = unit === 'years' ? value * 12 : value;
  if (!Number.isFinite(months) || months <= 0) return null;
  return months;
}

/** Factor k such that M = L × k. Handles zero interest. */
export function mortgagePaymentFactor(
  annualInterestRatePercent: number,
  termMonths: number
): number | null {
  if (
    !Number.isFinite(annualInterestRatePercent) ||
    annualInterestRatePercent < 0 ||
    !Number.isFinite(termMonths) ||
    termMonths <= 0
  ) {
    return null;
  }
  const r = monthlyInterestRate(annualInterestRatePercent);
  if (r === 0) return 1 / termMonths;
  const growth = (1 + r) ** termMonths;
  const denom = growth - 1;
  if (!(denom > 0) || !Number.isFinite(growth)) return null;
  return (r * growth) / denom;
}

export function calculateMonthlyMortgagePayment(
  loanPrincipal: number,
  annualInterestRatePercent: number,
  termMonths: number
): number | null {
  if (
    !Number.isFinite(loanPrincipal) ||
    loanPrincipal < 0 ||
    !Number.isFinite(annualInterestRatePercent) ||
    annualInterestRatePercent < 0 ||
    !Number.isFinite(termMonths) ||
    termMonths <= 0
  ) {
    return null;
  }
  if (loanPrincipal === 0) return 0;
  const k = mortgagePaymentFactor(annualInterestRatePercent, termMonths);
  if (k === null) return null;
  const payment = loanPrincipal * k;
  return Number.isFinite(payment) ? payment : null;
}

export function calculateMaximumLoanPrincipal(
  monthlyPrincipalAndInterest: number,
  annualInterestRatePercent: number,
  termMonths: number
): number | null {
  if (
    !Number.isFinite(monthlyPrincipalAndInterest) ||
    monthlyPrincipalAndInterest < 0 ||
    !Number.isFinite(annualInterestRatePercent) ||
    annualInterestRatePercent < 0 ||
    !Number.isFinite(termMonths) ||
    termMonths <= 0
  ) {
    return null;
  }
  if (monthlyPrincipalAndInterest === 0) return 0;
  const r = monthlyInterestRate(annualInterestRatePercent);
  if (r === 0) return monthlyPrincipalAndInterest * termMonths;
  const loan =
    monthlyPrincipalAndInterest * ((1 - (1 + r) ** -termMonths) / r);
  return Number.isFinite(loan) ? loan : null;
}

export function calculateMonthlyIncome(
  income: number,
  period: 'annual' | 'monthly'
): number {
  return period === 'annual' ? income / 12 : income;
}

export function calculateFrontEndDTILimit(
  monthlyIncome: number,
  frontEndPercent: number
): number {
  return monthlyIncome * (frontEndPercent / 100);
}

export function calculateBackEndDTILimit(
  monthlyIncome: number,
  backEndPercent: number,
  monthlyDebt: number
): number {
  return monthlyIncome * (backEndPercent / 100) - monthlyDebt;
}

export function calculateMaximumHousingBudget(
  frontEndLimit: number,
  backEndLimit: number
): { budget: number; binding: BindingLimit } {
  if (frontEndLimit < backEndLimit) {
    return { budget: frontEndLimit, binding: 'front' };
  }
  if (backEndLimit < frontEndLimit) {
    return { budget: backEndLimit, binding: 'back' };
  }
  return { budget: frontEndLimit, binding: 'tie' };
}

export function calculateMonthlyPropertyTax(
  homePrice: number,
  annualTaxRatePercent: number
): number {
  return (homePrice * (annualTaxRatePercent / 100)) / 12;
}

export function calculateMonthlyInsurance(annualInsurance: number): number {
  return annualInsurance / 12;
}

export function calculateMonthlyMortgageInsurance(
  loanPrincipal: number,
  annualMiRatePercent: number
): number {
  return (loanPrincipal * (annualMiRatePercent / 100)) / 12;
}

export function calculateTotalHousingPayment(parts: {
  principalAndInterest: number;
  propertyTax: number;
  insurance: number;
  hoa: number;
  mortgageInsurance: number;
}): number {
  return (
    parts.principalAndInterest +
    parts.propertyTax +
    parts.insurance +
    parts.hoa +
    parts.mortgageInsurance
  );
}

export function calculateFrontEndDTI(
  totalHousingPayment: number,
  monthlyIncome: number
): number | null {
  if (!(monthlyIncome > 0)) return null;
  return (totalHousingPayment / monthlyIncome) * 100;
}

export function calculateBackEndDTI(
  totalHousingPayment: number,
  monthlyDebt: number,
  monthlyIncome: number
): number | null {
  if (!(monthlyIncome > 0)) return null;
  return ((totalHousingPayment + monthlyDebt) / monthlyIncome) * 100;
}

export interface AffordabilitySolveInput {
  maximumHousingBudget: number;
  annualInterestRatePercent: number;
  termMonths: number;
  downPaymentMode: 'amount' | 'percent';
  downPaymentAmount: number;
  downPaymentPercent: number;
  annualPropertyTaxRatePercent: number;
  annualHomeownersInsurance: number;
  monthlyHoa: number;
  annualMortgageInsuranceRatePercent: number;
  closingCostMode: 'none' | 'amount' | 'percent';
  closingCostAmount: number;
  closingCostPercent: number;
  currency: SupportedCurrency;
  bindingLimit: BindingLimit;
  monthlyIncome: number | null;
  monthlyDebt: number;
}

export type AffordabilitySolveOutcome =
  | { ok: true; result: HomeAffordabilityResult }
  | { ok: false; reason: string };

function housingPaymentAtPrice(
  homePrice: number,
  input: AffordabilitySolveInput,
  paymentFactor: number
): {
  loan: number;
  downPayment: number;
  pi: number;
  tax: number;
  insurance: number;
  hoa: number;
  mi: number;
  total: number;
} | null {
  if (!(homePrice >= 0) || !Number.isFinite(homePrice)) return null;

  let downPayment: number;
  let loan: number;
  if (input.downPaymentMode === 'percent') {
    downPayment = homePrice * (input.downPaymentPercent / 100);
    loan = homePrice - downPayment;
  } else {
    downPayment = Math.min(input.downPaymentAmount, homePrice);
    loan = Math.max(0, homePrice - input.downPaymentAmount);
  }

  if (!(loan >= 0) || !Number.isFinite(loan) || !Number.isFinite(downPayment)) {
    return null;
  }

  const pi = loan * paymentFactor;
  const tax = calculateMonthlyPropertyTax(
    homePrice,
    input.annualPropertyTaxRatePercent
  );
  const insurance = calculateMonthlyInsurance(input.annualHomeownersInsurance);
  const hoa = input.monthlyHoa;
  const mi = calculateMonthlyMortgageInsurance(
    loan,
    input.annualMortgageInsuranceRatePercent
  );
  const total = calculateTotalHousingPayment({
    principalAndInterest: pi,
    propertyTax: tax,
    insurance,
    hoa,
    mortgageInsurance: mi,
  });

  if (![pi, tax, insurance, hoa, mi, total].every(Number.isFinite)) return null;
  return { loan, downPayment, pi, tax, insurance, hoa, mi, total };
}

/**
 * Solve max home price so total monthly housing payment ≤ budget.
 * Uses exact algebra when assumptions allow; binary search otherwise.
 */
export function solveAffordableHomePrice(
  input: AffordabilitySolveInput
): AffordabilitySolveOutcome {
  const budget = input.maximumHousingBudget;
  if (!Number.isFinite(budget)) {
    return { ok: false, reason: 'Housing budget is invalid.' };
  }

  const factor = mortgagePaymentFactor(
    input.annualInterestRatePercent,
    input.termMonths
  );
  if (factor === null) {
    return { ok: false, reason: 'Unable to compute mortgage payment factor.' };
  }

  const a =
    factor + input.annualMortgageInsuranceRatePercent / 100 / 12;
  const b = input.annualPropertyTaxRatePercent / 100 / 12;
  const fixed =
    calculateMonthlyInsurance(input.annualHomeownersInsurance) +
    input.monthlyHoa;

  if (!(a >= 0) || !(b >= 0) || !(fixed >= 0)) {
    return { ok: false, reason: 'Housing cost assumptions are invalid.' };
  }

  if (budget < fixed - PRICE_TOLERANCE) {
    return {
      ok: false,
      reason:
        'Fixed monthly insurance and HOA fees already exceed the housing budget, so no affordable financed home price exists under these assumptions.',
    };
  }

  let priceRaw: number | null = null;

  if (input.downPaymentMode === 'percent') {
    const d = input.downPaymentPercent / 100;
    if (!(d >= 0) || d > 1) {
      return { ok: false, reason: 'Down payment percent must be between 0 and 100.' };
    }
    const denom = (1 - d) * a + b;
    if (!(denom > 0)) {
      // All-cash style (100% down) with optional tax only.
      if (d >= 1) {
        if (b > 0) {
          priceRaw = (budget - fixed) / b;
        } else if (budget + PRICE_TOLERANCE >= fixed) {
          // No payment constraint besides fixed costs; no unique price — use 0 loan unlimited is invalid.
          return {
            ok: false,
            reason:
              'With 100% down and no property tax rate, home price is not constrained by the monthly housing budget.',
          };
        } else {
          return {
            ok: false,
            reason: 'Fixed expenses exceed the housing budget.',
          };
        }
      } else {
        return { ok: false, reason: 'Unable to solve for home price with these rates.' };
      }
    } else {
      priceRaw = (budget - fixed) / denom;
    }
  } else {
    const D = input.downPaymentAmount;
    const denom = a + b;
    if (!(denom > 0)) {
      return { ok: false, reason: 'Unable to solve for home price with these rates.' };
    }
    // Financed solution assuming price ≥ D.
    priceRaw = (budget + D * a - fixed) / denom;

    // If solved price is below down payment, loan would be negative — try cash-only up to D.
    if (priceRaw !== null && priceRaw < D - PRICE_TOLERANCE) {
      if (b > 0) {
        const cashPrice = (budget - fixed) / b;
        priceRaw = Math.min(D, Math.max(0, cashPrice));
      } else if (budget + PRICE_TOLERANCE >= fixed) {
        priceRaw = D;
      } else {
        return {
          ok: false,
          reason: 'Fixed expenses exceed the housing budget.',
        };
      }
    }
  }

  if (priceRaw === null || !Number.isFinite(priceRaw) || priceRaw < 0) {
    return {
      ok: false,
      reason: 'No positive affordable home price exists under the selected assumptions.',
    };
  }

  // Refine with binary search for floating-point safety / monotonic check.
  let low = 0;
  let high = Math.max(priceRaw * 1.5, priceRaw + 1, 1);
  let best = 0;
  const probe = housingPaymentAtPrice(0, input, factor);
  if (probe && probe.total <= budget + PRICE_TOLERANCE) best = 0;

  // Expand upper bound until payment exceeds budget or cap.
  for (let i = 0; i < 40; i += 1) {
    const atHigh = housingPaymentAtPrice(high, input, factor);
    if (!atHigh) break;
    if (atHigh.total > budget + PRICE_TOLERANCE) break;
    best = high;
    high *= 2;
    if (high > 1e15) break;
  }

  for (let i = 0; i < MAX_BINARY_ITERATIONS; i += 1) {
    const mid = (low + high) / 2;
    const atMid = housingPaymentAtPrice(mid, input, factor);
    if (!atMid) {
      high = mid;
      continue;
    }
    if (atMid.total <= budget + PRICE_TOLERANCE) {
      best = mid;
      low = mid;
    } else {
      high = mid;
    }
    if (high - low < PRICE_TOLERANCE) break;
  }

  // Prefer algebraic when close; otherwise binary best.
  const algebraic = housingPaymentAtPrice(priceRaw, input, factor);
  let chosenPrice = best;
  if (
    algebraic &&
    algebraic.total <= budget + PRICE_TOLERANCE &&
    Math.abs(algebraic.total - budget) <= Math.abs(
      (housingPaymentAtPrice(best, input, factor)?.total ?? Infinity) - budget
    ) + PRICE_TOLERANCE
  ) {
    chosenPrice = Math.max(best, priceRaw);
    // Clamp to budget with a tiny nudge if overshooting.
    const check = housingPaymentAtPrice(chosenPrice, input, factor);
    if (check && check.total > budget + PRICE_TOLERANCE) {
      chosenPrice = best;
    }
  }

  const breakdown = housingPaymentAtPrice(chosenPrice, input, factor);
  if (!breakdown || chosenPrice < 0) {
    return {
      ok: false,
      reason: 'No positive affordable home price exists under the selected assumptions.',
    };
  }

  if (breakdown.total > budget + 1) {
    return {
      ok: false,
      reason:
        'Could not find a home price whose total housing payment stays within the budget.',
    };
  }

  let closing = 0;
  if (input.closingCostMode === 'amount') {
    closing = input.closingCostAmount;
  } else if (input.closingCostMode === 'percent') {
    closing = chosenPrice * (input.closingCostPercent / 100);
  }

  const currency = input.currency;
  const homePrice = roundMoney(chosenPrice, currency);
  const loanAmount = roundMoney(breakdown.loan, currency);
  const downPayment = roundMoney(breakdown.downPayment, currency);
  const monthlyPi = roundMoney(breakdown.pi, currency);
  const monthlyTax = roundMoney(breakdown.tax, currency);
  const monthlyIns = roundMoney(breakdown.insurance, currency);
  const monthlyHoa = roundMoney(breakdown.hoa, currency);
  const monthlyMi = roundMoney(breakdown.mi, currency);
  const totalHousing = roundMoney(breakdown.total, currency);
  const budgetRounded = roundMoney(budget, currency);
  const closingRounded = roundMoney(closing, currency);
  const cashAtClosing = roundMoney(downPayment + closing, currency);

  const frontEndDti =
    input.monthlyIncome !== null
      ? calculateFrontEndDTI(totalHousing, input.monthlyIncome)
      : null;
  const backEndDti =
    input.monthlyIncome !== null
      ? calculateBackEndDTI(totalHousing, input.monthlyDebt, input.monthlyIncome)
      : null;

  let warning: string | null = null;
  if (loanAmount === 0 && homePrice > 0) {
    warning =
      'This estimate is an all-cash (or fully covered) purchase under the current down-payment assumption; no mortgage principal is required.';
  }

  const result: HomeAffordabilityResult = {
    affordableHomePrice: homePrice,
    loanAmount,
    downPayment,
    monthlyPrincipalAndInterest: monthlyPi,
    monthlyPropertyTax: monthlyTax,
    monthlyHomeownersInsurance: monthlyIns,
    monthlyHoa,
    monthlyMortgageInsurance: monthlyMi,
    totalMonthlyHousingPayment: totalHousing,
    maximumHousingBudget: budgetRounded,
    bindingLimit: input.bindingLimit,
    frontEndDti,
    backEndDti,
    estimatedClosingCosts: closingRounded,
    cashNeededAtClosing: cashAtClosing,
    currency,
    formattedHomePrice: formatHomeMoney(homePrice, currency),
    formattedLoanAmount: formatHomeMoney(loanAmount, currency),
    formattedDownPayment: formatHomeMoney(downPayment, currency),
    formattedMonthlyPi: formatHomeMoney(monthlyPi, currency),
    formattedMonthlyTax: formatHomeMoney(monthlyTax, currency),
    formattedMonthlyInsurance: formatHomeMoney(monthlyIns, currency),
    formattedMonthlyHoa: formatHomeMoney(monthlyHoa, currency),
    formattedMonthlyMi: formatHomeMoney(monthlyMi, currency),
    formattedTotalHousing: formatHomeMoney(totalHousing, currency),
    formattedBudget: formatHomeMoney(budgetRounded, currency),
    formattedClosingCosts: formatHomeMoney(closingRounded, currency),
    formattedCashAtClosing: formatHomeMoney(cashAtClosing, currency),
    warning,
  };

  return { ok: true, result };
}
