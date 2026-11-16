import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { moneyAmountToInputString } from '@/tools/shared/money-value';
import {
  calculateAprAmount,
  calculateFinanceChargeFromApr,
  calculateMonthlyFeeAmount,
  calculatePaydayAprPercent,
  calculateTotalDebt,
  formatPaydayMoney,
  formatPaydayPercent,
} from './calculation';
import type {
  PaydayLoanFieldErrors,
  PaydayLoanInput,
  PaydayLoanResult,
} from './types';

export interface PaydayLoanValidation {
  isValid: boolean;
  errors: PaydayLoanFieldErrors;
  result: PaydayLoanResult | null;
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
  from: string,
  to: string,
  rates: CurrencyRatesSnapshot | null | undefined
): number | null {
  if (from === to) return amount;
  if (!rates?.available) return null;
  const converted = convertCurrency({ amount, from, to, rates: rates.rates });
  return converted.ok ? converted.amount : null;
}

/**
 * Validates inputs, syncs APR ↔ finance charge from editSource, normalizes
 * money into loanAmountCurrency, then derives APR amount / monthly fee / total debt.
 */
export function validatePaydayLoanInput(
  input: PaydayLoanInput,
  rates?: CurrencyRatesSnapshot | null
): PaydayLoanValidation {
  const errors: PaydayLoanFieldErrors = {};

  const loan = parseNumber(input.loanAmount);
  const charge = parseNumber(input.financeCharge);
  const days = parseNumber(input.loanTermDays);
  const apr = parseNumber(input.aprPercent);
  const feePct = parseNumber(input.monthlyFeePercent);

  if (!loan.blank && (loan.invalid || loan.value === null)) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (!loan.blank && loan.value !== null && !(loan.value > 0)) {
    errors.loanAmount = 'Loan amount must be greater than zero.';
  }

  if (!charge.blank && (charge.invalid || charge.value === null)) {
    errors.financeCharge = 'Enter a valid finance charge.';
  } else if (!charge.blank && charge.value !== null && charge.value < 0) {
    errors.financeCharge = 'Finance charge cannot be negative.';
  }

  if (!days.blank && (days.invalid || days.value === null)) {
    errors.loanTermDays = 'Enter a valid loan term in days.';
  } else if (!days.blank && days.value !== null && !(days.value > 0)) {
    errors.loanTermDays = 'Loan term must be greater than zero.';
  }

  if (!apr.blank && (apr.invalid || apr.value === null)) {
    errors.aprPercent = 'Enter a valid APR.';
  } else if (!apr.blank && apr.value !== null && apr.value < 0) {
    errors.aprPercent = 'APR cannot be negative.';
  }

  if (!feePct.blank && (feePct.invalid || feePct.value === null)) {
    errors.monthlyFeePercent = 'Enter a valid monthly fee percent.';
  } else if (!feePct.blank && feePct.value !== null && feePct.value < 0) {
    errors.monthlyFeePercent = 'Monthly fee percent cannot be negative.';
  }

  const feePercentValue = feePct.blank ? 0 : feePct.value;
  const needsCharge =
    input.editSource === 'financeCharge'
      ? charge.blank || charge.value === null
      : apr.blank || apr.value === null;

  if (
    loan.blank ||
    days.blank ||
    needsCharge ||
    feePercentValue === null ||
    Object.keys(errors).length > 0 ||
    loan.value === null ||
    days.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const principal = loan.value;
  const termDays = days.value;

  let financeChargeInLoanCurrency: number;
  let aprPercent: number;
  let syncedFinanceCharge: string | undefined;
  let syncedAprPercent: string | undefined;

  if (input.editSource === 'apr') {
    if (apr.value === null) {
      return { isValid: false, errors, result: null };
    }
    const chargeCanonical = calculateFinanceChargeFromApr(
      principal,
      apr.value,
      termDays
    );
    if (chargeCanonical === null) {
      errors.form = 'Unable to derive a finance charge from APR.';
      return { isValid: false, errors, result: null };
    }
    financeChargeInLoanCurrency = chargeCanonical;
    aprPercent = apr.value;

    const chargeInFieldCurrency = convertTo(
      chargeCanonical,
      input.loanAmountCurrency,
      input.financeChargeCurrency,
      rates
    );
    if (chargeInFieldCurrency === null) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    syncedFinanceCharge = moneyAmountToInputString(chargeInFieldCurrency);
  } else {
    if (charge.value === null) {
      return { isValid: false, errors, result: null };
    }
    const normalizedCharge = convertTo(
      charge.value,
      input.financeChargeCurrency,
      input.loanAmountCurrency,
      rates
    );
    if (normalizedCharge === null) {
      errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
      return { isValid: false, errors, result: null };
    }
    financeChargeInLoanCurrency = normalizedCharge;
    const computedApr = calculatePaydayAprPercent(
      principal,
      financeChargeInLoanCurrency,
      termDays
    );
    if (computedApr === null) {
      errors.form = 'Unable to calculate a finite APR.';
      return { isValid: false, errors, result: null };
    }
    aprPercent = computedApr;
    syncedAprPercent = formatPaydayPercent(computedApr);
  }

  const aprAmountCanonical = calculateAprAmount(
    financeChargeInLoanCurrency,
    termDays
  );
  const monthlyFeeCanonical = calculateMonthlyFeeAmount(
    principal,
    feePercentValue
  );
  if (aprAmountCanonical === null || monthlyFeeCanonical === null) {
    errors.form = 'Unable to calculate fee results.';
    return { isValid: false, errors, result: null };
  }

  const totalDebtCanonical = calculateTotalDebt(
    principal,
    financeChargeInLoanCurrency,
    monthlyFeeCanonical
  );
  if (totalDebtCanonical === null) {
    errors.form = 'Unable to calculate total debt.';
    return { isValid: false, errors, result: null };
  }

  const aprAmountDisplay = convertTo(
    aprAmountCanonical,
    input.loanAmountCurrency,
    input.aprAmountCurrency,
    rates
  );
  const monthlyFeeDisplay = convertTo(
    monthlyFeeCanonical,
    input.loanAmountCurrency,
    input.monthlyFeeCurrency,
    rates
  );
  const totalDebtDisplay = convertTo(
    totalDebtCanonical,
    input.loanAmountCurrency,
    input.totalDebtCurrency,
    rates
  );

  if (
    aprAmountDisplay === null ||
    monthlyFeeDisplay === null ||
    totalDebtDisplay === null
  ) {
    errors.form = CURRENCY_CONVERSION_UNAVAILABLE_NOTE;
    return { isValid: false, errors, result: null };
  }

  const result: PaydayLoanResult = {
    loanAmount: principal,
    financeChargeCanonical: financeChargeInLoanCurrency,
    loanTermDays: termDays,
    aprPercent,
    aprAmountCanonical,
    monthlyFeePercent: feePercentValue,
    monthlyFeeCanonical,
    totalDebtCanonical,
    loanAmountCurrency: input.loanAmountCurrency,
    aprAmountDisplay,
    aprAmountCurrency: input.aprAmountCurrency,
    monthlyFeeDisplay,
    monthlyFeeCurrency: input.monthlyFeeCurrency,
    totalDebtDisplay,
    totalDebtCurrency: input.totalDebtCurrency,
    formattedAprPercent: formatPaydayPercent(aprPercent),
    formattedAprAmount: formatPaydayMoney(
      aprAmountDisplay,
      input.aprAmountCurrency
    ),
    formattedMonthlyFee: formatPaydayMoney(
      monthlyFeeDisplay,
      input.monthlyFeeCurrency
    ),
    formattedTotalDebt: formatPaydayMoney(
      totalDebtDisplay,
      input.totalDebtCurrency
    ),
    syncedFinanceCharge,
    syncedAprPercent,
  };

  return { isValid: true, errors: {}, result };
}
