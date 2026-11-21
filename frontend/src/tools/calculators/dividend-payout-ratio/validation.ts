import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateCompanyPayoutRatio,
  calculatePerSharePayoutRatio,
  formatPayoutPercent,
} from './calculation';
import type {
  DividendPayoutRatioFieldErrors,
  DividendPayoutRatioInput,
  DividendPayoutRatioResult,
} from './types';

export interface DividendPayoutRatioValidation {
  isValid: boolean;
  errors: DividendPayoutRatioFieldErrors;
  result: DividendPayoutRatioResult | null;
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
 * Validates inputs, normalizes each money pair into one currency with stored FX
 * rates, then computes company and/or per-share payout ratios at full precision.
 * Zero NI or zero diluted EPS → undefined (field error), never 0%.
 * Above 100% and negative ratios are allowed. Percentages are never FX-converted.
 * Main and per-share sections are independent — either or both may produce a result.
 */
export function validateDividendPayoutRatioInput(
  input: DividendPayoutRatioInput,
  rates?: CurrencyRatesSnapshot | null
): DividendPayoutRatioValidation {
  const errors: DividendPayoutRatioFieldErrors = {};

  const dividends = parseNumber(input.totalDividends);
  const income = parseNumber(input.netIncome);
  const dps = parseNumber(input.declaredDps);
  const eps = parseNumber(input.dilutedEps);

  if (!dividends.blank && (dividends.invalid || dividends.value === null)) {
    errors.totalDividends = 'Enter a valid total dividends amount.';
  }
  if (!income.blank && (income.invalid || income.value === null)) {
    errors.netIncome = 'Enter a valid net income.';
  }
  if (!dps.blank && (dps.invalid || dps.value === null)) {
    errors.declaredDps = 'Enter a valid dividends per share.';
  }
  if (!eps.blank && (eps.invalid || eps.value === null)) {
    errors.dilutedEps = 'Enter a valid diluted EPS.';
  }

  let payoutRatioPercent: number | null = null;
  let payoutPerSharePercent: number | null = null;

  const mainReady =
    !dividends.blank &&
    !income.blank &&
    !errors.totalDividends &&
    !errors.netIncome;

  if (mainReady) {
    if (income.value === 0) {
      errors.netIncome =
        'Net income is zero; dividend payout ratio is undefined (not 0%).';
    } else {
      const dividendsNorm = convertMoney(
        dividends.value!,
        input.totalDividendsCurrency,
        input.netIncomeCurrency,
        rates
      );
      if (!dividendsNorm.ok) {
        errors.form = dividendsNorm.message;
      } else {
        payoutRatioPercent = calculateCompanyPayoutRatio({
          totalDividends: dividendsNorm.amount,
          netIncome: income.value!,
        });
        if (payoutRatioPercent === null) {
          errors.form =
            'This combination does not produce a finite company payout ratio.';
        }
      }
    }
  } else if (!dividends.blank && income.blank) {
    // Partial main section — wait for net income; no error unless invalid.
  } else if (dividends.blank && !income.blank) {
    // Partial main section — wait for dividends.
  }

  const perShareReady =
    !dps.blank && !eps.blank && !errors.declaredDps && !errors.dilutedEps;

  if (perShareReady && !errors.form) {
    if (eps.value === 0) {
      errors.dilutedEps =
        'Diluted EPS is zero; per-share payout ratio is undefined (not 0%).';
    } else {
      const dpsNorm = convertMoney(
        dps.value!,
        input.declaredDpsCurrency,
        input.dilutedEpsCurrency,
        rates
      );
      if (!dpsNorm.ok) {
        errors.form = dpsNorm.message;
      } else {
        payoutPerSharePercent = calculatePerSharePayoutRatio({
          declaredDps: dpsNorm.amount,
          dilutedEps: eps.value!,
        });
        if (payoutPerSharePercent === null) {
          errors.form =
            'This combination does not produce a finite per-share payout ratio.';
        }
      }
    }
  }

  const hasCompany = payoutRatioPercent !== null;
  const hasPerShare = payoutPerSharePercent !== null;

  if (!hasCompany && !hasPerShare) {
    return { isValid: false, errors, result: null };
  }

  const result: DividendPayoutRatioResult = {
    payoutRatioPercent,
    payoutPerSharePercent,
    formattedPayoutRatioPercent:
      payoutRatioPercent !== null ? formatPayoutPercent(payoutRatioPercent) : null,
    formattedPayoutPerSharePercent:
      payoutPerSharePercent !== null
        ? formatPayoutPercent(payoutPerSharePercent)
        : null,
    isAbove100: hasCompany && payoutRatioPercent! > 100,
    isPerShareAbove100: hasPerShare && payoutPerSharePercent! > 100,
    isNegative: hasCompany && payoutRatioPercent! < 0,
    isPerShareNegative: hasPerShare && payoutPerSharePercent! < 0,
  };

  return { isValid: true, errors, result };
}
