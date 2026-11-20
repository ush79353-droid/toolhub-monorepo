import {
  calculateAverageWorkingCapital,
  calculateChangeInWorkingCapital,
  calculateWorkingCapital,
  calculateWorkingCapitalRatio,
  calculateWorkingCapitalTurnover,
  formatSignedMoney,
  formatWcRatio,
  formatWcTurnover,
  interpretWorkingCapital,
} from './calculation';
import type {
  WorkingCapitalFieldErrors,
  WorkingCapitalInput,
  WorkingCapitalResult,
  WorkingCapitalStatus,
} from './types';

export interface WorkingCapitalValidation {
  isValid: boolean;
  errors: WorkingCapitalFieldErrors;
  result: WorkingCapitalResult | null;
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

type FieldKey = keyof WorkingCapitalFieldErrors;

function checkNonneg(
  parsed: ReturnType<typeof parseNumber>,
  key: FieldKey,
  label: string,
  errors: WorkingCapitalFieldErrors
): void {
  if (parsed.blank) return;
  if (parsed.invalid || parsed.value === null) {
    errors[key] = `Enter a valid ${label}.`;
  } else if (parsed.value < 0) {
    errors[key] = `${label.charAt(0).toUpperCase()}${label.slice(1)} cannot be negative.`;
  }
}

export function validateWorkingCapitalInput(
  input: WorkingCapitalInput
): WorkingCapitalValidation {
  const errors: WorkingCapitalFieldErrors = {};
  const currency = input.currency;

  const ca = parseNumber(input.currentAssets);
  const cl = parseNumber(input.currentLiabilities);
  const rev = parseNumber(input.revenue);
  const begCa = parseNumber(input.beginningCurrentAssets);
  const begCl = parseNumber(input.beginningCurrentLiabilities);
  const endCa = parseNumber(input.endingCurrentAssets);
  const endCl = parseNumber(input.endingCurrentLiabilities);

  checkNonneg(ca, 'currentAssets', 'current assets amount', errors);
  checkNonneg(cl, 'currentLiabilities', 'current liabilities amount', errors);
  checkNonneg(rev, 'revenue', 'revenue amount', errors);
  checkNonneg(
    begCa,
    'beginningCurrentAssets',
    'beginning current assets amount',
    errors
  );
  checkNonneg(
    begCl,
    'beginningCurrentLiabilities',
    'beginning current liabilities amount',
    errors
  );
  checkNonneg(
    endCa,
    'endingCurrentAssets',
    'ending current assets amount',
    errors
  );
  checkNonneg(
    endCl,
    'endingCurrentLiabilities',
    'ending current liabilities amount',
    errors
  );

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const basicReady = !ca.blank && !cl.blank && ca.value !== null && cl.value !== null;
  const begReady =
    !begCa.blank &&
    !begCl.blank &&
    begCa.value !== null &&
    begCl.value !== null;
  const endReady =
    !endCa.blank &&
    !endCl.blank &&
    endCa.value !== null &&
    endCl.value !== null;
  const revReady = !rev.blank && rev.value !== null;

  if (!basicReady && !begReady && !endReady) {
    return { isValid: false, errors, result: null };
  }

  let workingCapital: number | null = null;
  let workingCapitalRatio: number | null = null;
  let currentAssets: number | null = null;
  let currentLiabilities: number | null = null;
  let status: WorkingCapitalStatus = 'partial';
  let warningMessage: string | null =
    'Working capital = CA − CL. Working capital ratio = CA / CL (current ratio). Amounts share one currency label (no FX).';

  if (basicReady) {
    currentAssets = ca.value;
    currentLiabilities = cl.value;
    workingCapital = calculateWorkingCapital(ca.value!, cl.value!);
    if (cl.value === 0) {
      status = 'zeroLiabilities';
      warningMessage =
        'Working capital ratio is unavailable because current liabilities equal zero.';
      errors.form = warningMessage;
    } else {
      workingCapitalRatio = calculateWorkingCapitalRatio(ca.value!, cl.value!);
      status = 'valid';
    }
  }

  let beginningWorkingCapital: number | null = null;
  let endingWorkingCapital: number | null = null;
  let averageWorkingCapital: number | null = null;
  let changeInWorkingCapital: number | null = null;
  let workingCapitalTurnoverRatio: number | null = null;
  let revenue: number | null = null;

  if (begReady) {
    beginningWorkingCapital = calculateWorkingCapital(
      begCa.value!,
      begCl.value!
    );
  }
  if (endReady) {
    endingWorkingCapital = calculateWorkingCapital(endCa.value!, endCl.value!);
  }

  if (beginningWorkingCapital !== null && endingWorkingCapital !== null) {
    averageWorkingCapital = calculateAverageWorkingCapital(
      beginningWorkingCapital,
      endingWorkingCapital
    );
    changeInWorkingCapital = calculateChangeInWorkingCapital(
      beginningWorkingCapital,
      endingWorkingCapital
    );

    if (revReady && averageWorkingCapital !== null) {
      revenue = rev.value;
      if (averageWorkingCapital === 0) {
        status = 'zeroAverageWc';
        warningMessage =
          'Working capital turnover is unavailable because average working capital equals zero.';
        errors.form = warningMessage;
      } else {
        workingCapitalTurnoverRatio = calculateWorkingCapitalTurnover(
          revenue!,
          averageWorkingCapital
        );
        if (averageWorkingCapital < 0) {
          status = 'negativeAverageWc';
          warningMessage =
            'Average working capital is negative, so turnover is a signed mathematical result — efficiency interpretation may not apply.';
        } else if (status !== 'zeroLiabilities') {
          status = 'valid';
        }
      }
    }
  } else if (revReady && (begReady || endReady)) {
    revenue = rev.value;
  }

  const hasAnything =
    workingCapital !== null ||
    beginningWorkingCapital !== null ||
    endingWorkingCapital !== null;

  if (!hasAnything) {
    return { isValid: false, errors, result: null };
  }

  const result: WorkingCapitalResult = {
    currentAssets,
    currentLiabilities,
    workingCapital,
    workingCapitalRatio,
    revenue,
    beginningCurrentAssets: begReady ? begCa.value! : null,
    beginningCurrentLiabilities: begReady ? begCl.value! : null,
    endingCurrentAssets: endReady ? endCa.value! : null,
    endingCurrentLiabilities: endReady ? endCl.value! : null,
    beginningWorkingCapital,
    endingWorkingCapital,
    averageWorkingCapital,
    changeInWorkingCapital,
    workingCapitalTurnoverRatio,
    status,
    interpretation: interpretWorkingCapital(
      workingCapital,
      workingCapitalRatio,
      averageWorkingCapital,
      workingCapitalTurnoverRatio,
      status
    ),
    warningMessage,
    currency,
    formattedCurrentAssets:
      currentAssets === null ? null : formatSignedMoney(currentAssets, currency),
    formattedCurrentLiabilities:
      currentLiabilities === null
        ? null
        : formatSignedMoney(currentLiabilities, currency),
    formattedWorkingCapital:
      workingCapital === null
        ? null
        : formatSignedMoney(workingCapital, currency),
    formattedWorkingCapitalRatio:
      workingCapitalRatio === null
        ? null
        : formatWcRatio(workingCapitalRatio),
    formattedRevenue:
      revenue === null ? null : formatSignedMoney(revenue, currency),
    formattedBeginningWorkingCapital:
      beginningWorkingCapital === null
        ? null
        : formatSignedMoney(beginningWorkingCapital, currency),
    formattedEndingWorkingCapital:
      endingWorkingCapital === null
        ? null
        : formatSignedMoney(endingWorkingCapital, currency),
    formattedAverageWorkingCapital:
      averageWorkingCapital === null
        ? null
        : formatSignedMoney(averageWorkingCapital, currency),
    formattedChangeInWorkingCapital:
      changeInWorkingCapital === null
        ? null
        : formatSignedMoney(changeInWorkingCapital, currency),
    formattedWorkingCapitalTurnoverRatio:
      workingCapitalTurnoverRatio === null
        ? null
        : formatWcTurnover(workingCapitalTurnoverRatio),
  };

  return { isValid: true, errors, result };
}
