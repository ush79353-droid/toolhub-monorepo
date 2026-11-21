import {
  calculateEbit,
  calculateEbitMargin,
  calculateOperatingExpensesFromEbit,
  calculateRevenueFromEbit,
  formatEbitMargin,
  formatEbitMoney,
  interpretEbit,
} from './calculation';
import type { EbitFieldErrors, EbitInput, EbitResult } from './types';

export interface EbitValidation {
  isValid: boolean;
  errors: EbitFieldErrors;
  result: EbitResult | null;
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

export function validateEbitInput(input: EbitInput): EbitValidation {
  const errors: EbitFieldErrors = {};
  const currency = input.currency;

  const revParsed = parseNumber(input.revenue);
  const oeParsed = parseNumber(input.operatingExpenses);
  const ebitParsed = parseNumber(input.ebit);

  if (!revParsed.blank && input.mode !== 'revenue') {
    if (revParsed.invalid || revParsed.value === null) {
      errors.revenue = 'Enter a valid revenue amount.';
    } else if (revParsed.value < 0) {
      errors.revenue = 'Revenue cannot be negative.';
    }
  }

  if (!oeParsed.blank && input.mode !== 'operatingExpenses') {
    if (oeParsed.invalid || oeParsed.value === null) {
      errors.operatingExpenses = 'Enter a valid operating expenses amount.';
    } else if (oeParsed.value < 0) {
      errors.operatingExpenses = 'Operating expenses cannot be negative.';
    }
  }

  if (!ebitParsed.blank && input.mode !== 'ebit') {
    if (ebitParsed.invalid || ebitParsed.value === null) {
      errors.ebit = 'Enter a valid EBIT amount.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  let revenue = 0;
  let operatingExpenses = 0;
  let ebit = 0;
  let ready = false;

  if (input.mode === 'ebit') {
    if (
      !revParsed.blank &&
      !oeParsed.blank &&
      revParsed.value !== null &&
      oeParsed.value !== null
    ) {
      const calculated = calculateEbit(revParsed.value, oeParsed.value);
      if (calculated === null) {
        return { isValid: false, errors, result: null };
      }
      revenue = revParsed.value;
      operatingExpenses = oeParsed.value;
      ebit = calculated;
      ready = true;
    }
  } else if (input.mode === 'revenue') {
    if (
      !ebitParsed.blank &&
      !oeParsed.blank &&
      ebitParsed.value !== null &&
      oeParsed.value !== null
    ) {
      if (oeParsed.value < 0) {
        return {
          isValid: false,
          errors: {
            operatingExpenses: 'Operating expenses cannot be negative.',
          },
          result: null,
        };
      }
      const calculated = calculateRevenueFromEbit(
        ebitParsed.value,
        oeParsed.value
      );
      if (calculated === null) {
        return {
          isValid: false,
          errors: {
            form: 'Revenue would be negative under the standard model. Adjust EBIT or operating expenses.',
          },
          result: null,
        };
      }
      revenue = calculated;
      operatingExpenses = oeParsed.value;
      ebit = ebitParsed.value;
      ready = true;
    }
  } else {
    if (
      !revParsed.blank &&
      !ebitParsed.blank &&
      revParsed.value !== null &&
      ebitParsed.value !== null
    ) {
      if (revParsed.value < 0) {
        return {
          isValid: false,
          errors: { revenue: 'Revenue cannot be negative.' },
          result: null,
        };
      }
      const calculated = calculateOperatingExpensesFromEbit(
        revParsed.value,
        ebitParsed.value
      );
      if (calculated === null) {
        return {
          isValid: false,
          errors: {
            form: 'Operating expenses would be negative under the standard model. Adjust revenue or EBIT.',
          },
          result: null,
        };
      }
      revenue = revParsed.value;
      operatingExpenses = calculated;
      ebit = ebitParsed.value;
      ready = true;
    }
  }

  if (!ready) {
    return { isValid: false, errors, result: null };
  }

  const margin = calculateEbitMargin(ebit, revenue);
  const warningMessage =
    revenue === 0
      ? 'EBIT margin is unavailable when revenue is zero (division by zero).'
      : 'Operating expenses should include all relevant operating costs for this simplified formula (including COGS where applicable). Do not subtract COGS twice. Exclude interest and income taxes.';

  const result: EbitResult = {
    revenue,
    operatingExpenses,
    ebit,
    ebitMargin: margin,
    status: 'valid',
    interpretation: interpretEbit(ebit, revenue),
    warningMessage,
    currency,
    formattedRevenue: formatEbitMoney(revenue, currency),
    formattedOperatingExpenses: formatEbitMoney(operatingExpenses, currency),
    formattedEbit: formatEbitMoney(ebit, currency),
    formattedEbitMargin: margin === null ? null : formatEbitMargin(margin),
  };

  return { isValid: true, errors, result };
}
