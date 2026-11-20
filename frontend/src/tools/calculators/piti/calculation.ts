import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export interface PitiMathInput {
  principal: number;
  termYears: number;
  termMonths: number;
  annualInterestRate: number;
  annualPropertyTax: number;
  annualInsurance: number;
}

export interface PitiMathResult {
  totalTermMonths: number;
  monthlyInterestRate: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeownersInsurance: number;
  monthlyPITI: number;
  annualPITI: number;
  monthlyEscrow: number;
  totalMortgagePayments: number;
  totalMortgageInterest: number;
}

/** Total payment months from years + months. */
export function termToMonths(years: number, months: number): number | null {
  if (
    !Number.isFinite(years) ||
    !Number.isFinite(months) ||
    years < 0 ||
    months < 0 ||
    !Number.isInteger(years) ||
    !Number.isInteger(months)
  ) {
    return null;
  }
  const n = years * 12 + months;
  return n > 0 ? n : null;
}

/**
 * Fixed-rate amortizing monthly P&I.
 * M = P·r / (1 − (1+r)^−n); r = 0 → P/n.
 */
export function calculateMonthlyPrincipalAndInterest(
  principal: number,
  annualRatePercent: number,
  totalMonths: number
): number | null {
  if (
    !Number.isFinite(principal) ||
    principal < 0 ||
    !Number.isFinite(annualRatePercent) ||
    annualRatePercent < 0 ||
    !Number.isFinite(totalMonths) ||
    totalMonths <= 0 ||
    !Number.isInteger(totalMonths)
  ) {
    return null;
  }
  if (principal === 0) return 0;

  const r = annualRatePercent / (100 * 12);
  if (r === 0) {
    const pmt = principal / totalMonths;
    return Number.isFinite(pmt) ? pmt : null;
  }

  const factor = (1 + r) ** totalMonths;
  if (!Number.isFinite(factor) || factor <= 1) return null;
  const pmt = (principal * r) / (1 - 1 / factor);
  return Number.isFinite(pmt) ? pmt : null;
}

export function calculatePITI(input: PitiMathInput): PitiMathResult | null {
  const n = termToMonths(input.termYears, input.termMonths);
  if (n === null) return null;

  if (
    !Number.isFinite(input.principal) ||
    input.principal < 0 ||
    !Number.isFinite(input.annualInterestRate) ||
    input.annualInterestRate < 0 ||
    !Number.isFinite(input.annualPropertyTax) ||
    input.annualPropertyTax < 0 ||
    !Number.isFinite(input.annualInsurance) ||
    input.annualInsurance < 0
  ) {
    return null;
  }

  const monthlyPI = calculateMonthlyPrincipalAndInterest(
    input.principal,
    input.annualInterestRate,
    n
  );
  if (monthlyPI === null) return null;

  const monthlyPropertyTax = input.annualPropertyTax / 12;
  const monthlyHomeownersInsurance = input.annualInsurance / 12;
  const monthlyEscrow = monthlyPropertyTax + monthlyHomeownersInsurance;
  const monthlyPITI = monthlyPI + monthlyEscrow;
  const annualPITI = monthlyPITI * 12;
  const totalMortgagePayments = monthlyPI * n;
  const totalMortgageInterest = totalMortgagePayments - input.principal;
  const monthlyInterestRate = input.annualInterestRate / (100 * 12);

  if (
    !Number.isFinite(monthlyPITI) ||
    !Number.isFinite(annualPITI) ||
    !Number.isFinite(totalMortgagePayments) ||
    !Number.isFinite(totalMortgageInterest)
  ) {
    return null;
  }

  return {
    totalTermMonths: n,
    monthlyInterestRate,
    monthlyPrincipalAndInterest: monthlyPI,
    monthlyPropertyTax,
    monthlyHomeownersInsurance,
    monthlyPITI,
    annualPITI,
    monthlyEscrow,
    totalMortgagePayments,
    totalMortgageInterest,
  };
}

export function formatPitiMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function interpretPiti(
  monthlyPITI: number,
  currency: SupportedCurrency
): string {
  return `Estimated monthly PITI is ${formatPitiMoney(monthlyPITI, currency)} (principal & interest + property tax/12 + homeowners insurance/12). Excludes PMI, HOA, utilities, and maintenance unless entered elsewhere.`;
}
