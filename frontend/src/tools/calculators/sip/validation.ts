import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateSip,
  formatSipFactor,
  formatSipMoney,
} from './calculation';
import type { SipFieldErrors, SipInput, SipResult } from './types';

export interface SipValidation {
  isValid: boolean;
  errors: SipFieldErrors;
  result: SipResult | null;
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

export function validateSipInput(
  input: SipInput,
  rates?: CurrencyRatesSnapshot | null
): SipValidation {
  const errors: SipFieldErrors = {};
  const monthly = parseNumber(input.monthlyAmount);
  const years = parseNumber(input.years);
  const rate = parseNumber(input.annualReturnPercent);

  if (!monthly.blank && (monthly.invalid || monthly.value === null)) {
    errors.monthlyAmount = 'Enter a valid monthly SIP amount.';
  } else if (monthly.value !== null && monthly.value < 0) {
    errors.monthlyAmount = 'Monthly SIP amount cannot be negative.';
  }

  if (!years.blank && (years.invalid || years.value === null)) {
    errors.years = 'Enter a valid investment period in years.';
  } else if (years.value !== null && !(years.value > 0)) {
    errors.years = 'Investment period must be greater than zero.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.annualReturnPercent = 'Enter a valid expected return rate.';
  } else if (rate.value !== null && rate.value < 0) {
    errors.annualReturnPercent = 'Expected return cannot be negative.';
  }

  const incomplete =
    monthly.blank ||
    years.blank ||
    rate.blank ||
    Boolean(errors.monthlyAmount) ||
    Boolean(errors.years) ||
    Boolean(errors.annualReturnPercent);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateSip({
    monthlyAmount: monthly.value!,
    years: years.value!,
    annualReturnPercent: rate.value!,
  });
  if (!computed) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const base = input.monthlyAmountCurrency;
  const totalFx = convertMoney(
    computed.totalInvestment,
    base,
    input.totalInvestmentCurrency,
    rates
  );
  if (!totalFx.ok) {
    errors.form = totalFx.message;
    return { isValid: false, errors, result: null };
  }
  const maturityFx = convertMoney(
    computed.maturityAmount,
    base,
    input.maturityCurrency,
    rates
  );
  if (!maturityFx.ok) {
    errors.form = maturityFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: SipResult = {
    totalInvestmentCanonical: computed.totalInvestment,
    maturityCanonical: computed.maturityAmount,
    multiplicationFactor: computed.multiplicationFactor,
    totalInvestment: totalFx.amount,
    maturityAmount: maturityFx.amount,
    monthlyAmountCurrency: base,
    totalInvestmentCurrency: input.totalInvestmentCurrency,
    maturityCurrency: input.maturityCurrency,
    formattedTotalInvestment: formatSipMoney(
      totalFx.amount,
      input.totalInvestmentCurrency
    ),
    formattedMaturity: formatSipMoney(maturityFx.amount, input.maturityCurrency),
    formattedFactor: formatSipFactor(computed.multiplicationFactor),
  };

  return { isValid: true, errors, result };
}
