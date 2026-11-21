/**
 * Post Office Monthly Income Scheme (POMIS) — educational engine.
 *
 * MonthlyIncome = P × R / (12 × 100)
 * AnnualInterest = P × R / 100
 * TotalInterest = MonthlyIncome × 12 × Y
 * TotalCashReceived = Principal + TotalInterest
 *
 * Currency: INR only. Principal is returned at maturity; interest paid monthly.
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import {
  DEFAULT_POMIS_SCHEME,
  accountLimit,
  type PomisAccountType,
  type PomisInput,
  type PomisResult,
  type PomisScheduleRow,
  type PomisSchemeConfig,
} from './types';

const INR = 'INR' as const;
const RATE_MAX = 50;

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function roundPaise(amount: number): number {
  return Math.round(amount * 100) / 100;
}

function parseIsoDate(raw: string): Date | null {
  const t = raw.trim();
  if (!t) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== mo - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return dt;
}

function formatIso(d: Date): string {
  const y = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${mo}-${day}`;
}

/** Add calendar months in UTC, clamping day to month length. */
export function addMonthsUtc(start: Date, months: number): Date {
  const y = start.getUTCFullYear();
  const m = start.getUTCMonth() + months;
  const day = start.getUTCDate();
  const target = new Date(Date.UTC(y, m, 1));
  const last = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  target.setUTCDate(Math.min(day, last));
  return target;
}

export function calculatePOMISMonthlyIncome(
  principal: number,
  annualRatePercent: number,
): number | null {
  if (![principal, annualRatePercent].every(Number.isFinite)) return null;
  if (principal < 0 || annualRatePercent < 0) return null;
  return (principal * annualRatePercent) / (12 * 100);
}

export function calculatePOMISAnnualIncome(
  principal: number,
  annualRatePercent: number,
): number | null {
  if (![principal, annualRatePercent].every(Number.isFinite)) return null;
  if (principal < 0 || annualRatePercent < 0) return null;
  return (principal * annualRatePercent) / 100;
}

export function calculatePOMISTotalInterest(
  monthlyIncome: number,
  termYears: number,
): number | null {
  if (![monthlyIncome, termYears].every(Number.isFinite)) return null;
  if (monthlyIncome < 0 || termYears < 0) return null;
  return monthlyIncome * 12 * termYears;
}

export function calculatePOMISTotalCashReceived(
  principal: number,
  totalInterest: number,
): number | null {
  if (![principal, totalInterest].every(Number.isFinite)) return null;
  return principal + totalInterest;
}

export function calculatePOMISMaturityDate(
  startIso: string,
  termYears: number,
): string | null {
  const start = parseIsoDate(startIso);
  if (!start || !Number.isFinite(termYears) || termYears < 0) return null;
  return formatIso(addMonthsUtc(start, Math.round(termYears * 12)));
}

export function generatePOMISInterestSchedule(input: {
  principal: number;
  monthlyIncome: number;
  termMonths: number;
  startIso: string | null;
}): PomisScheduleRow[] {
  const { principal, monthlyIncome, termMonths, startIso } = input;
  const start = startIso ? parseIsoDate(startIso) : null;
  const rows: PomisScheduleRow[] = [];
  let cumulative = 0;

  for (let i = 1; i <= termMonths; i++) {
    const interest = roundPaise(monthlyIncome);
    cumulative = roundPaise(cumulative + interest);
    const paymentDate = start
      ? formatIso(addMonthsUtc(start, i))
      : `Month ${i}`;
    rows.push({
      month: i,
      paymentDate,
      monthlyInterest: interest,
      cumulativeInterest: cumulative,
      principalOutstanding: principal,
      isMaturityPrincipal: false,
    });
  }

  if (termMonths > 0) {
    const last = rows[rows.length - 1]!;
    rows.push({
      month: termMonths,
      paymentDate: last.paymentDate,
      monthlyInterest: 0,
      cumulativeInterest: last.cumulativeInterest,
      principalOutstanding: 0,
      isMaturityPrincipal: true,
    });
  }

  return rows;
}

export function formatINR(amount: number): string {
  return formatCurrencyValue(amount, INR);
}

export function calculatePomisFromInput(
  input: PomisInput,
  scheme: PomisSchemeConfig = DEFAULT_POMIS_SCHEME,
): PomisResult | null {
  const principal = num(input.investmentAmount);
  const rate = num(input.annualInterestRate);
  if (principal == null || rate == null) return null;
  if (principal <= 0 || rate < 0 || rate > RATE_MAX) return null;

  const limit = accountLimit(input.accountType, scheme);
  if (principal > limit) return null;
  if (principal < scheme.minimumInvestment) return null;
  if (
    scheme.investmentIncrement > 0 &&
    Math.round(principal * 100) % Math.round(scheme.investmentIncrement * 100) !==
      0
  ) {
    return null;
  }

  const monthlyRaw = calculatePOMISMonthlyIncome(principal, rate);
  if (monthlyRaw == null) return null;
  const monthlyIncome = roundPaise(monthlyRaw);
  const annualIncome = roundPaise(
    calculatePOMISAnnualIncome(principal, rate) ?? 0,
  );
  const termYears = scheme.investmentTermYears;
  const termMonths = termYears * 12;
  const totalInterest = roundPaise(
    calculatePOMISTotalInterest(monthlyIncome, termYears) ?? 0,
  );
  const totalCash =
    calculatePOMISTotalCashReceived(principal, totalInterest) ?? 0;

  const startRaw = input.investmentStartDate.trim();
  const startOk = startRaw === '' || parseIsoDate(startRaw) != null;
  if (!startOk) return null;
  const startIso = startRaw === '' ? null : startRaw;
  const maturityDate = startIso
    ? calculatePOMISMaturityDate(startIso, termYears)
    : null;

  const schedule = generatePOMISInterestSchedule({
    principal,
    monthlyIncome,
    termMonths,
    startIso,
  });

  const accountLabel =
    input.accountType === 'joint' ? 'Joint' : 'Individual';

  return {
    accountType: input.accountType,
    principalInvestment: principal,
    maturityPrincipal: principal,
    interestRateUsed: rate,
    monthlyIncome,
    annualIncome,
    totalInterest,
    totalCashReceived: roundPaise(totalCash),
    investmentTermYears: termYears,
    investmentTermMonths: termMonths,
    scheduledPaymentCount: termMonths,
    investmentStartDate: startIso,
    maturityDate,
    investmentLimit: limit,
    rateNote: scheme.interestRateSource,
    rulesNote: scheme.rulesSource,
    schedule,
    interpretation: `${accountLabel} POMIS: ${formatINR(monthlyIncome)}/mo at ${rate}% for ${termYears} years. Principal ${formatINR(principal)} returned at maturity. Rate and limits are configurable educational defaults — verify with India Post.`,
    formattedMonthlyIncome: formatINR(monthlyIncome),
    formattedAnnualIncome: formatINR(annualIncome),
    formattedTotalInterest: formatINR(totalInterest),
    formattedTotalCash: formatINR(totalCash),
    formattedPrincipal: formatINR(principal),
  };
}

export function validatePOMISAccountLimit(
  accountType: PomisAccountType,
  amount: number,
  scheme: PomisSchemeConfig = DEFAULT_POMIS_SCHEME,
): boolean {
  return amount > 0 && amount <= accountLimit(accountType, scheme);
}
