import { calculateYoutubeMoney } from './calculation';
import type { YoutubeMoneyFieldErrors, YoutubeMoneyInput, YoutubeMoneyResult } from './types';

function parseOptional(raw: string): number | null | typeof Number.NaN {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const num = Number(cleaned);
  if (!Number.isFinite(num)) return Number.NaN;
  return num;
}

export function validateYoutubeMoneyInput(input: YoutubeMoneyInput): {
  isValid: boolean;
  errors: YoutubeMoneyFieldErrors;
  result: YoutubeMoneyResult | null;
} {
  const errors: YoutubeMoneyFieldErrors = {};
  const rpm = parseOptional(input.rpm);
  const views = parseOptional(input.views);

  if (rpm === null && views === null) {
    return { isValid: false, errors, result: null };
  }

  if (rpm === null || views === null) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(rpm)) {
    errors.rpm = 'Enter a valid RPM';
  } else if (rpm < 0) {
    errors.rpm = 'RPM cannot be negative';
  }

  if (Number.isNaN(views)) {
    errors.views = 'Enter a valid number of views';
  } else if (views < 0) {
    errors.views = 'Views cannot be negative';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateYoutubeMoney(
    rpm as number,
    views as number,
    input.viewsPeriod,
    input.grossPeriod,
    input.netPeriod,
    input.currency
  );

  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate revenue from the current values.' },
      result: null,
    };
  }

  return { isValid: true, errors, result };
}
