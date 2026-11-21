import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateFcff,
  formatFcffMoney,
  formulaLabelForSource,
} from './calculation';
import {
  showsDepreciation,
  showsInterest,
  showsNwc,
  type FcffFieldErrors,
  type FcffInput,
  type FcffResult,
} from './types';

export interface FcffValidation {
  isValid: boolean;
  errors: FcffFieldErrors;
  result: FcffResult | null;
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
 * Validates inputs for the active source, normalizes money into the FCFF
 * currency with stored FX rates, then computes source-specific FCFF.
 * Tax % is never converted. Unused adjustments for the source are treated as 0.
 */
export function validateFcffInput(
  input: FcffInput,
  rates?: CurrencyRatesSnapshot | null
): FcffValidation {
  const errors: FcffFieldErrors = {};
  const needDa = showsDepreciation(input.source);
  const needInterest = showsInterest(input.source);
  const needNwc = showsNwc(input.source);

  const source = parseNumber(input.sourceValue);
  const depreciation = parseNumber(input.depreciation);
  const interest = parseNumber(input.interest);
  const tax = parseNumber(input.taxRatePercent);
  const capex = parseNumber(input.capex);
  const nwc = parseNumber(input.nwc);

  if (source.blank || source.invalid || source.value === null) {
    errors.sourceValue = 'Enter a valid source value.';
  }

  if (needDa) {
    if (depreciation.blank || depreciation.invalid || depreciation.value === null) {
      errors.depreciation = 'Enter a valid depreciation and amortization amount.';
    }
  } else if (!depreciation.blank && (depreciation.invalid || depreciation.value === null)) {
    errors.depreciation = 'Enter a valid depreciation and amortization amount.';
  }

  if (needInterest) {
    if (interest.blank || interest.invalid || interest.value === null) {
      errors.interest = 'Enter a valid interest expense.';
    }
  } else if (!interest.blank && (interest.invalid || interest.value === null)) {
    errors.interest = 'Enter a valid interest expense.';
  }

  if (tax.blank || tax.invalid || tax.value === null) {
    errors.taxRatePercent = 'Enter a corporate tax rate from 0% to 100%.';
  } else if (tax.value < 0 || tax.value > 100) {
    errors.taxRatePercent = 'Corporate tax rate must be between 0% and 100%.';
  }

  if (capex.blank || capex.invalid || capex.value === null) {
    errors.capex = 'Enter a valid fixed capital investment.';
  }

  if (needNwc) {
    if (nwc.blank || nwc.invalid || nwc.value === null) {
      errors.nwc = 'Enter a valid working capital investment.';
    }
  } else if (!nwc.blank && (nwc.invalid || nwc.value === null)) {
    errors.nwc = 'Enter a valid working capital investment.';
  }

  const hasFieldErrors =
    Boolean(errors.sourceValue) ||
    Boolean(errors.depreciation) ||
    Boolean(errors.interest) ||
    Boolean(errors.taxRatePercent) ||
    Boolean(errors.capex) ||
    Boolean(errors.nwc);

  if (hasFieldErrors) {
    return { isValid: false, errors, result: null };
  }

  const target = input.fcffCurrency;

  const sourceNorm = convertMoney(
    source.value!,
    input.sourceValueCurrency,
    target,
    rates
  );
  if (!sourceNorm.ok) {
    errors.form = sourceNorm.message;
    return { isValid: false, errors, result: null };
  }

  let depreciationAmount = 0;
  if (needDa) {
    const daNorm = convertMoney(
      depreciation.value!,
      input.depreciationCurrency,
      target,
      rates
    );
    if (!daNorm.ok) {
      errors.form = daNorm.message;
      return { isValid: false, errors, result: null };
    }
    depreciationAmount = daNorm.amount;
  }

  let interestAmount = 0;
  if (needInterest) {
    const interestNorm = convertMoney(
      interest.value!,
      input.interestCurrency,
      target,
      rates
    );
    if (!interestNorm.ok) {
      errors.form = interestNorm.message;
      return { isValid: false, errors, result: null };
    }
    interestAmount = interestNorm.amount;
  }

  const capexNorm = convertMoney(
    capex.value!,
    input.capexCurrency,
    target,
    rates
  );
  if (!capexNorm.ok) {
    errors.form = capexNorm.message;
    return { isValid: false, errors, result: null };
  }

  let nwcAmount = 0;
  if (needNwc) {
    const nwcNorm = convertMoney(
      nwc.value!,
      input.nwcCurrency,
      target,
      rates
    );
    if (!nwcNorm.ok) {
      errors.form = nwcNorm.message;
      return { isValid: false, errors, result: null };
    }
    nwcAmount = nwcNorm.amount;
  }

  const taxRate = tax.value! / 100;
  const fcff = calculateFcff({
    source: input.source,
    sourceValue: sourceNorm.amount,
    depreciation: depreciationAmount,
    interest: interestAmount,
    taxRate,
    capex: capexNorm.amount,
    nwc: nwcAmount,
  });

  if (fcff === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const result: FcffResult = {
    fcff,
    currency: target,
    formattedFcff: formatFcffMoney(fcff, target),
    source: input.source,
    formulaLabel: formulaLabelForSource(input.source),
  };

  return { isValid: true, errors, result };
}
