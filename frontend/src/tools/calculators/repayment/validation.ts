import {
  calculateEffectivePeriodicRate,
  calculateFixedInstallmentPeriods,
  calculateFixedTermPayment,
  generateAmortizationSchedule,
  formatRepMoney,
  interpretRepayment,
  paymentFrequencyLabel,
  paymentsPerYear,
  compoundingPeriodsPerYear,
  termToPaymentCount,
} from './calculation';
import {
  MAX_SCHEDULE_ROWS,
  type RepaymentFieldErrors,
  type RepaymentInput,
  type RepaymentResult,
} from './types';

export interface RepaymentValidation {
  isValid: boolean;
  errors: RepaymentFieldErrors;
  result: RepaymentResult | null;
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

function parseNonNegInt(
  raw: string,
  allowBlankZero = false
): { value: number | null; blank: boolean; error?: string } {
  if (raw.trim() === '' && allowBlankZero) {
    return { value: 0, blank: false };
  }
  const p = parseNumber(raw);
  if (p.blank) return { value: null, blank: true, error: 'Enter a value.' };
  if (p.invalid || p.value === null) {
    return { value: null, blank: false, error: 'Enter a valid whole number.' };
  }
  if (p.value < 0) {
    return { value: null, blank: false, error: 'Cannot be negative.' };
  }
  if (!Number.isInteger(p.value)) {
    return { value: null, blank: false, error: 'Must be a whole number.' };
  }
  return { value: p.value, blank: false };
}

export function validateRepaymentInput(
  input: RepaymentInput
): RepaymentValidation {
  const errors: RepaymentFieldErrors = {};
  const currency = input.currency;
  let hasFieldError = false;

  const balance = parseNumber(input.loanBalance);
  if (balance.blank) {
    errors.loanBalance = 'Enter the loan balance.';
    hasFieldError = true;
  } else if (balance.invalid || balance.value === null) {
    errors.loanBalance = 'Enter a valid loan balance.';
    hasFieldError = true;
  } else if (balance.value <= 0) {
    errors.loanBalance = 'Loan balance must be greater than zero.';
    hasFieldError = true;
  }

  const rate = parseNumber(input.annualInterestRate);
  if (rate.blank) {
    errors.annualInterestRate = 'Enter the annual interest rate.';
    hasFieldError = true;
  } else if (rate.invalid || rate.value === null) {
    errors.annualInterestRate = 'Enter a valid interest rate.';
    hasFieldError = true;
  } else if (rate.value < 0) {
    errors.annualInterestRate = 'Interest rate cannot be negative.';
    hasFieldError = true;
  } else if (rate.value > 1000) {
    errors.annualInterestRate = 'Interest rate is unrealistically high.';
    hasFieldError = true;
  }

  let years = 0;
  let months = 0;
  let installment: number | null = null;

  if (input.mode === 'fixed-term') {
    const y = parseNonNegInt(input.years);
    if (y.error) {
      errors.years = y.error === 'Enter a value.' ? 'Enter term years.' : y.error;
      hasFieldError = true;
    } else {
      years = y.value!;
    }

    const m = parseNonNegInt(input.months, true);
    if (m.error) {
      errors.months = m.error;
      hasFieldError = true;
    } else if (m.value !== null && m.value > 11) {
      errors.months = 'Months must be 0–11.';
      hasFieldError = true;
    } else {
      months = m.value ?? 0;
    }

    if (!hasFieldError && years * 12 + months <= 0) {
      errors.years = 'Loan term must be greater than zero.';
      hasFieldError = true;
    }
  } else {
    const inst = parseNumber(input.fixedInstallment);
    if (inst.blank) {
      errors.fixedInstallment = 'Enter the fixed installment amount.';
      hasFieldError = true;
    } else if (inst.invalid || inst.value === null) {
      errors.fixedInstallment = 'Enter a valid installment.';
      hasFieldError = true;
    } else if (inst.value <= 0) {
      errors.fixedInstallment = 'Installment must be greater than zero.';
      hasFieldError = true;
    } else {
      installment = inst.value;
    }
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (balance.value === null || rate.value === null) {
    return { isValid: false, errors, result: null };
  }

  const payPerYear = paymentsPerYear(input.paymentFrequency);
  const compoundPerYear = compoundingPeriodsPerYear(input.compounding);
  const periodicRate = calculateEffectivePeriodicRate(
    rate.value,
    input.compounding,
    input.paymentFrequency
  );

  if (periodicRate === null) {
    errors.form = 'Unable to compute the effective interest rate for these frequencies.';
    return { isValid: false, errors, result: null };
  }

  const freqLabel = paymentFrequencyLabel(input.paymentFrequency);
  const warningBase =
    'Constant-rate amortizing estimate. Compounding and payment frequencies are converted to an effective per-period rate. Fees and variable rates are not included. Amounts share one currency label (no FX).';

  if (input.mode === 'fixed-term') {
    const n = termToPaymentCount(years, months, payPerYear);
    if (n === null) {
      errors.form = 'Enter a valid loan term.';
      return { isValid: false, errors, result: null };
    }

    const payment = calculateFixedTermPayment(
      balance.value,
      periodicRate,
      n
    );
    if (payment === null) {
      errors.form = 'Unable to calculate the required installment.';
      return { isValid: false, errors, result: null };
    }

    const built = generateAmortizationSchedule(
      balance.value,
      periodicRate,
      payment,
      n
    );
    if (built === null || built.schedule.length === 0) {
      errors.form = 'Unable to build the amortization schedule.';
      return { isValid: false, errors, result: null };
    }

    const result: RepaymentResult = {
      mode: 'fixed-term',
      paymentAmount: payment,
      numberOfPayments: built.numberOfPayments,
      finalPayment: built.finalPayment,
      totalPrincipal: balance.value,
      totalInterest: built.totalInterest,
      totalRepayment: built.totalRepayment,
      effectivePeriodicRate: periodicRate,
      paymentsPerYear: payPerYear,
      compoundingPeriodsPerYear: compoundPerYear,
      paymentFrequencyLabel: freqLabel,
      schedule: built.schedule,
      nonAmortizing: false,
      nonAmortizingMessage: null,
      currency,
      formattedPayment: formatRepMoney(payment, currency),
      formattedFinalPayment: formatRepMoney(built.finalPayment, currency),
      formattedTotalRepayment: formatRepMoney(built.totalRepayment, currency),
      formattedTotalInterest: formatRepMoney(built.totalInterest, currency),
      formattedPrincipal: formatRepMoney(balance.value, currency),
      interpretation: interpretRepayment(
        payment,
        built.numberOfPayments,
        built.totalInterest,
        freqLabel,
        currency
      ),
      warningMessage: warningBase,
    };
    return { isValid: true, errors, result };
  }

  // Fixed installment mode
  if (installment === null) {
    return { isValid: false, errors, result: null };
  }

  const termCalc = calculateFixedInstallmentPeriods(
    balance.value,
    periodicRate,
    installment
  );

  if (!termCalc.ok) {
    if (termCalc.reason === 'too-low') {
      const msg =
        'The selected installment is too low to repay the loan (payment does not exceed periodic interest). Increase the payment amount.';
      return {
        isValid: false,
        errors: { fixedInstallment: msg, form: msg },
        result: {
          mode: 'fixed-installment',
          paymentAmount: installment,
          numberOfPayments: 0,
          finalPayment: 0,
          totalPrincipal: balance.value,
          totalInterest: 0,
          totalRepayment: 0,
          effectivePeriodicRate: periodicRate,
          paymentsPerYear: payPerYear,
          compoundingPeriodsPerYear: compoundPerYear,
          paymentFrequencyLabel: freqLabel,
          schedule: [],
          nonAmortizing: true,
          nonAmortizingMessage: msg,
          currency,
          formattedPayment: formatRepMoney(installment, currency),
          formattedFinalPayment: formatRepMoney(0, currency),
          formattedTotalRepayment: formatRepMoney(0, currency),
          formattedTotalInterest: formatRepMoney(0, currency),
          formattedPrincipal: formatRepMoney(balance.value, currency),
          interpretation: msg,
          warningMessage: msg,
        },
      };
    }
    errors.form = 'Unable to calculate the repayment term.';
    return { isValid: false, errors, result: null };
  }

  const ceilN = Math.max(1, Math.ceil(termCalc.theoreticalPeriods - 1e-10));
  if (ceilN > MAX_SCHEDULE_ROWS) {
    errors.form = `Repayment would require more than ${MAX_SCHEDULE_ROWS} payments. Increase the installment.`;
    return { isValid: false, errors, result: null };
  }

  const built = generateAmortizationSchedule(
    balance.value,
    periodicRate,
    installment,
    ceilN
  );
  if (built === null || built.schedule.length === 0) {
    errors.form = 'Unable to build the amortization schedule.';
    return { isValid: false, errors, result: null };
  }

  const result: RepaymentResult = {
    mode: 'fixed-installment',
    paymentAmount: installment,
    numberOfPayments: built.numberOfPayments,
    finalPayment: built.finalPayment,
    totalPrincipal: balance.value,
    totalInterest: built.totalInterest,
    totalRepayment: built.totalRepayment,
    effectivePeriodicRate: periodicRate,
    paymentsPerYear: payPerYear,
    compoundingPeriodsPerYear: compoundPerYear,
    paymentFrequencyLabel: freqLabel,
    schedule: built.schedule,
    nonAmortizing: false,
    nonAmortizingMessage: null,
    currency,
    formattedPayment: formatRepMoney(installment, currency),
    formattedFinalPayment: formatRepMoney(built.finalPayment, currency),
    formattedTotalRepayment: formatRepMoney(built.totalRepayment, currency),
    formattedTotalInterest: formatRepMoney(built.totalInterest, currency),
    formattedPrincipal: formatRepMoney(balance.value, currency),
    interpretation: interpretRepayment(
      installment,
      built.numberOfPayments,
      built.totalInterest,
      freqLabel,
      currency
    ),
    warningMessage: warningBase,
  };

  return { isValid: true, errors, result };
}
