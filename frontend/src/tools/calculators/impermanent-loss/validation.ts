import { calculateImpermanentLoss } from './calculation';
import {
  WEIGHT_OPTIONS,
  type ImpermanentLossFieldErrors,
  type ImpermanentLossInput,
  type ImpermanentLossResult,
  type WeightPair,
} from './types';

function parseNumber(val: string): number | null {
  const trimmed = val.trim().replace(/,/g, '');
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateImpermanentLossInput(input: ImpermanentLossInput): {
  isValid: boolean;
  errors: ImpermanentLossFieldErrors;
  result: ImpermanentLossResult | null;
} {
  const errors: ImpermanentLossFieldErrors = {};

  const deposit = parseNumber(input.initialDeposit);
  const iA = parseNumber(input.initialPriceA);
  const fA = parseNumber(input.futurePriceA);
  const iB = parseNumber(input.initialPriceB);
  const fB = parseNumber(input.futurePriceB);

  if (deposit === null || iA === null || fA === null || iB === null || fB === null) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(deposit) || deposit <= 0) {
    errors.initialDeposit = 'Enter a positive initial deposit';
  }
  if (Number.isNaN(iA) || iA <= 0) {
    errors.initialPriceA = 'Enter a positive initial price for Token A';
  }
  if (Number.isNaN(fA) || fA <= 0) {
    errors.futurePriceA = 'Enter a positive future price for Token A';
  }
  if (Number.isNaN(iB) || iB <= 0) {
    errors.initialPriceB = 'Enter a positive initial price for Token B';
  }
  if (Number.isNaN(fB) || fB <= 0) {
    errors.futurePriceB = 'Enter a positive future price for Token B';
  }

  if (!WEIGHT_OPTIONS.some((o) => o.value === input.weights)) {
    errors.form = 'Select a valid asset weight pair';
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateImpermanentLoss({
    weights: input.weights as WeightPair,
    initialDeposit: deposit as number,
    initialPriceA: iA as number,
    futurePriceA: fA as number,
    initialPriceB: iB as number,
    futurePriceB: fB as number,
    currency: input.currency,
  });

  return { isValid: result !== null, errors, result };
}
