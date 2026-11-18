import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  PMI_CANCEL_LTV,
  type InterestMethod,
  type PaymentFrequency,
} from './types';

export function formatMortgageTaxesMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatMortgageTaxesPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  }).format(value);
}

/** Nominal period rate for US/UK (APR / periodsPerYear). */
function usUkPeriodRate(annualRatePercent: number, periodsPerYear: number): number {
  return annualRatePercent / (100 * periodsPerYear);
}

/**
 * Canadian mortgage: semi-annual compounding.
 * Effective rate per payment period for `periodsPerYear` payments.
 */
function canadianPeriodRate(
  annualRatePercent: number,
  periodsPerYear: number
): number {
  const semi = annualRatePercent / 200;
  return Math.pow(1 + semi, 2 / periodsPerYear) - 1;
}

function periodRate(
  annualRatePercent: number,
  method: InterestMethod,
  periodsPerYear: number
): number {
  if (method === 'semi_annual_canada') {
    return canadianPeriodRate(annualRatePercent, periodsPerYear);
  }
  return usUkPeriodRate(annualRatePercent, periodsPerYear);
}

function amortizingPayment(principal: number, r: number, n: number): number {
  if (!(principal > 0) || !(n > 0)) return 0;
  if (r === 0) return principal / n;
  const factor = Math.pow(1 + r, -n);
  const denom = 1 - factor;
  if (!(denom > 0) || !Number.isFinite(factor)) return NaN;
  return (principal * r) / denom;
}

function frequencyMeta(frequency: PaymentFrequency): {
  periodsPerYear: number;
  accelerated: boolean;
  divisorOfMonthly: number;
} {
  switch (frequency) {
    case 'monthly':
      return { periodsPerYear: 12, accelerated: false, divisorOfMonthly: 1 };
    case 'semi_monthly':
      return { periodsPerYear: 24, accelerated: false, divisorOfMonthly: 2 };
    case 'biweekly':
      return { periodsPerYear: 26, accelerated: false, divisorOfMonthly: 2 };
    case 'accelerated_biweekly':
      return { periodsPerYear: 26, accelerated: true, divisorOfMonthly: 2 };
    case 'weekly':
      return { periodsPerYear: 52, accelerated: false, divisorOfMonthly: 4 };
    case 'accelerated_weekly':
      return { periodsPerYear: 52, accelerated: true, divisorOfMonthly: 4 };
  }
}

/** Add whole months to YYYY-MM-DD without timezone drift (UTC civil date). */
export function addMonthsIso(isoDate: string, months: number): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (![y, m, d].every(Number.isFinite)) return null;
  const utc = new Date(Date.UTC(y, m - 1, d));
  if (
    utc.getUTCFullYear() !== y ||
    utc.getUTCMonth() !== m - 1 ||
    utc.getUTCDate() !== d
  ) {
    return null;
  }
  utc.setUTCMonth(utc.getUTCMonth() + months);
  const yy = utc.getUTCFullYear();
  const mm = String(utc.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(utc.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

/** Approximate calendar advance for non-monthly schedules (days ≈ 365.25 / ppy). */
export function addPeriodsIso(
  isoDate: string,
  periods: number,
  periodsPerYear: number
): string | null {
  if (periodsPerYear === 12) return addMonthsIso(isoDate, periods);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const utc = new Date(Date.UTC(y, m - 1, d));
  const dayStep = 365.25 / periodsPerYear;
  utc.setUTCDate(utc.getUTCDate() + Math.round(periods * dayStep));
  const yy = utc.getUTCFullYear();
  const mm = String(utc.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(utc.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

export function formatDisplayDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return isoDate;
  return `${match[2]}/${match[3]}/${match[1]}`;
}

export interface MortgageTaxesInsuranceCanonicalInput {
  homeValue: number;
  downPayment: number;
  annualRatePercent: number;
  termYears: number;
  interestMethod: InterestMethod;
  paymentFrequency: PaymentFrequency;
  firstDay: string;
  annualPmiPercent: number;
  propertyTaxAnnualPercent: number;
  homeownerInsuranceAnnual: number;
  otherCostsPeriodic: number;
}

export interface MortgageTaxesInsuranceCanonicalResult {
  homeValue: number;
  downPayment: number;
  downPaymentPercent: number;
  loanAmount: number;
  periodicPayment: number;
  paymentCount: number;
  totalPayments: number;
  totalInterest: number;
  periodicPmi: number;
  totalPmi: number;
  pmiPaymentCount: number;
  pmiUntilDate: string | null;
  periodicPropertyTax: number;
  totalPropertyTax: number;
  periodicHomeownerInsurance: number;
  totalHomeownerInsurance: number;
  otherCostsPeriodic: number;
  totalOtherCosts: number;
  totalEscrowAndOther: number;
  totalWithCosts: number;
  payoffDate: string;
  principalSharePercent: number;
  interestSharePercent: number;
  pmiSharePercent: number;
  otherSharePercent: number;
}

/**
 * Fixed-rate amortizing mortgage with PMI + optional property tax / homeowners
 * insurance / other costs. Payment field remains P&I only; tax and insurance are
 * escrow-style add-ons in totals and the “Other costs” chart slice (not double-counted
 * into principal/interest). PMI uses Omni-matched cancel when post-payment LTV ≤ 80%.
 */
export function calculateMortgageTaxesInsurance(
  input: MortgageTaxesInsuranceCanonicalInput
): MortgageTaxesInsuranceCanonicalResult | null {
  const {
    homeValue,
    downPayment,
    annualRatePercent,
    termYears,
    interestMethod,
    paymentFrequency,
    firstDay,
    annualPmiPercent,
    propertyTaxAnnualPercent,
    homeownerInsuranceAnnual,
    otherCostsPeriodic,
  } = input;

  if (
    ![
      homeValue,
      downPayment,
      annualRatePercent,
      termYears,
      annualPmiPercent,
      propertyTaxAnnualPercent,
      homeownerInsuranceAnnual,
      otherCostsPeriodic,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(homeValue > 0) || downPayment < 0 || downPayment > homeValue) return null;
  if (annualRatePercent < 0 || !(termYears > 0) || annualPmiPercent < 0) return null;
  if (propertyTaxAnnualPercent < 0 || homeownerInsuranceAnnual < 0) return null;
  if (otherCostsPeriodic < 0) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(firstDay.trim())) return null;

  const loanAmount = homeValue - downPayment;
  const downPaymentPercent = (downPayment / homeValue) * 100;
  const meta = frequencyMeta(paymentFrequency);
  const { periodsPerYear, accelerated, divisorOfMonthly } = meta;

  const scheduledPeriods = Math.round(termYears * periodsPerYear);
  if (!(scheduledPeriods > 0)) return null;

  // Base monthly payment (12 periods) for accelerated schedules.
  const monthlyRate = periodRate(annualRatePercent, interestMethod, 12);
  const monthlyN = Math.round(termYears * 12);
  const monthlyPayment = amortizingPayment(loanAmount, monthlyRate, monthlyN);
  if (!Number.isFinite(monthlyPayment)) return null;

  let periodicPayment: number;
  let r: number;
  let n: number;

  if (accelerated) {
    periodicPayment = monthlyPayment / divisorOfMonthly;
    r = periodRate(annualRatePercent, interestMethod, periodsPerYear);
    n = scheduledPeriods; // upper bound; actual may finish early
  } else {
    r = periodRate(annualRatePercent, interestMethod, periodsPerYear);
    n = scheduledPeriods;
    periodicPayment = amortizingPayment(loanAmount, r, n);
  }

  if (!Number.isFinite(periodicPayment) || periodicPayment < 0) return null;

  const startingLtv = loanAmount / homeValue;
  const pmiApplies = startingLtv > PMI_CANCEL_LTV && annualPmiPercent > 0;
  const periodicPmi = pmiApplies
    ? (loanAmount * (annualPmiPercent / 100)) / periodsPerYear
    : 0;

  let balance = loanAmount;
  let totalInterest = 0;
  let totalPmi = 0;
  let pmiPaymentCount = 0;
  let paymentCount = 0;
  const maxPeriods = accelerated ? scheduledPeriods * 2 : scheduledPeriods;

  for (let i = 0; i < maxPeriods && balance > 1e-9; i += 1) {
    const interestPart = r === 0 ? 0 : balance * r;
    let principalPart = periodicPayment - interestPart;
    if (principalPart > balance) principalPart = balance;
    const actualPayment = principalPart + interestPart;
    balance -= principalPart;
    if (balance < 0) balance = 0;

    totalInterest += interestPart;
    paymentCount += 1;

    // Charge PMI for this period when post-payment LTV is still above 80%.
    if (pmiApplies && balance / homeValue > PMI_CANCEL_LTV + 1e-12) {
      totalPmi += periodicPmi;
      pmiPaymentCount += 1;
    }

    // Safety: if payment doesn't cover interest on accelerated edge cases
    if (actualPayment <= interestPart && balance > 1e-6 && r > 0 && !accelerated) {
      return null;
    }
  }

  if (paymentCount === 0) return null;

  const periodicPropertyTax =
    (homeValue * (propertyTaxAnnualPercent / 100)) / periodsPerYear;
  const periodicHomeownerInsurance = homeownerInsuranceAnnual / periodsPerYear;
  const totalPropertyTax = periodicPropertyTax * paymentCount;
  const totalHomeownerInsurance = periodicHomeownerInsurance * paymentCount;
  const totalOtherCosts = otherCostsPeriodic * paymentCount;
  const totalEscrowAndOther =
    totalPropertyTax + totalHomeownerInsurance + totalOtherCosts;

  const totalPayments = loanAmount + totalInterest;
  const totalWithCosts = totalPayments + totalPmi + totalEscrowAndOther;

  const payoffDate = addPeriodsIso(firstDay, paymentCount, periodsPerYear);
  if (!payoffDate) return null;

  const pmiUntilDate =
    pmiPaymentCount > 0
      ? addPeriodsIso(firstDay, Math.max(0, pmiPaymentCount - 1), periodsPerYear)
      : null;

  const chartTotal = totalWithCosts > 0 ? totalWithCosts : 1;
  const principalSharePercent = (loanAmount / chartTotal) * 100;
  const interestSharePercent = (totalInterest / chartTotal) * 100;
  const pmiSharePercent = (totalPmi / chartTotal) * 100;
  const otherSharePercent = (totalEscrowAndOther / chartTotal) * 100;

  return {
    homeValue,
    downPayment,
    downPaymentPercent,
    loanAmount,
    periodicPayment,
    paymentCount,
    totalPayments,
    totalInterest,
    periodicPmi,
    totalPmi,
    pmiPaymentCount,
    pmiUntilDate,
    periodicPropertyTax,
    totalPropertyTax,
    periodicHomeownerInsurance,
    totalHomeownerInsurance,
    otherCostsPeriodic,
    totalOtherCosts,
    totalEscrowAndOther,
    totalWithCosts,
    payoffDate,
    principalSharePercent,
    interestSharePercent,
    pmiSharePercent,
    otherSharePercent,
  };
}
