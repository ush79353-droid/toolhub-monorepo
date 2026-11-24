/**
 * Drug half-life — first-order elimination engine (ADR-018).
 *
 * Formula (primary PK principle, not a clinical drug table):
 *   remaining = A₀ × 0.5^(t / t½)
 * equivalently A₀ × 2^(−t / t½)
 *
 * The UI lists successive half-life cycles (t = n × t½ for n = 0…CYCLE_COUNT).
 * Sources for the model: Greenblatt DJ, Annu Rev Med 1985; Smith et al., J Med Chem 2018
 * (educational framing — see Omni Drug Half-Life Calculator reference UX).
 */

import type {
  DosageMassUnit,
  DrugHalfLifeCycleRow,
  DrugHalfLifeInput,
  DrugHalfLifeResult,
  HalfLifeTimeUnit,
} from './types';

export const SOURCE_NOTE =
  'First-order elimination: remaining mass = A₀ × 0.5^(t / t½). Educational pharmacokinetics arithmetic — not individualized clinical PK.';

export const DISCLAIMER =
  'Educational estimate only. Does not account for multi-compartment kinetics, active metabolites, renal/hepatic impairment, accumulation, or drug interactions. Not a substitute for clinical judgment or laboratory monitoring.';

export const ASSUMPTIONS =
  'Assumes single-compartment first-order elimination with a constant half-life after a single bolus. No absorption delay, redistribution, or saturation (Michaelis–Menten) kinetics.';

/** Inclusive cycle indices 0…5 → six rows spanning five half-life intervals after dose. */
export const CYCLE_COUNT = 5;

export const MINUTES_PER_UNIT: Record<HalfLifeTimeUnit, number> = {
  min: 1,
  h: 60,
  d: 60 * 24,
};

export const MG_PER_UNIT: Record<DosageMassUnit, number> = {
  mcg: 0.001,
  mg: 1,
  g: 1000,
};

export function parsePositiveNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function timeToMinutes(value: number, unit: HalfLifeTimeUnit): number {
  return value * MINUTES_PER_UNIT[unit];
}

export function minutesToTime(minutes: number, unit: HalfLifeTimeUnit): number {
  return minutes / MINUTES_PER_UNIT[unit];
}

export function massToMg(value: number, unit: DosageMassUnit): number {
  return value * MG_PER_UNIT[unit];
}

export function mgToMass(mg: number, unit: DosageMassUnit): number {
  return mg / MG_PER_UNIT[unit];
}

/**
 * Remaining mass after elapsed time t given half-life t½ (same time basis).
 * Rejects non-positive half-life; returns A₀ when t = 0.
 */
export function remainingMass(
  initialAmount: number,
  elapsedTime: number,
  halfLife: number,
): number {
  if (!(Number.isFinite(initialAmount) && Number.isFinite(elapsedTime) && Number.isFinite(halfLife))) {
    throw new Error('remainingMass requires finite inputs.');
  }
  if (!(halfLife > 0)) {
    throw new Error('Half-life must be positive.');
  }
  if (!(initialAmount >= 0)) {
    throw new Error('Initial amount must be non-negative.');
  }
  if (!(elapsedTime >= 0)) {
    throw new Error('Elapsed time must be non-negative.');
  }
  if (elapsedTime === 0) return initialAmount;
  return initialAmount * Math.pow(0.5, elapsedTime / halfLife);
}

/** Concentration fraction remaining (1 at t=0, 0.25 after two half-lives). */
export function concentrationFraction(elapsedTime: number, halfLife: number): number {
  if (!(halfLife > 0)) {
    throw new Error('Half-life must be positive.');
  }
  if (elapsedTime === 0) return 1;
  return Math.pow(0.5, elapsedTime / halfLife);
}

function emptyResult(
  input: DrugHalfLifeInput,
  headline: string,
  detail: string,
): DrugHalfLifeResult {
  return {
    cycles: [],
    timeUnit: input.halfLifeUnit,
    dosageUnit: input.dosageUnit,
    statusHeadline: headline,
    statusDetail: detail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    assumptions: ASSUMPTIONS,
  };
}

export function calculateDrugHalfLife(input: DrugHalfLifeInput): DrugHalfLifeResult {
  const halfLifeRaw = parsePositiveNumber(input.halfLifeText);
  const dosageRaw = parsePositiveNumber(input.dosageText);

  if (halfLifeRaw === null && dosageRaw === null) {
    return emptyResult(
      input,
      'Enter half-life and dosage',
      'Provide a positive half-life and initial dosage to see remaining mass over successive half-life cycles.',
    );
  }

  if (halfLifeRaw === null) {
    return emptyResult(
      input,
      'Enter half-life',
      'Half-life (t½) is required. Use minutes, hours, or days to match your reference.',
    );
  }

  if (!(halfLifeRaw > 0)) {
    return emptyResult(
      input,
      'Half-life must be positive',
      'Elimination half-life must be greater than zero. Zero or negative values are not valid for first-order decay.',
    );
  }

  if (dosageRaw === null) {
    return emptyResult(
      input,
      'Enter dosage',
      'Enter the initial amount of drug present at administration (A₀).',
    );
  }

  if (!(dosageRaw > 0)) {
    return emptyResult(
      input,
      'Dosage must be positive',
      'Initial dosage must be greater than zero.',
    );
  }

  const cycles: DrugHalfLifeCycleRow[] = [];
  for (let n = 0; n <= CYCLE_COUNT; n += 1) {
    const elapsed = n * halfLifeRaw;
    const remaining = remainingMass(dosageRaw, elapsed, halfLifeRaw);
    const fraction = concentrationFraction(elapsed, halfLifeRaw);
    cycles.push({
      cycleIndex: n,
      elapsedTime: elapsed,
      remainingDosage: remaining,
      concentrationFraction: fraction,
    });
  }

  return {
    cycles,
    timeUnit: input.halfLifeUnit,
    dosageUnit: input.dosageUnit,
    statusHeadline: 'Elimination over half-life cycles',
    statusDetail: `Showing cycles 0–${CYCLE_COUNT} for t½ = ${halfLifeRaw} ${input.halfLifeUnit} and A₀ = ${dosageRaw} ${input.dosageUnit}.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    assumptions: ASSUMPTIONS,
  };
}
