import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { periodicGrowthFromAnnual } from '../annuity/calculation';
import {
  buildSummaryText,
  buildYearlySchedule,
  calculateImmediateAnnuity,
  formatImmediateMoney,
  formatLongDate,
  frequencyLabel,
  termToYears,
  timingLabel,
} from './calculation';
import type {
  ImmediateAnnuityFieldErrors,
  ImmediateAnnuityInput,
  ImmediateAnnuityResult,
} from './types';

export interface ImmediateAnnuityValidation {
  isValid: boolean;
  errors: ImmediateAnnuityFieldErrors;
  result: ImmediateAnnuityResult | null;
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

function isValidIsoDate(iso: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === mo - 1 &&
    dt.getUTCDate() === d
  );
}

/**
 * Validates inputs, normalizes money into the invest currency, then solves the
 * selected immediate-annuity unknown via the shared annuity engine.
 */
export function validateImmediateAnnuityInput(
  input: ImmediateAnnuityInput,
  rates?: CurrencyRatesSnapshot | null
): ImmediateAnnuityValidation {
  const errors: ImmediateAnnuityFieldErrors = {};
  const calcCurrency = input.amountToInvestCurrency;
  const mode = input.mode;

  const invest = parseNumber(input.amountToInvest);
  const withdrawal = parseNumber(input.withdrawalAmount);
  const length = parseNumber(input.length);
  const rate = parseNumber(input.rateOfReturnPercent);
  const remaining = parseNumber(
    input.displayMore ? input.remainingBalance : '0'
  );
  const growth = parseNumber(input.displayMore ? input.annualGrowthPercent : '0');

  if (!isValidIsoDate(input.startDate)) {
    errors.startDate = 'Enter a valid start date.';
  }

  const needsInvest = mode !== 'invest';
  const needsWithdrawal = mode !== 'withdraw';
  const needsLength = mode !== 'duration';
  const needsRate = mode !== 'rate';

  if (needsInvest) {
    if (invest.blank) errors.amountToInvest = 'Enter an amount to invest.';
    else if (invest.invalid || invest.value === null) {
      errors.amountToInvest = 'Enter a valid amount to invest.';
    } else if (!(invest.value > 0)) {
      errors.amountToInvest = 'Amount to invest must be greater than zero.';
    }
  }

  if (needsWithdrawal) {
    if (withdrawal.blank) {
      errors.withdrawalAmount = 'Enter a withdrawal amount.';
    } else if (withdrawal.invalid || withdrawal.value === null) {
      errors.withdrawalAmount = 'Enter a valid withdrawal amount.';
    } else if (!(withdrawal.value > 0)) {
      errors.withdrawalAmount = 'Withdrawal amount must be greater than zero.';
    }
  }

  if (needsLength) {
    if (length.blank) errors.length = 'Enter a withdrawal length.';
    else if (length.invalid || length.value === null) {
      errors.length = 'Enter a valid withdrawal length.';
    } else if (!(length.value > 0)) {
      errors.length = 'Withdrawal length must be greater than zero.';
    }
  }

  if (needsRate) {
    if (rate.blank) errors.rateOfReturnPercent = 'Enter a rate of return.';
    else if (rate.invalid || rate.value === null) {
      errors.rateOfReturnPercent = 'Enter a valid rate of return.';
    } else if (rate.value < 0) {
      errors.rateOfReturnPercent = 'Rate of return cannot be negative.';
    }
  }

  if (input.displayMore) {
    if (remaining.blank) {
      errors.remainingBalance = 'Enter a remaining balance.';
    } else if (remaining.invalid || remaining.value === null) {
      errors.remainingBalance = 'Enter a valid remaining balance.';
    } else if (remaining.value < 0) {
      errors.remainingBalance = 'Remaining balance cannot be negative.';
    }

    if (growth.blank) {
      errors.annualGrowthPercent = 'Enter an annual growth rate.';
    } else if (growth.invalid || growth.value === null) {
      errors.annualGrowthPercent = 'Enter a valid annual growth rate.';
    } else if (growth.value <= -100) {
      errors.annualGrowthPercent = 'Annual growth rate must be greater than -100%.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const termYears =
    needsLength && length.value !== null
      ? termToYears(length.value, input.lengthUnit)
      : 10;
  if (needsLength && termYears === null) {
    errors.length = 'Withdrawal length must produce a positive term.';
    return { isValid: false, errors, result: null };
  }

  const investCanonical =
    needsInvest && invest.value !== null
      ? convertMoney(
          invest.value,
          input.amountToInvestCurrency,
          calcCurrency,
          rates
        )
      : { ok: true as const, amount: invest.value ?? 0 };
  if (!investCanonical.ok) {
    errors.form = investCanonical.message;
    return { isValid: false, errors, result: null };
  }

  const withdrawalCanonical =
    needsWithdrawal && withdrawal.value !== null
      ? convertMoney(
          withdrawal.value,
          input.withdrawalAmountCurrency,
          calcCurrency,
          rates
        )
      : { ok: true as const, amount: withdrawal.value ?? 0 };
  if (!withdrawalCanonical.ok) {
    errors.form = withdrawalCanonical.message;
    return { isValid: false, errors, result: null };
  }

  const remainingCanonical =
    input.displayMore && remaining.value !== null
      ? convertMoney(
          remaining.value,
          input.remainingBalanceCurrency,
          calcCurrency,
          rates
        )
      : { ok: true as const, amount: 0 };
  if (!remainingCanonical.ok) {
    errors.form = remainingCanonical.message;
    return { isValid: false, errors, result: null };
  }

  const periodGrowth = periodicGrowthFromAnnual(
    growth.value ?? 0,
    input.paymentFrequency
  );
  if (periodGrowth === null) {
    errors.annualGrowthPercent = 'Enter a valid annual growth rate.';
    return { isValid: false, errors, result: null };
  }

  const compounding = input.changeCompounding
    ? input.compoundingFrequency
    : input.paymentFrequency;

  const computed = calculateImmediateAnnuity({
    mode,
    paymentFrequency: input.paymentFrequency,
    compoundingFrequency: compounding,
    annuityType: input.annuityType,
    startDate: input.startDate,
    amountToInvest: investCanonical.amount,
    withdrawalAmount: withdrawalCanonical.amount,
    termYears: termYears ?? 10,
    annualRatePercent: rate.value ?? 0,
    periodGrowth,
    remainingBalance: remainingCanonical.amount,
  });

  if (!computed) {
    errors.form =
      'This combination does not produce a finite annuity. Check amounts, rate, and length.';
    return { isValid: false, errors, result: null };
  }

  const { engine, lengthYears, ratePercent } = computed;
  const finalBalance =
    Math.abs(engine.finalBalance) < 1e-6 ? 0 : engine.finalBalance;

  const yearlySchedule = buildYearlySchedule({
    openingBalance: engine.openingBalance,
    firstWithdrawal: engine.periodicPayment,
    paymentCount: engine.numberOfPayments,
    annualRatePercent: ratePercent,
    paymentFrequency: input.paymentFrequency,
    compoundingFrequency: compounding,
    periodGrowth,
    annuityType: input.annuityType,
    startDate: input.startDate,
    currency: calcCurrency,
  });
  if (!yearlySchedule) {
    errors.form = 'Could not build the yearly payment schedule.';
    return { isValid: false, errors, result: null };
  }

  const symbol = getCurrencySymbol(calcCurrency);
  const result: ImmediateAnnuityResult = {
    mode,
    currency: calcCurrency,
    openingBalance: engine.openingBalance,
    finalBalance,
    periodicWithdrawal: engine.periodicPayment,
    totalWithdrawals: engine.totalPayments,
    totalReturn: engine.totalReturn,
    numberOfWithdrawals: engine.numberOfPayments,
    lastWithdrawalDate: engine.lastPaymentDate,
    lastWithdrawalDateLabel: formatLongDate(engine.lastPaymentDate),
    paymentFrequencyLabel: frequencyLabel(input.paymentFrequency),
    timingLabel: timingLabel(input.annuityType),
    lengthYears,
    rateOfReturnPercent: ratePercent,
    formattedOpeningBalance: formatImmediateMoney(
      engine.openingBalance,
      calcCurrency
    ),
    formattedFinalBalance: formatImmediateMoney(finalBalance, calcCurrency),
    formattedPeriodicWithdrawal: formatImmediateMoney(
      engine.periodicPayment,
      calcCurrency
    ),
    formattedTotalWithdrawals: formatImmediateMoney(
      engine.totalPayments,
      calcCurrency
    ),
    formattedTotalReturn: formatImmediateMoney(engine.totalReturn, calcCurrency),
    summaryText: buildSummaryText({
      mode,
      currency: calcCurrency,
      periodicWithdrawal: engine.periodicPayment,
      openingBalance: engine.openingBalance,
      finalBalance,
      lengthYears,
      rateOfReturnPercent: ratePercent,
      annuityType: input.annuityType,
      paymentFrequency: input.paymentFrequency,
    }).replace(`${calcCurrency} `, symbol),
    yearlySchedule,
  };

  return { isValid: true, errors, result };
}
