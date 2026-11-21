import {
  calculateAccountsReceivableTurnover,
  calculateAverageAccountsReceivable,
  calculateDaysSalesOutstanding,
  formatDays,
  formatDsoMoney,
  formatTurnover,
  interpretDso,
} from './calculation';
import type { DsoFieldErrors, DsoInput, DsoResult } from './types';

export interface DsoValidation {
  isValid: boolean;
  errors: DsoFieldErrors;
  result: DsoResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateDsoInput(input: DsoInput): DsoValidation {
  const errors: DsoFieldErrors = {};
  const currency = input.currency;

  let averageAr: number | null = null;

  if (input.averageReceivablesMode === 'calculated') {
    const beg = parseNumber(input.beginningAccountsReceivable);
    const end = parseNumber(input.endingAccountsReceivable);

    if (!beg.blank) {
      if (beg.invalid || beg.value === null) {
        errors.beginningAccountsReceivable =
          'Enter a valid beginning accounts receivable.';
      } else if (beg.value < 0) {
        errors.beginningAccountsReceivable =
          'Beginning accounts receivable cannot be negative.';
      }
    }
    if (!end.blank) {
      if (end.invalid || end.value === null) {
        errors.endingAccountsReceivable =
          'Enter a valid ending accounts receivable.';
      } else if (end.value < 0) {
        errors.endingAccountsReceivable =
          'Ending accounts receivable cannot be negative.';
      }
    }

    if (
      !beg.blank &&
      !end.blank &&
      beg.value !== null &&
      end.value !== null &&
      beg.value >= 0 &&
      end.value >= 0 &&
      !beg.invalid &&
      !end.invalid
    ) {
      averageAr = calculateAverageAccountsReceivable(beg.value, end.value);
    }
  } else {
    const manual = parseNumber(input.manualAverageReceivables);
    if (!manual.blank) {
      if (manual.invalid || manual.value === null) {
        errors.manualAverageReceivables =
          'Enter a valid average accounts receivable.';
      } else if (manual.value < 0) {
        errors.manualAverageReceivables =
          'Average accounts receivable cannot be negative.';
      } else {
        averageAr = manual.value;
      }
    }
  }

  const salesParsed = parseNumber(input.sales);
  if (!salesParsed.blank) {
    if (salesParsed.invalid || salesParsed.value === null) {
      errors.sales =
        input.salesBasis === 'netCreditSales'
          ? 'Enter a valid net credit sales amount.'
          : 'Enter a valid total sales amount.';
    } else if (salesParsed.value < 0) {
      errors.sales =
        input.salesBasis === 'netCreditSales'
          ? 'Net credit sales cannot be negative.'
          : 'Total sales cannot be negative.';
    }
  }

  const periodParsed = parseNumber(input.accountingPeriodDays);
  if (periodParsed.blank) {
    errors.accountingPeriodDays = 'Enter days in the accounting period.';
  } else if (periodParsed.invalid || periodParsed.value === null) {
    errors.accountingPeriodDays = 'Enter a valid period in days.';
  } else if (periodParsed.value <= 0) {
    errors.accountingPeriodDays = 'Period must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    averageAr === null ||
    salesParsed.blank ||
    salesParsed.value === null ||
    periodParsed.blank ||
    periodParsed.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const sales = salesParsed.value;
  const periodDays = periodParsed.value;

  if (sales === 0) {
    return {
      isValid: false,
      errors: {
        sales:
          'DSO is undefined when sales are zero. Enter positive sales for the period. Net credit sales is generally preferable when available; total sales is a proxy when credit sales are unknown.',
      },
      result: null,
    };
  }

  const dso = calculateDaysSalesOutstanding(averageAr, sales, periodDays);
  if (dso === null) {
    return { isValid: false, errors, result: null };
  }

  const turnover = calculateAccountsReceivableTurnover(sales, averageAr);
  const warningMessage =
    averageAr === 0 && sales > 0
      ? 'Zero average receivables with positive sales yields DSO of 0 days. AR turnover is unavailable (division by zero).'
      : input.salesBasis === 'totalSales'
        ? 'Total sales is the reference default denominator. If cash sales are material, DSO may be understated versus a net-credit-sales basis.'
        : 'Net credit sales is used as the DSO denominator; generally preferable when receivables arise from credit sales.';

  const result: DsoResult = {
    averageAccountsReceivable: averageAr,
    activeSales: sales,
    salesBasis: input.salesBasis,
    accountingPeriodDays: periodDays,
    daysSalesOutstanding: dso,
    accountsReceivableTurnover: turnover,
    status: 'valid',
    interpretation: interpretDso(dso, averageAr, sales),
    warningMessage,
    currency,
    formattedAverageAccountsReceivable: formatDsoMoney(averageAr, currency),
    formattedActiveSales: formatDsoMoney(sales, currency),
    formattedAccountingPeriodDays: formatDays(periodDays),
    formattedDaysSalesOutstanding: formatDays(dso),
    formattedAccountsReceivableTurnover:
      turnover === null ? null : formatTurnover(turnover),
  };

  return { isValid: true, errors, result };
}
