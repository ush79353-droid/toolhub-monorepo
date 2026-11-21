import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateOperatingCashFlow,
  calculateWorkingCapitalCashAdjustment,
  formatOcfMoney,
} from './calculation';
import type {
  OperatingCashFlowFieldErrors,
  OperatingCashFlowInput,
  OperatingCashFlowResult,
} from './types';

export interface OperatingCashFlowValidation {
  isValid: boolean;
  errors: OperatingCashFlowFieldErrors;
  result: OperatingCashFlowResult | null;
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
 * Validates monetary inputs, normalizes them into the OCF currency with stored
 * FX rates, then computes WC cash adjustment and operating cash flow at full
 * precision. Income tax payable is treated as a change (ending − beginning).
 * Never assumes 1:1 conversion when currencies differ.
 */
export function validateOperatingCashFlowInput(
  input: OperatingCashFlowInput,
  rates?: CurrencyRatesSnapshot | null
): OperatingCashFlowValidation {
  const errors: OperatingCashFlowFieldErrors = {};

  const netIncome = parseNumber(input.netIncome);
  const depreciation = parseNumber(input.depreciation);
  const amortization = parseNumber(input.amortization);
  const changeInInventories = parseNumber(input.changeInInventories);
  const changeInAr = parseNumber(input.changeInAr);
  const changeInAp = parseNumber(input.changeInAp);
  const incomeTaxPayable = parseNumber(input.incomeTaxPayable);
  const netOtherCashFlows = parseNumber(input.netOtherCashFlows);

  if (!netIncome.blank && (netIncome.invalid || netIncome.value === null)) {
    errors.netIncome = 'Enter a valid net income amount.';
  }
  if (
    !depreciation.blank &&
    (depreciation.invalid || depreciation.value === null)
  ) {
    errors.depreciation = 'Enter a valid depreciation amount.';
  }
  if (
    !amortization.blank &&
    (amortization.invalid || amortization.value === null)
  ) {
    errors.amortization = 'Enter a valid amortization amount.';
  }
  if (
    !changeInInventories.blank &&
    (changeInInventories.invalid || changeInInventories.value === null)
  ) {
    errors.changeInInventories = 'Enter a valid change in inventories.';
  }
  if (!changeInAr.blank && (changeInAr.invalid || changeInAr.value === null)) {
    errors.changeInAr = 'Enter a valid change in accounts receivables.';
  }
  if (!changeInAp.blank && (changeInAp.invalid || changeInAp.value === null)) {
    errors.changeInAp = 'Enter a valid change in accounts payable.';
  }
  if (
    !incomeTaxPayable.blank &&
    (incomeTaxPayable.invalid || incomeTaxPayable.value === null)
  ) {
    errors.incomeTaxPayable =
      'Enter a valid change in income tax payable (ending − beginning).';
  }
  if (
    !netOtherCashFlows.blank &&
    (netOtherCashFlows.invalid || netOtherCashFlows.value === null)
  ) {
    errors.netOtherCashFlows = 'Enter a valid net of other cash flows amount.';
  }

  const incomplete =
    netIncome.blank ||
    depreciation.blank ||
    amortization.blank ||
    changeInInventories.blank ||
    changeInAr.blank ||
    changeInAp.blank ||
    incomeTaxPayable.blank ||
    netOtherCashFlows.blank ||
    Boolean(errors.netIncome) ||
    Boolean(errors.depreciation) ||
    Boolean(errors.amortization) ||
    Boolean(errors.changeInInventories) ||
    Boolean(errors.changeInAr) ||
    Boolean(errors.changeInAp) ||
    Boolean(errors.incomeTaxPayable) ||
    Boolean(errors.netOtherCashFlows);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const target = input.operatingCashFlowCurrency;

  const pairs: Array<{
    amount: number;
    from: SupportedCurrency;
  }> = [
    { amount: netIncome.value!, from: input.netIncomeCurrency },
    { amount: depreciation.value!, from: input.depreciationCurrency },
    { amount: amortization.value!, from: input.amortizationCurrency },
    {
      amount: changeInInventories.value!,
      from: input.changeInInventoriesCurrency,
    },
    { amount: changeInAr.value!, from: input.changeInArCurrency },
    { amount: changeInAp.value!, from: input.changeInApCurrency },
    {
      amount: incomeTaxPayable.value!,
      from: input.incomeTaxPayableCurrency,
    },
    {
      amount: netOtherCashFlows.value!,
      from: input.netOtherCashFlowsCurrency,
    },
  ];

  const normalized: number[] = [];
  for (const pair of pairs) {
    const converted = convertMoney(pair.amount, pair.from, target, rates);
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null };
    }
    normalized.push(converted.amount);
  }

  const [
    ni,
    dep,
    amort,
    dInv,
    dAr,
    dAp,
    dTax,
    other,
  ] = normalized;

  const wcAdj = calculateWorkingCapitalCashAdjustment({
    changeInInventories: dInv,
    changeInAr: dAr,
    changeInAp: dAp,
    changeInIncomeTaxPayable: dTax,
  });
  if (wcAdj === null) {
    errors.form = 'This combination does not produce a finite WC adjustment.';
    return { isValid: false, errors, result: null };
  }

  const ocf = calculateOperatingCashFlow({
    netIncome: ni,
    depreciation: dep,
    amortization: amort,
    workingCapitalCashAdjustment: wcAdj,
    netOtherCashFlows: other,
  });
  if (ocf === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const wcDisplayCurrency = input.changeInOperatingWcCurrency;
  const wcDisplay = convertMoney(wcAdj, target, wcDisplayCurrency, rates);
  if (!wcDisplay.ok) {
    errors.form = wcDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: OperatingCashFlowResult = {
    workingCapitalCashAdjustment: wcAdj,
    changeInOperatingWc: wcDisplay.amount,
    changeInOperatingWcCurrency: wcDisplayCurrency,
    formattedChangeInOperatingWc: formatOcfMoney(
      wcDisplay.amount,
      wcDisplayCurrency
    ),
    operatingCashFlow: ocf,
    operatingCashFlowCanonical: ocf,
    operatingCashFlowCurrency: target,
    formattedOperatingCashFlow: formatOcfMoney(ocf, target),
    isNegativeOcf: ocf < 0,
  };

  return { isValid: true, errors, result };
}
