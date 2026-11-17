import {
  calculatePostJudgmentInterest,
  diffCalendarDays,
  formatUsdAmount,
  parseIsoDate,
  weeksAndDays,
} from './calculation';
import type {
  PostJudgmentInterestFieldErrors,
  PostJudgmentInterestInput,
  PostJudgmentInterestResult,
} from './types';

export interface PostJudgmentInterestValidation {
  isValid: boolean;
  errors: PostJudgmentInterestFieldErrors;
  result: PostJudgmentInterestResult | null;
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
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export function validatePostJudgmentInterestInput(
  input: PostJudgmentInterestInput
): PostJudgmentInterestValidation {
  const errors: PostJudgmentInterestFieldErrors = {};

  const amount = parseNumber(input.judgmentAmount);
  const rate = parseNumber(input.interestRatePercent);

  if (!amount.blank && (amount.invalid || amount.value === null)) {
    errors.judgmentAmount = 'Enter a valid judgment amount.';
  } else if (!amount.blank && amount.value !== null && amount.value < 0) {
    errors.judgmentAmount = 'Judgment amount cannot be negative.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.interestRatePercent = 'Enter a valid interest rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.interestRatePercent = 'Interest rate cannot be negative.';
  }

  if (!parseIsoDate(input.judgmentDate)) {
    errors.judgmentDate = 'Enter a valid date of judgment.';
  }
  if (!parseIsoDate(input.writDate)) {
    errors.writDate = 'Enter a valid date of writ.';
  }

  if (!errors.judgmentDate && !errors.writDate) {
    const elapsed = diffCalendarDays(input.judgmentDate, input.writDate);
    if (elapsed === null) {
      errors.form = 'Enter valid judgment and writ dates.';
    } else if (elapsed < 0) {
      errors.writDate = 'Date of writ cannot be before the date of judgment.';
    }
  }

  const incomplete =
    amount.blank ||
    rate.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const elapsedDays = diffCalendarDays(input.judgmentDate, input.writDate);
  if (elapsedDays === null || elapsedDays < 0) {
    errors.form = 'Enter a valid date range.';
    return { isValid: false, errors, result: null };
  }

  const interest = calculatePostJudgmentInterest({
    judgmentAmount: amount.value!,
    interestRatePercent: rate.value!,
    elapsedDays,
  });

  if (interest === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const { weeks, days } = weeksAndDays(elapsedDays);

  const result: PostJudgmentInterestResult = {
    elapsedDays,
    weeks,
    leftoverDays: days,
    accumulatedInterest: interest,
    formattedAccumulatedInterest: formatUsdAmount(interest),
    formattedWeeks: String(weeks),
    formattedLeftoverDays: String(days),
  };

  return { isValid: true, errors: {}, result };
}
