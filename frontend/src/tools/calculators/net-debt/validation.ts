import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { calculateNetDebt, formatNetDebtMoney } from './calculation';
import type {
  NetDebtFieldErrors,
  NetDebtInput,
  NetDebtResult,
} from './types';

export interface NetDebtValidation {
  isValid: boolean;
  errors: NetDebtFieldErrors;
  result: NetDebtResult | null;
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

type MoneyLine = {
  key: keyof NetDebtFieldErrors;
  label: string;
  raw: string;
  currency: SupportedCurrency;
};

/**
 * Canonical calc currency = cash currency.
 * Blank money lines treat as 0. Invalid non-blank values error.
 * Totals convert into independent display currencies.
 */
export function validateNetDebtInput(
  input: NetDebtInput,
  rates?: CurrencyRatesSnapshot | null
): NetDebtValidation {
  const errors: NetDebtFieldErrors = {};
  const calcCurrency = input.cashCurrency;

  const lines: MoneyLine[] = [
    { key: 'cash', label: 'Cash', raw: input.cash, currency: input.cashCurrency },
    {
      key: 'cashEquivalents',
      label: 'Cash equivalents',
      raw: input.cashEquivalents,
      currency: input.cashEquivalentsCurrency,
    },
    {
      key: 'accountsPayable',
      label: 'Accounts payable',
      raw: input.accountsPayable,
      currency: input.accountsPayableCurrency,
    },
    {
      key: 'currentLongTermDebt',
      label: 'Current portion of the long-term debt',
      raw: input.currentLongTermDebt,
      currency: input.currentLongTermDebtCurrency,
    },
    {
      key: 'currentLeases',
      label: 'Current part of leases',
      raw: input.currentLeases,
      currency: input.currentLeasesCurrency,
    },
    {
      key: 'otherShortTerm',
      label: 'Other payables or accrued items',
      raw: input.otherShortTerm,
      currency: input.otherShortTermCurrency,
    },
    {
      key: 'nonCurrentLongTermDebt',
      label: 'Non-current long-term debt',
      raw: input.nonCurrentLongTermDebt,
      currency: input.nonCurrentLongTermDebtCurrency,
    },
    {
      key: 'nonCurrentLeases',
      label: 'Non-current part of leases',
      raw: input.nonCurrentLeases,
      currency: input.nonCurrentLeasesCurrency,
    },
    {
      key: 'otherLongTerm',
      label: 'Other payables or accrued items',
      raw: input.otherLongTerm,
      currency: input.otherLongTermCurrency,
    },
  ];

  const normalized: Record<string, number> = {};

  for (const line of lines) {
    const parsed = parseNumber(line.raw);
    if (!parsed.blank && (parsed.invalid || parsed.value === null)) {
      errors[line.key] = `Enter a valid ${line.label.toLowerCase()}.`;
      continue;
    }
    if (!parsed.blank && parsed.value !== null && parsed.value < 0) {
      errors[line.key] = `${line.label} cannot be negative.`;
      continue;
    }
    const amount = parsed.blank || parsed.value === null ? 0 : parsed.value;
    const fx = convertMoney(amount, line.currency, calcCurrency, rates);
    if (!fx.ok) {
      errors.form = fx.message;
      return { isValid: false, errors, result: null };
    }
    normalized[line.key] = fx.amount;
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateNetDebt({
    cash: normalized.cash!,
    cashEquivalents: normalized.cashEquivalents!,
    accountsPayable: normalized.accountsPayable!,
    currentLongTermDebt: normalized.currentLongTermDebt!,
    currentLeases: normalized.currentLeases!,
    otherShortTerm: normalized.otherShortTerm!,
    nonCurrentLongTermDebt: normalized.nonCurrentLongTermDebt!,
    nonCurrentLeases: normalized.nonCurrentLeases!,
    otherLongTerm: normalized.otherLongTerm!,
  });

  if (!computed) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const cashDisplay = convertMoney(
    computed.cashTotal,
    calcCurrency,
    input.cashTotalCurrency,
    rates
  );
  if (!cashDisplay.ok) {
    errors.form = cashDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const stDisplay = convertMoney(
    computed.shortTermDebt,
    calcCurrency,
    input.shortTermDebtCurrency,
    rates
  );
  if (!stDisplay.ok) {
    errors.form = stDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const ltDisplay = convertMoney(
    computed.longTermDebt,
    calcCurrency,
    input.longTermDebtCurrency,
    rates
  );
  if (!ltDisplay.ok) {
    errors.form = ltDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const netDisplay = convertMoney(
    computed.netDebt,
    calcCurrency,
    input.netDebtCurrency,
    rates
  );
  if (!netDisplay.ok) {
    errors.form = netDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: NetDebtResult = {
    cashTotalCalc: computed.cashTotal,
    cashTotalDisplay: cashDisplay.amount,
    shortTermDebtCalc: computed.shortTermDebt,
    shortTermDebtDisplay: stDisplay.amount,
    longTermDebtCalc: computed.longTermDebt,
    longTermDebtDisplay: ltDisplay.amount,
    netDebtCalc: computed.netDebt,
    netDebtDisplay: netDisplay.amount,
    calcCurrency,
    formattedCashTotal: formatNetDebtMoney(
      cashDisplay.amount,
      input.cashTotalCurrency
    ),
    formattedShortTermDebt: formatNetDebtMoney(
      stDisplay.amount,
      input.shortTermDebtCurrency
    ),
    formattedLongTermDebt: formatNetDebtMoney(
      ltDisplay.amount,
      input.longTermDebtCurrency
    ),
    formattedNetDebt: formatNetDebtMoney(netDisplay.amount, input.netDebtCurrency),
  };

  return { isValid: true, errors: {}, result };
}
