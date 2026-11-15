import { calculateValueAtRisk } from './calculation';
import {
  VAR_PRESET_OPTIONS,
  type ValueAtRiskFieldErrors,
  type ValueAtRiskInput,
  type ValueAtRiskResult,
} from './types';

export interface ValueAtRiskValidation {
  isValid: boolean;
  errors: ValueAtRiskFieldErrors;
  result: ValueAtRiskResult | null;
}

function parseNumber(raw: string): { value: number | null; blank: boolean; invalid: boolean } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

function resolveTailPercent(input: ValueAtRiskInput): {
  value: number | null;
  error?: string;
} {
  const preset = VAR_PRESET_OPTIONS.find((o) => o.value === input.varPreset);
  if (!preset) return { value: null, error: 'Choose a VaR probability.' };

  if (preset.tailPercent !== null) {
    return { value: preset.tailPercent };
  }

  const custom = parseNumber(input.customTailPercent);
  if (custom.blank || custom.invalid || custom.value === null) {
    return { value: null, error: 'Enter a custom tail probability.' };
  }
  if (!(custom.value > 0) || !(custom.value < 50)) {
    return { value: null, error: 'Custom VaR probability must be between 0% and 50% (exclusive).' };
  }
  return { value: custom.value };
}

export function validateValueAtRiskInput(input: ValueAtRiskInput): ValueAtRiskValidation {
  const errors: ValueAtRiskFieldErrors = {};

  const portfolio = parseNumber(input.portfolioValue);
  const sigma = parseNumber(input.standardDeviation);
  const mu = parseNumber(input.expectedReturn);
  const timeframe = parseNumber(input.timeframe);
  const tail = resolveTailPercent(input);

  if (portfolio.blank || portfolio.invalid || portfolio.value === null) {
    errors.portfolioValue = 'Enter a valid portfolio value.';
  } else if (portfolio.value < 0) {
    errors.portfolioValue = 'Portfolio value cannot be negative.';
  }

  if (sigma.blank || sigma.invalid || sigma.value === null) {
    errors.standardDeviation = 'Enter a valid standard deviation.';
  } else if (sigma.value < 0) {
    errors.standardDeviation = 'Standard deviation cannot be negative.';
  }

  if (mu.blank || mu.invalid || mu.value === null) {
    errors.expectedReturn = 'Enter a valid expected return.';
  }

  if (timeframe.blank || timeframe.invalid || timeframe.value === null) {
    errors.timeframe = 'Enter a valid timeframe.';
  } else if (!(timeframe.value > 0)) {
    errors.timeframe = 'Timeframe must be greater than zero.';
  }

  if (tail.error) {
    errors.customTailPercent = tail.error;
  }

  if (Object.keys(errors).length > 0 || tail.value === null) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateValueAtRisk({
    portfolioValue: portfolio.value!,
    standardDeviationPercent: sigma.value!,
    expectedReturnPercent: mu.value!,
    timeframeAmount: timeframe.value!,
    timeframeUnit: input.timeframeUnit,
    tailProbabilityPercent: tail.value,
    currency: input.currency,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite VaR.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
