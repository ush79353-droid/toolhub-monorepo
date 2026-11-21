import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateEarningsGrowthPercent,
  calculateEps,
  calculatePegFromPeAndGrowth,
  calculatePeRatio,
  formatPegMoney,
  formatPercent,
  formatRatio,
} from './calculation';
import type {
  PegRatioFieldErrors,
  PegRatioInput,
  PegRatioResult,
} from './types';

export interface PegRatioValidation {
  isValid: boolean;
  errors: PegRatioFieldErrors;
  result: PegRatioResult | null;
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

export function validatePegRatioInput(
  input: PegRatioInput
): PegRatioValidation {
  const errors: PegRatioFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasBlockingError = false;

  const price = parseNumber(input.pricePerShare);
  if (price.blank) {
    errors.pricePerShare = 'Enter the price per share.';
    hasBlockingError = true;
  } else if (price.invalid || price.value === null) {
    errors.pricePerShare = 'Enter a valid share price.';
    hasBlockingError = true;
  } else if (price.value < 0) {
    errors.pricePerShare = 'Share price cannot be negative.';
    hasBlockingError = true;
  }

  let epsValue: number | null = null;

  if (input.calculateEps) {
    const net = parseNumber(input.netEarnings);
    if (net.blank) {
      errors.netEarnings = 'Enter net earnings.';
      hasBlockingError = true;
    } else if (net.invalid || net.value === null) {
      errors.netEarnings = 'Enter a valid net earnings amount.';
      hasBlockingError = true;
    }

    const shares = parseNumber(input.outstandingShares);
    if (shares.blank) {
      errors.outstandingShares = 'Enter outstanding shares.';
      hasBlockingError = true;
    } else if (shares.invalid || shares.value === null) {
      errors.outstandingShares = 'Enter a valid share count.';
      hasBlockingError = true;
    } else if (shares.value <= 0) {
      errors.outstandingShares =
        'Outstanding shares must be greater than zero.';
      hasBlockingError = true;
    } else if (!Number.isInteger(shares.value)) {
      errors.outstandingShares =
        'Outstanding shares must be a whole number.';
      hasBlockingError = true;
    } else if (!Number.isSafeInteger(shares.value)) {
      errors.outstandingShares =
        'Outstanding shares exceed the supported numeric range.';
      hasBlockingError = true;
    }

    if (
      net.value !== null &&
      !net.invalid &&
      shares.value !== null &&
      shares.value > 0 &&
      Number.isInteger(shares.value) &&
      Number.isSafeInteger(shares.value)
    ) {
      epsValue = calculateEps(net.value, shares.value);
      if (epsValue === null) {
        errors.form = 'Unable to calculate EPS with these inputs.';
        hasBlockingError = true;
      }
    }
  } else {
    const eps = parseNumber(input.earningsPerShare);
    if (eps.blank) {
      errors.earningsPerShare = 'Enter earnings per share.';
      hasBlockingError = true;
    } else if (eps.invalid || eps.value === null) {
      errors.earningsPerShare = 'Enter a valid EPS.';
      hasBlockingError = true;
    } else {
      epsValue = eps.value;
    }
  }

  const retention = parseNumber(input.retentionRate);
  if (retention.blank) {
    errors.retentionRate = 'Enter the retention rate.';
    hasBlockingError = true;
  } else if (retention.invalid || retention.value === null) {
    errors.retentionRate = 'Enter a valid retention rate.';
    hasBlockingError = true;
  } else if (retention.value < 0 || retention.value > 100) {
    errors.retentionRate = 'Retention rate must be between 0% and 100%.';
    hasBlockingError = true;
  }

  const roe = parseNumber(input.returnOnEquity);
  if (roe.blank) {
    errors.returnOnEquity = 'Enter return on equity.';
    hasBlockingError = true;
  } else if (roe.invalid || roe.value === null) {
    errors.returnOnEquity = 'Enter a valid ROE percentage.';
    hasBlockingError = true;
  }

  // Build partial results whenever we can
  let peRatio: number | null = null;
  let peUnavailableReason: string | null = null;
  if (
    price.value !== null &&
    price.value >= 0 &&
    !price.invalid &&
    epsValue !== null
  ) {
    if (epsValue === 0) {
      peUnavailableReason =
        'P/E is undefined when EPS is zero (division by zero).';
    } else if (epsValue < 0) {
      peUnavailableReason =
        'Conventional P/E (and PEG) are not meaningful with negative EPS.';
    } else {
      peRatio = calculatePeRatio(price.value, epsValue);
    }
  }

  let earningsGrowthPercent: number | null = null;
  if (
    retention.value !== null &&
    !retention.invalid &&
    retention.value >= 0 &&
    retention.value <= 100 &&
    roe.value !== null &&
    !roe.invalid
  ) {
    earningsGrowthPercent = calculateEarningsGrowthPercent(
      retention.value,
      roe.value
    );
  }

  let pegRatio: number | null = null;
  let pegUnavailableReason: string | null = peUnavailableReason;
  if (peRatio !== null && earningsGrowthPercent !== null) {
    if (earningsGrowthPercent <= 0) {
      pegUnavailableReason =
        earningsGrowthPercent === 0
          ? 'PEG is undefined when earnings growth is zero.'
          : 'Conventional PEG is not meaningful with zero or negative earnings growth.';
    } else {
      pegRatio = calculatePegFromPeAndGrowth(peRatio, earningsGrowthPercent);
      pegUnavailableReason = null;
    }
  } else if (peRatio === null && peUnavailableReason) {
    pegUnavailableReason = peUnavailableReason;
  } else if (
    peRatio !== null &&
    earningsGrowthPercent === null &&
    !errors.retentionRate &&
    !errors.returnOnEquity
  ) {
    pegUnavailableReason = 'Enter retention rate and ROE to calculate PEG.';
  }

  const hasAnyResult =
    epsValue !== null ||
    peRatio !== null ||
    earningsGrowthPercent !== null ||
    pegRatio !== null;

  if (!hasAnyResult && hasBlockingError) {
    return { isValid: false, errors, result: null };
  }

  if (!hasAnyResult) {
    return { isValid: false, errors, result: null };
  }

  const result: PegRatioResult = {
    earningsPerShare: epsValue,
    peRatio,
    earningsGrowthPercent,
    pegRatio,
    currency,
    formattedEps:
      epsValue === null
        ? null
        : `${symbol}${formatPegMoney(epsValue, currency)}`,
    formattedPeRatio:
      peRatio === null ? null : `${formatRatio(peRatio)}×`,
    formattedGrowth:
      earningsGrowthPercent === null
        ? null
        : `${formatPercent(earningsGrowthPercent)}%`,
    formattedPeg: pegRatio === null ? null : formatRatio(pegRatio),
    peUnavailableReason,
    pegUnavailableReason,
    warningMessage:
      'PEG divides P/E by earnings growth in percentage points (e.g. 4.8 for 4.8%). Growth uses retention × ROE under simplifying assumptions — not a forecast guarantee.',
  };

  return {
    isValid: !hasBlockingError && pegRatio !== null,
    errors,
    result,
  };
}
