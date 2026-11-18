import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  type CurrencyRatesSnapshot,
} from '@/tools/shared/currency-rates';
import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  calculatePartiallyAmortizedLoan,
  formatPartiallyAmortizedMoney,
} from './calculation';
import type {
  PartiallyAmortizedLoanFieldErrors,
  PartiallyAmortizedLoanInput,
  PartiallyAmortizedLoanResult,
} from './types';

export interface PartiallyAmortizedLoanValidation {
  isValid: boolean;
  errors: PartiallyAmortizedLoanFieldErrors;
  result: PartiallyAmortizedLoanResult | null;
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

/** Blank duration part → 0 when the sibling part is filled. */
function resolveDurationPart(
  part: ReturnType<typeof parseNumber>,
  sibling: ReturnType<typeof parseNumber>
): { value: number | null; blank: boolean; invalid: boolean } {
  if (part.blank && sibling.blank) {
    return { value: null, blank: true, invalid: false };
  }
  if (part.blank) {
    return { value: 0, blank: false, invalid: false };
  }
  if (part.invalid || part.value === null) {
    return { value: null, blank: false, invalid: true };
  }
  return { value: part.value, blank: false, invalid: false };
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
 * Amortizes in loan currency at full precision, then converts each monetary
 * result into its independent display currency.
 */
export function validatePartiallyAmortizedLoanInput(
  input: PartiallyAmortizedLoanInput,
  rates?: CurrencyRatesSnapshot | null
): PartiallyAmortizedLoanValidation {
  const errors: PartiallyAmortizedLoanFieldErrors = {};

  const loan = parseNumber(input.fullLoan);
  const rate = parseNumber(input.annualInterestRatePercent);
  const amortYRaw = parseNumber(input.amortYears);
  const amortMRaw = parseNumber(input.amortMonths);
  const payYRaw = parseNumber(input.paymentYears);
  const payMRaw = parseNumber(input.paymentMonths);

  if (!loan.blank && (loan.invalid || loan.value === null)) {
    errors.fullLoan = 'Enter a valid full loan amount.';
  } else if (!loan.blank && loan.value !== null && !(loan.value > 0)) {
    errors.fullLoan = 'Full loan must be greater than zero.';
  }

  if (!rate.blank && (rate.invalid || rate.value === null)) {
    errors.annualInterestRatePercent = 'Enter a valid annual interest rate.';
  } else if (!rate.blank && rate.value !== null && rate.value < 0) {
    errors.annualInterestRatePercent = 'Annual interest rate cannot be negative.';
  }

  const amortY = resolveDurationPart(amortYRaw, amortMRaw);
  const amortM = resolveDurationPart(amortMRaw, amortYRaw);
  const payY = resolveDurationPart(payYRaw, payMRaw);
  const payM = resolveDurationPart(payMRaw, payYRaw);

  if (amortY.invalid) errors.amortYears = 'Enter a valid number of years.';
  else if (amortY.value !== null && amortY.value < 0) {
    errors.amortYears = 'Years cannot be negative.';
  }

  if (amortM.invalid) errors.amortMonths = 'Enter a valid number of months.';
  else if (amortM.value !== null && amortM.value < 0) {
    errors.amortMonths = 'Months cannot be negative.';
  } else if (amortM.value !== null && amortM.value > 11) {
    errors.amortMonths = 'Months must be between 0 and 11.';
  }

  if (
    !amortY.blank &&
    !amortM.blank &&
    !errors.amortYears &&
    !errors.amortMonths &&
    amortY.value !== null &&
    amortM.value !== null &&
    amortY.value * 12 + amortM.value <= 0
  ) {
    errors.amortYears = 'Amortization time must be greater than zero.';
  }

  if (payY.invalid) errors.paymentYears = 'Enter a valid number of years.';
  else if (payY.value !== null && payY.value < 0) {
    errors.paymentYears = 'Years cannot be negative.';
  }

  if (payM.invalid) errors.paymentMonths = 'Enter a valid number of months.';
  else if (payM.value !== null && payM.value < 0) {
    errors.paymentMonths = 'Months cannot be negative.';
  } else if (payM.value !== null && payM.value > 11) {
    errors.paymentMonths = 'Months must be between 0 and 11.';
  }

  if (
    !payY.blank &&
    !payM.blank &&
    !errors.paymentYears &&
    !errors.paymentMonths &&
    payY.value !== null &&
    payM.value !== null &&
    payY.value * 12 + payM.value <= 0
  ) {
    errors.paymentYears = 'Payment period must be greater than zero.';
  }

  const incomplete =
    loan.blank ||
    rate.blank ||
    amortY.blank ||
    amortM.blank ||
    payY.blank ||
    payM.blank ||
    Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const amortMonthsTotal = amortY.value! * 12 + amortM.value!;
  const paymentMonthsTotal = payY.value! * 12 + payM.value!;
  if (paymentMonthsTotal > amortMonthsTotal) {
    errors.paymentYears = 'Payment period cannot exceed amortization time.';
    return { isValid: false, errors, result: null };
  }

  const computed = calculatePartiallyAmortizedLoan({
    fullLoan: loan.value!,
    annualInterestRatePercent: rate.value!,
    amortYears: amortY.value!,
    amortMonths: amortM.value!,
    paymentYears: payY.value!,
    paymentMonths: payM.value!,
  });

  if (!computed) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, errors, result: null };
  }

  const from = input.loanCurrency;
  const monthlyFx = convertMoney(
    computed.monthlyPayment,
    from,
    input.monthlyPaymentCurrency,
    rates
  );
  if (!monthlyFx.ok) {
    errors.form = monthlyFx.message;
    return { isValid: false, errors, result: null };
  }
  const totalPaidFx = convertMoney(
    computed.totalPaid,
    from,
    input.totalPaidCurrency,
    rates
  );
  if (!totalPaidFx.ok) {
    errors.form = totalPaidFx.message;
    return { isValid: false, errors, result: null };
  }
  const balloonFx = convertMoney(
    computed.balloon,
    from,
    input.balloonCurrency,
    rates
  );
  if (!balloonFx.ok) {
    errors.form = balloonFx.message;
    return { isValid: false, errors, result: null };
  }
  const totalFx = convertMoney(computed.total, from, input.totalCurrency, rates);
  if (!totalFx.ok) {
    errors.form = totalFx.message;
    return { isValid: false, errors, result: null };
  }

  const result: PartiallyAmortizedLoanResult = {
    monthlyPaymentInLoan: computed.monthlyPayment,
    totalPaidInLoan: computed.totalPaid,
    balloonInLoan: computed.balloon,
    totalInLoan: computed.total,
    amortMonthsTotal: computed.amortMonthsTotal,
    paymentMonthsTotal: computed.paymentMonthsTotal,
    monthlyPayment: monthlyFx.amount,
    totalPaid: totalPaidFx.amount,
    balloon: balloonFx.amount,
    total: totalFx.amount,
    loanCurrency: input.loanCurrency,
    monthlyPaymentCurrency: input.monthlyPaymentCurrency,
    totalPaidCurrency: input.totalPaidCurrency,
    balloonCurrency: input.balloonCurrency,
    totalCurrency: input.totalCurrency,
    formattedMonthlyPayment: formatPartiallyAmortizedMoney(
      monthlyFx.amount,
      input.monthlyPaymentCurrency
    ),
    formattedTotalPaid: formatPartiallyAmortizedMoney(
      totalPaidFx.amount,
      input.totalPaidCurrency
    ),
    formattedBalloon: formatPartiallyAmortizedMoney(
      balloonFx.amount,
      input.balloonCurrency
    ),
    formattedTotal: formatPartiallyAmortizedMoney(
      totalFx.amount,
      input.totalCurrency
    ),
  };

  return { isValid: true, errors: {}, result };
}
