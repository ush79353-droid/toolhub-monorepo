import {
  calculateBankReconciliation,
  parseExtraRows,
} from './calculation';
import type {
  BankReconciliationFieldErrors,
  BankReconciliationInput,
  BankReconciliationResult,
  ReconciliationAdjustment,
} from './types';

function parseOptionalNonNeg(val: string): number | null | typeof Number.NaN {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

function parseRequiredBalance(val: string): number | null | typeof Number.NaN {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

function validateExtraRows(
  rows: readonly ReconciliationAdjustment[],
  prefix: string,
  errors: BankReconciliationFieldErrors,
): void {
  for (const row of rows) {
    const desc = row.description.trim();
    const amountRaw = row.amount.trim();
    if (!desc && !amountRaw) continue;
    if (desc && !amountRaw) {
      errors[`${prefix}-${row.id}-amount`] = 'Enter an amount for this adjustment';
      continue;
    }
    if (!desc && amountRaw) {
      errors[`${prefix}-${row.id}-description`] =
        'Enter a description for this adjustment';
    }
    const amount = Number(amountRaw);
    if (!Number.isFinite(amount) || amount < 0) {
      errors[`${prefix}-${row.id}-amount`] = 'Enter a nonnegative amount';
    }
  }
}

export function validateBankReconciliationInput(
  input: BankReconciliationInput,
): {
  isValid: boolean;
  errors: BankReconciliationFieldErrors;
  result: BankReconciliationResult | null;
  incomplete: boolean;
} {
  const errors: BankReconciliationFieldErrors = {};

  const cashbook = parseRequiredBalance(input.cashbookBalance);
  const bank = parseRequiredBalance(input.bankStatementBalance);

  if (cashbook === null || bank === null) {
    validateExtraRows(input.cashbookExtra, 'cash', errors);
    validateExtraRows(input.bankExtra, 'bank', errors);
    return {
      isValid: false,
      errors,
      result: null,
      incomplete: true,
    };
  }

  if (Number.isNaN(cashbook)) {
    errors.cashbookBalance = 'Enter a valid cashbook balance';
  }
  if (Number.isNaN(bank)) {
    errors.bankStatementBalance = 'Enter a valid bank statement balance';
  }

  const optionalFields: Array<{
    key: keyof BankReconciliationFieldErrors;
    value: string;
    label: string;
  }> = [
    { key: 'bankCharges', value: input.bankCharges, label: 'bank charges' },
    { key: 'nsfChecks', value: input.nsfChecks, label: 'NSF / returned checks' },
    {
      key: 'automaticPayments',
      value: input.automaticPayments,
      label: 'automatic payments',
    },
    { key: 'interestEarned', value: input.interestEarned, label: 'interest earned' },
    {
      key: 'depositsInTransit',
      value: input.depositsInTransit,
      label: 'deposits in transit',
    },
    {
      key: 'outstandingChecks',
      value: input.outstandingChecks,
      label: 'outstanding checks',
    },
  ];

  const parsedOptional: Record<string, number> = {};
  for (const field of optionalFields) {
    const parsed = parseOptionalNonNeg(field.value);
    if (parsed === null) {
      parsedOptional[field.key as string] = 0;
      continue;
    }
    if (Number.isNaN(parsed) || (parsed as number) < 0) {
      errors[field.key] = `Enter a valid nonnegative amount for ${field.label}`;
      parsedOptional[field.key as string] = 0;
    } else {
      parsedOptional[field.key as string] = parsed as number;
    }
  }

  validateExtraRows(input.cashbookExtra, 'cash', errors);
  validateExtraRows(input.bankExtra, 'bank', errors);

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, result: null, incomplete: false };
  }

  const result = calculateBankReconciliation({
    cashbookBalance: cashbook as number,
    bankStatementBalance: bank as number,
    interestEarned: parsedOptional.interestEarned ?? 0,
    bankCharges: parsedOptional.bankCharges ?? 0,
    nsfChecks: parsedOptional.nsfChecks ?? 0,
    automaticPayments: parsedOptional.automaticPayments ?? 0,
    depositsInTransit: parsedOptional.depositsInTransit ?? 0,
    outstandingChecks: parsedOptional.outstandingChecks ?? 0,
    cashbookExtras: parseExtraRows(input.cashbookExtra),
    bankExtras: parseExtraRows(input.bankExtra),
    currency: input.currency,
  });

  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate bank reconciliation with the current inputs.' },
      result: null,
      incomplete: false,
    };
  }

  return { isValid: true, errors, result, incomplete: false };
}
