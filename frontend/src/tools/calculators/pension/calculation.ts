import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { PensionResult, PensionYearRow } from './types';

/** Project until this age (inclusive end-of-year), or until shortly after depletion. */
export const MAX_AGE = 100;
export const MAX_YEARS = 50;

export interface PensionMathInput {
  retirementAge: number;
  lumpSum: number;
  annualReturnPercent: number;
  monthlyPension: number;
  colaPercent: number;
}

export interface PensionMathResult {
  breakEvenAge: number | null;
  yearsToDepletion: number | null;
  horizonYears: number;
  yearRows: PensionYearRow[];
  summaryMessage: string;
  assumptionNotes: string[];
}

/**
 * Monthly effective rate from annual return:
 * rm = (1 + r)^(1/12) − 1
 */
export function monthlyRateFromAnnualPercent(annualReturnPercent: number): number {
  return Math.pow(1 + annualReturnPercent / 100, 1 / 12) - 1;
}

/**
 * Lump-sum vs COLA pension comparison (monthly cash-flow).
 *
 * Timing (each month):
 * 1. Invested lump sum compounds at the monthly effective return.
 * 2. An amount equal to the current monthly pension is withdrawn (end of month).
 * 3. After every 12 months, the monthly pension steps up by the annual COLA.
 *
 * Break-even age = first age (fractional by month) when the invested balance reaches 0
 * while matching pension withdrawals. Living beyond that age favors the pension stream
 * under these assumptions; dying earlier can favor the lump sum. Not advice.
 */
export function calculatePensionComparison(
  input: PensionMathInput
): PensionMathResult | null {
  const {
    retirementAge,
    lumpSum,
    annualReturnPercent,
    monthlyPension,
    colaPercent,
  } = input;

  if (!Number.isFinite(retirementAge) || retirementAge < 18 || retirementAge > 100) {
    return null;
  }
  if (!Number.isFinite(lumpSum) || lumpSum < 0) return null;
  if (!Number.isFinite(annualReturnPercent) || annualReturnPercent < -99.999) {
    return null;
  }
  if (!Number.isFinite(monthlyPension) || monthlyPension < 0) return null;
  if (!Number.isFinite(colaPercent) || colaPercent < -99.999) return null;

  const rm = monthlyRateFromAnnualPercent(annualReturnPercent);
  if (!Number.isFinite(rm) || rm <= -1) return null;

  const colaFactor = 1 + colaPercent / 100;
  if (!(colaFactor > 0)) return null;

  let balance = lumpSum;
  let payment = monthlyPension;
  let cumulative = 0;
  let breakEvenAge: number | null = null;
  let yearsToDepletion: number | null = null;
  const yearRows: PensionYearRow[] = [];

  const maxYears = Math.min(
    MAX_YEARS,
    Math.max(1, Math.ceil(MAX_AGE - retirementAge))
  );

  // Edge: zero pension — lump sum only grows; no break-even from withdrawals.
  if (monthlyPension === 0) {
    let bal = lumpSum;
    for (let y = 0; y < Math.min(10, maxYears); y++) {
      const annual = 0;
      for (let m = 0; m < 12; m++) {
        bal = bal * (1 + rm);
      }
      yearRows.push({
        yearIndex: y + 1,
        ageEnd: retirementAge + y + 1,
        annualPension: annual,
        cumulativePension: 0,
        remainingLumpSum: bal,
        depletedDuringYear: false,
      });
    }
    return {
      breakEvenAge: null,
      yearsToDepletion: null,
      horizonYears: yearRows.length,
      yearRows,
      summaryMessage:
        'Monthly pension is zero, so there are no pension withdrawals to deplete the lump sum under this comparison.',
      assumptionNotes: baseAssumptions(annualReturnPercent, colaPercent),
    };
  }

  // Edge: zero lump sum — pension-only path; immediately “depleted”.
  if (lumpSum === 0) {
    breakEvenAge = retirementAge;
    yearsToDepletion = 0;
  }

  let depleted = lumpSum === 0;
  let yearsAfterDepletion = 0;

  for (let y = 0; y < maxYears; y++) {
    let annualPension = 0;
    let depletedDuringYear = false;

    for (let m = 0; m < 12; m++) {
      if (!depleted) {
        balance = balance * (1 + rm) - payment;
        if (balance <= 0) {
          balance = 0;
          depleted = true;
          depletedDuringYear = true;
          const monthsElapsed = y * 12 + (m + 1);
          breakEvenAge = retirementAge + monthsElapsed / 12;
          yearsToDepletion = monthsElapsed / 12;
        }
      }
      cumulative += payment;
      annualPension += payment;
    }

    // Annual COLA step-up after each completed year of payments.
    payment *= colaFactor;

    yearRows.push({
      yearIndex: y + 1,
      ageEnd: retirementAge + y + 1,
      annualPension,
      cumulativePension: cumulative,
      remainingLumpSum: Math.max(0, balance),
      depletedDuringYear,
    });

    if (depleted) {
      yearsAfterDepletion += 1;
      // Keep a few years after depletion so cumulative pension growth remains visible.
      if (yearsAfterDepletion >= 5) break;
    }
  }

  const summaryMessage = buildSummary(
    retirementAge,
    breakEvenAge,
    annualReturnPercent,
    colaPercent
  );

  return {
    breakEvenAge,
    yearsToDepletion,
    horizonYears: yearRows.length,
    yearRows,
    summaryMessage,
    assumptionNotes: baseAssumptions(annualReturnPercent, colaPercent),
  };
}

function baseAssumptions(
  annualReturnPercent: number,
  colaPercent: number
): string[] {
  return [
    'Monthly compounding uses rm = (1 + annual return)^(1/12) − 1.',
    'Each month: invested balance grows, then an amount equal to the current monthly pension is withdrawn (end-of-month).',
    `COLA of ${colaPercent}% is applied once per year to the monthly pension after each 12 months of payments.`,
    `Investment return assumption: ${annualReturnPercent}% per year (constant).`,
    'Taxes, fees, survivor benefits, guarantees, employer subsidies, and longevity risk are omitted.',
    'Informational comparison only — not financial, tax, or retirement advice. Neither option is universally better.',
  ];
}

function buildSummary(
  retirementAge: number,
  breakEvenAge: number | null,
  annualReturnPercent: number,
  colaPercent: number
): string {
  if (breakEvenAge === null) {
    return `Under a ${annualReturnPercent}% return and ${colaPercent}% COLA, the invested lump sum still has a remaining balance through the projection horizon when matching pension withdrawals. There is no depletion break-even in this window.`;
  }
  if (breakEvenAge <= retirementAge) {
    return 'With a zero lump sum, matching pension withdrawals have no invested balance to draw from at retirement.';
  }
  const years = breakEvenAge - retirementAge;
  const y = Math.floor(years);
  const months = Math.round((years - y) * 12);
  const ageLabel =
    months === 0
      ? `age ${breakEvenAge.toFixed(0)}`
      : `about age ${Math.floor(breakEvenAge)} (${y} yr ${months} mo after retirement)`;
  return `Matching the COLA-adjusted pension by withdrawing from the invested lump sum depletes the balance at ${ageLabel}. Living longer than that break-even tends to favor the pension stream under these assumptions; dying sooner can favor the lump sum. This is not a recommendation.`;
}

export function roundMoneyAmount(
  amount: number,
  currency: SupportedCurrency
): number {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatPensionMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatBreakEvenAge(age: number | null): string {
  if (age === null) return 'No depletion in horizon';
  const whole = Math.floor(age);
  const months = Math.round((age - whole) * 12);
  if (months === 0 || months === 12) {
    return months === 12 ? `Age ${whole + 1}` : `Age ${whole}`;
  }
  return `Age ${whole} + ${months} mo`;
}

export function toPensionResult(
  math: PensionMathResult,
  input: PensionMathInput,
  currency: SupportedCurrency,
  symbol: string
): PensionResult {
  const money = (n: number) =>
    `${symbol}${formatPensionMoney(roundMoneyAmount(n, currency), currency)}`;

  return {
    retirementAge: input.retirementAge,
    lumpSum: input.lumpSum,
    annualReturnPercent: input.annualReturnPercent,
    monthlyPension: input.monthlyPension,
    colaPercent: input.colaPercent,
    breakEvenAge: math.breakEvenAge,
    breakEvenLabel: formatBreakEvenAge(math.breakEvenAge),
    yearsToDepletion: math.yearsToDepletion,
    horizonYears: math.horizonYears,
    yearRows: math.yearRows.map((row) => ({
      ...row,
      annualPension: roundMoneyAmount(row.annualPension, currency),
      cumulativePension: roundMoneyAmount(row.cumulativePension, currency),
      remainingLumpSum: roundMoneyAmount(row.remainingLumpSum, currency),
    })),
    summaryMessage: math.summaryMessage,
    assumptionNotes: math.assumptionNotes,
    currency,
    formattedLumpSum: money(input.lumpSum),
    formattedMonthlyPension: money(input.monthlyPension),
    formattedBreakEvenBalance:
      math.breakEvenAge === null ? null : money(0),
  };
}
