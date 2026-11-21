import { convertCurrency } from '@/tools/shared/convert-currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import {
  MAX_PERIODS,
  computeSavingsPlan,
  formatSavingsPlanMoney,
} from './calculation';
import type {
  SavingsPlanFieldErrors,
  SavingsPlanInput,
  SavingsPlanResult,
} from './types';

export interface SavingsPlanValidation {
  isValid: boolean;
  errors: SavingsPlanFieldErrors;
  result: SavingsPlanResult | null;
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
 * Validates inputs, normalizes money into the plan currency with stored FX,
 * then runs the principal-only arithmetic series. Durations never convert.
 */
export function validateSavingsPlanInput(
  input: SavingsPlanInput,
  rates?: CurrencyRatesSnapshot | null
): SavingsPlanValidation {
  const errors: SavingsPlanFieldErrors = {};
  const periodsParsed = parseNumber(input.periods);
  const increaseParsed = parseNumber(input.increaseAmount);
  const depositParsed = parseNumber(input.depositAmount);
  const targetParsed = parseNumber(input.targetBalance);

  if (
    periodsParsed.blank ||
    periodsParsed.invalid ||
    periodsParsed.value === null ||
    !Number.isInteger(periodsParsed.value) ||
    periodsParsed.value < 1
  ) {
    errors.periods = `Enter a whole number of periods between 1 and ${MAX_PERIODS}.`;
  } else if (periodsParsed.value > MAX_PERIODS) {
    errors.periods = `Period count cannot exceed ${MAX_PERIODS}.`;
  }

  if (
    increaseParsed.blank ||
    increaseParsed.invalid ||
    increaseParsed.value === null
  ) {
    errors.increaseAmount = 'Enter a valid increase amount (use 0 for fixed deposits).';
  }

  if (input.mode === 'deposit') {
    if (
      depositParsed.blank ||
      depositParsed.invalid ||
      depositParsed.value === null
    ) {
      errors.depositAmount = 'Enter a valid deposit amount.';
    } else if (depositParsed.value < 0) {
      errors.depositAmount = 'Deposit amount cannot be negative.';
    }
  } else if (
    targetParsed.blank ||
    targetParsed.invalid ||
    targetParsed.value === null
  ) {
    errors.targetBalance = 'Enter a valid target final balance.';
  } else if (targetParsed.value < 0) {
    errors.targetBalance = 'Target balance cannot be negative.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const periods = periodsParsed.value!;
  const resultCurrency: SupportedCurrency =
    input.mode === 'deposit' ? input.depositCurrency : input.targetCurrency;

  const increaseNorm = convertMoney(
    increaseParsed.value!,
    input.increaseCurrency,
    resultCurrency,
    rates
  );
  if (!increaseNorm.ok) {
    errors.currency = increaseNorm.message;
    return { isValid: false, errors, result: null };
  }

  let startingDeposit = 0;
  let targetBalance = 0;

  if (input.mode === 'deposit') {
    const depositNorm = convertMoney(
      depositParsed.value!,
      input.depositCurrency,
      resultCurrency,
      rates
    );
    if (!depositNorm.ok) {
      errors.currency = depositNorm.message;
      return { isValid: false, errors, result: null };
    }
    startingDeposit = depositNorm.amount;
  } else {
    const targetNorm = convertMoney(
      targetParsed.value!,
      input.targetCurrency,
      resultCurrency,
      rates
    );
    if (!targetNorm.ok) {
      errors.currency = targetNorm.message;
      return { isValid: false, errors, result: null };
    }
    targetBalance = targetNorm.amount;
  }

  const computed = computeSavingsPlan({
    mode: input.mode,
    frequency: input.frequency,
    periods,
    startingDeposit,
    increasePerPeriod: increaseNorm.amount,
    targetBalance,
    currency: resultCurrency,
  });

  if (!computed.ok) {
    if (computed.reason === 'unreachable-target') {
      errors.targetBalance =
        'This target is unreachable with the chosen increase and period count (required deposit would be negative).';
    } else if (computed.reason === 'invalid-periods') {
      errors.periods = `Enter a whole number of periods between 1 and ${MAX_PERIODS}.`;
    } else {
      errors.form = 'This combination does not produce a finite result.';
    }
    return { isValid: false, errors, result: null };
  }

  // Chart / table final balance must match closed-form total.
  const last = computed.balances[computed.balances.length - 1];
  if (!last || Math.abs(last.balance - computed.finalBalance) > 1e-9) {
    errors.form = 'Internal balance mismatch — please reload the calculator.';
    return { isValid: false, errors, result: null };
  }

  const result: SavingsPlanResult = {
    mode: computed.mode,
    frequency: computed.frequency,
    periods: computed.periods,
    startingDeposit: computed.startingDeposit,
    increasePerPeriod: computed.increasePerPeriod,
    finalBalance: computed.finalBalance,
    totalDeposited: computed.totalDeposited,
    currency: computed.currency,
    balances: computed.balances,
    formattedFinalBalance: formatSavingsPlanMoney(
      computed.finalBalance,
      computed.currency
    ),
    formattedStartingDeposit: formatSavingsPlanMoney(
      computed.startingDeposit,
      computed.currency
    ),
    formattedTotalDeposited: formatSavingsPlanMoney(
      computed.totalDeposited,
      computed.currency
    ),
    periodUnitSingular: computed.periodUnitSingular,
    periodUnitPlural: computed.periodUnitPlural,
    balancesLabel: computed.balancesLabel,
  };

  return { isValid: true, errors, result };
}
