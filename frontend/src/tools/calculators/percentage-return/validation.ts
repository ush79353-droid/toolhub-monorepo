import {
  calculateAnnualizedReturn,
  calculateGainOrLoss,
  calculatePercentageReturn,
  calculateTimeNeededYears,
  endDateFromDuration,
  formatMoney,
  formatPercent,
  formatYears,
  yearsBetweenDates,
} from './calculation';
import type {
  PercentageReturnFieldErrors,
  PercentageReturnInput,
  PercentageReturnResult,
} from './types';

function parseNumber(raw: string): { blank: boolean; value: number | null } {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return { blank: true, value: null };
  if (/infinity|nan/i.test(trimmed)) return { blank: false, value: Number.NaN };
  const n = Number(trimmed);
  return { blank: false, value: Number.isFinite(n) ? n : Number.NaN };
}

/** Keep end date ↔ duration in sync without fighting the last-edited source. */
export function syncDurationFields(input: PercentageReturnInput): PercentageReturnInput {
  if (input.solveMode === 'time-needed') {
    return input;
  }

  if (input.durationSource === 'endDate') {
    if (!input.startDate || !input.endDate) return input;
    const years = yearsBetweenDates(input.startDate, input.endDate);
    if (years === null) return input;
    return { ...input, durationYears: formatYears(years) };
  }

  const duration = parseNumber(input.durationYears);
  if (duration.blank || duration.value === null || Number.isNaN(duration.value)) {
    return input;
  }
  if (!(duration.value >= 0) || !input.startDate) return input;
  const end = endDateFromDuration(input.startDate, duration.value);
  if (!end) return input;
  return { ...input, endDate: end };
}

export function validatePercentageReturn(input: PercentageReturnInput): {
  isValid: boolean;
  errors: PercentageReturnFieldErrors;
  result: PercentageReturnResult | null;
} {
  const errors: PercentageReturnFieldErrors = {};
  const invested = parseNumber(input.investedAmount);
  const returned = parseNumber(input.returnedAmount);

  if (!invested.blank) {
    if (invested.value === null || Number.isNaN(invested.value)) {
      errors.investedAmount = 'Enter a valid invested amount';
    } else if (!(invested.value > 0)) {
      errors.investedAmount = 'Invested amount must be greater than zero';
    }
  }

  if (!returned.blank) {
    if (returned.value === null || Number.isNaN(returned.value)) {
      errors.returnedAmount = 'Enter a valid returned amount';
    } else if (returned.value < 0) {
      errors.returnedAmount = 'Returned amount cannot be negative';
    }
  }

  let years: number | null = null;

  if (input.solveMode === 'annualized') {
    if (input.endDate && input.startDate) {
      const span = yearsBetweenDates(input.startDate, input.endDate);
      if (span === null) {
        errors.endDate = 'End date must be on or after the start date';
      } else {
        years = span;
      }
    } else {
      const duration = parseNumber(input.durationYears);
      if (!duration.blank) {
        if (duration.value === null || Number.isNaN(duration.value)) {
          errors.durationYears = 'Enter a valid investment duration';
        } else if (!(duration.value > 0)) {
          errors.durationYears = 'Investment duration must be greater than zero';
        } else {
          years = duration.value;
        }
      }
    }
  } else {
    const rate = parseNumber(input.annualizedRatePercent);
    if (!rate.blank) {
      if (rate.value === null || Number.isNaN(rate.value)) {
        errors.annualizedRatePercent = 'Enter a valid annualized rate';
      } else if (rate.value <= -100) {
        errors.annualizedRatePercent = 'Annualized rate must be greater than −100%';
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const investedValue = invested.blank ? null : invested.value;
  const returnedValue = returned.blank ? null : returned.value;

  const gainOrLoss =
    investedValue !== null && returnedValue !== null
      ? calculateGainOrLoss(investedValue, returnedValue)
      : null;
  const percentageReturn =
    investedValue !== null && returnedValue !== null
      ? calculatePercentageReturn(investedValue, returnedValue)
      : null;

  let annualizedReturn: number | null = null;
  let timeNeededYears: number | null = null;

  if (input.solveMode === 'annualized') {
    if (investedValue !== null && returnedValue !== null && years !== null && years > 0) {
      annualizedReturn = calculateAnnualizedReturn(investedValue, returnedValue, years);
    }
  } else {
    const rate = parseNumber(input.annualizedRatePercent);
    if (
      investedValue !== null &&
      returnedValue !== null &&
      !rate.blank &&
      rate.value !== null &&
      !Number.isNaN(rate.value)
    ) {
      timeNeededYears = calculateTimeNeededYears(
        investedValue,
        returnedValue,
        rate.value / 100
      );
    }
  }

  const hasAny =
    gainOrLoss !== null ||
    percentageReturn !== null ||
    annualizedReturn !== null ||
    timeNeededYears !== null;

  if (!hasAny) {
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors,
    result: {
      gainOrLoss,
      percentageReturn,
      annualizedReturn,
      timeNeededYears,
      gainOrLossDisplay:
        gainOrLoss === null ? '' : formatMoney(gainOrLoss, input.currency),
      percentageReturnDisplay:
        percentageReturn === null ? '' : formatPercent(percentageReturn),
      annualizedReturnDisplay:
        annualizedReturn === null ? '' : formatPercent(annualizedReturn),
      timeNeededDisplay: timeNeededYears === null ? '' : formatYears(timeNeededYears),
      currency: input.currency,
    },
  };
}
