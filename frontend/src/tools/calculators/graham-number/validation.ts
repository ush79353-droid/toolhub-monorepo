import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateDerivedBvps,
  calculateDerivedEps,
  calculateGrahamNumber,
  formatGrahamMoney,
  formatGrahamPercent,
  interpretGraham,
  valuationLabel,
} from './calculation';
import type {
  GrahamNumberFieldErrors,
  GrahamNumberInput,
  GrahamNumberResult,
} from './types';

export interface GrahamNumberValidation {
  isValid: boolean;
  errors: GrahamNumberFieldErrors;
  result: GrahamNumberResult | null;
  derivedEps: number | null;
  derivedBvps: number | null;
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

export function validateGrahamNumberInput(
  input: GrahamNumberInput
): GrahamNumberValidation {
  const errors: GrahamNumberFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasFieldError = false;

  const bvps = parseNumber(input.bookValuePerShare);
  if (bvps.blank) {
    errors.bookValuePerShare = 'Enter book value per share.';
    hasFieldError = true;
  } else if (bvps.invalid || bvps.value === null) {
    errors.bookValuePerShare = 'Enter a valid book value per share.';
    hasFieldError = true;
  } else if (bvps.value <= 0) {
    errors.bookValuePerShare =
      'Book value per share must be greater than zero for the Graham Number formula.';
    hasFieldError = true;
  }

  const eps = parseNumber(input.earningsPerShare);
  if (eps.blank) {
    errors.earningsPerShare = 'Enter earnings per share.';
    hasFieldError = true;
  } else if (eps.invalid || eps.value === null) {
    errors.earningsPerShare = 'Enter a valid earnings per share.';
    hasFieldError = true;
  } else if (eps.value <= 0) {
    errors.earningsPerShare =
      'Earnings per share must be greater than zero for the Graham Number formula.';
    hasFieldError = true;
  }

  const price = parseNumber(input.currentPrice);
  let currentPrice: number | undefined;
  if (!price.blank) {
    if (price.invalid || price.value === null) {
      errors.currentPrice = 'Enter a valid current price.';
      hasFieldError = true;
    } else if (price.value <= 0) {
      errors.currentPrice = 'Current price must be greater than zero.';
      hasFieldError = true;
    } else {
      currentPrice = price.value;
    }
  }

  // Optional derived helpers — validate only when partially filled
  let derivedEps: number | null = null;
  const ni = parseNumber(input.netIncome);
  const prefDiv = parseNumber(input.preferredDividends);
  const wShares = parseNumber(input.weightedShares);
  const epsHelperTouched =
    !ni.blank || !prefDiv.blank || !wShares.blank;
  if (epsHelperTouched) {
    if (ni.blank || ni.invalid || ni.value === null) {
      errors.netIncome = 'Enter net income (or clear helper fields).';
    } else if (prefDiv.blank) {
      // treat blank preferred as 0 if other fields present
    } else if (prefDiv.invalid || prefDiv.value === null) {
      errors.preferredDividends = 'Enter preferred dividends (use 0 if none).';
    } else if (prefDiv.value < 0) {
      errors.preferredDividends = 'Preferred dividends cannot be negative.';
    }
    if (wShares.blank || wShares.invalid || wShares.value === null) {
      errors.weightedShares = 'Enter weighted-average common shares.';
    } else if (!(wShares.value > 0)) {
      errors.weightedShares = 'Weighted-average shares must be greater than zero.';
    }
    const pref =
      prefDiv.blank ? 0 : prefDiv.value;
    if (
      ni.value != null &&
      pref != null &&
      wShares.value != null &&
      !errors.netIncome &&
      !errors.preferredDividends &&
      !errors.weightedShares
    ) {
      derivedEps = calculateDerivedEps({
        netIncome: ni.value,
        preferredDividends: pref,
        weightedShares: wShares.value,
      });
      if (derivedEps == null) {
        errors.derivedEps = 'Unable to derive EPS from these inputs.';
      } else if (derivedEps <= 0) {
        errors.derivedEps =
          'Derived EPS is not positive: the Graham Number formula does not apply.';
      }
    }
  }

  let derivedBvps: number | null = null;
  const equity = parseNumber(input.totalEquity);
  const prefEq = parseNumber(input.preferredEquity);
  const cShares = parseNumber(input.commonShares);
  const bvpsHelperTouched =
    !equity.blank || !prefEq.blank || !cShares.blank;
  if (bvpsHelperTouched) {
    if (equity.blank || equity.invalid || equity.value === null) {
      errors.totalEquity = 'Enter total shareholders’ equity (or clear helper fields).';
    }
    if (prefEq.blank) {
      // ok → 0
    } else if (prefEq.invalid || prefEq.value === null) {
      errors.preferredEquity = 'Enter preferred equity (use 0 if none).';
    } else if (prefEq.value < 0) {
      errors.preferredEquity = 'Preferred equity cannot be negative.';
    }
    if (cShares.blank || cShares.invalid || cShares.value === null) {
      errors.commonShares = 'Enter common shares outstanding.';
    } else if (!(cShares.value > 0)) {
      errors.commonShares = 'Common shares must be greater than zero.';
    }
    const pref = prefEq.blank ? 0 : prefEq.value;
    if (
      equity.value != null &&
      pref != null &&
      cShares.value != null &&
      !errors.totalEquity &&
      !errors.preferredEquity &&
      !errors.commonShares
    ) {
      derivedBvps = calculateDerivedBvps({
        totalEquity: equity.value,
        preferredEquity: pref,
        commonShares: cShares.value,
      });
      if (derivedBvps == null) {
        errors.derivedBvps = 'Unable to derive BVPS from these inputs.';
      } else if (derivedBvps <= 0) {
        errors.derivedBvps =
          'Derived BVPS is not positive: the Graham Number formula does not apply.';
      }
    }
  }

  if (hasFieldError) {
    return {
      isValid: false,
      errors,
      result: null,
      derivedEps,
      derivedBvps,
    };
  }

  if (eps.value === null || bvps.value === null) {
    return {
      isValid: false,
      errors,
      result: null,
      derivedEps,
      derivedBvps,
    };
  }

  const math = calculateGrahamNumber({
    earningsPerShare: eps.value,
    bookValuePerShare: bvps.value,
    currentPrice,
  });

  if (math === null) {
    errors.form = 'Unable to calculate the Graham Number with these inputs.';
    return {
      isValid: false,
      errors,
      result: null,
      derivedEps,
      derivedBvps,
    };
  }

  const status = math.valuationStatus ?? null;
  const result: GrahamNumberResult = {
    grahamNumber: math.grahamNumber,
    currency,
    formattedGrahamNumber: `${symbol}${formatGrahamMoney(math.grahamNumber, currency)}`,
    valuationStatus: status,
    valuationLabel: status ? valuationLabel(status) : null,
    priceDifferencePercentage: math.priceDifferencePercentage ?? null,
    formattedPriceDifference:
      math.priceDifferencePercentage != null
        ? `${formatGrahamPercent(math.priceDifferencePercentage)}%`
        : null,
    upsidePercentage: math.upsidePercentage ?? null,
    formattedUpside:
      math.upsidePercentage != null
        ? `${formatGrahamPercent(math.upsidePercentage)}%`
        : null,
    interpretation: interpretGraham(
      math.grahamNumber,
      symbol,
      currency,
      status
    ),
    warningMessage:
      'The Graham Number is a simplified screening heuristic (√(22.5 × EPS × BVPS)), not a complete intrinsic-value model or investment recommendation.',
  };

  return { isValid: true, errors, result, derivedEps, derivedBvps };
}
