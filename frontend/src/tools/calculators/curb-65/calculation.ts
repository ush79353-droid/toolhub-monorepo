/**
 * CURB-65 (Lim et al., Thorax 2003) — pure engine (ADR-018).
 *
 * One point each for:
 *   C — Confusion (new)
 *   U — Urea > 7 mmol/L (BUN > 19 mg/dL; urea mmol/L = BUN_mg/dL ÷ 2.8)
 *   R — Respiratory rate ≥ 30 /min
 *   B — SBP < 90 mmHg OR DBP ≤ 60 mmHg (single point if either/both)
 *   65 — Age ≥ 65 years
 *
 * Educational mortality bands commonly cited for CAP (not a care order).
 */

import type { BunUnit, Curb65Input, Curb65Result } from './types';

export const SOURCE_NOTE =
  'CURB-65 (Lim WS et al., Thorax 2003): confusion; urea >7 mmol/L (BUN >19 mg/dL); RR ≥30; SBP <90 or DBP ≤60 (one point); age ≥65. Educational risk stratification only.';

export const DISCLAIMER =
  'Educational worksheet only — not a diagnosis, admission order, or substitute for clinical judgment. Confirm with local pneumonia pathways.';

/** BUN mg/dL → urea mmol/L factor (÷2.8). */
export const BUN_MG_DL_PER_UREA_MMOL = 2.8;

/** Urea threshold mmol/L (Lim). */
export const UREA_MMOL_THRESHOLD = 7;

/** Equivalent BUN mg/dL threshold: 7 × 2.8 = 19.6 → score when BUN > 19. */
export const BUN_MG_DL_THRESHOLD = UREA_MMOL_THRESHOLD * BUN_MG_DL_PER_UREA_MMOL;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function bunToUreaMmol(value: number, unit: BunUnit): number {
  return unit === 'mmol_l_urea' ? value : value / BUN_MG_DL_PER_UREA_MMOL;
}

export function ureaMmolToDisplay(mmol: number, unit: BunUnit): number {
  return unit === 'mmol_l_urea' ? mmol : mmol * BUN_MG_DL_PER_UREA_MMOL;
}

export function interpretScore(score: number): string {
  if (score <= 1) return 'Low risk (0–1)';
  if (score === 2) return 'Intermediate risk (2)';
  return 'High risk (3–5)';
}

export function calculateCurb65(input: Curb65Input): Curb65Result {
  const empty = {
    score: null,
    points: null,
    bandLabel: null,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (input.confusion === '') {
    return {
      ...empty,
      statusHeadline: 'Enter CURB-65 inputs',
      statusDetail:
        'Set confusion (Yes/No), BUN/urea, respiratory rate, blood pressures, and age.',
    };
  }

  const bunRaw = parseNumber(input.bunText);
  const rr = parseNumber(input.respiratoryRateText);
  const sbp = parseNumber(input.systolicBpText);
  const dbp = parseNumber(input.diastolicBpText);
  const age = parseNumber(input.ageText);

  if (
    bunRaw === null ||
    rr === null ||
    sbp === null ||
    dbp === null ||
    age === null
  ) {
    return {
      ...empty,
      statusHeadline: 'Enter all lab and vital values',
      statusDetail:
        'BUN/urea, respiratory rate, systolic BP, diastolic BP, and age are required. Score stays blank until complete.',
    };
  }

  if (bunRaw < 0 || rr < 0 || sbp < 0 || dbp < 0 || age < 0) {
    return {
      ...empty,
      statusHeadline: 'Invalid values',
      statusDetail: 'All numeric inputs must be non-negative.',
    };
  }

  const ureaMmol = bunToUreaMmol(bunRaw, input.bunUnit);

  const points = {
    confusion: input.confusion === 'yes' ? 1 : 0,
    urea: ureaMmol > UREA_MMOL_THRESHOLD ? 1 : 0,
    respiratory: rr >= 30 ? 1 : 0,
    // Single BP point: SBP < 90 OR DBP ≤ 60
    bloodPressure: sbp < 90 || dbp <= 60 ? 1 : 0,
    age: age >= 65 ? 1 : 0,
  };

  const score =
    points.confusion +
    points.urea +
    points.respiratory +
    points.bloodPressure +
    points.age;

  const band = interpretScore(score);

  return {
    score,
    points,
    bandLabel: band,
    statusHeadline: 'CURB-65 score',
    statusDetail: `Score ${score}/5 — ${band}. C${points.confusion} U${points.urea} R${points.respiratory} B${points.bloodPressure} 65=${points.age}. Educational only.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function formatScore(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return String(value);
}
