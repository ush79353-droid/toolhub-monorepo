import {
  calculateRSI,
  formatMetric,
  formatRsi,
  interpretRsi,
} from './calculation';
import type {
  RelativeStrengthIndexFieldErrors,
  RelativeStrengthIndexInput,
  RelativeStrengthIndexResult,
} from './types';

export interface RelativeStrengthIndexValidation {
  isValid: boolean;
  errors: RelativeStrengthIndexFieldErrors;
  result: RelativeStrengthIndexResult | null;
}

function parseFinite(raw: string): {
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

export function validateRelativeStrengthIndexInput(
  input: RelativeStrengthIndexInput
): RelativeStrengthIndexValidation {
  const errors: RelativeStrengthIndexFieldErrors = {};
  const priceErrors: Record<string, string> = {};
  let hasError = false;

  const periodParsed = parseFinite(input.period);
  let period: number | null = null;
  if (periodParsed.blank) {
    errors.period = 'Enter an RSI period.';
    hasError = true;
  } else if (
    periodParsed.invalid ||
    periodParsed.value === null ||
    !Number.isInteger(periodParsed.value) ||
    periodParsed.value < 1
  ) {
    errors.period = 'RSI period must be a positive whole number.';
    hasError = true;
  } else {
    period = periodParsed.value;
  }

  const closingPrices: number[] = [];
  let anyFilled = false;
  let anyBlank = false;

  for (const row of input.prices) {
    const parsed = parseFinite(row.price);
    if (parsed.blank) {
      anyBlank = true;
      continue;
    }
    anyFilled = true;
    if (parsed.invalid || parsed.value === null) {
      priceErrors[row.id] = 'Enter a valid closing price.';
      hasError = true;
      continue;
    }
    if (parsed.value < 0) {
      priceErrors[row.id] = 'Closing price cannot be negative.';
      hasError = true;
      continue;
    }
    closingPrices.push(parsed.value);
  }

  if (Object.keys(priceErrors).length > 0) {
    errors.prices = priceErrors;
  }

  // Trailing blanks after filled prices are OK; blanks in the middle break sequence
  if (anyFilled && anyBlank) {
    let seenBlank = false;
    let gapError = false;
    for (const row of input.prices) {
      const blank = row.price.trim() === '';
      if (blank) {
        seenBlank = true;
      } else if (seenBlank) {
        gapError = true;
        break;
      }
    }
    // Only flag gaps if we have a blank between filled values
    if (gapError) {
      // Find first blank that has a later filled price
      for (let i = 0; i < input.prices.length; i += 1) {
        const row = input.prices[i]!;
        if (row.price.trim() !== '') continue;
        const laterFilled = input.prices
          .slice(i + 1)
          .some((r) => r.price.trim() !== '');
        if (laterFilled && !priceErrors[row.id]) {
          priceErrors[row.id] =
            'Fill prices in chronological order without gaps.';
          hasError = true;
        }
      }
      errors.prices = priceErrors;
    }
  }

  if (!anyFilled) {
    errors.form = 'Enter sequential closing prices (oldest to newest).';
    hasError = true;
  }

  if (hasError || period === null) {
    return { isValid: false, errors, result: null };
  }

  const requiredPrices = period + 1;
  const math = calculateRSI({
    closingPrices,
    period,
    method: input.method,
  });

  if (math.status === 'insufficient-data') {
    const result: RelativeStrengthIndexResult = {
      rsi: null,
      averageGain: null,
      averageLoss: null,
      relativeStrength: null,
      interpretation: null,
      series: [],
      status: 'insufficient-data',
      priceCount: closingPrices.length,
      changeCount: Math.max(0, closingPrices.length - 1),
      requiredPrices,
      formattedRsi: null,
      formattedAvgGain: null,
      formattedAvgLoss: null,
      formattedRs: null,
      insufficientMessage: `Enter at least ${requiredPrices} valid closing prices to calculate a ${period}-period RSI (you have ${closingPrices.length}).`,
      warningMessage:
        'RSI needs period + 1 closing prices for the first reading. A 14-period RSI requires at least 15 prices.',
    };
    return { isValid: false, errors, result };
  }

  if (math.status !== 'valid' || math.rsi === null) {
    errors.form = 'Unable to calculate RSI with these inputs.';
    return { isValid: false, errors, result: null };
  }

  const result: RelativeStrengthIndexResult = {
    rsi: math.rsi,
    averageGain: math.averageGain,
    averageLoss: math.averageLoss,
    relativeStrength: math.relativeStrength,
    interpretation: interpretRsi(math.rsi),
    series: math.series,
    status: 'valid',
    priceCount: closingPrices.length,
    changeCount: Math.max(0, closingPrices.length - 1),
    requiredPrices,
    formattedRsi: formatRsi(math.rsi),
    formattedAvgGain:
      math.averageGain === null ? null : formatMetric(math.averageGain),
    formattedAvgLoss:
      math.averageLoss === null ? null : formatMetric(math.averageLoss),
    formattedRs:
      math.relativeStrength === null
        ? math.averageLoss === 0 && (math.averageGain ?? 0) > 0
          ? '∞'
          : math.averageGain === 0 && math.averageLoss === 0
            ? '—'
            : null
        : formatMetric(math.relativeStrength),
    insufficientMessage: null,
    warningMessage:
      'RSI is a momentum oscillator (0–100), not a forecast. Thresholds like 30/70 are common references, not guarantees.',
  };

  return { isValid: true, errors, result };
}
