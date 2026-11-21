import {
  calculateCompoundingMonthlyGrowthRate,
  calculateMonthOverMonth,
  calculateQuarterOverQuarter,
  calculateYearOverYear,
  convertDurationToMonths,
  formatGrowthPercent,
  interpretCmgr,
} from './calculation';
import type {
  MonthOverMonthFieldErrors,
  MonthOverMonthInput,
  MonthOverMonthResult,
} from './types';

export interface MonthOverMonthValidation {
  isValid: boolean;
  errors: MonthOverMonthFieldErrors;
  result: MonthOverMonthResult | null;
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

function validatePair(
  prev: ReturnType<typeof parseNumber>,
  curr: ReturnType<typeof parseNumber>,
  prevKey: keyof MonthOverMonthFieldErrors,
  currKey: keyof MonthOverMonthFieldErrors,
  errors: MonthOverMonthFieldErrors,
  prevLabel: string,
  currLabel: string
): { prev: number; curr: number } | null {
  if (!prev.blank) {
    if (prev.invalid || prev.value === null) {
      errors[prevKey] = `Enter a valid ${prevLabel}.`;
    }
  }
  if (!curr.blank) {
    if (curr.invalid || curr.value === null) {
      errors[currKey] = `Enter a valid ${currLabel}.`;
    }
  }
  if (
    prev.blank ||
    curr.blank ||
    prev.value === null ||
    curr.value === null ||
    errors[prevKey] ||
    errors[currKey]
  ) {
    return null;
  }
  return { prev: prev.value, curr: curr.value };
}

export function validateMonthOverMonthInput(
  input: MonthOverMonthInput
): MonthOverMonthValidation {
  const errors: MonthOverMonthFieldErrors = {};

  const m1 = parseNumber(input.month1);
  const m2 = parseNumber(input.month2);
  const ci = parseNumber(input.cmgrInitial);
  const cf = parseNumber(input.cmgrFinal);
  const cd = parseNumber(input.cmgrDuration);
  const qp = parseNumber(input.qoqPrevious);
  const qc = parseNumber(input.qoqCurrent);
  const yp = parseNumber(input.yoyPrevious);
  const yc = parseNumber(input.yoyCurrent);

  const momPair = validatePair(
    m1,
    m2,
    'month1',
    'month2',
    errors,
    'value in month 1',
    'value in month 2'
  );

  // CMGR-specific validation
  if (!ci.blank) {
    if (ci.invalid || ci.value === null) {
      errors.cmgrInitial = 'Enter a valid first-month value.';
    } else if (ci.value <= 0) {
      errors.cmgrInitial =
        'CMGR requires a positive initial value (zero and negatives are unsupported).';
    }
  }
  if (!cf.blank) {
    if (cf.invalid || cf.value === null) {
      errors.cmgrFinal = 'Enter a valid last-month value.';
    } else if (cf.value < 0) {
      errors.cmgrFinal =
        'CMGR requires a nonnegative final value under the standard model.';
    }
  }
  if (!cd.blank) {
    if (cd.invalid || cd.value === null) {
      errors.cmgrDuration = 'Enter a valid time duration.';
    } else if (cd.value <= 0) {
      errors.cmgrDuration = 'Duration must be greater than zero.';
    }
  }

  const qoqPair = validatePair(
    qp,
    qc,
    'qoqPrevious',
    'qoqCurrent',
    errors,
    'previous-quarter value',
    'current-quarter value'
  );

  const yoyPair = validatePair(
    yp,
    yc,
    'yoyPrevious',
    'yoyCurrent',
    errors,
    'previous-year value',
    'current-year value'
  );

  const mom =
    momPair && !errors.month1 && !errors.month2
      ? calculateMonthOverMonth(momPair.prev, momPair.curr)
      : null;

  let cmgr: MonthOverMonthResult['cmgr'] = null;
  const cmgrReady =
    !ci.blank &&
    !cf.blank &&
    !cd.blank &&
    !errors.cmgrInitial &&
    !errors.cmgrFinal &&
    !errors.cmgrDuration &&
    ci.value !== null &&
    cf.value !== null &&
    cd.value !== null;

  if (cmgrReady) {
    const months = convertDurationToMonths(cd.value, input.cmgrDurationUnit);
    if (months === null) {
      errors.cmgrDuration = 'Duration must normalize to a positive number of months.';
    } else {
      const cmgrPercent = calculateCompoundingMonthlyGrowthRate(
        ci.value,
        cf.value,
        months
      );
      if (cmgrPercent === null) {
        errors.form = 'Unable to calculate CMGR for these inputs.';
      } else {
        cmgr = {
          cmgrPercent,
          months,
          formatted: formatGrowthPercent(cmgrPercent),
          interpretation: interpretCmgr(
            cmgrPercent,
            months,
            ci.value,
            cf.value
          ),
          warning: null,
        };
      }
    }
  }

  const qoq =
    qoqPair && !errors.qoqPrevious && !errors.qoqCurrent
      ? calculateQuarterOverQuarter(qoqPair.prev, qoqPair.curr)
      : null;

  const yoy =
    yoyPair && !errors.yoyPrevious && !errors.yoyCurrent
      ? calculateYearOverYear(yoyPair.prev, yoyPair.curr)
      : null;

  const hasHardErrors = Object.keys(errors).some(
    (k) => k !== 'form' && errors[k as keyof MonthOverMonthFieldErrors]
  );

  const result: MonthOverMonthResult = { mom, cmgr, qoq, yoy };
  const anyResult = Boolean(mom || cmgr || qoq || yoy);

  // Soft unavailable statuses still count as successful section results
  return {
    isValid: anyResult && !hasHardErrors,
    errors,
    result: anyResult || Object.keys(errors).length > 0 ? result : null,
  };
}
