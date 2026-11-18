import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  FREQUENCY_OPTIONS,
  type ChartPoint,
  type Frequency,
  type TermUnit,
} from './types';

export function formatLoanInterestMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function periodsPerYear(frequency: Frequency): number {
  return (
    FREQUENCY_OPTIONS.find((o) => o.value === frequency)?.periodsPerYear ?? 12
  );
}

export function paymentLabelFor(frequency: Frequency): string {
  return (
    FREQUENCY_OPTIONS.find((o) => o.value === frequency)?.paymentLabel ??
    'Payment'
  );
}

/** Term length in years (fractional months allowed via mos unit). */
export function termYears(term: number, unit: TermUnit): number {
  if (!(term > 0) || !Number.isFinite(term)) return NaN;
  return unit === 'mos' ? term / 12 : term;
}

/**
 * Effective rate per payment period:
 * r = (1 + APR/(100 × m))^(m/p) − 1
 */
export function periodicRate(
  annualRatePercent: number,
  compounding: Frequency,
  payment: Frequency
): number {
  if (annualRatePercent < 0 || !Number.isFinite(annualRatePercent)) return NaN;
  if (annualRatePercent === 0) return 0;
  const m = periodsPerYear(compounding);
  const p = periodsPerYear(payment);
  const j = annualRatePercent / 100;
  if (m === p) return j / p;
  return Math.expm1((m / p) * Math.log1p(j / m));
}

/** Payment = P × r / (1 − (1+r)^(-n)); r = 0 → P/n. */
export function amortizingPayment(
  principal: number,
  r: number,
  n: number
): number {
  if (!(principal > 0) || !(n > 0)) return NaN;
  if (r === 0) return principal / n;
  const denom = -Math.expm1(-n * Math.log1p(r));
  if (!(denom > 0)) return NaN;
  return (principal * r) / denom;
}

export interface LoanInterestCanonicalInput {
  principal: number;
  annualRatePercent: number;
  termYears: number;
  paymentFrequency: Frequency;
  compoundingFrequency: Frequency;
}

export interface LoanInterestCanonicalResult {
  principal: number;
  periodicPayment: number;
  paymentCount: number;
  totalPayment: number;
  totalInterest: number;
  paymentLabel: string;
  paymentsPerYear: number;
  chartPoints: ChartPoint[];
}

/**
 * Fixed-rate amortizing loan with independent payment and compounding frequencies.
 * Chart points sample yearly (and final) cumulative balances from the full schedule.
 */
export function calculateLoanInterest(
  input: LoanInterestCanonicalInput
): LoanInterestCanonicalResult | null {
  const {
    principal,
    annualRatePercent,
    termYears: years,
    paymentFrequency,
    compoundingFrequency,
  } = input;

  if (
    ![principal, annualRatePercent, years].every(Number.isFinite) ||
    !(principal > 0) ||
    annualRatePercent < 0 ||
    !(years > 0)
  ) {
    return null;
  }

  const ppy = periodsPerYear(paymentFrequency);
  const n = Math.round(years * ppy);
  if (!(n > 0)) return null;

  const r = periodicRate(
    annualRatePercent,
    compoundingFrequency,
    paymentFrequency
  );
  if (!Number.isFinite(r) || r < 0) return null;

  const payment = amortizingPayment(principal, r, n);
  if (!Number.isFinite(payment) || payment < 0) return null;

  let balance = principal;
  let cumPrincipal = 0;
  let cumInterest = 0;
  const yearlyMarks = new Set<number>();
  for (let y = 1; y <= Math.ceil(years); y += 1) {
    yearlyMarks.add(Math.min(n, Math.round(y * ppy)));
  }
  yearlyMarks.add(n);

  const chartPoints: ChartPoint[] = [
    {
      year: 0,
      principalBalance: principal,
      principalPaid: 0,
      interestPaid: 0,
    },
  ];

  for (let period = 1; period <= n; period += 1) {
    const interestPart = r === 0 ? 0 : balance * r;
    let principalPart = payment - interestPart;
    if (principalPart > balance) principalPart = balance;
    if (principalPart < 0) principalPart = 0;

    balance -= principalPart;
    if (balance < 0) balance = 0;

    cumPrincipal += principalPart;
    cumInterest += interestPart;

    if (yearlyMarks.has(period)) {
      chartPoints.push({
        year: period / ppy,
        principalBalance: balance,
        principalPaid: cumPrincipal,
        interestPaid: cumInterest,
      });
    }
  }

  const totalPayment = payment * n;
  // Prefer ledger totals so chart end matches reported interest/principal.
  const totalInterest = cumInterest;
  const reconciledTotal = cumPrincipal + cumInterest;

  return {
    principal,
    periodicPayment: payment,
    paymentCount: n,
    totalPayment: Number.isFinite(reconciledTotal) ? reconciledTotal : totalPayment,
    totalInterest,
    paymentLabel: paymentLabelFor(paymentFrequency),
    paymentsPerYear: ppy,
    chartPoints,
  };
}
