import {
  calculateBackEndDTILimit,
  calculateFrontEndDTILimit,
  calculateMaximumHousingBudget,
  calculateMonthlyIncome,
  loanTermToMonths,
  solveAffordableHomePrice,
} from './calculation';
import type {
  HomeAffordabilityFieldErrors,
  HomeAffordabilityInput,
  HomeAffordabilityResult,
} from './types';

export interface HomeAffordabilityValidation {
  isValid: boolean;
  errors: HomeAffordabilityFieldErrors;
  result: HomeAffordabilityResult | null;
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

function optionalNonNeg(
  raw: string,
  label: string,
  errors: HomeAffordabilityFieldErrors,
  key: keyof HomeAffordabilityFieldErrors,
  fallback = 0
): number | null {
  const parsed = parseNumber(raw);
  if (parsed.blank) return fallback;
  if (parsed.invalid || parsed.value === null) {
    errors[key] = `Enter a valid ${label}.`;
    return null;
  }
  if (parsed.value < 0) {
    errors[key] = `${label} must be zero or greater.`;
    return null;
  }
  return parsed.value;
}

function percent0to100(
  raw: string,
  label: string,
  errors: HomeAffordabilityFieldErrors,
  key: keyof HomeAffordabilityFieldErrors,
  required: boolean,
  fallback?: number
): number | null {
  const parsed = parseNumber(raw);
  if (parsed.blank) {
    if (required) {
      errors[key] = `Enter ${label}.`;
      return null;
    }
    return fallback ?? 0;
  }
  if (parsed.invalid || parsed.value === null) {
    errors[key] = `Enter a valid ${label}.`;
    return null;
  }
  if (parsed.value < 0 || parsed.value > 100) {
    errors[key] = `${label} must be between 0% and 100%.`;
    return null;
  }
  return parsed.value;
}

export function validateHomeAffordabilityInput(
  input: HomeAffordabilityInput
): HomeAffordabilityValidation {
  const errors: HomeAffordabilityFieldErrors = {};

  const termParsed = parseNumber(input.loanTermValue);
  if (termParsed.blank) {
    errors.loanTermValue = 'Enter a loan term.';
  } else if (termParsed.invalid || termParsed.value === null) {
    errors.loanTermValue = 'Enter a valid loan term.';
  } else if (termParsed.value <= 0) {
    errors.loanTermValue = 'Loan term must be greater than zero.';
  }

  const rateParsed = parseNumber(input.annualInterestRate);
  if (rateParsed.blank) {
    errors.annualInterestRate = 'Enter an interest rate (0 allowed).';
  } else if (rateParsed.invalid || rateParsed.value === null) {
    errors.annualInterestRate = 'Enter a valid interest rate.';
  } else if (rateParsed.value < 0) {
    errors.annualInterestRate = 'Interest rate cannot be negative.';
  } else if (rateParsed.value > 100) {
    errors.annualInterestRate = 'Interest rate must be 100% or less.';
  }

  let maximumMonthlyPayment: number | null = null;
  let monthlyIncome: number | null = null;
  let monthlyDebt = 0;
  let binding: 'front' | 'back' | 'tie' | 'payment' = 'payment';
  let housingBudget: number | null = null;

  if (input.mode === 'payment') {
    const pay = parseNumber(input.maximumPayment);
    if (pay.blank) {
      errors.maximumPayment = 'Enter a maximum housing payment.';
    } else if (pay.invalid || pay.value === null) {
      errors.maximumPayment = 'Enter a valid maximum payment.';
    } else if (pay.value < 0) {
      errors.maximumPayment = 'Maximum payment cannot be negative.';
    } else {
      maximumMonthlyPayment =
        input.paymentPeriod === 'annual' ? pay.value / 12 : pay.value;
      housingBudget = maximumMonthlyPayment;
      binding = 'payment';
    }

    // Optional income for DTI display only
    const income = parseNumber(input.income);
    if (!income.blank) {
      if (income.invalid || income.value === null || income.value < 0) {
        errors.income = 'Enter a valid nonnegative income.';
      } else {
        monthlyIncome = calculateMonthlyIncome(income.value, input.incomePeriod);
      }
    }
    const debt = optionalNonNeg(
      input.monthlyDebtPayments,
      'monthly debt payments',
      errors,
      'monthlyDebtPayments',
      0
    );
    if (debt !== null) monthlyDebt = debt;
  } else {
    const income = parseNumber(input.income);
    if (income.blank) {
      errors.income = 'Enter household income.';
    } else if (income.invalid || income.value === null) {
      errors.income = 'Enter a valid income.';
    } else if (income.value < 0) {
      errors.income = 'Income cannot be negative.';
    } else {
      monthlyIncome = calculateMonthlyIncome(income.value, input.incomePeriod);
    }

    const debt = optionalNonNeg(
      input.monthlyDebtPayments,
      'monthly debt payments',
      errors,
      'monthlyDebtPayments',
      0
    );
    if (debt !== null) monthlyDebt = debt;

    const front = percent0to100(
      input.frontEndDtiLimit,
      'front-end DTI',
      errors,
      'frontEndDtiLimit',
      true
    );
    const back = percent0to100(
      input.backEndDtiLimit,
      'back-end DTI',
      errors,
      'backEndDtiLimit',
      true
    );

    if (
      monthlyIncome !== null &&
      debt !== null &&
      front !== null &&
      back !== null &&
      !errors.income &&
      !errors.monthlyDebtPayments &&
      !errors.frontEndDtiLimit &&
      !errors.backEndDtiLimit
    ) {
      const frontLimit = calculateFrontEndDTILimit(monthlyIncome, front);
      const backLimit = calculateBackEndDTILimit(monthlyIncome, back, monthlyDebt);
      const max = calculateMaximumHousingBudget(frontLimit, backLimit);
      housingBudget = max.budget;
      binding = max.binding;
      if (housingBudget < 0) {
        errors.form =
          'Existing monthly debts exceed the selected back-end DTI allowance, so no affordable debt-financed housing payment remains under these limits.';
      }
    }
  }

  let downPaymentAmount = 0;
  let downPaymentPercent = 0;
  if (input.downPaymentMode === 'amount') {
    const dp = optionalNonNeg(
      input.downPaymentAmount,
      'down payment',
      errors,
      'downPaymentAmount',
      0
    );
    if (dp !== null) downPaymentAmount = dp;
  } else {
    const pct = percent0to100(
      input.downPaymentPercent,
      'down payment percent',
      errors,
      'downPaymentPercent',
      false,
      0
    );
    if (pct !== null) downPaymentPercent = pct;
  }

  const taxRate = percent0to100(
    input.annualPropertyTaxRate,
    'property tax rate',
    errors,
    'annualPropertyTaxRate',
    false,
    0
  );
  const annualIns = optionalNonNeg(
    input.annualHomeownersInsurance,
    'homeowners insurance',
    errors,
    'annualHomeownersInsurance',
    0
  );
  const hoa = optionalNonNeg(
    input.monthlyHoa,
    'HOA fees',
    errors,
    'monthlyHoa',
    0
  );
  const miRate = percent0to100(
    input.annualMortgageInsuranceRate,
    'mortgage insurance rate',
    errors,
    'annualMortgageInsuranceRate',
    false,
    0
  );

  let closingAmount = 0;
  let closingPercent = 0;
  if (input.closingCostMode === 'amount') {
    const c = optionalNonNeg(
      input.closingCostAmount,
      'closing costs',
      errors,
      'closingCostAmount',
      0
    );
    if (c !== null) closingAmount = c;
  } else if (input.closingCostMode === 'percent') {
    const c = percent0to100(
      input.closingCostPercent,
      'closing cost percent',
      errors,
      'closingCostPercent',
      false,
      0
    );
    if (c !== null) closingPercent = c;
  }

  const termMonths =
    termParsed.value !== null && !termParsed.blank && !errors.loanTermValue
      ? loanTermToMonths(termParsed.value, input.loanTermUnit)
      : null;
  if (
    termParsed.value !== null &&
    !termParsed.blank &&
    !errors.loanTermValue &&
    termMonths === null
  ) {
    errors.loanTermValue = 'Loan term must be greater than zero.';
  }

  if (Object.keys(errors).length > 0 || housingBudget === null || termMonths === null) {
    return { isValid: false, errors, result: null };
  }

  if (
    rateParsed.value === null ||
    taxRate === null ||
    annualIns === null ||
    hoa === null ||
    miRate === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const solved = solveAffordableHomePrice({
    maximumHousingBudget: housingBudget,
    annualInterestRatePercent: rateParsed.value,
    termMonths,
    downPaymentMode: input.downPaymentMode,
    downPaymentAmount,
    downPaymentPercent,
    annualPropertyTaxRatePercent: taxRate,
    annualHomeownersInsurance: annualIns,
    monthlyHoa: hoa,
    annualMortgageInsuranceRatePercent: miRate,
    closingCostMode: input.closingCostMode,
    closingCostAmount: closingAmount,
    closingCostPercent: closingPercent,
    currency: input.currency,
    bindingLimit: binding,
    monthlyIncome,
    monthlyDebt,
  });

  if (!solved.ok) {
    return {
      isValid: false,
      errors: { ...errors, form: solved.reason },
      result: null,
    };
  }

  return { isValid: true, errors, result: solved.result };
}
