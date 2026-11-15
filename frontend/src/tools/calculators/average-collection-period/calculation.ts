import {
  isAverageArMethod,
  type AverageCollectionPeriodInput,
  type AverageCollectionPeriodResult,
} from './types';

function finite(value: number): boolean {
  return Number.isFinite(value);
}

export function averageAccountsReceivable(beginning: number, ending: number): number {
  return (beginning + ending) / 2;
}

function undefinedResult(
  input: AverageCollectionPeriodInput,
  explanation: string
): AverageCollectionPeriodResult {
  return {
    defined: false,
    explanation,
    method: input.method,
    collectionPeriodDays: null,
    averageReceivable: null,
    totalCreditSales: null,
    receivablesTurnoverRatio: null,
    durationDays: null,
    termsOfCreditDays: finite(input.termsOfCreditDays) ? input.termsOfCreditDays : null,
    currency: input.currency,
  };
}

/**
 * Average collection period (days).
 * - Average AR method: (average AR / total credit sales) × duration
 * - Turnover method: duration / receivables turnover ratio
 * Terms of credit are comparison-only and never enter the formula.
 */
export function calculateAverageCollectionPeriod(
  input: AverageCollectionPeriodInput
): AverageCollectionPeriodResult {
  const duration = input.durationDays;
  const terms = finite(input.termsOfCreditDays) ? input.termsOfCreditDays : null;

  if (!finite(duration) || duration <= 0) {
    return undefinedResult(input, 'Enter a duration greater than zero.');
  }

  if (isAverageArMethod(input)) {
    const average = finite(input.averageReceivable) ? input.averageReceivable : null;
    const sales = input.totalCreditSales;

    if (average === null || !finite(sales)) {
      return undefinedResult(
        input,
        'Enter average accounts receivable and total credit sales.'
      );
    }
    if (sales === 0 && average === 0) {
      return undefinedResult(
        input,
        'Average receivables and credit sales are both zero, so the collection period is indeterminate.'
      );
    }
    if (sales === 0) {
      return undefinedResult(
        input,
        'Total credit sales are zero, so the collection period cannot be calculated.'
      );
    }

    const days = (average / sales) * duration;
    if (!finite(days)) {
      return undefinedResult(input, 'This combination does not produce a finite result.');
    }

    return {
      defined: true,
      explanation: null,
      method: input.method,
      collectionPeriodDays: days,
      averageReceivable: average,
      totalCreditSales: sales,
      receivablesTurnoverRatio: null,
      durationDays: duration,
      termsOfCreditDays: terms,
      currency: input.currency,
    };
  }

  const turnover = input.receivablesTurnoverRatio;
  if (!finite(turnover)) {
    return undefinedResult(input, 'Enter the receivables turnover ratio.');
  }
  if (turnover === 0) {
    return undefinedResult(
      input,
      'Receivables turnover ratio is zero, so the collection period cannot be calculated.'
    );
  }

  const days = duration / turnover;
  if (!finite(days)) {
    return undefinedResult(input, 'This combination does not produce a finite result.');
  }

  return {
    defined: true,
    explanation: null,
    method: input.method,
    collectionPeriodDays: days,
    averageReceivable: null,
    totalCreditSales: null,
    receivablesTurnoverRatio: turnover,
    durationDays: duration,
    termsOfCreditDays: terms,
    currency: input.currency,
  };
}

export function describeResult(result: AverageCollectionPeriodResult): string {
  if (!result.defined || result.collectionPeriodDays === null) {
    return result.explanation ?? '';
  }
  const rounded = Math.round(result.collectionPeriodDays * 10000) / 10000;
  const daysText = new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rounded);
  if (
    result.termsOfCreditDays !== null &&
    Number.isFinite(result.termsOfCreditDays) &&
    result.termsOfCreditDays > 0
  ) {
    const terms = new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(
      result.termsOfCreditDays
    );
    if (result.collectionPeriodDays > result.termsOfCreditDays) {
      return `Average collection period is ${daysText} days, longer than the ${terms}-day credit terms.`;
    }
    if (result.collectionPeriodDays < result.termsOfCreditDays) {
      return `Average collection period is ${daysText} days, shorter than the ${terms}-day credit terms.`;
    }
    return `Average collection period is ${daysText} days, matching the stated credit terms.`;
  }
  return `Average collection period is ${daysText} days.`;
}
