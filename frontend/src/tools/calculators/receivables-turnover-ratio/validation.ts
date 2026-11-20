import {
  calculateAverageAccountsReceivable,
  calculateReceivablesTurnoverRatio,
  formatRtrMoney,
  formatRtrRatio,
  interpretReceivablesTurnover,
} from './calculation';
import type {
  ReceivablesTurnoverFieldErrors,
  ReceivablesTurnoverInput,
  ReceivablesTurnoverResult,
  ReceivablesTurnoverStatus,
} from './types';

export interface ReceivablesTurnoverValidation {
  isValid: boolean;
  errors: ReceivablesTurnoverFieldErrors;
  result: ReceivablesTurnoverResult | null;
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

export function validateReceivablesTurnoverInput(
  input: ReceivablesTurnoverInput
): ReceivablesTurnoverValidation {
  const errors: ReceivablesTurnoverFieldErrors = {};
  const currency = input.currency;

  const sales = parseNumber(input.netCreditSales);
  const opening = parseNumber(input.openingAccountsReceivable);
  const closing = parseNumber(input.closingAccountsReceivable);

  if (!sales.blank) {
    if (sales.invalid || sales.value === null) {
      errors.netCreditSales = 'Enter a valid net credit sales amount.';
    } else if (sales.value < 0) {
      errors.netCreditSales = 'Net credit sales cannot be negative.';
    }
  }
  if (!opening.blank) {
    if (opening.invalid || opening.value === null) {
      errors.openingAccountsReceivable =
        'Enter a valid opening accounts receivable.';
    } else if (opening.value < 0) {
      errors.openingAccountsReceivable =
        'Opening accounts receivable cannot be negative.';
    }
  }
  if (!closing.blank) {
    if (closing.invalid || closing.value === null) {
      errors.closingAccountsReceivable =
        'Enter a valid closing accounts receivable.';
    } else if (closing.value < 0) {
      errors.closingAccountsReceivable =
        'Closing accounts receivable cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const openingReady =
    !opening.blank && opening.value !== null;
  const closingReady =
    !closing.blank && closing.value !== null;

  if (!openingReady || !closingReady) {
    return { isValid: false, errors, result: null };
  }

  const averageAccountsReceivable = calculateAverageAccountsReceivable(
    opening.value!,
    closing.value!
  );
  if (averageAccountsReceivable === null) {
    return { isValid: false, errors, result: null };
  }

  const salesReady = !sales.blank && sales.value !== null;
  let receivablesTurnoverRatio: number | null = null;
  let netCreditSales: number | null = null;

  if (salesReady) {
    netCreditSales = sales.value;
    receivablesTurnoverRatio = calculateReceivablesTurnoverRatio(
      netCreditSales!,
      averageAccountsReceivable
    );
  }

  let status: ReceivablesTurnoverStatus = salesReady ? 'valid' : 'partial';
  let warningMessage: string | null =
    'Receivables turnover = Net Credit Sales ÷ Average AR. Use net credit sales (not total revenue including cash sales). Amounts share one currency label (no FX). The ratio is dimensionless (times per period), not a percentage.';

  if (averageAccountsReceivable === 0) {
    status = 'undefinedTurnover';
    warningMessage =
      'Receivables turnover ratio is undefined because average accounts receivable is zero.';
  } else if (
    salesReady &&
    receivablesTurnoverRatio !== null &&
    Math.abs(receivablesTurnoverRatio) < 5e-12
  ) {
    status = 'zeroTurnover';
  } else if (!salesReady) {
    warningMessage =
      'Average AR calculated. Enter net credit sales to compute the turnover ratio.';
  }

  const result: ReceivablesTurnoverResult = {
    netCreditSales,
    openingAccountsReceivable: opening.value!,
    closingAccountsReceivable: closing.value!,
    averageAccountsReceivable,
    receivablesTurnoverRatio,
    status,
    interpretation: interpretReceivablesTurnover(
      receivablesTurnoverRatio,
      averageAccountsReceivable,
      netCreditSales
    ),
    warningMessage,
    currency,
    formattedNetCreditSales:
      netCreditSales === null
        ? null
        : formatRtrMoney(netCreditSales, currency),
    formattedOpeningAR: formatRtrMoney(opening.value!, currency),
    formattedClosingAR: formatRtrMoney(closing.value!, currency),
    formattedAverageAR: formatRtrMoney(averageAccountsReceivable, currency),
    formattedTurnoverRatio:
      receivablesTurnoverRatio === null
        ? null
        : formatRtrRatio(receivablesTurnoverRatio),
  };

  return { isValid: true, errors, result };
}
