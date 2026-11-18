import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateUnleveredFreeCashFlow,
  formatUfcfMoney,
} from './calculation';
import type {
  UnleveredFreeCashFlowFieldErrors,
  UnleveredFreeCashFlowInput,
  UnleveredFreeCashFlowResult,
} from './types';

export interface UnleveredFreeCashFlowValidation {
  isValid: boolean;
  errors: UnleveredFreeCashFlowFieldErrors;
  result: UnleveredFreeCashFlowResult | null;
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
 * Validates inputs, normalizes money into the UFCF currency with stored FX
 * rates, then computes NOPAT and UFCF at full precision. ETR is never
 * FX-converted. Negative EBIT/UFCF allowed. Never assumes 1:1 conversion.
 */
export function validateUnleveredFreeCashFlowInput(
  input: UnleveredFreeCashFlowInput,
  rates?: CurrencyRatesSnapshot | null
): UnleveredFreeCashFlowValidation {
  const errors: UnleveredFreeCashFlowFieldErrors = {};

  const ebit = parseNumber(input.ebit);
  const etr = parseNumber(input.etr);
  const da = parseNumber(input.da);
  const capex = parseNumber(input.capex);
  const changeInWc = parseNumber(input.changeInWc);

  if (!ebit.blank && (ebit.invalid || ebit.value === null)) {
    errors.ebit = 'Enter a valid EBIT amount.';
  }
  if (!etr.blank && (etr.invalid || etr.value === null)) {
    errors.etr = 'Enter a valid effective tax rate.';
  } else if (etr.value !== null && (etr.value < 0 || etr.value > 100)) {
    errors.etr = 'Effective tax rate must be between 0% and 100%.';
  }
  if (!da.blank && (da.invalid || da.value === null)) {
    errors.da = 'Enter a valid depreciation and amortization amount.';
  }
  if (!capex.blank && (capex.invalid || capex.value === null)) {
    errors.capex = 'Enter a valid capital expenditures amount.';
  }
  if (!changeInWc.blank && (changeInWc.invalid || changeInWc.value === null)) {
    errors.changeInWc = 'Enter a valid change in working capital.';
  }

  const incomplete =
    ebit.blank ||
    etr.blank ||
    da.blank ||
    capex.blank ||
    changeInWc.blank ||
    Boolean(errors.ebit) ||
    Boolean(errors.etr) ||
    Boolean(errors.da) ||
    Boolean(errors.capex) ||
    Boolean(errors.changeInWc);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const target = input.ufcfCurrency;

  const ebitNorm = convertMoney(ebit.value!, input.ebitCurrency, target, rates);
  if (!ebitNorm.ok) {
    errors.form = ebitNorm.message;
    return { isValid: false, errors, result: null };
  }

  const daNorm = convertMoney(da.value!, input.daCurrency, target, rates);
  if (!daNorm.ok) {
    errors.form = daNorm.message;
    return { isValid: false, errors, result: null };
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

  const wcNorm = convertMoney(
    changeInWc.value!,
    input.changeInWcCurrency,
    target,
    rates
  );
  if (!wcNorm.ok) {
    errors.form = wcNorm.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateUnleveredFreeCashFlow({
    ebit: ebitNorm.amount,
    etrPercent: etr.value!,
    da: daNorm.amount,
    capex: capexNorm.amount,
    changeInWc: wcNorm.amount,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const result: UnleveredFreeCashFlowResult = {
    nopat: computed.nopat,
    ufcf: computed.ufcf,
    ufcfCanonical: computed.ufcf,
    currency: target,
    formattedUfcf: formatUfcfMoney(computed.ufcf, target),
    isNegative: computed.ufcf < 0,
  };

  return { isValid: true, errors, result };
}
