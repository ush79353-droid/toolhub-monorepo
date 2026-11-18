import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { calculateDebtAvalanche, type NormalizedDebt } from './calculation';
import type {
  DebtAvalancheFieldErrors,
  DebtAvalancheInput,
  DebtAvalancheResult,
  DebtCount,
} from './types';
import { ensureDebtRows } from './types';

export interface DebtAvalancheValidation {
  isValid: boolean;
  errors: DebtAvalancheFieldErrors;
  result: DebtAvalancheResult | null;
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

function convertTo(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: CurrencyRatesSnapshot | null | undefined
): { ok: true; amount: number } | { ok: false } {
  if (from === to) return { ok: true, amount };
  if (!rates?.available) return { ok: false };
  const converted = convertCurrency({
    amount,
    from,
    to,
    rates: rates.rates,
  });
  if (!converted.ok) return { ok: false };
  return { ok: true, amount: converted.amount };
}

export function validateDebtAvalancheInput(
  input: DebtAvalancheInput,
  rates?: CurrencyRatesSnapshot | null
): DebtAvalancheValidation {
  const errors: DebtAvalancheFieldErrors = {};
  const count = input.debtCount as DebtCount;
  const debts = ensureDebtRows(input.debts, count);
  const debtErrors: NonNullable<DebtAvalancheFieldErrors['debts']> = [];

  const normalized: NormalizedDebt[] = [];

  for (let i = 0; i < count; i += 1) {
    const row = debts[i]!;
    const rowErr: { balance?: string; interestRatePercent?: string; payment?: string } =
      {};
    const balance = parseNumber(row.balance);
    const rate = parseNumber(row.interestRatePercent);
    const payment = parseNumber(row.payment);

    if (balance.blank || balance.invalid || balance.value === null) {
      rowErr.balance = 'Enter a valid balance.';
    } else if (balance.value < 0) {
      rowErr.balance = 'Balance cannot be negative.';
    }

    if (rate.blank || rate.invalid || rate.value === null) {
      rowErr.interestRatePercent = 'Enter a valid interest rate.';
    } else if (rate.value < 0) {
      rowErr.interestRatePercent = 'Interest rate cannot be negative.';
    }

    if (payment.blank || payment.invalid || payment.value === null) {
      rowErr.payment = 'Enter a valid monthly payment.';
    } else if (payment.value < 0) {
      rowErr.payment = 'Payment cannot be negative.';
    }

    debtErrors.push(rowErr);

    if (Object.keys(rowErr).length > 0) continue;
    if (balance.value === 0) continue;

    const balFx = convertTo(
      balance.value!,
      row.balanceCurrency,
      input.resultCurrency,
      rates
    );
    const payFx = convertTo(
      payment.value!,
      row.paymentCurrency,
      input.resultCurrency,
      rates
    );

    if (!balFx.ok || !payFx.ok) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }

    if (!(payFx.amount > 0)) {
      rowErr.payment = 'Payment must be greater than zero for a positive balance.';
      continue;
    }

    const monthlyInterest = balFx.amount * (rate.value! / 100 / 12);
    if (payFx.amount <= monthlyInterest + 1e-12) {
      rowErr.payment =
        'Monthly payment must exceed the first month’s interest on this debt.';
      continue;
    }

    normalized.push({
      id: i + 1,
      principal: balFx.amount,
      annualRatePercent: rate.value!,
      monthlyPayment: payFx.amount,
    });
  }

  if (debtErrors.some((e) => Object.keys(e).length > 0)) {
    errors.debts = debtErrors;
  }

  if (errors.form || (errors.debts && errors.debts.some((e) => Object.keys(e).length > 0))) {
    return { isValid: false, errors, result: null };
  }

  if (normalized.length === 0) {
    errors.form = 'Enter at least one debt with a balance greater than zero.';
    return { isValid: false, errors, result: null };
  }

  const result = calculateDebtAvalanche({
    debts: normalized,
    currency: input.resultCurrency,
  });

  if (!result) {
    errors.form =
      'These payments cannot pay off the debts. Increase payments so each covers interest.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
