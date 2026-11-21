import {
  calculatePortfolioBeta,
  formatBeta,
  formatWeightPercent,
  interpretPortfolioBeta,
  weightStatusMessage,
} from './calculation';
import type {
  PortfolioBetaFieldErrors,
  PortfolioBetaInput,
  PortfolioBetaResult,
} from './types';

export interface PortfolioBetaValidation {
  isValid: boolean;
  errors: PortfolioBetaFieldErrors;
  result: PortfolioBetaResult | null;
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

export function validatePortfolioBetaInput(
  input: PortfolioBetaInput
): PortfolioBetaValidation {
  const errors: PortfolioBetaFieldErrors = { stocks: {} };
  let hasError = false;

  if (input.stocks.length === 0) {
    errors.form = 'Add at least one stock.';
    return { isValid: false, errors, result: null };
  }

  const parsed: {
    id: string;
    label: string;
    beta: number;
    weightPercent: number;
  }[] = [];

  input.stocks.forEach((stock, index) => {
    const label = `Stock ${index + 1}`;
    const rowErrors: { beta?: string; weight?: string } = {};

    const beta = parseNumber(stock.beta);
    if (beta.blank) {
      rowErrors.beta = 'Enter a beta.';
      hasError = true;
    } else if (beta.invalid || beta.value === null) {
      rowErrors.beta = 'Enter a valid beta.';
      hasError = true;
    }

    const weight = parseNumber(stock.weight);
    if (weight.blank) {
      rowErrors.weight = 'Enter a portfolio weight.';
      hasError = true;
    } else if (weight.invalid || weight.value === null) {
      rowErrors.weight = 'Enter a valid weight.';
      hasError = true;
    } else if (weight.value < 0) {
      rowErrors.weight = 'Weight cannot be negative.';
      hasError = true;
    } else if (weight.value > 100) {
      rowErrors.weight = 'Weight cannot exceed 100% per stock.';
      hasError = true;
    }

    if (Object.keys(rowErrors).length > 0) {
      errors.stocks![stock.id] = rowErrors;
    } else if (beta.value !== null && weight.value !== null) {
      parsed.push({
        id: stock.id,
        label,
        beta: beta.value,
        weightPercent: weight.value,
      });
    }
  });

  if (hasError || parsed.length !== input.stocks.length) {
    // Still show total weight if we can sum valid weights only? Spec: incomplete → no portfolio beta.
    // Show partial total when all rows parse for weight even if beta missing? Keep simple: no result if any error.
    const weightOnly = input.stocks.map((s) => parseNumber(s.weight));
    const allWeightsOk = weightOnly.every(
      (w) =>
        !w.blank &&
        !w.invalid &&
        w.value !== null &&
        w.value >= 0 &&
        w.value <= 100
    );
    if (allWeightsOk) {
      const total = weightOnly.reduce((sum, w) => sum + (w.value ?? 0), 0);
      const result: PortfolioBetaResult = {
        totalWeightPercent: total,
        portfolioBeta: null,
        contributions: [],
        isFullyAllocated: false,
        interpretation: null,
        weightMessage: weightStatusMessage(total),
        warningMessage:
          'Enter a valid beta and weight for every stock. Portfolio beta is shown only when weights total 100%.',
        formattedTotalWeight: formatWeightPercent(total),
        formattedPortfolioBeta: null,
      };
      return { isValid: false, errors, result };
    }
    return { isValid: false, errors, result: null };
  }

  const math = calculatePortfolioBeta(parsed);
  if (math === null) {
    errors.form = 'Unable to calculate portfolio beta with these inputs.';
    return { isValid: false, errors, result: null };
  }

  const result: PortfolioBetaResult = {
    totalWeightPercent: math.totalWeightPercent,
    portfolioBeta: math.portfolioBeta,
    contributions: math.contributions,
    isFullyAllocated: math.isFullyAllocated,
    interpretation:
      math.portfolioBeta !== null
        ? interpretPortfolioBeta(math.portfolioBeta)
        : null,
    weightMessage: weightStatusMessage(math.totalWeightPercent),
    warningMessage:
      'Portfolio beta is a weighted average of individual betas for a fully invested long-only allocation. It estimates systematic market sensitivity, not total risk or future returns.',
    formattedTotalWeight: formatWeightPercent(math.totalWeightPercent),
    formattedPortfolioBeta:
      math.portfolioBeta === null ? null : formatBeta(math.portfolioBeta),
  };

  return {
    isValid: math.isFullyAllocated && math.portfolioBeta !== null,
    errors,
    result,
  };
}
