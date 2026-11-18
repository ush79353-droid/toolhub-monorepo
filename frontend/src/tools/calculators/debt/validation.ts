import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { calculateDebt, formatDebtMoney } from './calculation';
import {
  MAX_DEBT_COUNT,
  MIN_DEBT_COUNT,
  type DebtCalculatorFieldErrors,
  type DebtCalculatorInput,
  type DebtCalculatorResult,
} from './types';

export interface DebtValidation {
  isValid: boolean;
  errors: DebtCalculatorFieldErrors;
  result: DebtCalculatorResult | null;
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
 * Validate, normalize all money fields into debt #1 balance currency at full precision,
 * run strategies, then convert total debt / monthly payment into their display currencies.
 */
export function validateDebtInput(
  input: DebtCalculatorInput,
  rates?: CurrencyRatesSnapshot | null
): DebtValidation {
  const errors: DebtCalculatorFieldErrors = {};
  const debtErrors: NonNullable<DebtCalculatorFieldErrors['debts']> = [];

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

  const consolRate = parseNumber(input.consolidationRatePercent);
  const fee = parseNumber(input.prepaidFee);

  if (consolRate.blank) errors.consolidationRatePercent = 'Enter a consolidation rate.';
  else if (consolRate.invalid || consolRate.value === null) {
    errors.consolidationRatePercent = 'Enter a valid consolidation rate.';
  } else if (consolRate.value < 0) {
    errors.consolidationRatePercent = 'Consolidation rate cannot be negative.';
  }

  if (fee.blank) errors.prepaidFee = 'Enter a prepaid fee (0 allowed).';
  else if (fee.invalid || fee.value === null) errors.prepaidFee = 'Enter a valid prepaid fee.';
  else if (fee.value < 0) errors.prepaidFee = 'Prepaid fee cannot be negative.';

  if (debtErrors.some((e) => e && Object.keys(e).length > 0)) {
    errors.debts = debtErrors;
  }

  if (
    errors.debts ||
    errors.consolidationRatePercent ||
    errors.prepaidFee ||
    canonicalDebts.length < MIN_DEBT_COUNT
  ) {
    return { isValid: false, errors, result: null };
  }

  const feeFx = convertMoney(fee.value!, input.prepaidFeeCurrency, calcCurrency, rates);
  if (!feeFx.ok) {
    errors.form = feeFx.message;
    return { isValid: false, errors, result: null };
  }

  const canonical = calculateDebt({
    debts: canonicalDebts,
    consolidationRatePercent: consolRate.value!,
    prepaidFee: feeFx.amount,
  });

  if (!canonical) {
    errors.form = 'This combination does not produce a valid debt comparison.';
    return { isValid: false, errors, result: null };
  }

  const totalDisplay = convertMoney(
    canonical.totalDebt,
    calcCurrency,
    input.totalDebtCurrency,
    rates
  );
  if (!totalDisplay.ok) {
    errors.form = totalDisplay.message;
    return { isValid: false, errors, result: null };
  }
  const monthlyDisplay = convertMoney(
    canonical.monthlyPayment,
    calcCurrency,
    input.monthlyPaymentCurrency,
    rates
  );
  if (!monthlyDisplay.ok) {
    errors.form = monthlyDisplay.message;
    return { isValid: false, errors, result: null };
  }

  const result: DebtCalculatorResult = {
    totalDebt: canonical.totalDebt,
    monthlyPayment: canonical.monthlyPayment,
    calcCurrency,
    totalDebtDisplay: totalDisplay.amount,
    monthlyPaymentDisplay: monthlyDisplay.amount,
    totalDebtCurrency: input.totalDebtCurrency,
    monthlyPaymentCurrency: input.monthlyPaymentCurrency,
    formattedTotalDebt: formatDebtMoney(totalDisplay.amount, input.totalDebtCurrency),
    formattedMonthlyPayment: formatDebtMoney(
      monthlyDisplay.amount,
      input.monthlyPaymentCurrency
    ),
    rows: canonical.rows,
    formattedInterest: (amount: number) => formatDebtMoney(amount, calcCurrency),
  };

  return { isValid: true, errors: {}, result };
}
