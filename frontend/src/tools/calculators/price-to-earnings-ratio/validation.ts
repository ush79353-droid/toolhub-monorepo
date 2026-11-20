import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateEps,
  calculatePeRatio,
  formatPeMoney,
  formatRatio,
  interpretPeRatio,
} from './calculation';
import type {
  PriceToEarningsFieldErrors,
  PriceToEarningsInput,
  PriceToEarningsResult,
} from './types';

export interface PriceToEarningsValidation {
  isValid: boolean;
  errors: PriceToEarningsFieldErrors;
  result: PriceToEarningsResult | null;
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

export function validatePriceToEarningsInput(
  input: PriceToEarningsInput
): PriceToEarningsValidation {
  const errors: PriceToEarningsFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasError = false;

  const price = parseNumber(input.pricePerShare);
  if (price.blank) {
    errors.pricePerShare = 'Enter the price per share.';
    hasError = true;
  } else if (price.invalid || price.value === null) {
    errors.pricePerShare = 'Enter a valid share price.';
    hasError = true;
  } else if (price.value < 0) {
    errors.pricePerShare = 'Share price cannot be negative.';
    hasError = true;
  }

  let epsValue: number | null = null;

  if (input.showEpsCalculator) {
    const net = parseNumber(input.netIncome);
    if (net.blank) {
      errors.netIncome = 'Enter net income.';
      hasError = true;
    } else if (net.invalid || net.value === null) {
      errors.netIncome = 'Enter a valid net income.';
      hasError = true;
    }

    const pref = parseNumber(input.preferredDividends);
    if (pref.blank) {
      errors.preferredDividends =
        'Enter preferred dividends (use 0 if none).';
      hasError = true;
    } else if (pref.invalid || pref.value === null) {
      errors.preferredDividends = 'Enter a valid preferred dividends amount.';
      hasError = true;
    } else if (pref.value < 0) {
      errors.preferredDividends =
        'Preferred dividends cannot be negative.';
      hasError = true;
    }

    const shares = parseNumber(input.weightedAverageShares);
    if (shares.blank) {
      errors.weightedAverageShares =
        'Enter weighted-average common shares.';
      hasError = true;
    } else if (shares.invalid || shares.value === null) {
      errors.weightedAverageShares = 'Enter a valid share count.';
      hasError = true;
    } else if (shares.value <= 0) {
      errors.weightedAverageShares =
        'Weighted-average shares must be greater than zero.';
      hasError = true;
    }

    if (
      net.value !== null &&
      !net.invalid &&
      pref.value !== null &&
      pref.value >= 0 &&
      !pref.invalid &&
      shares.value !== null &&
      shares.value > 0 &&
      !shares.invalid
    ) {
      epsValue = calculateEps(net.value, pref.value, shares.value);
      if (epsValue === null) {
        errors.form = 'Unable to calculate EPS with these inputs.';
        hasError = true;
      }
    }
  } else {
    const eps = parseNumber(input.earningsPerShare);
    if (eps.blank) {
      errors.earningsPerShare = 'Enter earnings per share.';
      hasError = true;
    } else if (eps.invalid || eps.value === null) {
      errors.earningsPerShare = 'Enter a valid EPS.';
      hasError = true;
    } else {
      epsValue = eps.value;
    }
  }

  if (hasError || price.value === null || epsValue === null) {
    return { isValid: false, errors, result: null };
  }

  const pe = calculatePeRatio(price.value, epsValue);

  let peUnavailableReason: string | null = null;
  if (pe.status === 'undefined') {
    peUnavailableReason =
      'The price-to-earnings ratio cannot be calculated because earnings per share are zero.';
  } else if (pe.status === 'not-meaningful') {
    peUnavailableReason =
      'The company reported negative earnings per share. A conventional P/E valuation multiple is not meaningful.';
  } else if (pe.status === 'invalid') {
    peUnavailableReason = 'Unable to calculate a valid P/E ratio.';
  }

  const money = (n: number) => `${symbol}${formatPeMoney(n, currency)}`;

  const result: PriceToEarningsResult = {
    earningsPerShare: epsValue,
    peRatio: pe.peRatio,
    status: pe.status,
    currency,
    formattedEps: money(epsValue),
    formattedPe:
      pe.peRatio === null ? null : `${formatRatio(pe.peRatio)}×`,
    peUnavailableReason,
    interpretation:
      pe.peRatio !== null ? interpretPeRatio(pe.peRatio) : null,
    warningMessage:
      'P/E = share price ÷ EPS when EPS is positive. Trailing vs forward earnings, industry norms, and growth expectations all affect interpretation.',
  };

  return {
    isValid: pe.status === 'valid' && pe.peRatio !== null,
    errors,
    result,
  };
}
