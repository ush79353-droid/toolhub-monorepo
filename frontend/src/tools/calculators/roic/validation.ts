import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateAverageInvestedCapital,
  calculateInvestedCapital,
  calculateNopat,
  calculateRoic,
  explainRoicReturn,
  formatRoicMoney,
  formatRoicPercent,
  interpretRoic,
} from './calculation';
import type { RoicFieldErrors, RoicInput, RoicResult } from './types';

export interface RoicValidation {
  isValid: boolean;
  errors: RoicFieldErrors;
  result: RoicResult | null;
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

export function validateRoicInput(input: RoicInput): RoicValidation {
  const errors: RoicFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasError = false;

  const ebit = parseFinite(input.ebit);
  if (ebit.blank) {
    errors.ebit = 'Enter EBIT.';
    hasError = true;
  } else if (ebit.invalid || ebit.value === null) {
    errors.ebit = 'Enter a valid EBIT amount.';
    hasError = true;
  }

  const tax = parseFinite(input.taxRate);
  if (tax.blank) {
    errors.taxRate = 'Enter a tax rate.';
    hasError = true;
  } else if (tax.invalid || tax.value === null) {
    errors.taxRate = 'Enter a valid tax rate.';
    hasError = true;
  } else if (tax.value < 0 || tax.value > 100) {
    errors.taxRate = 'Tax rate must be between 0% and 100%.';
    hasError = true;
  }

  let investedCapital: number | null = null;
  let hasNegativeEquity = false;

  if (input.useAverageCapital) {
    const begin = parseFinite(input.beginningCapital);
    if (begin.blank) {
      errors.beginningCapital = 'Enter beginning invested capital.';
      hasError = true;
    } else if (begin.invalid || begin.value === null) {
      errors.beginningCapital = 'Enter a valid beginning invested capital.';
      hasError = true;
    }

    const end = parseFinite(input.endingCapital);
    if (end.blank) {
      errors.endingCapital = 'Enter ending invested capital.';
      hasError = true;
    } else if (end.invalid || end.value === null) {
      errors.endingCapital = 'Enter a valid ending invested capital.';
      hasError = true;
    }

    if (
      begin.value !== null &&
      !begin.invalid &&
      end.value !== null &&
      !end.invalid
    ) {
      investedCapital = calculateAverageInvestedCapital(begin.value, end.value);
      if (investedCapital === null || investedCapital <= 0) {
        errors.form =
          'Average invested capital must be greater than zero to calculate a meaningful ROIC.';
        hasError = true;
        investedCapital = null;
      }
    }
  } else {
    const equity = parseFinite(input.equity);
    if (equity.blank) {
      errors.equity = 'Enter equity.';
      hasError = true;
    } else if (equity.invalid || equity.value === null) {
      errors.equity = 'Enter a valid equity amount.';
      hasError = true;
    } else {
      hasNegativeEquity = equity.value < 0;
    }

    const debt = parseFinite(input.debt);
    if (debt.blank) {
      errors.debt = 'Enter debt.';
      hasError = true;
    } else if (debt.invalid || debt.value === null) {
      errors.debt = 'Enter a valid debt amount.';
      hasError = true;
    }

    if (
      equity.value !== null &&
      !equity.invalid &&
      debt.value !== null &&
      !debt.invalid
    ) {
      investedCapital = calculateInvestedCapital(equity.value, debt.value);
      if (investedCapital === null || investedCapital <= 0) {
        errors.form =
          'Invested capital must be greater than zero to calculate a meaningful ROIC.';
        hasError = true;
        investedCapital = null;
      }
    }
  }

  if (
    hasError ||
    ebit.value === null ||
    tax.value === null ||
    investedCapital === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const nopat = calculateNopat(ebit.value, tax.value);
  if (nopat === null) {
    errors.form = 'Unable to calculate NOPAT.';
    return { isValid: false, errors, result: null };
  }

  const math = calculateRoic(nopat, investedCapital);
  if (!math) {
    errors.form = 'Unable to calculate return on invested capital.';
    return { isValid: false, errors, result: null };
  }

  const hasNegativeEbit = ebit.value < 0;
  const warnings: string[] = [];
  if (hasNegativeEbit) {
    warnings.push(
      'A simplified after-tax operating loss (NOPAT) calculation may not reflect actual tax benefits, refunds, or loss carryforwards.'
    );
  }
  if (hasNegativeEquity && !input.useAverageCapital) {
    warnings.push(
      'Equity is negative. Conventional ROIC interpretation may be less reliable even when total invested capital remains positive.'
    );
  }
  if (input.useAverageCapital) {
    warnings.push(
      'ROIC uses average invested capital = (beginning + ending) ÷ 2 as the denominator. This is still a simplified capital definition.'
    );
  } else {
    warnings.push(
      'Invested capital uses the simplified financing definition Equity + Debt. Advanced valuation may adjust for excess cash, leases, and non-operating items.'
    );
  }

  const result: RoicResult = {
    nopat,
    investedCapital,
    roicPercentage: math.roicPercentage,
    returnPerCapitalUnit: math.returnPerCapitalUnit,
    usedAverageCapital: input.useAverageCapital,
    hasNegativeEquity,
    hasNegativeEbit,
    currency,
    formattedNopat: `${symbol}${formatRoicMoney(nopat, currency)}`,
    formattedInvestedCapital: `${symbol}${formatRoicMoney(investedCapital, currency)}`,
    formattedRoic: formatRoicPercent(math.roicPercentage),
    interpretation: interpretRoic(math.roicPercentage),
    explanation: explainRoicReturn(math.returnPerCapitalUnit, currency),
    warningMessage: warnings.join(' '),
  };

  return { isValid: true, errors, result };
}
