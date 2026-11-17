import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  FREQUENCY_OPTIONS,
  type AnnuityType,
  type FilingStatus,
  type Frequency,
} from './types';

export function periodsPerYear(frequency: Frequency): number {
  return FREQUENCY_OPTIONS.find((o) => o.value === frequency)?.periodsPerYear ?? 12;
}

export function formatVaMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Equivalent rate per payment period from nominal annual rate with compounding m.
 * i = (1 + r/m)^(m/q) − 1
 */
export function paymentPeriodRate(
  annualRatePercent: number,
  compoundingFrequency: Frequency,
  paymentFrequency: Frequency
): number | null {
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) return null;
  const m = periodsPerYear(compoundingFrequency);
  const q = periodsPerYear(paymentFrequency);
  if (!(m > 0) || !(q > 0)) return null;
  if (annualRatePercent === 0) return 0;
  const base = 1 + annualRatePercent / (100 * m);
  if (!(base > 0)) return null;
  const i = Math.pow(base, m / q) - 1;
  return Number.isFinite(i) ? i : null;
}

/** Periodic contribution growth from annual growth: g = (1+G)^(1/q) − 1 */
export function periodicGrowthFromAnnual(
  annualGrowthPercent: number,
  paymentFrequency: Frequency
): number | null {
  if (!Number.isFinite(annualGrowthPercent)) return null;
  const q = periodsPerYear(paymentFrequency);
  const base = 1 + annualGrowthPercent / 100;
  if (!(base > 0)) return null;
  const g = Math.pow(base, 1 / q) - 1;
  return Number.isFinite(g) ? g : null;
}

export interface PretaxSolveInput {
  startingBalance: number;
  contribution: number;
  lengthYears: number;
  paymentFrequency: Frequency;
  compoundingFrequency: Frequency;
  annuityType: AnnuityType;
  rateOfReturnPercent: number;
  annualGrowthPercent: number;
}

export interface PretaxSolveResult {
  finalBalance: number;
  numberOfContributions: number;
  annualContribution: number;
  totalContribution: number;
  totalReturn: number;
  periodRate: number;
}

/**
 * Growing annuity FV (deposits). Ordinary: PMT × ((1+i)^n − (1+g)^n) / (i − g)
 * (or n×(1+i)^(n−1) when i = g). Due multiplies the payment FV by (1+i).
 */
export function calculatePretaxAccumulation(
  input: PretaxSolveInput
): PretaxSolveResult | null {
  const {
    startingBalance,
    contribution,
    lengthYears,
    paymentFrequency,
    compoundingFrequency,
    annuityType,
    rateOfReturnPercent,
    annualGrowthPercent,
  } = input;

  if (
    ![startingBalance, contribution, lengthYears, rateOfReturnPercent, annualGrowthPercent].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (startingBalance < 0 || contribution < 0 || !(lengthYears > 0)) return null;
  if (rateOfReturnPercent < 0) return null;

  const q = periodsPerYear(paymentFrequency);
  const n = Math.round(lengthYears * q);
  if (!(n > 0)) return null;

  const i = paymentPeriodRate(
    rateOfReturnPercent,
    compoundingFrequency,
    paymentFrequency
  );
  if (i === null) return null;

  const g = periodicGrowthFromAnnual(annualGrowthPercent, paymentFrequency);
  if (g === null) return null;

  const fvPrincipal = startingBalance * Math.pow(1 + i, n);

  let fvPayments: number;
  if (contribution === 0) {
    fvPayments = 0;
  } else if (Math.abs(i - g) < 1e-12) {
    fvPayments = contribution * n * Math.pow(1 + i, n - 1);
  } else {
    fvPayments =
      (contribution * (Math.pow(1 + i, n) - Math.pow(1 + g, n))) / (i - g);
  }
  if (annuityType === 'due' && contribution !== 0) {
    fvPayments *= 1 + i;
  }

  const finalBalance = fvPrincipal + fvPayments;
  if (!Number.isFinite(finalBalance)) return null;

  let totalContribution = 0;
  if (g === 0) {
    totalContribution = contribution * n;
  } else {
    for (let k = 0; k < n; k++) {
      totalContribution += contribution * Math.pow(1 + g, k);
    }
  }

  const annualContribution =
    g === 0 ? contribution * q : totalContribution / lengthYears;

  return {
    finalBalance,
    numberOfContributions: n,
    annualContribution,
    totalContribution,
    totalReturn: finalBalance - startingBalance - totalContribution,
    periodRate: i,
  };
}

/**
 * Published US federal ordinary-income brackets for tax year 2024
 * (IRS Rev. Proc. 2023-34). Not invented project rates.
 * Thresholds are taxable-income cutoffs; rates apply to slices above each cutoff.
 */
const IRS_2024_SINGLE: readonly { upTo: number; rate: number }[] = [
  { upTo: 11600, rate: 0.1 },
  { upTo: 47150, rate: 0.12 },
  { upTo: 100525, rate: 0.22 },
  { upTo: 191950, rate: 0.24 },
  { upTo: 243725, rate: 0.32 },
  { upTo: 609350, rate: 0.35 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.37 },
];

export const TAX_BRACKET_CITATION =
  'US federal ordinary income tax brackets for tax year 2024 (IRS Rev. Proc. 2023-34), Single filing status. Year-by-year tax is applied to that year’s investment gain only; brackets inflate with the stated inflation rate. This is not Omni’s proprietary taxable model and may differ from third-party screenshots.';

function bracketsFor(status: FilingStatus): readonly { upTo: number; rate: number }[] {
  if (status === 'single') return IRS_2024_SINGLE;
  return IRS_2024_SINGLE;
}

function taxOnTaxableIncome(
  taxableIncome: number,
  brackets: readonly { upTo: number; rate: number }[]
): number {
  if (!(taxableIncome > 0)) return 0;
  let tax = 0;
  let prev = 0;
  for (const band of brackets) {
    const slice = Math.min(taxableIncome, band.upTo) - prev;
    if (slice > 0) tax += slice * band.rate;
    if (taxableIncome <= band.upTo) break;
    prev = band.upTo;
  }
  return tax;
}

function marginalTaxOnGain(
  ordinaryIncome: number,
  gain: number,
  brackets: readonly { upTo: number; rate: number }[]
): number {
  if (!(gain > 0)) return 0;
  const base = Math.max(0, ordinaryIncome);
  return (
    taxOnTaxableIncome(base + gain, brackets) - taxOnTaxableIncome(base, brackets)
  );
}

function inflateBrackets(
  brackets: readonly { upTo: number; rate: number }[],
  factor: number
): { upTo: number; rate: number }[] {
  return brackets.map((b) => ({
    upTo: Number.isFinite(b.upTo) ? b.upTo * factor : b.upTo,
    rate: b.rate,
  }));
}

export interface TaxableSolveInput extends PretaxSolveInput {
  annualIncome: number;
  incomeGrowthPercent: number;
  inflationPercent: number;
  filingStatus: FilingStatus;
}

/**
 * Taxable-account path: simulate payment periods, tax each calendar year’s
 * investment gain at published federal ordinary rates (status Single / TY2024).
 * Contributions are basis (not taxed); only growth is taxed when realized yearly.
 */
export function calculateTaxableAccumulation(
  input: TaxableSolveInput
): number | null {
  const pretaxMeta = calculatePretaxAccumulation(input);
  if (!pretaxMeta) return null;

  const q = periodsPerYear(input.paymentFrequency);
  const n = pretaxMeta.numberOfContributions;
  const i = pretaxMeta.periodRate;
  const g = periodicGrowthFromAnnual(
    input.annualGrowthPercent,
    input.paymentFrequency
  );
  if (g === null) return null;

  if (
    !Number.isFinite(input.annualIncome) ||
    input.annualIncome < 0 ||
    !Number.isFinite(input.incomeGrowthPercent) ||
    !Number.isFinite(input.inflationPercent) ||
    input.inflationPercent < -99
  ) {
    return null;
  }

  const baseBrackets = bracketsFor(input.filingStatus);
  let balance = input.startingBalance;
  let income = input.annualIncome;
  let bracketFactor = 1;
  let yearStartBalance = balance;
  let yearContrib = 0;

  const settleYear = () => {
    const gain = balance - yearStartBalance - yearContrib;
    const brackets = inflateBrackets(baseBrackets, bracketFactor);
    const tax = marginalTaxOnGain(income, gain, brackets);
    balance -= tax;
    if (!Number.isFinite(balance)) return false;
    income *= 1 + input.incomeGrowthPercent / 100;
    bracketFactor *= 1 + input.inflationPercent / 100;
    yearContrib = 0;
    yearStartBalance = balance;
    return true;
  };

  for (let k = 0; k < n; k++) {
    const pmt = input.contribution * Math.pow(1 + g, k);
    if (input.annuityType === 'due') {
      balance += pmt;
      yearContrib += pmt;
      balance *= 1 + i;
    } else {
      balance *= 1 + i;
      balance += pmt;
      yearContrib += pmt;
    }
    if (!Number.isFinite(balance)) return null;

    if (k % q === q - 1) {
      if (!settleYear()) return null;
    }
  }

  if (n % q !== 0) {
    if (!settleYear()) return null;
  }

  return Number.isFinite(balance) ? balance : null;
}
