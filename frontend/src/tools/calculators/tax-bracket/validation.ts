import { calculateTaxBracket } from './calculation';
import type {
  TaxBracketCalculatorInput,
  TaxBracketFieldErrors,
  TaxBracketCalculatorResult,
  TaxBracketYear,
  TaxBracketFilingStatus,
} from './types';

export interface TaxBracketValidation {
  isValid: boolean;
  errors: TaxBracketFieldErrors;
  result: TaxBracketCalculatorResult | null;
}

const YEARS: readonly TaxBracketYear[] = [2024, 2025, 2026];
const STATUSES: readonly TaxBracketFilingStatus[] = [
  'single',
  'married-joint',
  'married-separate',
  'head-of-household',
  'qualifying-surviving-spouse',
];

function parseMoney(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/^\$/, '');
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

export function validateTaxBracketCalculatorInput(
  input: TaxBracketCalculatorInput
): TaxBracketValidation {
  const errors: TaxBracketFieldErrors = {};

  if (!YEARS.includes(input.taxYear)) {
    errors.form = 'Select a supported tax year (2024–2026).';
  }
  if (!STATUSES.includes(input.filingStatus)) {
    errors.form = 'Select a valid filing status.';
  }

  const income = parseMoney(input.totalTaxableIncome);
  const deductions = parseMoney(input.deductions);

  if (!income.blank && (income.invalid || income.value === null)) {
    errors.totalTaxableIncome = 'Enter a valid income amount.';
  } else if (income.value !== null && income.value < 0) {
    errors.totalTaxableIncome = 'Income must be zero or greater.';
  }

  if (!deductions.blank && (deductions.invalid || deductions.value === null)) {
    errors.deductions = 'Enter a valid deductions amount.';
  } else if (deductions.value !== null && deductions.value < 0) {
    errors.deductions = 'Deductions must be zero or greater.';
  }

  const incomplete =
    income.blank ||
    deductions.blank ||
    Boolean(errors.totalTaxableIncome) ||
    Boolean(errors.deductions) ||
    Boolean(errors.form);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateTaxBracket({
    taxYear: input.taxYear,
    filingStatus: input.filingStatus,
    incomeEntered: income.value!,
    deductions: deductions.value!,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite tax estimate.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
