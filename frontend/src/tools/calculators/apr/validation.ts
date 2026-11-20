import {
  PAYMENTS_PER_YEAR,
  annualizePeriodicRate,
  buildAmortizationSchedule,
  calculateEffectiveAnnualRate,
  calculatePeriodicPayment,
  formatAprMoney,
  formatAprPercent,
  interpretApr,
  resolveCashFlows,
  resolveOriginationFeeAmount,
  resolvePaymentCount,
  solvePeriodicAprRate,
} from './calculation';
import type {
  AprFieldErrors,
  AprInput,
  AprResult,
  AprStatus,
} from './types';

export interface AprValidation {
  isValid: boolean;
  errors: AprFieldErrors;
  result: AprResult | null;
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

/** Optional fee field: blank → 0. */
function optionalNonneg(
  parsed: ReturnType<typeof parseNumber>
): number | null {
  if (parsed.blank) return 0;
  if (parsed.invalid || parsed.value === null || parsed.value < 0) return null;
  return parsed.value;
}

export function validateAprInput(input: AprInput): AprValidation {
  const errors: AprFieldErrors = {};
  const currency = input.currency;
  const m = PAYMENTS_PER_YEAR[input.paymentFrequency];

  const loan = parseNumber(input.loanAmount);
  const rate = parseNumber(input.annualInterestRate);
  const term = parseNumber(input.loanTerm);
  const orig = parseNumber(input.originationFee);
  const other = parseNumber(input.otherFinanceCharges);

  if (loan.blank) {
    // required — leave blank, no result later
  } else if (loan.invalid || loan.value === null) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (loan.value <= 0) {
    errors.loanAmount = 'Loan amount must be greater than zero.';
  }

  if (rate.blank) {
    // required
  } else if (rate.invalid || rate.value === null) {
    errors.annualInterestRate = 'Enter a valid interest rate.';
  } else if (rate.value < 0) {
    errors.annualInterestRate = 'Interest rate cannot be negative.';
  } else if (rate.value > 1000) {
    errors.annualInterestRate = 'Interest rate is unrealistically high.';
  }

  if (term.blank) {
    // required
  } else if (term.invalid || term.value === null) {
    errors.loanTerm = 'Enter a valid loan term.';
  } else if (term.value <= 0) {
    errors.loanTerm = 'Loan term must be greater than zero.';
  }

  if (!orig.blank && (orig.invalid || orig.value === null || orig.value < 0)) {
    errors.originationFee =
      orig.value !== null && orig.value < 0
        ? 'Origination fee cannot be negative.'
        : 'Enter a valid origination fee.';
  } else if (
    !orig.blank &&
    input.originationFeeType === 'percentage' &&
    orig.value !== null &&
    orig.value > 100
  ) {
    errors.originationFee = 'Origination fee percentage cannot exceed 100%.';
  }

  if (
    !other.blank &&
    (other.invalid || other.value === null || other.value < 0)
  ) {
    errors.otherFinanceCharges =
      other.value !== null && other.value < 0
        ? 'Other finance charges cannot be negative.'
        : 'Enter a valid finance charge amount.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const loanReady = !loan.blank && loan.value !== null && loan.value > 0;
  const rateReady = !rate.blank && rate.value !== null && rate.value >= 0;
  const termReady = !term.blank && term.value !== null && term.value > 0;

  if (!loanReady && !rateReady && !termReady) {
    return { isValid: false, errors, result: null };
  }

  if (!loanReady || !rateReady || !termReady) {
    return { isValid: false, errors, result: null };
  }

  const paymentCount = resolvePaymentCount(
    term.value!,
    input.loanTermUnit,
    input.paymentFrequency
  );
  if (paymentCount === null) {
    errors.loanTerm =
      'Loan term must produce a whole number of payments for the selected frequency (no fractional periods).';
    return { isValid: false, errors, result: null };
  }

  const origFeeValue = optionalNonneg(orig);
  const otherFeeValue = optionalNonneg(other);
  if (origFeeValue === null) {
    errors.originationFee = 'Enter a valid origination fee.';
    return { isValid: false, errors, result: null };
  }
  if (otherFeeValue === null) {
    errors.otherFinanceCharges = 'Enter a valid finance charge amount.';
    return { isValid: false, errors, result: null };
  }

  const originationAmount = resolveOriginationFeeAmount(
    loan.value!,
    origFeeValue,
    input.originationFeeType
  );
  if (originationAmount === null) {
    errors.originationFee = 'Could not resolve origination fee.';
    return { isValid: false, errors, result: null };
  }

  const totalFees = originationAmount + otherFeeValue;
  const flows = resolveCashFlows(loan.value!, totalFees, input.feeTreatment);
  if (flows === null) {
    errors.form =
      'Fees leave zero or negative net loan proceeds. Reduce fees or change fee treatment.';
    return { isValid: false, errors, result: null };
  }

  const periodicRate = rate.value! / 100 / m;
  const periodicPayment = calculatePeriodicPayment(
    flows.amortizingPrincipal,
    periodicRate,
    paymentCount
  );
  if (periodicPayment === null) {
    errors.form = 'Could not calculate the periodic payment for these inputs.';
    return { isValid: false, errors, result: null };
  }

  let status: AprStatus = 'valid';
  let warningMessage: string | null =
    'Estimated cash-flow APR (nominal annualized). Not a certified regulatory disclosure. Amounts share one currency label (no FX).';

  const rApr = solvePeriodicAprRate(
    flows.netProceeds,
    periodicPayment,
    paymentCount
  );
  let apr: number | null = null;
  let ear: number | null = null;
  if (rApr === null) {
    status = 'solverFailed';
    warningMessage =
      'APR solver did not converge for these cash flows. Results below show payment totals without APR.';
    errors.form = warningMessage;
  } else {
    apr = annualizePeriodicRate(rApr, m);
    ear = calculateEffectiveAnnualRate(rApr, m);
  }

  const schedule = buildAmortizationSchedule(
    flows.amortizingPrincipal,
    periodicRate,
    periodicPayment,
    paymentCount
  );

  const totalPayments = schedule.reduce((s, row) => s + row.payment, 0);
  const totalInterest = schedule.reduce((s, row) => s + row.interest, 0);
  // Finance charges ≈ interest + fees (fees paid separately or financed)
  const totalFinanceCharges = totalInterest + totalFees;

  const result: AprResult = {
    periodicPayment,
    paymentCount,
    paymentsPerYear: m,
    amortizingPrincipal: flows.amortizingPrincipal,
    netProceeds: flows.netProceeds,
    totalFees,
    totalInterest,
    totalPayments,
    totalFinanceCharges,
    apr,
    effectiveAnnualRate: ear,
    nominalAnnualRate: rate.value!,
    schedule,
    status,
    interpretation: interpretApr(apr, rate.value!, status),
    warningMessage,
    currency,
    formattedPeriodicPayment: formatAprMoney(periodicPayment, currency),
    formattedNetProceeds: formatAprMoney(flows.netProceeds, currency),
    formattedAmortizingPrincipal: formatAprMoney(
      flows.amortizingPrincipal,
      currency
    ),
    formattedTotalFees: formatAprMoney(totalFees, currency),
    formattedTotalInterest: formatAprMoney(totalInterest, currency),
    formattedTotalPayments: formatAprMoney(totalPayments, currency),
    formattedTotalFinanceCharges: formatAprMoney(
      totalFinanceCharges,
      currency
    ),
    formattedApr: apr === null ? null : formatAprPercent(apr),
    formattedEar: ear === null ? null : formatAprPercent(ear),
  };

  return {
    isValid: status !== 'solverFailed',
    errors,
    result,
  };
}
