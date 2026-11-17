import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculateDebtSnowball,
  formatDebtSnowballMoney,
} from './calculation';
import {
  MAX_DEBT_COUNT,
  MIN_DEBT_COUNT,
  aimToMethod,
  type DebtSnowballFieldErrors,
  type DebtSnowballInput,
  type DebtSnowballResult,
} from './types';

export interface DebtSnowballValidation {
  isValid: boolean;
  errors: DebtSnowballFieldErrors;
  result: DebtSnowballResult | null;
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
 * Normalize mixed-currency balances, payments, and the optional increase into
 * debt #1 balance currency, run strategies, then convert money outputs for display.
 */
export function validateDebtSnowballInput(
  input: DebtSnowballInput,
  rates?: CurrencyRatesSnapshot | null
): DebtSnowballValidation {
  const errors: DebtSnowballFieldErrors = {};
  const debtErrors: NonNullable<DebtSnowballFieldErrors['debts']> = [];

  const count = Math.min(
    MAX_DEBT_COUNT,
    Math.max(MIN_DEBT_COUNT, Math.floor(input.debtCount) || MIN_DEBT_COUNT)
  );
  const active = input.debts.slice(0, count);
  const calcCurrency = active[0]?.balanceCurrency ?? 'PKR';

  const canonicalDebts: {
    balance: number;
    annualRatePercent: number;
    minPayment: number;
  }[] = [];

  for (let i = 0; i < active.length; i += 1) {
    const row = active[i]!;
    const rowErr: { balance?: string; interestRatePercent?: string; payment?: string } = {};
    const bal = parseNumber(row.balance);
    const rate = parseNumber(row.interestRatePercent);
    const pay = parseNumber(row.payment);

    if (bal.blank) rowErr.balance = 'Enter a balance.';
    else if (bal.invalid || bal.value === null) rowErr.balance = 'Enter a valid balance.';
    else if (!(bal.value > 0)) rowErr.balance = 'Balance must be greater than zero.';

    if (rate.blank) rowErr.interestRatePercent = 'Enter an interest rate.';
    else if (rate.invalid || rate.value === null) {
      rowErr.interestRatePercent = 'Enter a valid interest rate.';
    } else if (rate.value < 0) {
      rowErr.interestRatePercent = 'Interest rate cannot be negative.';
    }

    if (pay.blank) rowErr.payment = 'Enter a payment.';
    else if (pay.invalid || pay.value === null) rowErr.payment = 'Enter a valid payment.';
    else if (!(pay.value > 0)) rowErr.payment = 'Payment must be greater than zero.';

    debtErrors[i] = rowErr;

    if (Object.keys(rowErr).length > 0) continue;

    const balFx = convertMoney(bal.value!, row.balanceCurrency, calcCurrency, rates);
    if (!balFx.ok) {
      errors.form = balFx.message;
      return { isValid: false, errors, result: null };
    }
    const payFx = convertMoney(pay.value!, row.paymentCurrency, calcCurrency, rates);
    if (!payFx.ok) {
      errors.form = payFx.message;
      return { isValid: false, errors, result: null };
    }

    canonicalDebts.push({
      balance: balFx.amount,
      annualRatePercent: rate.value!,
      minPayment: payFx.amount,
    });
  }

  const increase = parseNumber(input.paymentIncrease);
  if (increase.blank) errors.paymentIncrease = 'Enter an increase (0 allowed).';
  else if (increase.invalid || increase.value === null) {
    errors.paymentIncrease = 'Enter a valid increase.';
  } else if (increase.value < 0) {
    errors.paymentIncrease = 'Increase cannot be negative.';
  }

  if (debtErrors.some((e) => e && Object.keys(e).length > 0)) {
    errors.debts = debtErrors;
  }

  if (errors.debts || errors.paymentIncrease || canonicalDebts.length < MIN_DEBT_COUNT) {
    return { isValid: false, errors, result: null };
  }

  const increaseFx = convertMoney(
    increase.value!,
    input.paymentIncreaseCurrency,
    calcCurrency,
    rates
  );
  if (!increaseFx.ok) {
    errors.form = increaseFx.message;
    return { isValid: false, errors, result: null };
  }

  const canonical = calculateDebtSnowball({
    debts: canonicalDebts,
    paymentIncrease: increaseFx.amount,
  });

  if (!canonical) {
    errors.form = 'This combination does not produce a valid debt comparison.';
    return { isValid: false, errors, result: null };
  }

  const totalDebtDisplay = convertMoney(
    canonical.totalDebt,
    calcCurrency,
    input.totalDebtCurrency,
    rates
  );
  if (!totalDebtDisplay.ok) {
    errors.form = totalDebtDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const totalPayDisplay = convertMoney(
    canonical.totalCurrentMonthlyPayment,
    calcCurrency,
    input.totalPaymentCurrency,
    rates
  );
  if (!totalPayDisplay.ok) {
    errors.form = totalPayDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const increaseDisplay = convertMoney(
    increaseFx.amount,
    calcCurrency,
    input.paymentIncreaseCurrency,
    rates
  );
  if (!increaseDisplay.ok) {
    errors.form = increaseDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const newPayDisplay = convertMoney(
    canonical.newMonthlyPayment,
    calcCurrency,
    input.totalPaymentCurrency,
    rates
  );
  if (!newPayDisplay.ok) {
    errors.form = newPayDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: DebtSnowballResult = {
    calcCurrency,
    totalDebt: canonical.totalDebt,
    totalCurrentMonthlyPayment: canonical.totalCurrentMonthlyPayment,
    paymentIncrease: increaseFx.amount,
    newMonthlyPayment: canonical.newMonthlyPayment,
    totalDebtDisplay: totalDebtDisplay.amount,
    totalCurrentMonthlyPaymentDisplay: totalPayDisplay.amount,
    paymentIncreaseDisplay: increaseDisplay.amount,
    newMonthlyPaymentDisplay: newPayDisplay.amount,
    totalDebtCurrency: input.totalDebtCurrency,
    totalPaymentCurrency: input.totalPaymentCurrency,
    paymentIncreaseCurrency: input.paymentIncreaseCurrency,
    formattedTotalDebt: formatDebtSnowballMoney(
      totalDebtDisplay.amount,
      input.totalDebtCurrency
    ),
    formattedTotalCurrentMonthlyPayment: formatDebtSnowballMoney(
      totalPayDisplay.amount,
      input.totalPaymentCurrency
    ),
    formattedPaymentIncrease: formatDebtSnowballMoney(
      increaseDisplay.amount,
      input.paymentIncreaseCurrency
    ),
    formattedNewMonthlyPayment: formatDebtSnowballMoney(
      newPayDisplay.amount,
      input.totalPaymentCurrency
    ),
    rows: canonical.rows,
    aimMethod: aimToMethod(input.aim),
    compareWith: input.compareWith,
  };

  return { isValid: true, errors: {}, result };
}
