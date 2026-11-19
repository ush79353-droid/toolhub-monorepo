import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateAccountingProfit,
  formatAccountingProfitMoney,
} from './calculation';
import type {
  AccountingProfitFieldErrors,
  AccountingProfitInput,
  AccountingProfitResult,
} from './types';

export interface AccountingProfitValidation {
  isValid: boolean;
  errors: AccountingProfitFieldErrors;
  result: AccountingProfitResult | null;
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

function validateNonneg(
  parsed: ReturnType<typeof parseNumber>,
  blankMessage: string,
  negativeMessage: string
): string | undefined {
  if (!parsed.blank && (parsed.invalid || parsed.value === null)) {
    return blankMessage;
  }
  if (parsed.value !== null && parsed.value < 0) {
    return negativeMessage;
  }
  return undefined;
}

/**
 * Validates nonnegative money fields, normalizes expenses into the
 * total-revenue currency, computes explicit costs and accounting profit at
 * full precision, then FX-converts results into their display currencies.
 */
export function validateAccountingProfitInput(
  input: AccountingProfitInput,
  rates?: CurrencyRatesSnapshot | null
): AccountingProfitValidation {
  const errors: AccountingProfitFieldErrors = {};

  const revenue = parseNumber(input.totalRevenue);
  const opEx = parseNumber(input.operationExpenses);
  const interest = parseNumber(input.interest);
  const depreciation = parseNumber(input.depreciation);
  const taxes = parseNumber(input.taxes);

  errors.totalRevenue = validateNonneg(
    revenue,
    'Enter a valid total revenue.',
    'Total revenue must be zero or greater.'
  );
  errors.operationExpenses = validateNonneg(
    opEx,
    'Enter a valid operation expenses amount.',
    'Operation expenses must be zero or greater.'
  );
  errors.interest = validateNonneg(
    interest,
    'Enter a valid interest amount.',
    'Interest must be zero or greater.'
  );
  errors.depreciation = validateNonneg(
    depreciation,
    'Enter a valid depreciation amount.',
    'Depreciation must be zero or greater.'
  );
  errors.taxes = validateNonneg(
    taxes,
    'Enter a valid taxes amount.',
    'Taxes must be zero or greater.'
  );

  // Drop undefined keys for cleaner error objects
  for (const key of Object.keys(errors) as (keyof AccountingProfitFieldErrors)[]) {
    if (errors[key] === undefined) delete errors[key];
  }

  const incomplete =
    revenue.blank ||
    opEx.blank ||
    interest.blank ||
    depreciation.blank ||
    taxes.blank ||
    Boolean(errors.totalRevenue) ||
    Boolean(errors.operationExpenses) ||
    Boolean(errors.interest) ||
    Boolean(errors.depreciation) ||
    Boolean(errors.taxes);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const base = input.totalRevenueCurrency;

  const opExN = convertMoney(
    opEx.value!,
    input.operationExpensesCurrency,
    base,
    rates
  );
  if (!opExN.ok) {
    errors.form = opExN.message;
    return { isValid: false, errors, result: null };
  }

  const interestN = convertMoney(
    interest.value!,
    input.interestCurrency,
    base,
    rates
  );
  if (!interestN.ok) {
    errors.form = interestN.message;
    return { isValid: false, errors, result: null };
  }

  const depN = convertMoney(
    depreciation.value!,
    input.depreciationCurrency,
    base,
    rates
  );
  if (!depN.ok) {
    errors.form = depN.message;
    return { isValid: false, errors, result: null };
  }

  const taxesN = convertMoney(taxes.value!, input.taxesCurrency, base, rates);
  if (!taxesN.ok) {
    errors.form = taxesN.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateAccountingProfit({
    totalRevenue: revenue.value!,
    operationExpenses: opExN.amount,
    interest: interestN.amount,
    depreciation: depN.amount,
    taxes: taxesN.amount,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const costsFx = convertMoney(
    computed.totalExplicitCosts,
    base,
    input.totalExplicitCostsCurrency,
    rates
  );
  if (!costsFx.ok) {
    errors.form = costsFx.message;
    return { isValid: false, errors, result: null };
  }

  const profitFx = convertMoney(
    computed.accountingProfit,
    base,
    input.accountingProfitCurrency,
    rates
  );
  if (!profitFx.ok) {
    errors.form = profitFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: AccountingProfitResult = {
    totalExplicitCostsCanonical: computed.totalExplicitCosts,
    accountingProfitCanonical: computed.accountingProfit,
    totalExplicitCosts: costsFx.amount,
    accountingProfit: profitFx.amount,
    totalRevenueCurrency: base,
    totalExplicitCostsCurrency: input.totalExplicitCostsCurrency,
    accountingProfitCurrency: input.accountingProfitCurrency,
    formattedTotalExplicitCosts: formatAccountingProfitMoney(
      costsFx.amount,
      input.totalExplicitCostsCurrency
    ),
    formattedAccountingProfit: formatAccountingProfitMoney(
      profitFx.amount,
      input.accountingProfitCurrency
    ),
  };

  return { isValid: true, errors, result };
}
