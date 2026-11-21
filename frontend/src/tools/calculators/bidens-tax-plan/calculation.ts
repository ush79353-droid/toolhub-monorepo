import {
  ADDITIONAL_STD_AGED_MARRIED,
  ADDITIONAL_STD_AGED_UNMARRIED,
  AFP_CTC_AGES_6_TO_17,
  AFP_CTC_UNDER_6,
  AFP_FIRST_PHASEOUT_THRESHOLD,
  BASELINE_BRACKETS,
  BASELINE_CTC_PER_CHILD,
  BIDEN_BRACKETS,
  CTC_PHASEOUT_PER_STEP,
  CTC_PHASEOUT_STEP,
  ODC_PER_DEPENDENT,
  STANDARD_DEDUCTION,
  TCJA_PHASEOUT_THRESHOLD,
  type Bracket,
} from './historical-params';
import type { FilingStatus } from './types';

export interface BidensTaxPlanCalcInput {
  age: number | null;
  agi: number;
  filingStatus: FilingStatus;
  childrenUnder6: number;
  children6to17: number;
  dependents: number;
}

export interface BidensTaxPlanCalcOutput {
  baselineTaxUsd: number;
  bidenTaxUsd: number;
  baselineEffectiveRatePct: number | null;
  bidenEffectiveRatePct: number | null;
  baselineTaxableIncome: number;
  bidenTaxableIncome: number;
  baselineTaxBeforeCredits: number;
  bidenTaxBeforeCredits: number;
  baselineCredits: number;
  bidenCtcCredit: number;
  bidenOdcCredit: number;
}

export function formatUsd(amount: number): string {
  const rounded = Math.round(amount);
  const abs = Math.abs(rounded);
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(abs);
  return rounded < 0 ? `-${formatted}` : formatted;
}

export function formatRatePct(rate: number | null): string {
  if (rate === null) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rate);
}

function taxFromBrackets(taxableIncome: number, brackets: readonly Bracket[]): number {
  if (taxableIncome <= 0) return 0;
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.upTo || !Number.isFinite(bracket.upTo)) {
      return bracket.baseTax + (taxableIncome - bracket.from) * bracket.rate;
    }
  }
  const last = brackets[brackets.length - 1]!;
  return last.baseTax + (taxableIncome - last.from) * last.rate;
}

function standardDeduction(filingStatus: FilingStatus, age: number | null): number {
  let deduction = STANDARD_DEDUCTION[filingStatus];
  if (age !== null && age >= 65) {
    deduction +=
      filingStatus === 'married'
        ? ADDITIONAL_STD_AGED_MARRIED
        : ADDITIONAL_STD_AGED_UNMARRIED;
  }
  return deduction;
}

function phaseoutSteps(agi: number, threshold: number): number {
  const excess = Math.max(0, agi - threshold);
  return excess > 0 ? Math.ceil(excess / CTC_PHASEOUT_STEP) : 0;
}

/**
 * Baseline TCJA CTC ($2,000) + ODC ($500), combined second-step phaseout.
 * Nonrefundable — ACTC is not modeled (no earned-income input).
 *
 * Children in the “6 and 17” bucket are treated as under-17 TCJA qualifying
 * children ($2,000). True age-17-only kids would not qualify under TCJA; that
 * within-bucket split is not identifiable from the screenshot inputs.
 */
function baselineCredits(input: {
  agi: number;
  filingStatus: FilingStatus;
  childrenUnder6: number;
  children6to17: number;
  dependents: number;
}): number {
  const qualifyingChildren = input.childrenUnder6 + input.children6to17;
  const gross =
    qualifyingChildren * BASELINE_CTC_PER_CHILD + input.dependents * ODC_PER_DEPENDENT;
  const steps = phaseoutSteps(input.agi, TCJA_PHASEOUT_THRESHOLD[input.filingStatus]);
  const reduction = Math.min(gross, steps * CTC_PHASEOUT_PER_STEP);
  return Math.max(0, gross - reduction);
}

/**
 * AFP / ARP CTC with two-step phaseout + ODC.
 * Returns CTC (refundable under AFP) and ODC (nonrefundable) after phaseouts.
 */
function bidenCredits(input: {
  agi: number;
  filingStatus: FilingStatus;
  childrenUnder6: number;
  children6to17: number;
  dependents: number;
}): { ctc: number; odc: number } {
  const grossCtc =
    input.childrenUnder6 * AFP_CTC_UNDER_6 +
    input.children6to17 * AFP_CTC_AGES_6_TO_17;
  const tcjaFloor =
    (input.childrenUnder6 + input.children6to17) * BASELINE_CTC_PER_CHILD;
  const enhancement = Math.max(0, grossCtc - tcjaFloor);

  const firstSteps = phaseoutSteps(
    input.agi,
    AFP_FIRST_PHASEOUT_THRESHOLD[input.filingStatus]
  );
  const firstReduction = Math.min(enhancement, firstSteps * CTC_PHASEOUT_PER_STEP);
  const ctcAfterFirst = Math.max(tcjaFloor, grossCtc - firstReduction);

  const odcGross = input.dependents * ODC_PER_DEPENDENT;
  const combined = ctcAfterFirst + odcGross;
  const secondSteps = phaseoutSteps(
    input.agi,
    TCJA_PHASEOUT_THRESHOLD[input.filingStatus]
  );
  const secondReduction = Math.min(combined, secondSteps * CTC_PHASEOUT_PER_STEP);

  // Apply second-step reduction to CTC first, then ODC (IRS Schedule 8812 order).
  const ctc = Math.max(0, ctcAfterFirst - secondReduction);
  const odcRemainder = Math.max(0, secondReduction - ctcAfterFirst);
  const odc = Math.max(0, odcGross - odcRemainder);

  return { ctc, odc };
}

function effectiveRate(taxUsd: number, agi: number): number | null {
  if (agi === 0) return null;
  return (taxUsd / agi) * 100;
}

/**
 * Historical Biden tax plan comparison estimate.
 * Returns null for non-finite / invalid numeric inputs.
 */
export function calculateBidensTaxPlan(
  input: BidensTaxPlanCalcInput
): BidensTaxPlanCalcOutput | null {
  const {
    age,
    agi,
    filingStatus,
    childrenUnder6,
    children6to17,
    dependents,
  } = input;

  if (!Number.isFinite(agi) || agi < 0) return null;
  if (age !== null && (!Number.isFinite(age) || age < 0 || age > 120)) return null;
  for (const n of [childrenUnder6, children6to17, dependents]) {
    if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) return null;
  }

  const deduction = standardDeduction(filingStatus, age);
  const taxableIncome = Math.max(0, agi - deduction);

  const baselineTaxBeforeCredits = taxFromBrackets(
    taxableIncome,
    BASELINE_BRACKETS[filingStatus]
  );
  const bidenTaxBeforeCredits = taxFromBrackets(
    taxableIncome,
    BIDEN_BRACKETS[filingStatus]
  );

  const baselineCreditAmount = baselineCredits({
    agi,
    filingStatus,
    childrenUnder6,
    children6to17,
    dependents,
  });
  const { ctc: bidenCtcCredit, odc: bidenOdcCredit } = bidenCredits({
    agi,
    filingStatus,
    childrenUnder6,
    children6to17,
    dependents,
  });

  // Baseline: nonrefundable credits only (ACTC excluded — no earned income).
  const baselineTaxUsd = Math.round(
    Math.max(0, baselineTaxBeforeCredits - baselineCreditAmount)
  );

  // AFP: ODC nonrefundable; CTC fully refundable → net tax may be negative.
  const odcApplied = Math.min(bidenOdcCredit, bidenTaxBeforeCredits);
  const bidenTaxUsd = Math.round(
    bidenTaxBeforeCredits - odcApplied - bidenCtcCredit
  );

  const baselineEffectiveRatePct = effectiveRate(baselineTaxUsd, agi);
  const bidenEffectiveRatePct = effectiveRate(bidenTaxUsd, agi);

  const out: BidensTaxPlanCalcOutput = {
    baselineTaxUsd,
    bidenTaxUsd,
    baselineEffectiveRatePct,
    bidenEffectiveRatePct,
    baselineTaxableIncome: Math.round(taxableIncome),
    bidenTaxableIncome: Math.round(taxableIncome),
    baselineTaxBeforeCredits: Math.round(baselineTaxBeforeCredits),
    bidenTaxBeforeCredits: Math.round(bidenTaxBeforeCredits),
    baselineCredits: Math.round(
      Math.min(baselineCreditAmount, baselineTaxBeforeCredits)
    ),
    bidenCtcCredit: Math.round(bidenCtcCredit),
    bidenOdcCredit: Math.round(odcApplied),
  };

  if (
    ![
      out.baselineTaxUsd,
      out.bidenTaxUsd,
      out.baselineTaxableIncome,
      out.bidenTaxableIncome,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (
    out.baselineEffectiveRatePct !== null &&
    !Number.isFinite(out.baselineEffectiveRatePct)
  ) {
    return null;
  }
  if (
    out.bidenEffectiveRatePct !== null &&
    !Number.isFinite(out.bidenEffectiveRatePct)
  ) {
    return null;
  }

  return out;
}
