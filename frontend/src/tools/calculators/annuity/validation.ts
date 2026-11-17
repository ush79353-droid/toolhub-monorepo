import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import {
  annualGrowthFromPeriodic,
  buildSummaryText,
  calculateAnnuity,
  formatAnnuityMoney,
  formatLongDate,
  frequencyLabel,
  periodicGrowthFromAnnual,
  termToYears,
} from './calculation';
import type {
  AnnuityFieldErrors,
  AnnuityInput,
  AnnuityResult,
} from './types';

export interface AnnuityValidation {
  isValid: boolean;
  errors: AnnuityFieldErrors;
  result: AnnuityResult | null;
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

function needsTargetFinal(solveFor: AnnuityInput['solveFor']): boolean {
  return solveFor !== 'finalBalance';
}

/**
 * Validates inputs, normalizes money into the initial-deposit currency, then
 * runs the annuity engine for the selected solve target.
 */
export function validateAnnuityInput(
  input: AnnuityInput,
  rates?: CurrencyRatesSnapshot | null
): AnnuityValidation {
  const errors: AnnuityFieldErrors = {};
  const calcCurrency = input.initialDepositCurrency;

  const opening = parseNumber(input.initialDeposit);
  const payment = parseNumber(input.annuityAmount);
  const length = parseNumber(input.length);
  const rate = parseNumber(input.rateOfReturnPercent);
  const annualGrowth = parseNumber(input.annualGrowthPercent);
  const periodicGrowth = parseNumber(input.periodicGrowthPercent);
  const targetFv = parseNumber(input.targetFinalBalance);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.startDate.trim())) {
    errors.startDate = 'Enter a valid start date.';
  }

  if (input.solveFor !== 'initialDeposit') {
    if (!opening.blank && (opening.invalid || opening.value === null)) {
      errors.initialDeposit = 'Enter a valid initial deposit.';
    } else if (!opening.blank && opening.value !== null && opening.value < 0) {
      errors.initialDeposit = 'Initial deposit cannot be negative.';
    }
  }

  if (input.solveFor !== 'annuityAmount') {
    if (!payment.blank && (payment.invalid || payment.value === null)) {
      errors.annuityAmount = 'Enter a valid annuity amount.';
    } else if (!payment.blank && payment.value !== null && payment.value < 0) {
      errors.annuityAmount = 'Annuity amount cannot be negative.';
    }
  }

  if (input.solveFor !== 'timeLength') {
    if (!length.blank && (length.invalid || length.value === null)) {
      errors.length = 'Enter a valid length.';
    } else if (!length.blank && length.value !== null && !(length.value > 0)) {
      errors.length = 'Length must be greater than zero.';
    }
  }

  if (input.solveFor !== 'rateOfReturn') {
    if (!rate.blank && (rate.invalid || rate.value === null)) {
      errors.rateOfReturnPercent = 'Enter a valid rate of return.';
    } else if (!rate.blank && rate.value !== null && rate.value < 0) {
      errors.rateOfReturnPercent = 'Rate of return cannot be negative.';
    }
  }

  if (!annualGrowth.blank && (annualGrowth.invalid || annualGrowth.value === null)) {
    errors.annualGrowthPercent = 'Enter a valid annual growth rate.';
  }
  if (
    !periodicGrowth.blank &&
    (periodicGrowth.invalid || periodicGrowth.value === null)
  ) {
    errors.periodicGrowthPercent = 'Enter a valid periodic growth rate.';
  }

  if (needsTargetFinal(input.solveFor)) {
    if (targetFv.blank || targetFv.invalid || targetFv.value === null) {
      errors.targetFinalBalance = 'Enter a target final balance.';
    }
  }

  const requiredMissing =
    (input.solveFor !== 'initialDeposit' && opening.blank) ||
    (input.solveFor !== 'annuityAmount' && payment.blank) ||
    (input.solveFor !== 'timeLength' && length.blank) ||
    (input.solveFor !== 'rateOfReturn' && rate.blank) ||
    (needsTargetFinal(input.solveFor) && targetFv.blank) ||
    annualGrowth.blank ||
    periodicGrowth.blank;

  if (requiredMissing || Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  let openingNorm = 0;
  if (input.solveFor !== 'initialDeposit') {
    const converted = convertMoney(
      opening.value!,
      input.initialDepositCurrency,
      calcCurrency,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null };
    }
    openingNorm = converted.amount;
  }

  let paymentNorm = 0;
  if (input.solveFor !== 'annuityAmount') {
    const converted = convertMoney(
      payment.value!,
      input.annuityAmountCurrency,
      calcCurrency,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null };
    }
    paymentNorm = converted.amount;
  }

  let targetNorm = 0;
  if (needsTargetFinal(input.solveFor)) {
    const converted = convertMoney(
      targetFv.value!,
      input.targetFinalBalanceCurrency,
      calcCurrency,
      rates
    );
    if (!converted.ok) {
      errors.form = converted.message;
      return { isValid: false, errors, result: null };
    }
    targetNorm = converted.amount;
  }

  let periodGrowthDecimal: number | null;
  if (input.growthSource === 'annual') {
    periodGrowthDecimal = periodicGrowthFromAnnual(
      annualGrowth.value!,
      input.paymentFrequency
    );
  } else {
    periodGrowthDecimal = periodicGrowth.value! / 100;
    const annualCheck = annualGrowthFromPeriodic(
      periodicGrowth.value!,
      input.paymentFrequency
    );
    if (annualCheck === null) {
      errors.periodicGrowthPercent = 'Periodic growth rate is invalid.';
      return { isValid: false, errors, result: null };
    }
  }
  if (periodGrowthDecimal === null || !(periodGrowthDecimal > -1)) {
    errors.form = 'Growth rate produces a non-finite annuity.';
    return { isValid: false, errors, result: null };
  }

  const termYears =
    input.solveFor === 'timeLength'
      ? 1
      : termToYears(length.value!, input.lengthUnit);
  if (input.solveFor !== 'timeLength' && termYears === null) {
    errors.length = 'Enter a valid length.';
    return { isValid: false, errors, result: null };
  }

  const engine = calculateAnnuity({
    solveFor: input.solveFor,
    direction: input.direction,
    paymentFrequency: input.paymentFrequency,
    compoundingFrequency: input.compoundingFrequency,
    annuityType: input.annuityType,
    startDate: input.startDate.trim(),
    openingBalance: openingNorm,
    firstPaymentAbs: paymentNorm,
    termYears: termYears ?? 1,
    annualRatePercent:
      input.solveFor === 'rateOfReturn' ? 0 : rate.value!,
    periodGrowth: periodGrowthDecimal,
    targetFinalBalance: targetNorm,
  });

  if (!engine) {
    errors.form = 'This combination does not produce a finite annuity result.';
    return { isValid: false, errors, result: null };
  }

  const symbol = getCurrencySymbol(calcCurrency);
  const paymentWord =
    input.direction === 'deposit' ? 'deposit' : 'withdrawal';
  const freq = frequencyLabel(input.paymentFrequency).toLowerCase();

  const result: AnnuityResult = {
    openingBalance: engine.openingBalance,
    finalBalance: engine.finalBalance,
    periodicPayment: engine.periodicPayment,
    totalPayments: engine.totalPayments,
    totalReturn: engine.totalReturn,
    numberOfPayments: engine.numberOfPayments,
    lastPaymentDate: engine.lastPaymentDate,
    lastPaymentDateLabel: formatLongDate(engine.lastPaymentDate),
    paymentFrequencyLabel: frequencyLabel(input.paymentFrequency),
    direction: input.direction,
    solvedValue: engine.solvedValue,
    solveFor: input.solveFor,
    calcCurrency,
    formattedOpeningBalance: formatAnnuityMoney(engine.openingBalance, calcCurrency),
    formattedFinalBalance: formatAnnuityMoney(engine.finalBalance, calcCurrency),
    formattedPeriodicPayment: formatAnnuityMoney(engine.periodicPayment, calcCurrency),
    formattedTotalPayments: formatAnnuityMoney(engine.totalPayments, calcCurrency),
    formattedTotalReturn: formatAnnuityMoney(engine.totalReturn, calcCurrency),
    summaryText: buildSummaryText({
      solveFor: input.solveFor,
      solvedValue: engine.solvedValue,
      finalBalance: engine.finalBalance,
      currency: calcCurrency,
      currencySymbol: symbol,
    }),
  };

  // Attach frequency wording for table labels via summary only; table uses paymentWord.
  void paymentWord;
  void freq;

  return { isValid: true, errors: {}, result };
}
