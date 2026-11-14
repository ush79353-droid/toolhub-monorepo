import { cashFlowsPerYear, compoundsPerYear, solveDiscountRate, termToYears } from './calculation';
import type {
  DiscountRateFieldErrors,
  DiscountRateInput,
  DiscountRateResult,
} from './types';

function parseField(val: string): number | null {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const num = Number(trimmed.replace(/,/g, ''));
  return Number.isFinite(num) ? num : Number.NaN;
}

export function validateDiscountRateInput(input: DiscountRateInput): {
  isValid: boolean;
  errors: DiscountRateFieldErrors;
  result: DiscountRateResult | null;
} {
  const errors: DiscountRateFieldErrors = {};

  const presentValue = parseField(input.presentValue);
  const futureValue = parseField(input.futureValue);
  const term = parseField(input.term);
  const cashFlow = parseField(input.cashFlow);

  // Cascading blank-until-complete: no errors, no result
  if (
    presentValue === null ||
    futureValue === null ||
    term === null ||
    cashFlow === null
  ) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(presentValue) || presentValue <= 0) {
    errors.presentValue = 'Enter a positive present value.';
  }
  if (Number.isNaN(futureValue) || futureValue < 0) {
    errors.futureValue = 'Enter a valid future value (≥ 0).';
  }
  if (Number.isNaN(term) || term <= 0) {
    errors.term = 'Enter a positive term.';
  }
  if (Number.isNaN(cashFlow) || cashFlow < 0) {
    errors.cashFlow = 'Enter a valid cash flow (≥ 0).';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const termYears = termToYears(term, input.termUnit);
  if (termYears <= 0 || !Number.isFinite(termYears)) {
    errors.term = 'Term must resolve to a positive duration.';
    return { isValid: false, errors, result: null };
  }

  const m = compoundsPerYear(input.compoundFrequency);
  const c = cashFlowsPerYear(input.cashFlowFrequency);
  if (Math.round(termYears * Math.max(m, c)) > 100_000) {
    errors.form = 'Term is too long for the selected frequencies.';
    return { isValid: false, errors, result: null };
  }

  const result = solveDiscountRate({
    presentValue,
    futureValue,
    cashFlow,
    termYears,
    compoundFrequency: input.compoundFrequency,
    cashFlowFrequency: input.cashFlowFrequency,
    cashFlowTiming: input.cashFlowTiming,
  });

  if (!result) {
    errors.form =
      'No valid discount rate for these inputs. Check PV, FV, term, and cash flows.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
