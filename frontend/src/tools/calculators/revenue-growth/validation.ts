import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateRevenueGrowthRate,
  calculateTotalRevenueGrowth,
  formatRevenueGrowthPercent,
} from './calculation';
import type {
  RevenueGrowthFieldErrors,
  RevenueGrowthInput,
  RevenueGrowthResult,
} from './types';

export interface RevenueGrowthValidation {
  isValid: boolean;
  errors: RevenueGrowthFieldErrors;
  result: RevenueGrowthResult | null;
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

function convertMoney(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number } | { ok: false; message: string } {
  if (from === to) return { ok: true, amount };
  if (!rates?.available) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) {
    return { ok: false, message: CURRENCY_CONVERSION_UNAVAILABLE_NOTE };
  }
  return { ok: true, amount: converted.amount };
}

/**
 * Validates both independent sections. Either section can produce a result;
 * overall isValid when at least one section yields a finite percentage.
 */
export function validateRevenueGrowthInput(
  input: RevenueGrowthInput,
  rates?: CurrencyRatesSnapshot | null
): RevenueGrowthValidation {
  const errors: RevenueGrowthFieldErrors = {};

  const totalInitial = parseNumber(input.totalInitial);
  const totalFinal = parseNumber(input.totalFinal);
  const rateInitial = parseNumber(input.rateInitial);
  const rateFinal = parseNumber(input.rateFinal);
  const periods = parseNumber(input.periods);

  // --- Total growth section ---
  let totalGrowthPercent: number | null = null;
  const totalStarted = !totalInitial.blank || !totalFinal.blank;
  if (totalStarted) {
    if (totalInitial.blank || totalInitial.invalid || totalInitial.value === null) {
      errors.totalInitial = 'Enter a valid initial revenue.';
    } else if (totalInitial.value === 0) {
      errors.totalInitial = 'Initial revenue must be nonzero for total growth.';
    }

    if (totalFinal.blank || totalFinal.invalid || totalFinal.value === null) {
      errors.totalFinal = 'Enter a valid final revenue.';
    }

    if (!errors.totalInitial && !errors.totalFinal) {
      const finalHome = convertMoney(
        totalFinal.value!,
        input.totalFinalCurrency,
        input.totalInitialCurrency,
        rates
      );
      if (!finalHome.ok) {
        errors.form = finalHome.message;
      } else {
        totalGrowthPercent = calculateTotalRevenueGrowth(
          totalInitial.value!,
          finalHome.amount
        );
        if (totalGrowthPercent === null) {
          errors.form = 'Total growth is undefined for these inputs.';
        }
      }
    }
  }

  // --- Compound growth rate section ---
  let growthRatePercent: number | null = null;
  const rateStarted =
    !rateInitial.blank || !rateFinal.blank || !periods.blank;
  if (rateStarted) {
    if (rateInitial.blank || rateInitial.invalid || rateInitial.value === null) {
      errors.rateInitial = 'Enter a valid initial revenue.';
    } else if (!(rateInitial.value > 0)) {
      errors.rateInitial = 'Initial revenue must be greater than zero.';
    }

    if (rateFinal.blank || rateFinal.invalid || rateFinal.value === null) {
      errors.rateFinal = 'Enter a valid final revenue.';
    } else if (!(rateFinal.value! > 0)) {
      errors.rateFinal = 'Final revenue must be greater than zero.';
    }

    if (periods.blank || periods.invalid || periods.value === null) {
      errors.periods = 'Enter a positive number of periods.';
    } else if (!(periods.value > 0)) {
      errors.periods = 'Number of periods must be greater than zero.';
    }

    if (!errors.rateInitial && !errors.rateFinal && !errors.periods && !errors.form) {
      const finalHome = convertMoney(
        rateFinal.value!,
        input.rateFinalCurrency,
        input.rateInitialCurrency,
        rates
      );
      if (!finalHome.ok) {
        errors.form = finalHome.message;
      } else {
        growthRatePercent = calculateRevenueGrowthRate(
          rateInitial.value!,
          finalHome.amount,
          periods.value!
        );
        if (growthRatePercent === null) {
          errors.form =
            errors.form ??
            'Growth rate is undefined for these inputs.';
        }
      }
    }
  }

  const fieldErrorKeys = Object.keys(errors).filter((k) => k !== 'form');
  if (fieldErrorKeys.length > 0 || (errors.form && totalGrowthPercent === null && growthRatePercent === null)) {
    return {
      isValid: false,
      errors,
      result: null,
    };
  }

  if (totalGrowthPercent === null && growthRatePercent === null) {
    return { isValid: false, errors: {}, result: null };
  }

  const result: RevenueGrowthResult = {
    totalGrowthPercent,
    formattedTotalGrowth:
      totalGrowthPercent === null
        ? ''
        : formatRevenueGrowthPercent(totalGrowthPercent),
    growthRatePercent,
    formattedGrowthRate:
      growthRatePercent === null
        ? ''
        : formatRevenueGrowthPercent(growthRatePercent),
  };

  return { isValid: true, errors: {}, result };
}
