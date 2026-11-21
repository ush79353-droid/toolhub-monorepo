import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateRmd,
  formatLifeFactor,
  formatRmdMoney,
} from './calculation';
import type { RmdFieldErrors, RmdInput, RmdResult } from './types';

export interface RmdValidation {
  isValid: boolean;
  errors: RmdFieldErrors;
  result: RmdResult | null;
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

export function validateRmdInput(
  input: RmdInput,
  rates?: CurrencyRatesSnapshot | null
): RmdValidation {
  const errors: RmdFieldErrors = {};
  const ageParsed = parseNumber(input.age);
  const balance = parseNumber(input.accountBalance);

  if (!ageParsed.blank && (ageParsed.invalid || ageParsed.value === null)) {
    errors.age = 'Select a valid age.';
  } else if (
    ageParsed.value !== null &&
    (!Number.isInteger(ageParsed.value) ||
      ageParsed.value < 72 ||
      ageParsed.value > 120)
  ) {
    errors.age = 'Age must be an integer from 72 to 120 for this Uniform Lifetime table.';
  }

  if (!balance.blank && (balance.invalid || balance.value === null)) {
    errors.accountBalance = 'Enter a valid account balance.';
  } else if (balance.value !== null && balance.value < 0) {
    errors.accountBalance = 'Account balance must be zero or greater.';
  }

  if (
    ageParsed.blank ||
    balance.blank ||
    errors.age ||
    errors.accountBalance
  ) {
    return { isValid: false, errors, result: null };
  }

  const spouseYounger = input.spouseYoungerSoleBeneficiary === 'yes';
  const computed = calculateRmd({
    age: ageParsed.value!,
    accountBalance: balance.value!,
    spouseYoungerSoleBeneficiary: spouseYounger,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite RMD.';
    return { isValid: false, errors, result: null };
  }

  if (computed.jointLifeUnavailable) {
    const result: RmdResult = {
      age: ageParsed.value!,
      lifeExpectancyFactor: null,
      factorLabel: '—',
      accountBalanceCanonical: balance.value!,
      rmdCanonical: null,
      rmd: null,
      formattedFactor: '',
      formattedRmd: '',
      accountBalanceCurrency: input.accountBalanceCurrency,
      rmdCurrency: input.rmdCurrency,
      jointLifeUnavailable: true,
      unavailableNote:
        'Joint Life and Last Survivor Expectancy (Table II) applies when your spouse is the sole beneficiary and more than 10 years younger, but spouse age is not collected on this form — RMD cannot be estimated for that path without inventing a spouse age.',
    };
    return { isValid: true, errors, result };
  }

  const balanceCurrency = input.accountBalanceCurrency;
  const rmdFx = convertMoney(
    computed.rmd!,
    balanceCurrency,
    input.rmdCurrency,
    rates
  );
  if (!rmdFx.ok) {
    errors.form = rmdFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: RmdResult = {
    age: ageParsed.value!,
    lifeExpectancyFactor: computed.lifeExpectancyFactor,
    factorLabel: formatLifeFactor(computed.lifeExpectancyFactor!),
    accountBalanceCanonical: balance.value!,
    rmdCanonical: computed.rmd,
    rmd: rmdFx.amount,
    formattedFactor: formatLifeFactor(computed.lifeExpectancyFactor!),
    formattedRmd: formatRmdMoney(rmdFx.amount, input.rmdCurrency),
    accountBalanceCurrency: balanceCurrency,
    rmdCurrency: input.rmdCurrency,
    jointLifeUnavailable: false,
    unavailableNote: null,
  };

  return { isValid: true, errors, result };
}
