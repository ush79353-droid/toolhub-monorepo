import {
  calculateAnnualCashFlow,
  calculateAnnualDebtService,
  calculateCashOnCashReturn,
  calculateEffectiveRentalIncome,
  calculateNetOperatingIncome,
  calculateVacancyLoss,
  formatCashOnCashMoney,
  formatCashOnCashPercent,
} from './calculation';
import type {
  CashOnCashFieldErrors,
  CashOnCashInput,
  CashOnCashResult,
} from './types';

export interface CashOnCashValidation {
  isValid: boolean;
  errors: CashOnCashFieldErrors;
  result: CashOnCashResult | null;
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

/**
 * Validates Cash-on-Cash inputs and computes NOI, debt service, cash flow,
 * and return. Incomplete required fields clear results (no invented zeros).
 */
export function validateCashOnCashInput(
  input: CashOnCashInput
): CashOnCashValidation {
  const errors: CashOnCashFieldErrors = {};

  const investment = parseNumber(input.totalCashInvestment);
  const grossRent = parseNumber(input.grossAnnualRentalIncome);
  const vacancy = parseNumber(input.vacancyRate);
  const expenses = parseNumber(input.annualOperatingExpenses);
  const monthlyLoan = parseNumber(input.monthlyLoanPayment);

  if (
    !investment.blank &&
    (investment.invalid || investment.value === null)
  ) {
    errors.totalCashInvestment = 'Enter a valid cash investment.';
  } else if (investment.value !== null && investment.value < 0) {
    errors.totalCashInvestment = 'Cash investment must be zero or greater.';
  } else if (investment.value === 0) {
    errors.totalCashInvestment =
      'Cash investment must be greater than zero for cash-on-cash return.';
  }

  if (
    !grossRent.blank &&
    (grossRent.invalid || grossRent.value === null)
  ) {
    errors.grossAnnualRentalIncome = 'Enter a valid gross rental income.';
  } else if (grossRent.value !== null && grossRent.value < 0) {
    errors.grossAnnualRentalIncome =
      'Gross rental income must be zero or greater.';
  }

  if (!vacancy.blank && (vacancy.invalid || vacancy.value === null)) {
    errors.vacancyRate = 'Enter a valid vacancy rate.';
  } else if (
    vacancy.value !== null &&
    (vacancy.value < 0 || vacancy.value > 100)
  ) {
    errors.vacancyRate = 'Vacancy rate must be between 0% and 100%.';
  }

  if (
    !expenses.blank &&
    (expenses.invalid || expenses.value === null)
  ) {
    errors.annualOperatingExpenses = 'Enter a valid expense amount.';
  } else if (expenses.value !== null && expenses.value < 0) {
    errors.annualOperatingExpenses = 'Expenses must be zero or greater.';
  }

  if (
    !monthlyLoan.blank &&
    (monthlyLoan.invalid || monthlyLoan.value === null)
  ) {
    errors.monthlyLoanPayment = 'Enter a valid monthly loan payment.';
  } else if (monthlyLoan.value !== null && monthlyLoan.value < 0) {
    errors.monthlyLoanPayment = 'Loan payment must be zero or greater.';
  }

  const coreReady =
    !grossRent.blank &&
    !errors.grossAnnualRentalIncome &&
    !vacancy.blank &&
    !errors.vacancyRate &&
    !expenses.blank &&
    !errors.annualOperatingExpenses &&
    !monthlyLoan.blank &&
    !errors.monthlyLoanPayment;

  if (!coreReady) {
    return { isValid: false, errors, result: null };
  }

  const vacancyLoss = calculateVacancyLoss(
    grossRent.value!,
    vacancy.value!
  );
  if (vacancyLoss === null) {
    errors.form = 'Unable to calculate vacancy loss.';
    return { isValid: false, errors, result: null };
  }

  const effective = calculateEffectiveRentalIncome(
    grossRent.value!,
    vacancyLoss
  );
  if (effective === null) {
    errors.form = 'Unable to calculate effective rental income.';
    return { isValid: false, errors, result: null };
  }

  const noi = calculateNetOperatingIncome(effective, expenses.value!);
  if (noi === null) {
    errors.form = 'Unable to calculate net operating income.';
    return { isValid: false, errors, result: null };
  }

  const annualDebtService = calculateAnnualDebtService(monthlyLoan.value!);
  if (annualDebtService === null) {
    errors.form = 'Unable to calculate annual debt service.';
    return { isValid: false, errors, result: null };
  }

  const annualCashFlow = calculateAnnualCashFlow(noi, annualDebtService);
  if (annualCashFlow === null) {
    errors.form = 'Unable to calculate annual cash flow.';
    return { isValid: false, errors, result: null };
  }

  let cashOnCashReturnPercent: number | null = null;
  if (
    !investment.blank &&
    !errors.totalCashInvestment &&
    investment.value !== null &&
    investment.value > 0
  ) {
    cashOnCashReturnPercent = calculateCashOnCashReturn(
      annualCashFlow,
      investment.value
    );
  }

  const currency = input.currency;
  const result: CashOnCashResult = {
    vacancyLoss,
    effectiveRentalIncome: effective,
    noi,
    annualDebtService,
    annualCashFlow,
    cashOnCashReturnPercent,
    currency,
    formattedVacancyLoss: formatCashOnCashMoney(vacancyLoss, currency),
    formattedEffectiveRentalIncome: formatCashOnCashMoney(effective, currency),
    formattedNoi: formatCashOnCashMoney(noi, currency),
    formattedAnnualDebtService: formatCashOnCashMoney(
      annualDebtService,
      currency
    ),
    formattedAnnualCashFlow: formatCashOnCashMoney(annualCashFlow, currency),
    formattedCashOnCashReturn:
      cashOnCashReturnPercent !== null
        ? formatCashOnCashPercent(cashOnCashReturnPercent)
        : null,
  };

  return { isValid: true, errors, result };
}
