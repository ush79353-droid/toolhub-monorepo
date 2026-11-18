import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateLeveredFreeCashFlow,
  formatLeveredFcfMoney,
} from './calculation';
import type {
  LeveredFreeCashFlowFieldErrors,
  LeveredFreeCashFlowInput,
  LeveredFreeCashFlowResult,
} from './types';

export interface LeveredFreeCashFlowValidation {
  isValid: boolean;
  errors: LeveredFreeCashFlowFieldErrors;
  result: LeveredFreeCashFlowResult | null;
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
 * Validates monetary inputs, normalizes them into the levered-FCF currency with
 * stored FX rates, then computes Levered FCF = EBITDA − CapEx − ΔWC − Debt
 * repayments at full precision. Negative results are allowed. Never assumes
 * 1:1 conversion when currencies differ.
 */
export function validateLeveredFreeCashFlowInput(
  input: LeveredFreeCashFlowInput,
  rates?: CurrencyRatesSnapshot | null
): LeveredFreeCashFlowValidation {
  const errors: LeveredFreeCashFlowFieldErrors = {};

  const ebitda = parseNumber(input.ebitda);
  const capex = parseNumber(input.capex);
  const changeInWc = parseNumber(input.changeInWc);
  const debtRepayments = parseNumber(input.debtRepayments);

  if (!ebitda.blank && (ebitda.invalid || ebitda.value === null)) {
    errors.ebitda = 'Enter a valid EBITDA amount.';
  }
  if (!capex.blank && (capex.invalid || capex.value === null)) {
    errors.capex = 'Enter a valid capital expenditures amount.';
  }
  if (!changeInWc.blank && (changeInWc.invalid || changeInWc.value === null)) {
    errors.changeInWc = 'Enter a valid net change in working capital.';
  }
  if (
    !debtRepayments.blank &&
    (debtRepayments.invalid || debtRepayments.value === null)
  ) {
    errors.debtRepayments = 'Enter a valid mandatory debt repayments amount.';
  }

  const incomplete =
    ebitda.blank ||
    capex.blank ||
    changeInWc.blank ||
    debtRepayments.blank ||
    Boolean(errors.ebitda) ||
    Boolean(errors.capex) ||
    Boolean(errors.changeInWc) ||
    Boolean(errors.debtRepayments);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const target = input.leveredFcfCurrency;

  const ebitdaNorm = convertMoney(
    ebitda.value!,
    input.ebitdaCurrency,
    target,
    rates
  );
  if (!ebitdaNorm.ok) {
    errors.form = ebitdaNorm.message;
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

  const debtNorm = convertMoney(
    debtRepayments.value!,
    input.debtRepaymentsCurrency,
    target,
    rates
  );
  if (!debtNorm.ok) {
    errors.form = debtNorm.message;
    return { isValid: false, errors, result: null };
  }

  const leveredFcf = calculateLeveredFreeCashFlow({
    ebitda: ebitdaNorm.amount,
    capex: capexNorm.amount,
    changeInWc: wcNorm.amount,
    debtRepayments: debtNorm.amount,
  });

  if (leveredFcf === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const result: LeveredFreeCashFlowResult = {
    leveredFcf,
    leveredFcfCanonical: leveredFcf,
    currency: target,
    formattedLeveredFcf: formatLeveredFcfMoney(leveredFcf, target),
    isNegative: leveredFcf < 0,
  };

  return { isValid: true, errors, result };
}
