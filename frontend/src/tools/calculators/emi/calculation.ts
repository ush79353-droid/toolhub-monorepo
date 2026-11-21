/**
 * EMI Calculator — Equated Monthly Installment (ADR-018).
 *
 * EMI = P × r(1+r)^n / ((1+r)^n − 1)   (r = R/1200; n = months)
 * r = 0 → EMI = P / n
 * Nominal annual rate with monthly accrual (not EAR).
 */

import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  AmortizationEntry,
  EmiInput,
  EmiLoanSnapshot,
  EmiResult,
  EmiTermUnit,
  EmiYearlySummary,
} from './types';

const RATE_TOL = 1e-14;

function num(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function scale(currency: SupportedCurrency): number {
  return 10 ** getCurrencyFractionDigits(currency);
}

function toMinor(amount: number, currency: SupportedCurrency): number {
  return Math.round(amount * scale(currency));
}

function fromMinor(minor: number, currency: SupportedCurrency): number {
  return minor / scale(currency);
}

function money(n: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(
    fromMinor(toMinor(n, currency), currency),
    currency,
  );
}

export function formatPercent(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function resolveTermMonths(
  termValue: number,
  termUnit: EmiTermUnit,
): number | null {
  if (!Number.isFinite(termValue) || termValue <= 0) return null;
  if (!Number.isInteger(termValue)) return null;
  if (termUnit === 'months') return termValue;
  return termValue * 12;
}

export function calculateMonthlyInterestRate(annualRate: number): number | null {
  if (!Number.isFinite(annualRate) || annualRate < 0) return null;
  return annualRate / 1200;
}

export function calculateEMI(input: {
  principal: number;
  annualInterestRate: number;
  loanTermMonths: number;
}): {
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
  principal: number;
  totalPayments: number;
  monthlyInterestRate: number;
} | null {
  const { principal, annualInterestRate, loanTermMonths } = input;
  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(annualInterestRate) ||
    !Number.isFinite(loanTermMonths)
  ) {
    return null;
  }
  if (principal <= 0) return null;
  if (annualInterestRate < 0) return null;
  if (!Number.isInteger(loanTermMonths) || loanTermMonths <= 0) return null;

  const r = calculateMonthlyInterestRate(annualInterestRate);
  if (r == null) return null;

  let monthlyEMI: number;
  if (r < RATE_TOL) {
    monthlyEMI = principal / loanTermMonths;
  } else {
    const growth = (1 + r) ** loanTermMonths;
    if (!Number.isFinite(growth) || growth <= 1) return null;
    monthlyEMI = (principal * r * growth) / (growth - 1);
  }
  if (!Number.isFinite(monthlyEMI) || monthlyEMI < 0) return null;

  const totalPayable = monthlyEMI * loanTermMonths;
  const totalInterest = totalPayable - principal;
  if (!Number.isFinite(totalPayable) || !Number.isFinite(totalInterest)) {
    return null;
  }

  return {
    monthlyEMI,
    totalInterest,
    totalPayable,
    principal,
    totalPayments: loanTermMonths,
    monthlyInterestRate: r,
  };
}

export function calculateTotalInterest(
  monthlyEMI: number,
  totalMonths: number,
  principal: number,
): number | null {
  if (
    ![monthlyEMI, totalMonths, principal].every(Number.isFinite) ||
    totalMonths <= 0
  ) {
    return null;
  }
  return monthlyEMI * totalMonths - principal;
}

export function generateAmortizationSchedule(input: {
  principal: number;
  annualInterestRate: number;
  loanTermMonths: number;
  extraMonthlyPayment?: number;
  currency: SupportedCurrency;
}): AmortizationEntry[] | null {
  const core = calculateEMI({
    principal: input.principal,
    annualInterestRate: input.annualInterestRate,
    loanTermMonths: input.loanTermMonths,
  });
  if (!core) return null;

  const currency = input.currency;
  const r = core.monthlyInterestRate;
  const emiMinor = toMinor(core.monthlyEMI, currency);
  const extraMinor = toMinor(
    Math.max(0, input.extraMonthlyPayment ?? 0),
    currency,
  );
  let balanceMinor = toMinor(input.principal, currency);
  const rows: AmortizationEntry[] = [];
  const maxMonths = input.loanTermMonths + (extraMinor > 0 ? input.loanTermMonths : 0);

  for (let month = 1; month <= maxMonths && balanceMinor > 0; month++) {
    const interestMinor =
      r < RATE_TOL ? 0 : Math.round(balanceMinor * r);
    const isLastScheduled =
      extraMinor === 0 && month >= input.loanTermMonths;
    let paymentMinor = emiMinor;
    let principalMinor = paymentMinor - interestMinor;
    let extraPaidMinor = 0;

    const canClear =
      principalMinor >= balanceMinor ||
      emiMinor >= balanceMinor + interestMinor ||
      isLastScheduled;

    if (canClear) {
      principalMinor = balanceMinor;
      paymentMinor = principalMinor + interestMinor;
      extraPaidMinor = 0;
      balanceMinor = 0;
    } else {
      balanceMinor -= principalMinor;
      if (extraMinor > 0 && balanceMinor > 0) {
        extraPaidMinor = Math.min(extraMinor, balanceMinor);
        balanceMinor -= extraPaidMinor;
      }
    }

    rows.push({
      month,
      payment: fromMinor(paymentMinor + extraPaidMinor, currency),
      principalPaid: fromMinor(principalMinor, currency),
      interestPaid: fromMinor(interestMinor, currency),
      remainingBalance: fromMinor(Math.max(0, balanceMinor), currency),
      extraPaid: fromMinor(extraPaidMinor, currency),
    });

    if (balanceMinor <= 0) break;
  }

  if (rows.length === 0) return null;
  const last = rows[rows.length - 1]!;
  last.remainingBalance = 0;
  return rows;
}

export function summarizeYearly(
  schedule: AmortizationEntry[],
): EmiYearlySummary[] {
  const map = new Map<number, EmiYearlySummary>();
  for (const row of schedule) {
    const year = Math.ceil(row.month / 12);
    const existing = map.get(year);
    if (!existing) {
      map.set(year, {
        year,
        payment: row.payment,
        principalPaid: row.principalPaid + row.extraPaid,
        interestPaid: row.interestPaid,
        endingBalance: row.remainingBalance,
      });
    } else {
      existing.payment += row.payment;
      existing.principalPaid += row.principalPaid + row.extraPaid;
      existing.interestPaid += row.interestPaid;
      existing.endingBalance = row.remainingBalance;
    }
  }
  return [...map.values()];
}

export function calculateOutstandingBalance(
  principal: number,
  annualRate: number,
  totalMonths: number,
  paymentsMade: number,
  currency: SupportedCurrency,
): number | null {
  if (
    !Number.isInteger(paymentsMade) ||
    paymentsMade < 0 ||
    paymentsMade > totalMonths
  ) {
    return null;
  }
  if (paymentsMade === 0) return principal;
  const schedule = generateAmortizationSchedule({
    principal,
    annualInterestRate: annualRate,
    loanTermMonths: totalMonths,
    currency,
  });
  if (!schedule) return null;
  const row = schedule[paymentsMade - 1];
  return row ? row.remainingBalance : null;
}

function snapshotLoan(
  principal: number,
  annualInterestRate: number,
  loanTermMonths: number,
): EmiLoanSnapshot | null {
  const core = calculateEMI({ principal, annualInterestRate, loanTermMonths });
  if (!core) return null;
  return {
    principal,
    annualInterestRate,
    loanTermMonths,
    monthlyEMI: core.monthlyEMI,
    totalPayable: core.totalPayable,
    totalInterest: core.totalInterest,
    totalPayments: core.totalPayments,
  };
}

export function calculateEmiFromInput(input: EmiInput): EmiResult | null {
  const principal = num(input.principal);
  const termValue = num(input.termValue);
  const annualInterestRate = num(input.annualInterestRate);
  if (principal == null || termValue == null || annualInterestRate == null) {
    return null;
  }

  const loanTermMonths = resolveTermMonths(termValue, input.termUnit);
  if (loanTermMonths == null) return null;

  const core = calculateEMI({
    principal,
    annualInterestRate,
    loanTermMonths,
  });
  if (!core) return null;

  const { currency } = input;
  const schedule = generateAmortizationSchedule({
    principal,
    annualInterestRate,
    loanTermMonths,
    currency,
  });
  if (!schedule) return null;

  const yearlySummary = summarizeYearly(schedule);
  const total = core.totalPayable;
  const principalRatioPercent =
    total > 0 ? (principal / total) * 100 : 100;
  const interestRatioPercent =
    total > 0 ? (core.totalInterest / total) * 100 : 0;

  let hasExtraPayment = false;
  let extraMonthlyPayment = 0;
  let scheduleWithExtra: AmortizationEntry[] | null = null;
  let payoffMonthsWithExtra: number | null = null;
  let totalInterestWithExtra: number | null = null;
  let interestSaved: number | null = null;
  let monthsSaved: number | null = null;

  if (input.enableExtraPayment) {
    const extra = num(input.extraMonthlyPayment);
    if (extra != null && extra > 0) {
      hasExtraPayment = true;
      extraMonthlyPayment = extra;
      scheduleWithExtra = generateAmortizationSchedule({
        principal,
        annualInterestRate,
        loanTermMonths,
        extraMonthlyPayment: extra,
        currency,
      });
      if (scheduleWithExtra) {
        payoffMonthsWithExtra = scheduleWithExtra.length;
        totalInterestWithExtra = scheduleWithExtra.reduce(
          (s, row) => s + row.interestPaid,
          0,
        );
        interestSaved = core.totalInterest - totalInterestWithExtra;
        monthsSaved = loanTermMonths - payoffMonthsWithExtra;
      }
    }
  }

  let paymentsMade: number | null = null;
  let outstandingBalance: number | null = null;
  let principalRepaidToDate: number | null = null;
  let interestPaidToDate: number | null = null;
  let remainingInstallments: number | null = null;

  if (input.enableBalanceLookup) {
    const k = num(input.paymentsMade);
    if (k != null && Number.isInteger(k) && k >= 0 && k <= loanTermMonths) {
      paymentsMade = k;
      if (k === 0) {
        outstandingBalance = principal;
        principalRepaidToDate = 0;
        interestPaidToDate = 0;
        remainingInstallments = loanTermMonths;
      } else {
        const row = schedule[k - 1];
        if (row) {
          outstandingBalance = row.remainingBalance;
          principalRepaidToDate = principal - row.remainingBalance;
          interestPaidToDate = schedule
            .slice(0, k)
            .reduce((s, r) => s + r.interestPaid, 0);
          remainingInstallments = loanTermMonths - k;
        }
      }
    }
  }

  let comparison: EmiResult['comparison'] = null;
  if (input.enableComparison) {
    const pB = num(input.comparePrincipal);
    const rB = num(input.compareRate);
    const tB = num(input.compareTermValue);
    if (pB != null && rB != null && tB != null) {
      const monthsB = resolveTermMonths(tB, input.compareTermUnit);
      const loanA = snapshotLoan(principal, annualInterestRate, loanTermMonths);
      const loanB =
        monthsB != null ? snapshotLoan(pB, rB, monthsB) : null;
      if (loanA && loanB) {
        comparison = {
          loanA,
          loanB,
          emiDiff: loanB.monthlyEMI - loanA.monthlyEMI,
          interestDiff: loanB.totalInterest - loanA.totalInterest,
          payableDiff: loanB.totalPayable - loanA.totalPayable,
        };
      }
    }
  }

  const termLabel =
    input.termUnit === 'years'
      ? `${termValue} year${termValue === 1 ? '' : 's'} (${loanTermMonths} months)`
      : `${loanTermMonths} month${loanTermMonths === 1 ? '' : 's'}`;

  const steps = [
    `Principal P = ${money(principal, currency)}`,
    `Nominal annual rate R = ${formatPercent(annualInterestRate)}`,
    `Monthly rate r = R / 1200 = ${core.monthlyInterestRate.toExponential(6)}`,
    `Number of installments n = ${loanTermMonths}`,
    annualInterestRate === 0
      ? `EMI = P / n = ${money(core.monthlyEMI, currency)}`
      : `EMI = P × r(1+r)^n / ((1+r)^n − 1) = ${money(core.monthlyEMI, currency)}`,
    `Total payable = EMI × n = ${money(core.totalPayable, currency)}`,
    `Total interest = Total − P = ${money(core.totalInterest, currency)}`,
  ];

  const formulaBreakdown = [
    'EMI = P × r(1+r)^n / ((1+r)^n − 1)',
    'r = R / 1200 (nominal annual %, monthly accrual)',
    'n = term in months',
    'Total payable = EMI × n (using unrounded EMI)',
    'Total interest = Total payable − Principal',
  ].join('\n');

  const interpretation = `For a loan of ${money(principal, currency)} at a fixed nominal annual interest rate of ${formatPercent(annualInterestRate)} over ${termLabel}, your estimated monthly EMI is ${money(core.monthlyEMI, currency)}.`;

  const explanation =
    'Assumes a fixed-rate reducing-balance loan with monthly accrual. Excludes lender fees, insurance, taxes, and penalties. Extra payments (if enabled) reduce principal after each month’s interest.';

  return {
    currency,
    principal,
    annualInterestRate,
    loanTermMonths,
    termLabel,
    monthlyInterestRate: core.monthlyInterestRate,
    monthlyEMI: core.monthlyEMI,
    totalPayable: core.totalPayable,
    totalInterest: core.totalInterest,
    totalPayments: core.totalPayments,
    principalRatioPercent,
    interestRatioPercent,
    schedule,
    yearlySummary,
    hasExtraPayment,
    extraMonthlyPayment,
    payoffMonthsWithExtra,
    totalInterestWithExtra,
    interestSaved,
    monthsSaved,
    scheduleWithExtra,
    paymentsMade,
    outstandingBalance,
    principalRepaidToDate,
    interestPaidToDate,
    remainingInstallments,
    comparison,
    formattedPrincipal: money(principal, currency),
    formattedEMI: money(core.monthlyEMI, currency),
    formattedTotalPayable: money(core.totalPayable, currency),
    formattedTotalInterest: money(core.totalInterest, currency),
    formulaBreakdown,
    steps,
    interpretation,
    explanation,
  };
}

export function buildAmortizationCsv(
  schedule: AmortizationEntry[],
  currency: SupportedCurrency,
): string {
  const header = 'Month,Payment,Principal,Interest,Extra,Balance';
  const lines = schedule.map((row) =>
    [
      row.month,
      row.payment.toFixed(getCurrencyFractionDigits(currency)),
      row.principalPaid.toFixed(getCurrencyFractionDigits(currency)),
      row.interestPaid.toFixed(getCurrencyFractionDigits(currency)),
      row.extraPaid.toFixed(getCurrencyFractionDigits(currency)),
      row.remainingBalance.toFixed(getCurrencyFractionDigits(currency)),
    ].join(','),
  );
  return [header, ...lines].join('\n');
}
