/**
 * Estimated GFR (eGFR) — educational adult equations (ADR-018).
 *
 * Screenshot-first historical outputs (creatinine mode):
 *   CKD-EPI creatinine 2009 (Levey; race coefficient) and MDRD Study equation
 *   (IDMS 175 form with race coefficient).
 *
 * Prompt-authorized current clinical equations (versioned departure):
 *   CKD-EPI 2021 creatinine (race-free) and CKD-EPI 2021 creatinine–cystatin C.
 *   Cystatin-only uses CKD-EPI 2012 cystatin C (no race term).
 *   Combined mode also shows 2012 creatinine–cystatin C (with race) for
 *   historical comparison.
 *
 * Units: Scr mg/dL (µmol/L ÷ 88.4); Scys mg/L; eGFR mL/min/1.73 m².
 * Adult equations — age ≥ 18 years. A single eGFR does not establish CKD chronicity.
 *
 * Sources: Levey et al. Ann Intern Med 2009; Levey et al. Ann Intern Med 1999 /
 * MDRD IDMS re-expression; Inker et al. NEJM 2012; Inker et al. NEJM 2021;
 * NIDDK adult eGFR equations pages.
 */

import type {
  CreatinineUnit,
  EgfrBand,
  EgfrEquationValue,
  Ethnicity,
  GfrEstimatedInput,
  GfrEstimatedResult,
  Sex,
} from './types';

export const SOURCE_NOTE =
  'Adult eGFR (mL/min/1.73 m²): CKD-EPI 2009/2012/2021 and MDRD (175) per published constants. Ethnicity multiplies only historical race-based creatinine equations. Educational only.';

export const DISCLAIMER =
  'Educational kidney-function worksheet — not a diagnosis, staging order, or lab report. A single value does not establish CKD chronicity. Confirm with your clinician and local laboratory reporting.';

/** Conventional µmol/L → mg/dL factor used by clinical eGFR calculators. */
export const UMOL_L_PER_MG_DL = 88.4;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function creatinineToMgDl(
  value: number,
  unit: CreatinineUnit,
): number {
  return unit === 'umol_l' ? value / UMOL_L_PER_MG_DL : value;
}

function isBlack(ethnicity: Ethnicity): boolean {
  return ethnicity === 'black';
}

/** Round display eGFR to 1 decimal (NKF-style teaching calculators). */
export function roundEgfr(value: number): number {
  return Math.round(value * 10) / 10;
}

export function formatEgfr(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  const rounded = roundEgfr(value);
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(rounded);
}

/**
 * CKD-EPI creatinine 2009 (ASR) — Levey et al.
 * eGFR = 141 × min(Scr/κ,1)^α × max(Scr/κ,1)^−1.209 × 0.993^Age
 *        × 1.018 [female] × 1.159 [Black]
 */
export function ckdEpi2009Creatinine(
  ageYears: number,
  sex: Sex,
  ethnicity: Ethnicity,
  scrMgDl: number,
): number {
  const kappa = sex === 'female' ? 0.7 : 0.9;
  const alpha = sex === 'female' ? -0.329 : -0.411;
  const ratio = scrMgDl / kappa;
  let egfr =
    141 *
    Math.pow(Math.min(ratio, 1), alpha) *
    Math.pow(Math.max(ratio, 1), -1.209) *
    Math.pow(0.993, ageYears);
  if (sex === 'female') egfr *= 1.018;
  if (isBlack(ethnicity)) egfr *= 1.159;
  return egfr;
}

/**
 * MDRD Study equation (IDMS-traceable 175 form).
 * eGFR = 175 × Scr^−1.154 × Age^−0.203 × 0.742 [female] × 1.212 [Black]
 */
export function mdrd175(
  ageYears: number,
  sex: Sex,
  ethnicity: Ethnicity,
  scrMgDl: number,
): number {
  let egfr =
    175 *
    Math.pow(scrMgDl, -1.154) *
    Math.pow(ageYears, -0.203);
  if (sex === 'female') egfr *= 0.742;
  if (isBlack(ethnicity)) egfr *= 1.212;
  return egfr;
}

/**
 * CKD-EPI creatinine 2021 (AS, race-free) — Inker et al. / NIDDK.
 * eGFR = 142 × min(Scr/κ,1)^α × max(Scr/κ,1)^−1.200 × 0.9938^Age
 *        × 1.012 [female]
 */
export function ckdEpi2021Creatinine(
  ageYears: number,
  sex: Sex,
  scrMgDl: number,
): number {
  const kappa = sex === 'female' ? 0.7 : 0.9;
  const alpha = sex === 'female' ? -0.241 : -0.302;
  const ratio = scrMgDl / kappa;
  let egfr =
    142 *
    Math.pow(Math.min(ratio, 1), alpha) *
    Math.pow(Math.max(ratio, 1), -1.2) *
    Math.pow(0.9938, ageYears);
  if (sex === 'female') egfr *= 1.012;
  return egfr;
}

/**
 * CKD-EPI cystatin C 2012 — Inker et al.
 * eGFR = 133 × min(Scys/0.8,1)^−0.499 × max(Scys/0.8,1)^−1.328
 *        × 0.996^Age × 0.932 [female]
 */
export function ckdEpi2012Cystatin(
  ageYears: number,
  sex: Sex,
  scysMgL: number,
): number {
  const ratio = scysMgL / 0.8;
  let egfr =
    133 *
    Math.pow(Math.min(ratio, 1), -0.499) *
    Math.pow(Math.max(ratio, 1), -1.328) *
    Math.pow(0.996, ageYears);
  if (sex === 'female') egfr *= 0.932;
  return egfr;
}

/**
 * CKD-EPI creatinine–cystatin C 2012 (ASR) — Inker et al.
 * Uses race coefficient 1.08 when Black.
 */
export function ckdEpi2012CreatinineCystatin(
  ageYears: number,
  sex: Sex,
  ethnicity: Ethnicity,
  scrMgDl: number,
  scysMgL: number,
): number {
  const kappa = sex === 'female' ? 0.7 : 0.9;
  const a1 = sex === 'female' ? -0.248 : -0.207;
  const scrRatio = scrMgDl / kappa;
  const cysRatio = scysMgL / 0.8;
  let egfr =
    135 *
    Math.pow(Math.min(scrRatio, 1), a1) *
    Math.pow(Math.max(scrRatio, 1), -0.601) *
    Math.pow(Math.min(cysRatio, 1), -0.375) *
    Math.pow(Math.max(cysRatio, 1), -0.711) *
    Math.pow(0.995, ageYears);
  if (sex === 'female') egfr *= 0.969;
  if (isBlack(ethnicity)) egfr *= 1.08;
  return egfr;
}

/**
 * CKD-EPI creatinine–cystatin C 2021 (AS, race-free) — Inker et al. / NIDDK.
 */
export function ckdEpi2021CreatinineCystatin(
  ageYears: number,
  sex: Sex,
  scrMgDl: number,
  scysMgL: number,
): number {
  const kappa = sex === 'female' ? 0.7 : 0.9;
  const a1 = sex === 'female' ? -0.219 : -0.144;
  const scrRatio = scrMgDl / kappa;
  const cysRatio = scysMgL / 0.8;
  let egfr =
    135 *
    Math.pow(Math.min(scrRatio, 1), a1) *
    Math.pow(Math.max(scrRatio, 1), -0.544) *
    Math.pow(Math.min(cysRatio, 1), -0.323) *
    Math.pow(Math.max(cysRatio, 1), -0.778) *
    Math.pow(0.9961, ageYears);
  if (sex === 'female') egfr *= 0.963;
  return egfr;
}

/** Screenshot / KDIGO-style eGFR bands (mL/min/1.73 m²). */
export function categorizeEgfr(egfr: number): EgfrBand {
  if (egfr >= 90) return 'normal';
  if (egfr >= 60) return 'mild';
  if (egfr >= 45) return 'mild_moderate';
  if (egfr >= 30) return 'moderate_severe';
  if (egfr >= 15) return 'severe';
  return 'failure';
}

export function bandLabel(band: EgfrBand): string {
  switch (band) {
    case 'normal':
      return '≥ 90 — Normal';
    case 'mild':
      return '60 – 89 — Mildly decreased';
    case 'mild_moderate':
      return '45 – 59 — Mildly to moderately decreased';
    case 'moderate_severe':
      return '30 – 44 — Moderately to severely decreased';
    case 'severe':
      return '15 – 29 — Severely decreased';
    case 'failure':
      return '< 15 — Kidney failure';
  }
}

export const EGFR_BAND_ROWS: readonly {
  band: EgfrBand;
  range: string;
  meaning: string;
}[] = [
  { band: 'normal', range: '≥ 90', meaning: 'Normal' },
  { band: 'mild', range: '60 – 89', meaning: 'Mildly decreased' },
  {
    band: 'mild_moderate',
    range: '45 – 59',
    meaning: 'Mildly to moderately decreased',
  },
  {
    band: 'moderate_severe',
    range: '30 – 44',
    meaning: 'Moderately to severely decreased',
  },
  { band: 'severe', range: '15 – 29', meaning: 'Severely decreased' },
  { band: 'failure', range: '< 15', meaning: 'Kidney failure' },
];

function eq(
  id: string,
  label: string,
  value: number,
  usesRaceCoefficient: boolean,
  note: string,
): EgfrEquationValue {
  const rounded = roundEgfr(value);
  return {
    id,
    label,
    valueMlMin173: rounded,
    formatted: formatEgfr(rounded),
    usesRaceCoefficient,
    note,
  };
}

function emptyResult(
  headline: string,
  detail: string,
): GfrEstimatedResult {
  return {
    equations: [],
    band: null,
    bandLabel: '',
    statusHeadline: headline,
    statusDetail: detail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function calculateGfrEstimated(
  input: GfrEstimatedInput,
): GfrEstimatedResult {
  const age = parseNumber(input.ageYearsText);
  const needsCreatinine =
    input.markerMode === 'creatinine' || input.markerMode === 'both';
  const needsCystatin =
    input.markerMode === 'cystatin' || input.markerMode === 'both';

  const scrRaw = parseNumber(input.creatinineText);
  const cysRaw = parseNumber(input.cystatinText);

  if (age === null) {
    return emptyResult(
      'Enter age and lab markers',
      'Adult eGFR equations need age in years plus the selected serum marker(s). Fields stay blank until you enter values.',
    );
  }

  if (age < 18 || age > 120) {
    return emptyResult(
      'Adult equations only',
      'These CKD-EPI / MDRD equations are for ages 18–120. Pediatric GFR uses different formulas (separate catalog tool).',
    );
  }

  if (needsCreatinine && scrRaw === null) {
    return emptyResult(
      'Enter serum creatinine',
      'Creatinine mode needs a serum creatinine value (mg/dL or µmol/L).',
    );
  }

  if (needsCystatin && cysRaw === null) {
    return emptyResult(
      'Enter serum cystatin C',
      'Cystatin C mode needs a serum cystatin C value in mg/L.',
    );
  }

  const scrMgDl =
    needsCreatinine && scrRaw !== null
      ? creatinineToMgDl(scrRaw, input.creatinineUnit)
      : null;
  const scysMgL = needsCystatin && cysRaw !== null ? cysRaw : null;

  if (scrMgDl !== null && !(scrMgDl > 0)) {
    return emptyResult(
      'Invalid creatinine',
      'Serum creatinine must be greater than zero.',
    );
  }
  if (scysMgL !== null && !(scysMgL > 0)) {
    return emptyResult(
      'Invalid cystatin C',
      'Serum cystatin C must be greater than zero.',
    );
  }

  const equations: EgfrEquationValue[] = [];

  if (input.markerMode === 'creatinine' && scrMgDl !== null) {
    equations.push(
      eq(
        'ckd-epi-2021-cr',
        'CKD-EPI (2021, race-free)',
        ckdEpi2021Creatinine(age, input.sex, scrMgDl),
        false,
        'Current NIDDK/NKF preferred adult creatinine equation — no race coefficient.',
      ),
      eq(
        'ckd-epi-2009-cr',
        'CKD-EPI (2009)',
        ckdEpi2009Creatinine(age, input.sex, input.ethnicity, scrMgDl),
        true,
        'Historical screenshot equation; multiplies by 1.159 when ethnicity is Black.',
      ),
      eq(
        'mdrd-175',
        'MDRD',
        mdrd175(age, input.sex, input.ethnicity, scrMgDl),
        true,
        'IDMS-traceable MDRD (175); multiplies by 1.212 when ethnicity is Black.',
      ),
    );
  } else if (input.markerMode === 'cystatin' && scysMgL !== null) {
    equations.push(
      eq(
        'ckd-epi-2012-cys',
        'CKD-EPI cystatin C (2012)',
        ckdEpi2012Cystatin(age, input.sex, scysMgL),
        false,
        'Adult cystatin C equation — no race coefficient.',
      ),
    );
  } else if (
    input.markerMode === 'both' &&
    scrMgDl !== null &&
    scysMgL !== null
  ) {
    equations.push(
      eq(
        'ckd-epi-2021-cr-cys',
        'CKD-EPI creatinine–cystatin (2021, race-free)',
        ckdEpi2021CreatinineCystatin(age, input.sex, scrMgDl, scysMgL),
        false,
        'Current preferred combined adult equation — no race coefficient.',
      ),
      eq(
        'ckd-epi-2012-cr-cys',
        'CKD-EPI creatinine–cystatin (2012)',
        ckdEpi2012CreatinineCystatin(
          age,
          input.sex,
          input.ethnicity,
          scrMgDl,
          scysMgL,
        ),
        true,
        'Historical combined equation; multiplies by 1.08 when ethnicity is Black.',
      ),
      eq(
        'ckd-epi-2021-cr',
        'CKD-EPI creatinine (2021, race-free)',
        ckdEpi2021Creatinine(age, input.sex, scrMgDl),
        false,
        'Creatinine-only 2021 equation for comparison.',
      ),
      eq(
        'ckd-epi-2012-cys',
        'CKD-EPI cystatin C (2012)',
        ckdEpi2012Cystatin(age, input.sex, scysMgL),
        false,
        'Cystatin-only 2012 equation for comparison.',
      ),
    );
  }

  const primary = equations[0]?.valueMlMin173 ?? null;
  const band = primary != null ? categorizeEgfr(primary) : null;

  return {
    equations,
    band,
    bandLabel: band ? bandLabel(band) : '',
    statusHeadline: 'eGFR results',
    statusDetail:
      primary != null
        ? `Primary estimate ${formatEgfr(primary)} mL/min/1.73 m² (${band ? bandLabel(band) : 'unbanded'}). Historical race-based rows are labeled. A single value does not establish CKD chronicity.`
        : 'No estimate available.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
