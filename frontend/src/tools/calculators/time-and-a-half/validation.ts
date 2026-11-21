import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  calculateTimeAndAHalf,
  formatTimeAndAHalfMoney,
} from './calculation';
import type {
  TimeAndAHalfFieldErrors,
  TimeAndAHalfInput,
  TimeAndAHalfResult,
} from './types';

export interface TimeAndAHalfValidation {
  isValid: boolean;
  errors: TimeAndAHalfFieldErrors;
  result: TimeAndAHalfResult | null;
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

/** Blank hours treat as 0 when a rate is present. */
function parseHours(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const parsed = parseNumber(raw);
  if (parsed.blank) return { value: 0, blank: true, invalid: false };
  return parsed;
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
 * Validates standard rate (≥ 0) and hours (≥ 0), computes premium rates and
 * category earnings in the standard-rate currency, then FX-converts each money
 * display field. Hours and multipliers never convert.
 */
export function validateTimeAndAHalfInput(
  input: TimeAndAHalfInput,
  rates?: CurrencyRatesSnapshot | null
): TimeAndAHalfValidation {
  const errors: TimeAndAHalfFieldErrors = {};

  const rate = parseNumber(input.standardRate);
  const hs = parseHours(input.standardHours);
  const h15 = parseHours(input.timeAndHalfHours);
  const h2 = parseHours(input.doubleTimeHours);
  const h3 = parseHours(input.tripleTimeHours);

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.standardRate = 'Enter a valid standard pay rate.';
  } else if (rate.value !== null && rate.value < 0) {
    errors.standardRate = 'Standard pay rate must be zero or greater.';
  }

  const hourChecks: Array<{
    parsed: ReturnType<typeof parseHours>;
    key: keyof TimeAndAHalfFieldErrors;
    label: string;
  }> = [
    { parsed: hs, key: 'standardHours', label: 'Standard hours' },
    { parsed: h15, key: 'timeAndHalfHours', label: 'Time and a half hours' },
    { parsed: h2, key: 'doubleTimeHours', label: 'Double time hours' },
    { parsed: h3, key: 'tripleTimeHours', label: 'Triple time hours' },
  ];

  for (const check of hourChecks) {
    if (check.parsed.invalid || check.parsed.value === null) {
      errors[check.key] = `Enter a valid ${check.label.toLowerCase()} value.`;
    } else if (check.parsed.value < 0) {
      errors[check.key] = `${check.label} must be zero or greater.`;
    }
  }

  if (
    rate.blank ||
    Boolean(errors.standardRate) ||
    Boolean(errors.standardHours) ||
    Boolean(errors.timeAndHalfHours) ||
    Boolean(errors.doubleTimeHours) ||
    Boolean(errors.tripleTimeHours)
  ) {
    return { isValid: false, errors, result: null };
  }

  const computed = calculateTimeAndAHalf({
    standardRate: rate.value!,
    standardHours: hs.value!,
    timeAndHalfHours: h15.value!,
    doubleTimeHours: h2.value!,
    tripleTimeHours: h3.value!,
  });

  if (computed === null) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const from = input.standardRateCurrency;

  const pairs: Array<{
    amount: number;
    to: SupportedCurrency;
    assign: (amount: number) => Partial<TimeAndAHalfResult>;
  }> = [
    {
      amount: rate.value!,
      to: input.standardRateCurrency,
      assign: (amount) => ({
        standardRate: amount,
        formattedStandardRate: formatTimeAndAHalfMoney(
          amount,
          input.standardRateCurrency
        ),
      }),
    },
    {
      amount: computed.timeAndHalfRate,
      to: input.timeAndHalfRateCurrency,
      assign: (amount) => ({
        timeAndHalfRate: amount,
        formattedTimeAndHalfRate: formatTimeAndAHalfMoney(
          amount,
          input.timeAndHalfRateCurrency
        ),
      }),
    },
    {
      amount: computed.doubleTimeRate,
      to: input.doubleTimeRateCurrency,
      assign: (amount) => ({
        doubleTimeRate: amount,
        formattedDoubleTimeRate: formatTimeAndAHalfMoney(
          amount,
          input.doubleTimeRateCurrency
        ),
      }),
    },
    {
      amount: computed.tripleTimeRate,
      to: input.tripleTimeRateCurrency,
      assign: (amount) => ({
        tripleTimeRate: amount,
        formattedTripleTimeRate: formatTimeAndAHalfMoney(
          amount,
          input.tripleTimeRateCurrency
        ),
      }),
    },
    {
      amount: computed.standardPay,
      to: input.standardPayCurrency,
      assign: (amount) => ({
        standardPay: amount,
        formattedStandardPay: formatTimeAndAHalfMoney(
          amount,
          input.standardPayCurrency
        ),
      }),
    },
    {
      amount: computed.timeAndHalfPay,
      to: input.timeAndHalfPayCurrency,
      assign: (amount) => ({
        timeAndHalfPay: amount,
        formattedTimeAndHalfPay: formatTimeAndAHalfMoney(
          amount,
          input.timeAndHalfPayCurrency
        ),
      }),
    },
    {
      amount: computed.doubleTimePay,
      to: input.doubleTimePayCurrency,
      assign: (amount) => ({
        doubleTimePay: amount,
        formattedDoubleTimePay: formatTimeAndAHalfMoney(
          amount,
          input.doubleTimePayCurrency
        ),
      }),
    },
    {
      amount: computed.tripleTimePay,
      to: input.tripleTimePayCurrency,
      assign: (amount) => ({
        tripleTimePay: amount,
        formattedTripleTimePay: formatTimeAndAHalfMoney(
          amount,
          input.tripleTimePayCurrency
        ),
      }),
    },
    {
      amount: computed.totalPay,
      to: input.totalPayCurrency,
      assign: (amount) => ({
        totalPay: amount,
        formattedTotalPay: formatTimeAndAHalfMoney(
          amount,
          input.totalPayCurrency
        ),
      }),
    },
  ];

  const display: Partial<TimeAndAHalfResult> = {};
  for (const pair of pairs) {
    const fx = convertMoney(pair.amount, from, pair.to, rates);
    if (!fx.ok) {
      errors.form = fx.message;
      return { isValid: false, errors, result: null };
    }
    Object.assign(display, pair.assign(fx.amount));
  }

  const result: TimeAndAHalfResult = {
    standardRateCanonical: rate.value!,
    timeAndHalfRateCanonical: computed.timeAndHalfRate,
    doubleTimeRateCanonical: computed.doubleTimeRate,
    tripleTimeRateCanonical: computed.tripleTimeRate,
    standardPayCanonical: computed.standardPay,
    timeAndHalfPayCanonical: computed.timeAndHalfPay,
    doubleTimePayCanonical: computed.doubleTimePay,
    tripleTimePayCanonical: computed.tripleTimePay,
    totalPayCanonical: computed.totalPay,
    standardRate: display.standardRate!,
    timeAndHalfRate: display.timeAndHalfRate!,
    doubleTimeRate: display.doubleTimeRate!,
    tripleTimeRate: display.tripleTimeRate!,
    standardPay: display.standardPay!,
    timeAndHalfPay: display.timeAndHalfPay!,
    doubleTimePay: display.doubleTimePay!,
    tripleTimePay: display.tripleTimePay!,
    totalPay: display.totalPay!,
    standardRateCurrency: input.standardRateCurrency,
    timeAndHalfRateCurrency: input.timeAndHalfRateCurrency,
    doubleTimeRateCurrency: input.doubleTimeRateCurrency,
    tripleTimeRateCurrency: input.tripleTimeRateCurrency,
    standardPayCurrency: input.standardPayCurrency,
    timeAndHalfPayCurrency: input.timeAndHalfPayCurrency,
    doubleTimePayCurrency: input.doubleTimePayCurrency,
    tripleTimePayCurrency: input.tripleTimePayCurrency,
    totalPayCurrency: input.totalPayCurrency,
    sourceCurrency: from,
    formattedStandardRate: display.formattedStandardRate!,
    formattedTimeAndHalfRate: display.formattedTimeAndHalfRate!,
    formattedDoubleTimeRate: display.formattedDoubleTimeRate!,
    formattedTripleTimeRate: display.formattedTripleTimeRate!,
    formattedStandardPay: display.formattedStandardPay!,
    formattedTimeAndHalfPay: display.formattedTimeAndHalfPay!,
    formattedDoubleTimePay: display.formattedDoubleTimePay!,
    formattedTripleTimePay: display.formattedTripleTimePay!,
    formattedTotalPay: display.formattedTotalPay!,
  };

  return { isValid: true, errors, result };
}
