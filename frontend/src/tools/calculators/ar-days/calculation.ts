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

/**
 * Receivables figure the formula will use.
 * Average balances are used only when that method is selected and receivables are known.
 */
export function receivablesUsedForInputs(input: ARDaysInput): number | null {
  if (input.solveFor === 'receivables') return null;
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
    solveFor: input.solveFor,
    balanceMethod: input.balanceMethod,
    arDays: null,
    accountsReceivableUsed: null,
    netCreditSales: null,
    periodDays: null,
    averageReceivable: null,
    receivablesTurnover: null,
    formula: null,
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
    return 'A/R days are 0. That is a defined result for these inputs, not a judgment about collections. Compare any positive result with your payment terms and with similar businesses.';
  }
  return `${balance} lines up with ${formatDayCount(arDays)} days of net credit sales in this calculation. Compare that span with the terms you offer and with similar businesses. A shorter or longer result is not, by itself, a verdict.`;
}

function finish(
  input: ARDaysInput,
  values: { receivables: number; sales: number; days: number; arDays: number },
  average: number | null
): ARDaysResult {
  const { receivables, sales, days, arDays } = values;
  if (![receivables, sales, days, arDays].every(finite)) {
    return undefinedResult(
      input,
      'This combination does not produce a finite result. Check the amounts and the period length.'
    );
  }
  return {
    defined: true,
    explanation: null,
    solveFor: input.solveFor,
    balanceMethod: input.balanceMethod,
    arDays,
    accountsReceivableUsed: receivables,
    netCreditSales: sales,
    periodDays: days,
    averageReceivable: average,
    receivablesTurnover: receivables === 0 ? null : sales / receivables,
    formula: { receivables, netCreditSales: sales, periodDays: days, arDays },
    currency: input.currency,
  };
}

export function calculateARDays(input: ARDaysInput): ARDaysResult {
  const average = averageBalanceIsInput(input)
    ? averageReceivable(input.beginningReceivable, input.endingReceivable)
    : null;

  if (input.solveFor === 'arDays') {
    const receivables = average ?? input.accountsReceivable;
    const sales = input.netCreditSales;
    const days = input.periodDays;
    if (sales === 0 && receivables === 0) {
      return undefinedResult(
        input,
        'Receivables and net credit sales are both zero, so A/R days is indeterminate.'
      );
    }
    if (sales === 0) {
      return undefinedResult(
        input,
        'Net credit sales are zero, so A/R days cannot be calculated. A zero denominator makes the ratio undefined.'
      );
    }
    if (days === 0) {
      return undefinedResult(input, 'A period of zero days cannot be used in the A/R days formula.');
    }
    return finish(input, { receivables, sales, days, arDays: (receivables / sales) * days }, average);
  }

  if (input.solveFor === 'receivables') {
    const arDays = input.arDays;
    const sales = input.netCreditSales;
    const days = input.periodDays;
    if (days === 0 && arDays * sales === 0) {
      return undefinedResult(
        input,
        'The period length is zero and the other factors are zero, so receivables are indeterminate.'
      );
    }
    if (days === 0) {
      return undefinedResult(
        input,
        'The period length is zero, so receivables cannot be solved. Division by zero is undefined.'
      );
    }
    const receivables = (arDays * sales) / days;
    return finish(input, { receivables, sales, days, arDays }, null);
  }

  if (input.solveFor === 'creditSales') {
    const receivables = average ?? input.accountsReceivable;
    const arDays = input.arDays;
    const days = input.periodDays;
    if (arDays === 0 && receivables === 0) {
      return undefinedResult(
        input,
        'A/R days and receivables are both zero, so net credit sales are indeterminate.'
      );
    }
    if (arDays === 0) {
      return undefinedResult(
        input,
        'A/R days are zero while receivables are not, so net credit sales would have to be unlimited. The result is undefined.'
      );
    }
    const sales = (receivables * days) / arDays;
    return finish(input, { receivables, sales, days, arDays }, average);
  }

  const receivables = average ?? input.accountsReceivable;
  const arDays = input.arDays;
  const sales = input.netCreditSales;
  if (receivables === 0 && arDays * sales === 0) {
    return undefinedResult(
      input,
      'Receivables are zero and the numerator is zero, so the period length is indeterminate.'
    );
  }
  if (receivables === 0) {
    return undefinedResult(
      input,
      'Receivables are zero, so the period length cannot be solved. Division by zero is undefined.'
    );
  }
  const days = (arDays * sales) / receivables;
  return finish(input, { receivables, sales, days, arDays }, average);
}

export function describeResult(result: ARDaysResult): string {
  if (!result.defined || result.arDays === null) return result.explanation ?? '';
  return interpretation(result.arDays, result.balanceMethod);
}
