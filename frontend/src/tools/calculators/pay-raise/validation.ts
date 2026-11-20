import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  annualFromPeriod,
  calculatePayRaise,
  formatPayRaiseMoney,
  formatPayRaisePercent,
  MAX_HOURS_PER_WEEK,
} from './calculation';
import type {
  PayRaiseCalculatorFieldErrors,
  PayRaiseCalculatorInput,
  PayRaiseCalculatorResult,
  PayRaisePeriodField,
  PayRaiseRaiseSource,
} from './types';

export interface PayRaiseCalculatorValidation {
  isValid: boolean;
  errors: PayRaiseCalculatorFieldErrors;
  result: PayRaiseCalculatorResult | null;
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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
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

function beforeCurrency(
  input: PayRaiseCalculatorInput,
  field: PayRaisePeriodField
): SupportedCurrency {
  switch (field) {
    case 'hourly':
      return input.beforeHourlyCurrency;
    case 'weekly':
      return input.beforeWeeklyCurrency;
    case 'monthly':
      return input.beforeMonthlyCurrency;
    case 'annual':
      return input.beforeAnnualCurrency;
  }
}

function beforeRaw(
  input: PayRaiseCalculatorInput,
  field: PayRaisePeriodField
): string {
  switch (field) {
    case 'hourly':
      return input.beforeHourly;
    case 'weekly':
      return input.beforeWeekly;
    case 'monthly':
      return input.beforeMonthly;
    case 'annual':
      return input.beforeAnnual;
  }
}

function raiseCurrency(
  input: PayRaiseCalculatorInput,
  field: PayRaisePeriodField
): SupportedCurrency {
  switch (field) {
    case 'hourly':
      return input.raiseHourlyCurrency;
    case 'weekly':
      return input.raiseWeeklyCurrency;
    case 'monthly':
      return input.raiseMonthlyCurrency;
    case 'annual':
      return input.raiseAnnualCurrency;
  }
}

function raiseRaw(
  input: PayRaiseCalculatorInput,
  field: PayRaisePeriodField
): string {
  switch (field) {
    case 'hourly':
      return input.raiseHourly;
    case 'weekly':
      return input.raiseWeekly;
    case 'monthly':
      return input.raiseMonthly;
    case 'annual':
      return input.raiseAnnual;
  }
}

function beforeErrorKey(
  field: PayRaisePeriodField
): keyof PayRaiseCalculatorFieldErrors {
  switch (field) {
    case 'hourly':
      return 'beforeHourly';
    case 'weekly':
      return 'beforeWeekly';
    case 'monthly':
      return 'beforeMonthly';
    case 'annual':
      return 'beforeAnnual';
  }
}

function raiseErrorKey(
  source: PayRaiseRaiseSource
): keyof PayRaiseCalculatorFieldErrors {
  switch (source) {
    case 'percentage':
      return 'raisePercentage';
    case 'hourly':
      return 'raiseHourly';
    case 'weekly':
      return 'raiseWeekly';
    case 'monthly':
      return 'raiseMonthly';
    case 'annual':
      return 'raiseAnnual';
  }
}

/**
 * Validates hours (0 &lt; H ≤ 168), before-raise (≥ 0), and raise (percentage or
 * monetary ≥ 0). Math runs in the before-raise source currency; raise amounts
 * convert into that currency first. After/raise periods FX to their display
 * currencies. Hours and % never convert.
 */
export function validatePayRaiseCalculatorInput(
  input: PayRaiseCalculatorInput,
  rates?: CurrencyRatesSnapshot | null
): PayRaiseCalculatorValidation {
  const errors: PayRaiseCalculatorFieldErrors = {};
  const beforeSource = input.beforeSource;
  const raiseSource = input.raiseSource;

  const hours = parseNumber(input.hoursPerWeek);
  if (!hours.blank && (hours.invalid || hours.value === null)) {
    errors.hoursPerWeek = 'Enter a valid hours-per-week value.';
  } else if (hours.value !== null && hours.value <= 0) {
    errors.hoursPerWeek = 'Hours per week must be greater than zero.';
  } else if (hours.value !== null && hours.value > MAX_HOURS_PER_WEEK) {
    errors.hoursPerWeek = `Hours per week cannot exceed ${MAX_HOURS_PER_WEEK}.`;
  }

  const beforeParsed = parseNumber(beforeRaw(input, beforeSource));
  const beforeKey = beforeErrorKey(beforeSource);
  if (
    !beforeParsed.blank &&
    (beforeParsed.invalid || beforeParsed.value === null)
  ) {
    errors[beforeKey] = 'Enter a valid pay amount.';
  } else if (beforeParsed.value !== null && beforeParsed.value < 0) {
    errors[beforeKey] = 'Pay must be zero or greater.';
  }

  const raiseKey = raiseErrorKey(raiseSource);
  let raiseParsed =
    raiseSource === 'percentage'
      ? parseNumber(input.raisePercentage)
      : parseNumber(raiseRaw(input, raiseSource));

  if (
    !raiseParsed.blank &&
    (raiseParsed.invalid || raiseParsed.value === null)
  ) {
    errors[raiseKey] =
      raiseSource === 'percentage'
        ? 'Enter a valid raise percentage.'
        : 'Enter a valid raise amount.';
  } else if (raiseParsed.value !== null && raiseParsed.value < 0) {
    errors[raiseKey] =
      raiseSource === 'percentage'
        ? 'Raise percentage must be zero or greater.'
        : 'Raise amount must be zero or greater.';
  }

  const incomplete =
    hours.blank ||
    beforeParsed.blank ||
    raiseParsed.blank ||
    Boolean(errors.hoursPerWeek) ||
    Boolean(errors[beforeKey]) ||
    Boolean(errors[raiseKey]);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const hoursPerWeek = hours.value!;
  const beforeAmount = beforeParsed.value!;
  const beforeFrom = beforeCurrency(input, beforeSource);
  const beforeAnnual = annualFromPeriod(
    beforeSource,
    beforeAmount,
    hoursPerWeek
  );
  if (beforeAnnual === null) {
    errors.form = 'This pay combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  let math;
  if (raiseSource === 'percentage') {
    math = calculatePayRaise({
      hoursPerWeek,
      beforeAnnual,
      mode: 'percentage',
      raisePercent: raiseParsed.value!,
    });
  } else {
    const raiseFrom = raiseCurrency(input, raiseSource);
    const raiseInBefore = convertMoney(
      raiseParsed.value!,
      raiseFrom,
      beforeFrom,
      rates
    );
    if (!raiseInBefore.ok) {
      errors.form = raiseInBefore.message;
      return { isValid: false, errors, result: null };
    }
    const raiseAnnual = annualFromPeriod(
      raiseSource,
      raiseInBefore.amount,
      hoursPerWeek
    );
    if (raiseAnnual === null) {
      errors.form = 'This raise combination does not produce a finite result.';
      return { isValid: false, errors, result: null };
    }
    math = calculatePayRaise({
      hoursPerWeek,
      beforeAnnual,
      mode: 'monetary',
      raiseAnnual,
    });
  }

  if (!math) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const fxPairs: Array<{
    amount: number;
    to: SupportedCurrency;
    assign: (amount: number) => Partial<PayRaiseCalculatorResult>;
  }> = [
    {
      amount: math.before.hourly,
      to: input.beforeHourlyCurrency,
      assign: (amount) => ({
        beforeHourly: amount,
        formattedBeforeHourly: formatPayRaiseMoney(
          amount,
          input.beforeHourlyCurrency
        ),
      }),
    },
    {
      amount: math.before.weekly,
      to: input.beforeWeeklyCurrency,
      assign: (amount) => ({
        beforeWeekly: amount,
        formattedBeforeWeekly: formatPayRaiseMoney(
          amount,
          input.beforeWeeklyCurrency
        ),
      }),
    },
    {
      amount: math.before.monthly,
      to: input.beforeMonthlyCurrency,
      assign: (amount) => ({
        beforeMonthly: amount,
        formattedBeforeMonthly: formatPayRaiseMoney(
          amount,
          input.beforeMonthlyCurrency
        ),
      }),
    },
    {
      amount: math.before.annual,
      to: input.beforeAnnualCurrency,
      assign: (amount) => ({
        beforeAnnual: amount,
        formattedBeforeAnnual: formatPayRaiseMoney(
          amount,
          input.beforeAnnualCurrency
        ),
      }),
    },
    {
      amount: math.raise.hourly,
      to: input.raiseHourlyCurrency,
      assign: (amount) => ({
        raiseHourly: amount,
        formattedRaiseHourly: formatPayRaiseMoney(
          amount,
          input.raiseHourlyCurrency
        ),
      }),
    },
    {
      amount: math.raise.weekly,
      to: input.raiseWeeklyCurrency,
      assign: (amount) => ({
        raiseWeekly: amount,
        formattedRaiseWeekly: formatPayRaiseMoney(
          amount,
          input.raiseWeeklyCurrency
        ),
      }),
    },
    {
      amount: math.raise.monthly,
      to: input.raiseMonthlyCurrency,
      assign: (amount) => ({
        raiseMonthly: amount,
        formattedRaiseMonthly: formatPayRaiseMoney(
          amount,
          input.raiseMonthlyCurrency
        ),
      }),
    },
    {
      amount: math.raise.annual,
      to: input.raiseAnnualCurrency,
      assign: (amount) => ({
        raiseAnnual: amount,
        formattedRaiseAnnual: formatPayRaiseMoney(
          amount,
          input.raiseAnnualCurrency
        ),
      }),
    },
    {
      amount: math.after.hourly,
      to: input.afterHourlyCurrency,
      assign: (amount) => ({
        afterHourly: amount,
        formattedAfterHourly: formatPayRaiseMoney(
          amount,
          input.afterHourlyCurrency
        ),
      }),
    },
    {
      amount: math.after.weekly,
      to: input.afterWeeklyCurrency,
      assign: (amount) => ({
        afterWeekly: amount,
        formattedAfterWeekly: formatPayRaiseMoney(
          amount,
          input.afterWeeklyCurrency
        ),
      }),
    },
    {
      amount: math.after.monthly,
      to: input.afterMonthlyCurrency,
      assign: (amount) => ({
        afterMonthly: amount,
        formattedAfterMonthly: formatPayRaiseMoney(
          amount,
          input.afterMonthlyCurrency
        ),
      }),
    },
    {
      amount: math.after.annual,
      to: input.afterAnnualCurrency,
      assign: (amount) => ({
        afterAnnual: amount,
        formattedAfterAnnual: formatPayRaiseMoney(
          amount,
          input.afterAnnualCurrency
        ),
      }),
    },
  ];

  const display: Partial<PayRaiseCalculatorResult> = {};
  for (const pair of fxPairs) {
    const fx = convertMoney(pair.amount, beforeFrom, pair.to, rates);
    if (!fx.ok) {
      errors.form = fx.message;
      return { isValid: false, errors, result: null };
    }
    Object.assign(display, pair.assign(fx.amount));
  }

  const formattedRaisePercentage = math.percentageUndefined
    ? '—'
    : math.raisePercentage === null
      ? '—'
      : formatPayRaisePercent(math.raisePercentage);

  const result: PayRaiseCalculatorResult = {
    hoursPerWeek,
    beforeCurrency: beforeFrom,
    beforeHourlyCanonical: math.before.hourly,
    beforeWeeklyCanonical: math.before.weekly,
    beforeMonthlyCanonical: math.before.monthly,
    beforeAnnualCanonical: math.before.annual,
    raiseAnnualCanonical: math.raise.annual,
    raiseHourlyCanonical: math.raise.hourly,
    raiseWeeklyCanonical: math.raise.weekly,
    raiseMonthlyCanonical: math.raise.monthly,
    raisePercentage: math.raisePercentage,
    percentageUndefined: math.percentageUndefined,
    afterHourlyCanonical: math.after.hourly,
    afterWeeklyCanonical: math.after.weekly,
    afterMonthlyCanonical: math.after.monthly,
    afterAnnualCanonical: math.after.annual,
    beforeHourly: display.beforeHourly!,
    beforeWeekly: display.beforeWeekly!,
    beforeMonthly: display.beforeMonthly!,
    beforeAnnual: display.beforeAnnual!,
    raiseHourly: display.raiseHourly!,
    raiseWeekly: display.raiseWeekly!,
    raiseMonthly: display.raiseMonthly!,
    raiseAnnual: display.raiseAnnual!,
    afterHourly: display.afterHourly!,
    afterWeekly: display.afterWeekly!,
    afterMonthly: display.afterMonthly!,
    afterAnnual: display.afterAnnual!,
    formattedBeforeHourly: display.formattedBeforeHourly!,
    formattedBeforeWeekly: display.formattedBeforeWeekly!,
    formattedBeforeMonthly: display.formattedBeforeMonthly!,
    formattedBeforeAnnual: display.formattedBeforeAnnual!,
    formattedRaisePercentage,
    formattedRaiseHourly: display.formattedRaiseHourly!,
    formattedRaiseWeekly: display.formattedRaiseWeekly!,
    formattedRaiseMonthly: display.formattedRaiseMonthly!,
    formattedRaiseAnnual: display.formattedRaiseAnnual!,
    formattedAfterHourly: display.formattedAfterHourly!,
    formattedAfterWeekly: display.formattedAfterWeekly!,
    formattedAfterMonthly: display.formattedAfterMonthly!,
    formattedAfterAnnual: display.formattedAfterAnnual!,
    beforeSource,
    raiseSource,
  };

  return { isValid: true, errors, result };
}
