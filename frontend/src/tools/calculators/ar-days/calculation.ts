import {
  averageBalanceIsInput,
  type ARDaysInput,
  type ARDaysResult,
  type BalanceMethod,
} from './types';

function finite(value: number): boolean {
  return Number.isFinite(value);
}

export function averageReceivable(beginning: number, ending: number): number {
  return (beginning + ending) / 2;
}

/** Receivables figure used in the DSO formula for the selected method. */
export function receivablesUsedForInputs(input: ARDaysInput): number | null {
  if (averageBalanceIsInput(input)) {
    if (!finite(input.beginningReceivable) || !finite(input.endingReceivable)) return null;
    return averageReceivable(input.beginningReceivable, input.endingReceivable);
  }
  return finite(input.accountsReceivable) ? input.accountsReceivable : null;
}

function undefinedResult(input: ARDaysInput, explanation: string): ARDaysResult {
  return {
    defined: false,
    explanation,
    balanceMethod: input.balanceMethod,
    arDays: null,
    accountsReceivableUsed: null,
    netCreditSales: null,
    periodDays: null,
    averageReceivable: null,
    currency: input.currency,
  };
}

function formatDayCount(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rounded);
}

function interpretation(arDays: number, method: BalanceMethod): string {
  const balance =
    method === 'average' ? 'The average receivables balance' : 'The receivables balance';
  if (arDays === 0) {
    return 'A/R days are 0. That is a defined result for these inputs, not a judgment about collections.';
  }
  return `${balance} lines up with ${formatDayCount(arDays)} days of net credit sales. Compare that span with your payment terms and with similar businesses.`;
}

/**
 * A/R days (DSO) = (accounts receivable / net credit sales) × days in period.
 * Average method substitutes (beginning + ending) / 2 for accounts receivable.
 */
export function calculateARDays(input: ARDaysInput): ARDaysResult {
  const average =
    finite(input.beginningReceivable) && finite(input.endingReceivable)
      ? averageReceivable(input.beginningReceivable, input.endingReceivable)
      : null;

  const receivables = receivablesUsedForInputs(input);
  const sales = input.netCreditSales;
  const days = input.periodDays;

  if (receivables === null || !finite(sales) || !finite(days)) {
    return undefinedResult(input, 'Enter accounts receivable, net credit sales, and the period length.');
  }

  if (sales === 0 && receivables === 0) {
    return undefinedResult(
      input,
      'Receivables and net credit sales are both zero, so A/R days is indeterminate.'
    );
  }
  if (sales === 0) {
    return undefinedResult(
      input,
      'Net credit sales are zero, so A/R days cannot be calculated.'
    );
  }
  if (days <= 0) {
    return undefinedResult(input, 'Days in the period must be greater than zero.');
  }

  const arDays = (receivables / sales) * days;
  if (!finite(arDays)) {
    return undefinedResult(
      input,
      'This combination does not produce a finite result. Check the amounts and the period length.'
    );
  }

  return {
    defined: true,
    explanation: null,
    balanceMethod: input.balanceMethod,
    arDays,
    accountsReceivableUsed: receivables,
    netCreditSales: sales,
    periodDays: days,
    averageReceivable: input.balanceMethod === 'average' ? average : null,
    currency: input.currency,
  };
}

export function describeResult(result: ARDaysResult): string {
  if (!result.defined || result.arDays === null) return result.explanation ?? '';
  return interpretation(result.arDays, result.balanceMethod);
}
