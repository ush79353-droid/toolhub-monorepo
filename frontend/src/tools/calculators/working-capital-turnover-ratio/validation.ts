import {
  calculateAverageBalance,
  calculateAverageWorkingCapitalFromAverages,
  calculateWorkingCapitalTurnover,
  formatMoney,
  formatWcTurnover,
  interpretWctr,
} from './calculation';
import type {
  WorkingCapitalTurnoverRatioFieldErrors,
  WorkingCapitalTurnoverRatioInput,
  WorkingCapitalTurnoverRatioResult,
  WctrStatus,
} from './types';

export interface WorkingCapitalTurnoverRatioValidation {
  isValid: boolean;
  errors: WorkingCapitalTurnoverRatioFieldErrors;
  result: WorkingCapitalTurnoverRatioResult | null;
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

type FieldKey = keyof WorkingCapitalTurnoverRatioFieldErrors;

function checkNonneg(
  parsed: ReturnType<typeof parseNumber>,
  key: FieldKey,
  label: string,
  errors: WorkingCapitalTurnoverRatioFieldErrors
): void {
  if (parsed.blank) return;
  if (parsed.invalid || parsed.value === null) {
    errors[key] = `Enter a valid ${label}.`;
  } else if (parsed.value < 0) {
    errors[key] = `${label.charAt(0).toUpperCase()}${label.slice(1)} cannot be negative.`;
  }
}

export function validateWorkingCapitalTurnoverRatioInput(
  input: WorkingCapitalTurnoverRatioInput
): WorkingCapitalTurnoverRatioValidation {
  const errors: WorkingCapitalTurnoverRatioFieldErrors = {};
  const currency = input.currency;

  const oca = parseNumber(input.openingCurrentAssets);
  const cca = parseNumber(input.closingCurrentAssets);
  const ocl = parseNumber(input.openingCurrentLiabilities);
  const ccl = parseNumber(input.closingCurrentLiabilities);
  const rev = parseNumber(input.revenue);

  checkNonneg(oca, 'openingCurrentAssets', 'opening current assets amount', errors);
  checkNonneg(cca, 'closingCurrentAssets', 'closing current assets amount', errors);
  checkNonneg(
    ocl,
    'openingCurrentLiabilities',
    'opening current liabilities amount',
    errors
  );
  checkNonneg(
    ccl,
    'closingCurrentLiabilities',
    'closing current liabilities amount',
    errors
  );
  checkNonneg(rev, 'revenue', 'revenue amount', errors);

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const assetsReady =
    !oca.blank && !cca.blank && oca.value !== null && cca.value !== null;
  const liabReady =
    !ocl.blank && !ccl.blank && ocl.value !== null && ccl.value !== null;

  if (!assetsReady || !liabReady) {
    return { isValid: false, errors, result: null };
  }

  const averageCurrentAssets = calculateAverageBalance(oca.value!, cca.value!);
  const averageCurrentLiabilities = calculateAverageBalance(
    ocl.value!,
    ccl.value!
  );
  if (
    averageCurrentAssets === null ||
    averageCurrentLiabilities === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const averageWorkingCapital = calculateAverageWorkingCapitalFromAverages(
    averageCurrentAssets,
    averageCurrentLiabilities
  );
  if (averageWorkingCapital === null) {
    return { isValid: false, errors, result: null };
  }

  const revReady = !rev.blank && rev.value !== null;
  let revenue: number | null = null;
  let workingCapitalTurnover: number | null = null;
  let status: WctrStatus = revReady ? 'valid' : 'partial';
  let warningMessage: string | null =
    'WCT = Revenue ÷ (Average CA − Average CL). Opening/closing balances must share the same period as revenue. Amounts share one currency label (no FX).';

  if (averageWorkingCapital === 0) {
    status = 'zeroAverageWc';
    warningMessage =
      'Working capital turnover cannot be calculated because average working capital is zero.';
    errors.form = warningMessage;
  } else if (revReady) {
    revenue = rev.value;
    workingCapitalTurnover = calculateWorkingCapitalTurnover(
      revenue!,
      averageWorkingCapital
    );
    if (averageWorkingCapital < 0) {
      status = 'negativeAverageWc';
      warningMessage =
        'Average working capital is negative. The calculated turnover is mathematically valid, but standard efficiency comparisons may be misleading.';
    }
  } else {
    warningMessage =
      'Average working capital calculated. Enter revenue to compute the turnover ratio.';
  }

  const result: WorkingCapitalTurnoverRatioResult = {
    openingCurrentAssets: oca.value!,
    closingCurrentAssets: cca.value!,
    averageCurrentAssets,
    openingCurrentLiabilities: ocl.value!,
    closingCurrentLiabilities: ccl.value!,
    averageCurrentLiabilities,
    averageWorkingCapital,
    revenue,
    workingCapitalTurnover,
    status,
    interpretation: interpretWctr(
      averageWorkingCapital,
      workingCapitalTurnover,
      revenue,
      status
    ),
    warningMessage,
    currency,
    formattedOpeningCurrentAssets: formatMoney(oca.value!, currency),
    formattedClosingCurrentAssets: formatMoney(cca.value!, currency),
    formattedAverageCurrentAssets: formatMoney(averageCurrentAssets, currency),
    formattedOpeningCurrentLiabilities: formatMoney(ocl.value!, currency),
    formattedClosingCurrentLiabilities: formatMoney(ccl.value!, currency),
    formattedAverageCurrentLiabilities: formatMoney(
      averageCurrentLiabilities,
      currency
    ),
    formattedAverageWorkingCapital: formatMoney(
      averageWorkingCapital,
      currency
    ),
    formattedRevenue:
      revenue === null ? null : formatMoney(revenue, currency),
    formattedWorkingCapitalTurnover:
      workingCapitalTurnover === null
        ? null
        : formatWcTurnover(workingCapitalTurnover),
  };

  if (status === 'zeroAverageWc') {
    return { isValid: false, errors, result };
  }

  return { isValid: true, errors, result };
}
