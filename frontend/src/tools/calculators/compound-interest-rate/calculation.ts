import {
  periodsPerYear,
  type CompoundInterestRateInput,
  type CompoundInterestRateResult,
} from './types';

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Four decimal places for the annual nominal rate display. */
export function roundRate4(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round((value + Number.EPSILON) * 10_000) / 10_000;
}

function empty(
  input: CompoundInterestRateInput,
  explanation: string
): CompoundInterestRateResult {
  const n = periodsPerYear(input.compounding);
  const termYearsExact = input.termYears + input.termMonths / 12;
  return {
    defined: false,
    explanation,
    initialBalance: input.initialBalance,
    finalBalance: input.finalBalance,
    surplus: roundMoney(input.finalBalance - input.initialBalance),
    compounding: input.compounding,
    periodsPerYear: n,
    termYears: input.termYears,
    termMonths: input.termMonths,
    termYearsExact,
    annualNominalRatePercent: null,
    currency: input.currency,
  };
}

/**
 * Annual nominal rate (%) from compound growth:
 * n × [(FV / PV)^(1 / (n × t)) − 1] × 100
 */
export function solveAnnualNominalRate(
  initialBalance: number,
  finalBalance: number,
  periodsPerYearN: number,
  termYearsExact: number
): number | null {
  if (
    ![initialBalance, finalBalance, periodsPerYearN, termYearsExact].every(Number.isFinite)
  ) {
    return null;
  }
  if (initialBalance <= 0 || finalBalance <= 0) return null;
  if (periodsPerYearN <= 0 || termYearsExact <= 0) return null;

  const ratio = finalBalance / initialBalance;
  if (!Number.isFinite(ratio) || ratio <= 0) return null;

  const exponent = 1 / (periodsPerYearN * termYearsExact);
  if (!Number.isFinite(exponent) || exponent <= 0) return null;

  const growth = ratio ** exponent;
  if (!Number.isFinite(growth) || growth <= 0) return null;

  const rate = periodsPerYearN * (growth - 1) * 100;
  return Number.isFinite(rate) ? rate : null;
}

export function calculateCompoundInterestRate(
  input: CompoundInterestRateInput
): CompoundInterestRateResult {
  const {
    initialBalance,
    finalBalance,
    compounding,
    termYears,
    termMonths,
    currency,
  } = input;

  if (![initialBalance, finalBalance, termYears, termMonths].every(Number.isFinite)) {
    return empty(input, 'Enter finite amounts for every required field.');
  }

  const n = periodsPerYear(compounding);
  const termYearsExact = termYears + termMonths / 12;
  const surplus = roundMoney(finalBalance - initialBalance);

  if (initialBalance <= 0 || finalBalance <= 0) {
    return empty(input, 'Initial and final balances must be greater than zero.');
  }
  if (termYears < 0 || termMonths < 0) {
    return empty(input, 'Term years and months cannot be negative.');
  }
  if (termYearsExact <= 0) {
    return empty(input, 'Term must be greater than zero.');
  }

  const rawRate = solveAnnualNominalRate(
    initialBalance,
    finalBalance,
    n,
    termYearsExact
  );
  if (rawRate === null) {
    return empty(input, 'This combination does not produce a finite interest rate.');
  }

  const annualNominalRatePercent = roundRate4(rawRate);
  if (!Number.isFinite(annualNominalRatePercent)) {
    return empty(input, 'This combination does not produce a finite interest rate.');
  }

  return {
    defined: true,
    explanation: null,
    initialBalance: roundMoney(initialBalance),
    finalBalance: roundMoney(finalBalance),
    surplus,
    compounding,
    periodsPerYear: n,
    termYears,
    termMonths,
    termYearsExact,
    annualNominalRatePercent,
    currency,
  };
}
