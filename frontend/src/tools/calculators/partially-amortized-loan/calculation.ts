import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatPartiallyAmortizedMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Total months = years × 12 + months (months 0–11). */
export function durationToMonths(years: number, months: number): number | null {
  if (![years, months].every(Number.isFinite)) return null;
  if (years < 0 || months < 0 || months > 11) return null;
  const total = Math.round(years * 12 + months);
  return Number.isFinite(total) ? total : null;
}

/**
 * M = P × r / (1 − (1+r)^(-N)) when r > 0; M = P / N when r = 0.
 * Uses full amortization length N — never the shorter payment period K.
 */
export function calculateMonthlyPayment(
  principal: number,
  monthlyRate: number,
  amortMonths: number
): number | null {
  if (![principal, monthlyRate, amortMonths].every(Number.isFinite)) return null;
  if (!(principal > 0) || !(amortMonths > 0) || monthlyRate < 0) return null;

  if (monthlyRate === 0) {
    const m = principal / amortMonths;
    return Number.isFinite(m) ? m : null;
  }

  const growth = Math.pow(1 + monthlyRate, amortMonths);
  if (!Number.isFinite(growth) || growth === 0) return null;
  const m = (principal * monthlyRate) / (1 - 1 / growth);
  return Number.isFinite(m) ? m : null;
}

/**
 * Balloon = remaining principal after K scheduled payments on an N-month amortization.
 * Nonzero r: B = P(1+r)^K − M(((1+r)^K − 1) / r)
 * Zero r: B = P − M×K
 */
export function calculateBalloonPayment(input: {
  principal: number;
  monthlyRate: number;
  amortMonths: number;
  paymentMonths: number;
  monthlyPayment: number;
}): number | null {
  const { principal, monthlyRate, amortMonths, paymentMonths, monthlyPayment } = input;

  if (
    ![principal, monthlyRate, amortMonths, paymentMonths, monthlyPayment].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (!(principal > 0) || !(amortMonths > 0) || monthlyRate < 0) return null;
  if (paymentMonths < 0 || !(monthlyPayment >= 0)) return null;
  if (paymentMonths > amortMonths) return null;

  if (paymentMonths === 0) return principal;
  if (paymentMonths === amortMonths) return 0;

  let balloon: number;
  if (monthlyRate === 0) {
    balloon = principal - monthlyPayment * paymentMonths;
  } else {
    const growth = Math.pow(1 + monthlyRate, paymentMonths);
    if (!Number.isFinite(growth)) return null;
    balloon =
      principal * growth - monthlyPayment * ((growth - 1) / monthlyRate);
  }

  if (!Number.isFinite(balloon)) return null;
  if (Math.abs(balloon) < 1e-9) return 0;
  if (balloon < 0) return 0;
  return balloon;
}

/**
 * Pure engine in the loan principal's currency (full precision).
 */
export function calculatePartiallyAmortizedLoan(input: {
  fullLoan: number;
  annualInterestRatePercent: number;
  amortYears: number;
  amortMonths: number;
  paymentYears: number;
  paymentMonths: number;
}): {
  monthlyPayment: number;
  totalPaid: number;
  balloon: number;
  total: number;
  amortMonthsTotal: number;
  paymentMonthsTotal: number;
} | null {
  const amortMonthsTotal = durationToMonths(input.amortYears, input.amortMonths);
  const paymentMonthsTotal = durationToMonths(
    input.paymentYears,
    input.paymentMonths
  );
  if (amortMonthsTotal === null || paymentMonthsTotal === null) return null;
  if (!(amortMonthsTotal > 0)) return null;
  if (!(paymentMonthsTotal > 0)) return null;
  if (paymentMonthsTotal > amortMonthsTotal) return null;
  if (!(input.fullLoan > 0)) return null;
  if (!(input.annualInterestRatePercent >= 0)) return null;

  const monthlyRate = input.annualInterestRatePercent / 100 / 12;
  if (!Number.isFinite(monthlyRate)) return null;

  const monthlyPayment = calculateMonthlyPayment(
    input.fullLoan,
    monthlyRate,
    amortMonthsTotal
  );
  if (monthlyPayment === null) return null;

  const totalPaid = monthlyPayment * paymentMonthsTotal;
  if (!Number.isFinite(totalPaid)) return null;

  const balloon = calculateBalloonPayment({
    principal: input.fullLoan,
    monthlyRate,
    amortMonths: amortMonthsTotal,
    paymentMonths: paymentMonthsTotal,
    monthlyPayment,
  });
  if (balloon === null) return null;

  const total = totalPaid + balloon;
  if (!Number.isFinite(total)) return null;

  return {
    monthlyPayment,
    totalPaid,
    balloon,
    total,
    amortMonthsTotal,
    paymentMonthsTotal,
  };
}
