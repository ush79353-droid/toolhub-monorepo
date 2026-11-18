import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateAfterTaxCostOfDebtPercent,
  calculateMarginalTaxRatePercent,
  formatPercentValue,
} from './calculation';
import type {
  AfterTaxCostOfDebtFieldErrors,
  AfterTaxCostOfDebtInput,
  AfterTaxCostOfDebtResult,
} from './types';

export interface AfterTaxCostOfDebtValidation {
  isValid: boolean;
  errors: AfterTaxCostOfDebtFieldErrors;
  result: AfterTaxCostOfDebtResult | null;
  /** When taxRateSource is incomes and incomes are valid, refreshed tax % string. */
  syncedTaxRatePercent: string | null;
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
 * Validates inputs, normalizes incomes into net-income currency, derives or accepts
 * tax rate, then computes after-tax cost of debt. Percentages are never FX-converted.
 */
export function validateAfterTaxCostOfDebtInput(
  input: AfterTaxCostOfDebtInput,
  rates?: CurrencyRatesSnapshot | null
): AfterTaxCostOfDebtValidation {
  const errors: AfterTaxCostOfDebtFieldErrors = {};
  const net = parseNumber(input.netIncome);
  const pretax = parseNumber(input.pretaxIncome);
  const tax = parseNumber(input.taxRatePercent);
  const cost = parseNumber(input.costOfDebtPercent);

  if (!net.blank && (net.invalid || net.value === null)) {
    errors.netIncome = 'Enter a valid net income.';
  }
  if (!pretax.blank && (pretax.invalid || pretax.value === null)) {
    errors.pretaxIncome = 'Enter a valid pre-tax income.';
  }
  if (!tax.blank && (tax.invalid || tax.value === null)) {
    errors.taxRatePercent = 'Enter a valid tax rate.';
  }
  if (!cost.blank && (cost.invalid || cost.value === null)) {
    errors.costOfDebtPercent = 'Enter a valid cost of debt.';
  } else if (!cost.blank && cost.value !== null && cost.value < 0) {
    errors.costOfDebtPercent = 'Cost of debt cannot be negative.';
  }

  let syncedTaxRatePercent: string | null = null;
  let taxRatePercent: number | null = null;
  let netNormalized: number | null = null;
  let pretaxNormalized: number | null = null;
  const normalizeCurrency = input.netIncomeCurrency;

  const incomesReady =
    !net.blank &&
    !pretax.blank &&
    net.value !== null &&
    pretax.value !== null &&
    !errors.netIncome &&
    !errors.pretaxIncome;

  if (incomesReady) {
    if (pretax.value === 0) {
      errors.pretaxIncome = 'Pre-tax income must not be zero when deriving the tax rate.';
    } else {
      const pretaxInNet = convertMoney(
        pretax.value!,
        input.pretaxIncomeCurrency,
        input.netIncomeCurrency,
        rates
      );
      if (!pretaxInNet.ok) {
        errors.form = pretaxInNet.message;
        return { isValid: false, errors, result: null, syncedTaxRatePercent: null };
      }
      netNormalized = net.value!;
      pretaxNormalized = pretaxInNet.amount;
      const derived = calculateMarginalTaxRatePercent(
        netNormalized,
        pretaxNormalized
      );
      if (derived === null) {
        errors.form = 'Unable to derive a finite tax rate from these incomes.';
      } else if (input.taxRateSource === 'incomes') {
        taxRatePercent = derived;
        syncedTaxRatePercent = formatPercentValue(derived);
      }
    }
  }

  if (input.taxRateSource === 'manual' || (!incomesReady && !tax.blank)) {
    if (tax.blank) {
      // wait for tax or incomes
    } else if (!errors.taxRatePercent && tax.value !== null) {
      taxRatePercent = tax.value;
    }
  }

  if (taxRatePercent === null && input.taxRateSource === 'manual' && tax.blank) {
    // incomplete
  }

  const costReady =
    !cost.blank && cost.value !== null && !errors.costOfDebtPercent;

  if (
    Object.keys(errors).length > 0 ||
    taxRatePercent === null ||
    !costReady
  ) {
    return {
      isValid: false,
      errors,
      result: null,
      syncedTaxRatePercent,
    };
  }

  const after = calculateAfterTaxCostOfDebtPercent(
    cost.value!,
    taxRatePercent
  );
  if (after === null) {
    errors.form = 'This combination does not produce a finite after-tax cost of debt.';
    return { isValid: false, errors, result: null, syncedTaxRatePercent };
  }

  const result: AfterTaxCostOfDebtResult = {
    taxRatePercent,
    afterTaxCostOfDebtPercent: after,
    costOfDebtPercent: cost.value!,
    normalizeCurrency,
    netIncomeNormalized: netNormalized ?? Number.NaN,
    pretaxIncomeNormalized: pretaxNormalized ?? Number.NaN,
    formattedTaxRate: formatPercentValue(taxRatePercent),
    formattedAfterTaxCostOfDebt: formatPercentValue(after),
    formattedCostOfDebt: formatPercentValue(cost.value!),
  };

  return { isValid: true, errors: {}, result, syncedTaxRatePercent };
}
