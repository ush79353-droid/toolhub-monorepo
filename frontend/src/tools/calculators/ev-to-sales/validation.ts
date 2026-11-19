import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateEvToSales,
  formatEvMoney,
  formatEvToSalesRatio,
} from './calculation';
import type {
  EvToSalesFieldErrors,
  EvToSalesInput,
  EvToSalesResult,
} from './types';

export interface EvToSalesValidation {
  isValid: boolean;
  errors: EvToSalesFieldErrors;
  result: EvToSalesResult | null;
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
 * Validates money fields, normalizes all amounts into the market-cap currency,
 * computes EV and EV/Sales at full precision, then converts EV into its
 * independent display currency. The dimensionless EV/Sales ratio never FX-converts.
 * Sales must be > 0 for a defined ratio; sales === 0 → undefined (not Infinity).
 */
export function validateEvToSalesInput(
  input: EvToSalesInput,
  rates?: CurrencyRatesSnapshot | null
): EvToSalesValidation {
  const errors: EvToSalesFieldErrors = {};

  const cash = parseNumber(input.cash);
  const marketCap = parseNumber(input.marketCap);
  const totalDebt = parseNumber(input.totalDebt);
  const minority = parseNumber(input.minorityInterest);
  const preferred = parseNumber(input.preferredShares);
  const sales = parseNumber(input.sales);

  const moneyFields: Array<{
    parsed: ReturnType<typeof parseNumber>;
    key: keyof EvToSalesFieldErrors;
    label: string;
  }> = [
    { parsed: cash, key: 'cash', label: 'cash and cash equivalents' },
    { parsed: marketCap, key: 'marketCap', label: 'market capitalization' },
    { parsed: totalDebt, key: 'totalDebt', label: 'total debt' },
    { parsed: minority, key: 'minorityInterest', label: 'minority interest' },
    { parsed: preferred, key: 'preferredShares', label: 'preferred shares' },
    { parsed: sales, key: 'sales', label: 'sales (revenues)' },
  ];

  for (const field of moneyFields) {
    if (!field.parsed.blank && (field.parsed.invalid || field.parsed.value === null)) {
      errors[field.key] = `Enter a valid ${field.label} amount.`;
    }
  }

  if (!sales.blank && !errors.sales && sales.value !== null && sales.value < 0) {
    errors.sales = 'Sales (revenues) must be zero or greater.';
  }

  const incomplete =
    cash.blank ||
    marketCap.blank ||
    totalDebt.blank ||
    minority.blank ||
    preferred.blank ||
    sales.blank ||
    Boolean(errors.cash) ||
    Boolean(errors.marketCap) ||
    Boolean(errors.totalDebt) ||
    Boolean(errors.minorityInterest) ||
    Boolean(errors.preferredShares) ||
    Boolean(errors.sales);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const calcCurrency = input.marketCapCurrency;

  const normalize = (
    amount: number,
    from: SupportedCurrency
  ): { ok: true; amount: number } | { ok: false; message: string } =>
    convertMoney(amount, from, calcCurrency, rates);

  const cashN = normalize(cash.value!, input.cashCurrency);
  if (!cashN.ok) {
    errors.form = cashN.message;
    return { isValid: false, errors, result: null };
  }
  const debtN = normalize(totalDebt.value!, input.totalDebtCurrency);
  if (!debtN.ok) {
    errors.form = debtN.message;
    return { isValid: false, errors, result: null };
  }
  const minorityN = normalize(
    minority.value!,
    input.minorityInterestCurrency
  );
  if (!minorityN.ok) {
    errors.form = minorityN.message;
    return { isValid: false, errors, result: null };
  }
  const preferredN = normalize(
    preferred.value!,
    input.preferredSharesCurrency
  );
  if (!preferredN.ok) {
    errors.form = preferredN.message;
    return { isValid: false, errors, result: null };
  }
  const salesN = normalize(sales.value!, input.salesCurrency);
  if (!salesN.ok) {
    errors.form = salesN.message;
    return { isValid: false, errors, result: null };
  }

  const computed = calculateEvToSales({
    marketCap: marketCap.value!,
    totalDebt: debtN.amount,
    minorityInterest: minorityN.amount,
    preferredShares: preferredN.amount,
    cash: cashN.amount,
    sales: salesN.amount,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const evDisplay = convertMoney(
    computed.enterpriseValue,
    calcCurrency,
    input.enterpriseValueCurrency,
    rates
  );
  if (!evDisplay.ok) {
    errors.form = evDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: EvToSalesResult = {
    enterpriseValueCanonical: computed.enterpriseValue,
    enterpriseValue: evDisplay.amount,
    evToSales: computed.evToSales,
    ratioUndefined: computed.ratioUndefined,
    calculationCurrency: calcCurrency,
    enterpriseValueCurrency: input.enterpriseValueCurrency,
    formattedEnterpriseValue: formatEvMoney(
      evDisplay.amount,
      input.enterpriseValueCurrency
    ),
    formattedEvToSales:
      computed.evToSales === null
        ? null
        : formatEvToSalesRatio(computed.evToSales),
    negativeEvNote:
      computed.enterpriseValue < 0
        ? 'Enterprise value is negative (cash exceeds capital structure additions).'
        : null,
  };

  return { isValid: true, errors, result };
}
