import {
  formatCurrencyValue,
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  AdjustmentDirection,
  BankReconciliationResult,
  ReconciliationAdjustment,
  ReconciliationStatus,
} from './types';

export interface ParsedAdjustment {
  description: string;
  amount: number;
  direction: AdjustmentDirection;
}

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function signedAdjustmentAmount(
  amount: number,
  direction: AdjustmentDirection,
): number {
  if (!Number.isFinite(amount) || amount < 0) return Number.NaN;
  return direction === 'add' ? amount : -amount;
}

export function sumDirectedAdjustments(
  adjustments: readonly ParsedAdjustment[],
): { additions: number; deductions: number; net: number } {
  let additions = 0;
  let deductions = 0;
  for (const adj of adjustments) {
    if (!(adj.amount > 0)) continue;
    if (adj.direction === 'add') additions += adj.amount;
    else deductions += adj.amount;
  }
  return { additions, deductions, net: additions - deductions };
}

export function calculateAdjustedCashbookBalance(
  cashbookBalance: number,
  fixed: {
    interestEarned: number;
    bankCharges: number;
    nsfChecks: number;
    automaticPayments: number;
  },
  extras: readonly ParsedAdjustment[],
  currency: SupportedCurrency,
): {
  adjusted: number;
  additions: number;
  deductions: number;
} | null {
  if (!Number.isFinite(cashbookBalance)) return null;
  const values = [
    fixed.interestEarned,
    fixed.bankCharges,
    fixed.nsfChecks,
    fixed.automaticPayments,
  ];
  if (!values.every((v) => Number.isFinite(v) && v >= 0)) return null;

  const extra = sumDirectedAdjustments(extras);
  const additions = fixed.interestEarned + extra.additions;
  const deductions =
    fixed.bankCharges +
    fixed.nsfChecks +
    fixed.automaticPayments +
    extra.deductions;
  const adjusted = roundMoney(
    cashbookBalance + additions - deductions,
    currency,
  );
  return {
    adjusted,
    additions: roundMoney(additions, currency),
    deductions: roundMoney(deductions, currency),
  };
}

export function calculateAdjustedBankStatementBalance(
  bankStatementBalance: number,
  fixed: {
    depositsInTransit: number;
    outstandingChecks: number;
  },
  extras: readonly ParsedAdjustment[],
  currency: SupportedCurrency,
): {
  adjusted: number;
  additions: number;
  deductions: number;
} | null {
  if (!Number.isFinite(bankStatementBalance)) return null;
  if (
    ![fixed.depositsInTransit, fixed.outstandingChecks].every(
      (v) => Number.isFinite(v) && v >= 0,
    )
  ) {
    return null;
  }

  const extra = sumDirectedAdjustments(extras);
  const additions = fixed.depositsInTransit + extra.additions;
  const deductions = fixed.outstandingChecks + extra.deductions;
  const adjusted = roundMoney(
    bankStatementBalance + additions - deductions,
    currency,
  );
  return {
    adjusted,
    additions: roundMoney(additions, currency),
    deductions: roundMoney(deductions, currency),
  };
}

export function calculateBankReconciliation(input: {
  cashbookBalance: number;
  bankStatementBalance: number;
  interestEarned: number;
  bankCharges: number;
  nsfChecks: number;
  automaticPayments: number;
  depositsInTransit: number;
  outstandingChecks: number;
  cashbookExtras: readonly ParsedAdjustment[];
  bankExtras: readonly ParsedAdjustment[];
  currency: SupportedCurrency;
}): BankReconciliationResult | null {
  const cash = calculateAdjustedCashbookBalance(
    input.cashbookBalance,
    {
      interestEarned: input.interestEarned,
      bankCharges: input.bankCharges,
      nsfChecks: input.nsfChecks,
      automaticPayments: input.automaticPayments,
    },
    input.cashbookExtras,
    input.currency,
  );
  const bank = calculateAdjustedBankStatementBalance(
    input.bankStatementBalance,
    {
      depositsInTransit: input.depositsInTransit,
      outstandingChecks: input.outstandingChecks,
    },
    input.bankExtras,
    input.currency,
  );
  if (!cash || !bank) return null;

  const difference = roundMoney(
    cash.adjusted - bank.adjusted,
    input.currency,
  );
  const unreconciledAmount = Math.abs(difference);
  const isReconciled = difference === 0;
  const status: ReconciliationStatus = isReconciled
    ? 'reconciled'
    : 'unreconciled';

  const cashbookAdjustmentCount =
    [input.interestEarned, input.bankCharges, input.nsfChecks, input.automaticPayments].filter(
      (v) => v > 0,
    ).length + input.cashbookExtras.filter((a) => a.amount > 0).length;

  const bankAdjustmentCount =
    [input.depositsInTransit, input.outstandingChecks].filter((v) => v > 0).length +
    input.bankExtras.filter((a) => a.amount > 0).length;

  return {
    cashbookBalance: roundMoney(input.cashbookBalance, input.currency),
    bankStatementBalance: roundMoney(input.bankStatementBalance, input.currency),
    totalCashbookAdditions: cash.additions,
    totalCashbookDeductions: cash.deductions,
    totalBankAdditions: bank.additions,
    totalBankDeductions: bank.deductions,
    cashbookAdjustmentCount,
    bankAdjustmentCount,
    adjustedCashbookBalance: cash.adjusted,
    adjustedBankStatementBalance: bank.adjusted,
    reconciliationDifference: difference,
    unreconciledAmount,
    isReconciled,
    status,
    currency: input.currency,
  };
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

export function shareReconciliationText(result: BankReconciliationResult): string {
  return [
    'Bank Reconciliation Calculator — Omega Calculators',
    `Cashbook balance: ${formatMoney(result.cashbookBalance, result.currency)}`,
    `Adjusted cashbook: ${formatMoney(result.adjustedCashbookBalance, result.currency)}`,
    `Bank statement balance: ${formatMoney(result.bankStatementBalance, result.currency)}`,
    `Adjusted bank statement: ${formatMoney(result.adjustedBankStatementBalance, result.currency)}`,
    `Difference: ${formatMoney(result.unreconciledAmount, result.currency)}`,
    `Status: ${result.status}`,
  ].join('\n');
}

export function parseExtraRows(
  rows: readonly ReconciliationAdjustment[],
): ParsedAdjustment[] {
  const parsed: ParsedAdjustment[] = [];
  for (const row of rows) {
    const desc = row.description.trim();
    const amountRaw = row.amount.trim();
    if (!desc && !amountRaw) continue;
    const amount = Number(amountRaw);
    if (!Number.isFinite(amount) || amount < 0) continue;
    if (amount === 0 && !desc) continue;
    if (!(amount > 0)) continue;
    parsed.push({
      description: desc || 'Adjustment',
      amount,
      direction: row.direction,
    });
  }
  return parsed;
}
