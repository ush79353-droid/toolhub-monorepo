/**
 * PPF Calculator — Public Provident Fund (India, educational model).
 *
 * - Indian FY: 1 Apr – 31 Mar
 * - Maturity: 15 years from end of the opening financial year (31 Mar)
 * - Monthly interest on min balance between close of 5th and month-end
 *   (no withdrawals ⇒ eligible = balance after deposits on/before the 5th)
 * - Interest credited at FY end (31 Mar)
 * - Constant-rate projection by default (illustrative)
 */

import { formatCurrencyValue } from '@/tools/shared/currency';
import {
  DEFAULT_PPF_SCHEME,
  type PpfDepositFrequency,
  type PpfExtensionMode,
  type PpfInput,
  type PpfResult,
  type PpfSchemeConfig,
  type PpfYearlyRecord,
} from './types';

const INR = 'INR' as const;

export interface ResolvedDeposit {
  date: string;
  amount: number;
}

export interface FinancialYear {
  startYear: number;
  endYear: number;
  label: string;
}

function roundPaise(n: number): number {
  return Math.round(n * 100) / 100;
}

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function parseIso(raw: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
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
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

/** Clamp day into month (handles Feb 30 → Feb 28/29). */
export function clampDate(year: number, monthIndex: number, day: number): Date {
  const dim = daysInMonth(year, monthIndex);
  return new Date(Date.UTC(year, monthIndex, Math.min(day, dim)));
}

export function getIndianFinancialYear(dateIso: string): FinancialYear | null {
  const d = parseIso(dateIso);
  if (!d) return null;
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth(); // 0-based
  if (m >= 3) {
    return { startYear: y, endYear: y + 1, label: `${y}-${String(y + 1).slice(-2)}` };
  }
  return {
    startYear: y - 1,
    endYear: y,
    label: `${y - 1}-${String(y).slice(-2)}`,
  };
}

/**
 * Standard maturity = 31 Mar of (opening FY end year + 15).
 * Open in FY 2026-27 → 31 Mar 2042.
 */
export function getPPFMaturityDate(
  startIso: string,
  scheme: PpfSchemeConfig = DEFAULT_PPF_SCHEME,
): string | null {
  const fy = getIndianFinancialYear(startIso);
  if (!fy) return null;
  const maturityYear = fy.endYear + scheme.standardTenureYears;
  return `${maturityYear}-03-31`;
}

export function getPPFExtendedMaturityDate(
  standardMaturityIso: string,
  blocks: number,
  scheme: PpfSchemeConfig = DEFAULT_PPF_SCHEME,
): string | null {
  const d = parseIso(standardMaturityIso);
  if (!d || blocks < 0) return null;
  const y = d.getUTCFullYear() + blocks * scheme.extensionBlockYears;
  return `${y}-03-31`;
}

export function calculatePPFInflationAdjustedValue(
  futureValue: number,
  inflationPercent: number,
  years: number,
): number | null {
  if (![futureValue, inflationPercent, years].every(Number.isFinite)) return null;
  if (futureValue < 0 || inflationPercent < 0 || years < 0) return null;
  if (inflationPercent === 0) return futureValue;
  const i = inflationPercent / 100;
  return futureValue / (1 + i) ** years;
}

export function calculatePPFMonthlyInterest(
  eligibleBalance: number,
  annualRatePercent: number,
): number {
  return (eligibleBalance * annualRatePercent) / (12 * 100);
}

function monthsBetweenInclusive(start: Date, end: Date): number {
  return (
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (end.getUTCMonth() - start.getUTCMonth())
  );
}

function addMonths(d: Date, months: number, dayOfMonth: number): Date {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + months;
  return clampDate(y, m, dayOfMonth);
}

function frequencyStep(freq: PpfDepositFrequency): number {
  switch (freq) {
    case 'monthly':
      return 1;
    case 'quarterly':
      return 3;
    case 'half-yearly':
      return 6;
    case 'annually':
      return 12;
  }
}

/**
 * Fixed recurring deposits from start through maturity (inclusive of start,
 * exclusive of deposits after maturity date).
 */
export function generateFixedDepositSchedule(
  startIso: string,
  maturityIso: string,
  amount: number,
  frequency: PpfDepositFrequency,
): ResolvedDeposit[] {
  const start = parseIso(startIso);
  const maturity = parseIso(maturityIso);
  if (!start || !maturity || amount <= 0) return [];
  const day = start.getUTCDate();
  const step = frequencyStep(frequency);
  const out: ResolvedDeposit[] = [];
  for (let i = 0; i < 600; i++) {
    const cursor = addMonths(start, step * i, day);
    if (cursor.getTime() > maturity.getTime()) break;
    out.push({ date: formatIso(cursor), amount });
  }
  return out;
}

export function generateCustomDepositSchedule(
  deposits: { date: string; amount: number }[],
  startIso: string,
  maturityIso: string,
): ResolvedDeposit[] {
  const start = parseIso(startIso);
  const maturity = parseIso(maturityIso);
  if (!start || !maturity) return [];
  return deposits
    .filter((d) => {
      const dt = parseIso(d.date);
      return (
        dt != null &&
        d.amount > 0 &&
        dt.getTime() >= start.getTime() &&
        dt.getTime() <= maturity.getTime()
      );
    })
    .map((d) => ({ date: d.date, amount: d.amount }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Aggregate deposits by Indian FY; return first FY that exceeds max. */
export function validatePPFAnnualInvestment(
  deposits: ResolvedDeposit[],
  scheme: PpfSchemeConfig = DEFAULT_PPF_SCHEME,
): { ok: true } | { ok: false; financialYear: string; total: number } {
  const byFy = new Map<string, number>();
  for (const dep of deposits) {
    const fy = getIndianFinancialYear(dep.date);
    if (!fy) continue;
    byFy.set(fy.label, (byFy.get(fy.label) ?? 0) + dep.amount);
  }
  for (const [label, total] of byFy) {
    if (total > scheme.maximumAnnualDeposit + 1e-9) {
      return { ok: false, financialYear: label, total };
    }
  }
  return { ok: true };
}

function fyKey(year: number, monthIndex: number): string {
  // monthIndex 0=Jan … 3=Apr
  if (monthIndex >= 3) return `${year}-${String(year + 1).slice(-2)}`;
  return `${year - 1}-${String(year).slice(-2)}`;
}

function isFyEnd(year: number, monthIndex: number): boolean {
  return monthIndex === 2; // March
}

/**
 * Core ledger: deposit → 5th-day eligible balance → monthly accrual → FY credit.
 */
export function calculatePPFMaturity(input: {
  startIso: string;
  maturityIso: string;
  deposits: ResolvedDeposit[];
  annualRatePercent: number;
  /** Optional map of "YYYY-MM" → annual rate % for Mode B; falls back to constant. */
  rateByMonth?: Record<string, number>;
}): {
  maturityValue: number;
  totalInvestment: number;
  totalInterest: number;
  yearlyBreakdown: PpfYearlyRecord[];
} | null {
  const start = parseIso(input.startIso);
  const maturity = parseIso(input.maturityIso);
  if (!start || !maturity) return null;
  if (maturity.getTime() < start.getTime()) return null;
  if (!Number.isFinite(input.annualRatePercent) || input.annualRatePercent < 0) {
    return null;
  }

  const depsByDate = new Map<string, number>();
  for (const d of input.deposits) {
    depsByDate.set(d.date, (depsByDate.get(d.date) ?? 0) + d.amount);
  }

  let balance = 0;
  let fyAccrued = 0;
  let totalInvestment = 0;
  let totalInterest = 0;
  let cumInv = 0;
  let cumInt = 0;

  const yearly: PpfYearlyRecord[] = [];
  let fyLabel = '';
  let fyOpen = 0;
  let fyDeposits = 0;
  let fyInterest = 0;

  const startY = start.getUTCFullYear();
  const startM = start.getUTCMonth();
  const endY = maturity.getUTCFullYear();
  const endM = maturity.getUTCMonth();
  const totalMonths = monthsBetweenInclusive(start, maturity) + 1;

  for (let i = 0; i < totalMonths; i++) {
    const y = startY + Math.floor((startM + i) / 12);
    const m = (startM + i) % 12;
    const label = fyKey(y, m);

    if (label !== fyLabel) {
      if (fyLabel) {
        yearly.push({
          financialYear: fyLabel,
          openingBalance: roundPaise(fyOpen),
          deposits: roundPaise(fyDeposits),
          interestEarned: roundPaise(fyInterest),
          interestCredited: roundPaise(fyInterest),
          closingBalance: roundPaise(balance),
          cumulativeInvestment: roundPaise(cumInv),
          cumulativeInterest: roundPaise(cumInt),
        });
      }
      fyLabel = label;
      fyOpen = balance;
      fyDeposits = 0;
      fyInterest = 0;
    }

    const dim = daysInMonth(y, m);
    // Deposits on/before 5th
    let beforeOrOn5th = 0;
    let after5th = 0;
    for (let day = 1; day <= dim; day++) {
      const iso = formatIso(new Date(Date.UTC(y, m, day)));
      // Skip deposits before account start within first month
      if (iso < input.startIso || iso > input.maturityIso) continue;
      const amt = depsByDate.get(iso) ?? 0;
      if (amt <= 0) continue;
      if (day <= 5) beforeOrOn5th += amt;
      else after5th += amt;
    }

    balance += beforeOrOn5th;
    fyDeposits += beforeOrOn5th + after5th;
    totalInvestment += beforeOrOn5th + after5th;
    cumInv += beforeOrOn5th + after5th;

    const eligible = balance;
    const monthKey = `${y}-${String(m + 1).padStart(2, '0')}`;
    const rate =
      input.rateByMonth?.[monthKey] ?? input.annualRatePercent;
    const monthInterest = calculatePPFMonthlyInterest(eligible, rate);
    fyAccrued += monthInterest;
    fyInterest += monthInterest;

    balance += after5th;

    if (isFyEnd(y, m) || (y === endY && m === endM)) {
      const credited = roundPaise(fyAccrued);
      balance = roundPaise(balance + credited);
      totalInterest = roundPaise(totalInterest + credited);
      cumInt = roundPaise(cumInt + credited);
      fyAccrued = 0;
    }
  }

  if (fyLabel) {
    yearly.push({
      financialYear: fyLabel,
      openingBalance: roundPaise(fyOpen),
      deposits: roundPaise(fyDeposits),
      interestEarned: roundPaise(fyInterest),
      interestCredited: roundPaise(fyInterest),
      closingBalance: roundPaise(balance),
      cumulativeInvestment: roundPaise(cumInv),
      cumulativeInterest: roundPaise(cumInt),
    });
  }

  return {
    maturityValue: roundPaise(balance),
    totalInvestment: roundPaise(totalInvestment),
    totalInterest: roundPaise(totalInterest),
    yearlyBreakdown: yearly,
  };
}

function resolveEndDate(
  startIso: string,
  extensionMode: PpfExtensionMode,
  scheme: PpfSchemeConfig,
): string | null {
  const standard = getPPFMaturityDate(startIso, scheme);
  if (!standard) return null;
  if (extensionMode === 'standard') return standard;
  return getPPFExtendedMaturityDate(standard, 1, scheme);
}

export function calculatePpfFromInput(
  input: PpfInput,
  scheme: PpfSchemeConfig = DEFAULT_PPF_SCHEME,
): PpfResult | null {
  const startIso = input.startDate.trim();
  if (!parseIso(startIso)) return null;

  const rate = num(input.annualInterestRate);
  const inflation = num(input.inflationRate);
  if (rate == null || rate < 0 || rate > 50) return null;
  if (inflation == null || inflation < 0 || inflation > 50) return null;

  const endIso = resolveEndDate(startIso, input.extensionMode, scheme);
  if (!endIso) return null;

  let deposits: ResolvedDeposit[] = [];
  let scheduledAmount = 0;
  let freqLabel: PpfDepositFrequency | 'custom' = input.depositFrequency;

  if (input.investmentMode === 'fixed') {
    const amount = num(input.depositAmount);
    if (amount == null || amount <= 0) return null;
    if (amount % scheme.depositIncrement !== 0) return null;
    scheduledAmount = amount;
    const allowContributions =
      input.extensionMode !== 'extension-without-contributions';
    const contribEnd =
      input.extensionMode === 'extension-with-contributions'
        ? endIso
        : getPPFMaturityDate(startIso, scheme)!;
    // For extension-without-contributions: schedule only to standard maturity
    // For standard / with-contributions: schedule through endIso (or standard)
    const scheduleEnd =
      input.extensionMode === 'extension-without-contributions'
        ? getPPFMaturityDate(startIso, scheme)!
        : allowContributions
          ? contribEnd
          : getPPFMaturityDate(startIso, scheme)!;
    deposits = generateFixedDepositSchedule(
      startIso,
      scheduleEnd,
      amount,
      input.depositFrequency,
    );
  } else {
    freqLabel = 'custom';
    const parsed: { date: string; amount: number }[] = [];
    for (const row of input.customDeposits) {
      const a = num(row.amount);
      if (a == null || a <= 0) continue;
      if (!parseIso(row.date)) continue;
      if (a % scheme.depositIncrement !== 0) return null;
      parsed.push({ date: row.date, amount: a });
    }
    if (parsed.length === 0) return null;
    deposits = generateCustomDepositSchedule(parsed, startIso, endIso);
    scheduledAmount = deposits[0]?.amount ?? 0;
  }

  if (deposits.length === 0 && input.extensionMode !== 'extension-without-contributions') {
    return null;
  }

  const annualCheck = validatePPFAnnualInvestment(deposits, scheme);
  if (!annualCheck.ok) return null;

  // Minimum annual deposit for FYs that have contributions
  const byFy = new Map<string, number>();
  for (const d of deposits) {
    const fy = getIndianFinancialYear(d.date);
    if (!fy) continue;
    byFy.set(fy.label, (byFy.get(fy.label) ?? 0) + d.amount);
  }
  for (const total of byFy.values()) {
    if (total > 0 && total < scheme.minimumAnnualDeposit) return null;
  }

  const core = calculatePPFMaturity({
    startIso,
    maturityIso: endIso,
    deposits,
    annualRatePercent: rate,
  });
  if (!core) return null;

  // Reconciliation check
  const recon = roundPaise(core.totalInvestment + core.totalInterest);
  if (Math.abs(recon - core.maturityValue) > 1) {
    // Allow ₹1 tolerance for paise rounding across months
  }

  const openingFy = getIndianFinancialYear(startIso)!;
  const startD = parseIso(startIso)!;
  const endD = parseIso(endIso)!;
  const years =
    (endD.getUTCFullYear() - startD.getUTCFullYear()) +
    (endD.getUTCMonth() - startD.getUTCMonth()) / 12 +
    (endD.getUTCDate() - startD.getUTCDate()) / 365.25;

  const inflationAdj =
    calculatePPFInflationAdjustedValue(
      core.maturityValue,
      inflation,
      Math.max(0, years),
    ) ?? core.maturityValue;

  const initial = deposits[0]?.amount ?? 0;

  return {
    initialInvestment: initial,
    scheduledDepositAmount: scheduledAmount,
    depositFrequency: freqLabel,
    totalInvestment: core.totalInvestment,
    totalInterest: core.totalInterest,
    maturityValue: core.maturityValue,
    inflationAdjustedValue: roundPaise(inflationAdj),
    investmentYears: roundPaise(years * 100) / 100,
    numberOfDeposits: deposits.length,
    maturityDate: endIso,
    openingFinancialYear: openingFy.label,
    interestRateUsed: rate,
    inflationRateUsed: inflation,
    extensionMode: input.extensionMode,
    yearlyBreakdown: core.yearlyBreakdown,
    interpretation: `Illustrative PPF projection at a constant ${rate}% annual rate with 5th-day eligibility and FY-end interest credit. Opening FY ${openingFy.label}; maturity ${endIso}. Not a guaranteed return.`,
    formattedMaturity: formatCurrencyValue(core.maturityValue, INR),
    formattedInvestment: formatCurrencyValue(core.totalInvestment, INR),
    formattedInterest: formatCurrencyValue(core.totalInterest, INR),
    formattedInflationAdjusted: formatCurrencyValue(
      roundPaise(inflationAdj),
      INR,
    ),
    formattedInitial: formatCurrencyValue(initial, INR),
  };
}

export function buildPpfScheduleCsv(result: PpfResult): string {
  const header =
    'FinancialYear,OpeningBalance,Deposits,InterestEarned,InterestCredited,ClosingBalance,CumulativeInvestment,CumulativeInterest';
  const rows = result.yearlyBreakdown.map((r) =>
    [
      r.financialYear,
      r.openingBalance.toFixed(2),
      r.deposits.toFixed(2),
      r.interestEarned.toFixed(2),
      r.interestCredited.toFixed(2),
      r.closingBalance.toFixed(2),
      r.cumulativeInvestment.toFixed(2),
      r.cumulativeInterest.toFixed(2),
    ].join(','),
  );
  return [header, ...rows].join('\n');
}
