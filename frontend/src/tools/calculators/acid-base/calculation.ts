/**
 * Acid–base / anion gap worksheet — educational (ADR-018).
 *
 * Anion gap (screenshot primary result; no potassium term):
 *   AG = Na − Cl − HCO₃   [mEq/L ≡ mmol/L for these monovalent ions]
 *
 * Albumin-corrected AG (Figge et al., Crit Care Med 1998 teaching form):
 *   cAG = AG + 2.5 × (4.0 − albumin_g/dL)
 *
 * ABG framing (when pH, PCO₂, and HCO₃ are all present):
 *   acidemia pH < 7.35; alkalemia pH > 7.45; otherwise normal-range pH
 *   Process from dominant HCO₃ / PCO₂ deviation vs ~24 mEq/L and ~40 mmHg
 *   Metabolic acidosis expected PCO₂ (Winter's): 1.5×HCO₃ + 8 (±2)
 *
 * Prompt fixture: Na 140, Cl 104, HCO₃ 24 → AG 12 with albumin blank.
 */

import type { AcidBaseInput, AcidBaseResult } from './types';

export const SOURCE_NOTE =
  'AG = Na − Cl − HCO₃. Corrected AG = AG + 2.5 × (4.0 − albumin g/dL) (Figge et al. 1998 factor). Winter’s expected PCO₂ for metabolic acidosis ≈ 1.5×HCO₃ + 8. Educational only.';

export const DISCLAIMER =
  'Not a laboratory report or acid–base diagnosis — interpret with clinical context and local reference ranges.';

/** Figge teaching normal albumin (g/dL). */
export const NORMAL_ALBUMIN_G_DL = 4.0;
/** mEq/L per g/dL albumin (Figge ≈ 2.5). */
export const ALBUMIN_CORRECTION_FACTOR = 2.5;

export const NORMAL_PH_LOW = 7.35;
export const NORMAL_PH_HIGH = 7.45;
export const NORMAL_HCO3 = 24;
export const NORMAL_PCO2 = 40;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function anionGap(
  sodium: number,
  chloride: number,
  bicarbonate: number,
): number {
  return sodium - chloride - bicarbonate;
}

export function albuminCorrectedAnionGap(
  gap: number,
  albuminGdl: number,
): number {
  return (
    gap + ALBUMIN_CORRECTION_FACTOR * (NORMAL_ALBUMIN_G_DL - albuminGdl)
  );
}

/** Winter's formula expected PCO₂ (mmHg) for metabolic acidosis. */
export function wintersExpectedPco2(bicarbonate: number): number {
  return 1.5 * bicarbonate + 8;
}

export function formatGap(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return rounded.toFixed(1);
}

export function interpretAbg(
  ph: number,
  pco2: number,
  hco3: number,
): { headline: string; detail: string } {
  const acidemia = ph < NORMAL_PH_LOW;
  const alkalemia = ph > NORMAL_PH_HIGH;
  const phLabel = acidemia
    ? 'Acidemia'
    : alkalemia
      ? 'Alkalemia'
      : 'pH in the usual reference band';

  const hco3Delta = hco3 - NORMAL_HCO3;
  const pco2Delta = pco2 - NORMAL_PCO2;
  const metDom = Math.abs(hco3Delta) >= Math.abs(pco2Delta) * 0.25;
  // ponytail: simple dominance heuristic; upgrade to formal Boston/Winters pathway charts if product expands ABG results

  let process = 'Mixed or indeterminate ABG pattern';
  if (acidemia) {
    if (hco3 < NORMAL_HCO3 && (metDom || pco2 <= NORMAL_PCO2)) {
      process = 'Metabolic acidosis pattern';
    } else if (pco2 > NORMAL_PCO2) {
      process = 'Respiratory acidosis pattern';
    }
  } else if (alkalemia) {
    if (hco3 > NORMAL_HCO3 && (metDom || pco2 >= NORMAL_PCO2)) {
      process = 'Metabolic alkalosis pattern';
    } else if (pco2 < NORMAL_PCO2) {
      process = 'Respiratory alkalosis pattern';
    }
  } else if (hco3 < NORMAL_HCO3 && pco2 < NORMAL_PCO2) {
    process = 'Compensated metabolic acidosis / respiratory alkalosis pattern';
  } else if (hco3 > NORMAL_HCO3 && pco2 > NORMAL_PCO2) {
    process = 'Compensated metabolic alkalosis / respiratory acidosis pattern';
  }

  let detail = `${phLabel} (pH ${ph.toFixed(2)}). ${process}.`;
  if (acidemia && hco3 < NORMAL_HCO3) {
    const expected = wintersExpectedPco2(hco3);
    const low = expected - 2;
    const high = expected + 2;
    const match = pco2 >= low && pco2 <= high;
    detail += ` Winter’s expected PCO₂ ≈ ${expected.toFixed(1)} mmHg (band ${low.toFixed(1)}–${high.toFixed(1)}); measured ${pco2.toFixed(1)} mmHg ${match ? 'matches' : 'differs from'} that teaching band.`;
  }

  return {
    headline: `${phLabel} — ${process}`,
    detail,
  };
}

function emptyResult(partial?: Partial<AcidBaseResult>): AcidBaseResult {
  return {
    anionGap: null,
    correctedAnionGap: null,
    formattedAnionGap: '',
    formattedCorrected: '',
    abgHeadline: '',
    abgDetail: '',
    statusHeadline: 'Enter Na⁺, Cl⁻, and HCO₃⁻ for the anion gap.',
    statusDetail:
      'pH and PCO₂ frame educational ABG context when all three ABG fields are set. Albumin enables the corrected gap.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateAcidBase(input: AcidBaseInput): AcidBaseResult {
  const ph = parseNumber(input.phText);
  const pco2 = parseNumber(input.pco2Text);
  const hco3 = parseNumber(input.bicarbonateText);
  const cl = parseNumber(input.chlorideText);
  const na = parseNumber(input.sodiumText);
  const alb = parseNumber(input.albuminText);

  let abgHeadline = '';
  let abgDetail = '';
  if (ph !== null && pco2 !== null && hco3 !== null) {
    const abg = interpretAbg(ph, pco2, hco3);
    abgHeadline = abg.headline;
    abgDetail = abg.detail;
  }

  if (na === null || cl === null || hco3 === null) {
    return emptyResult({
      abgHeadline,
      abgDetail,
      statusHeadline:
        abgHeadline !== ''
          ? 'ABG framing ready — enter Na⁺ and Cl⁻ for the anion gap.'
          : 'Enter Na⁺, Cl⁻, and HCO₃⁻ for the anion gap.',
      statusDetail:
        abgHeadline !== ''
          ? 'Anion gap still needs sodium and chloride with bicarbonate.'
          : 'pH and PCO₂ frame educational ABG context when all three ABG fields are set. Albumin enables the corrected gap.',
    });
  }

  const ag = anionGap(na, cl, hco3);
  if (!Number.isFinite(ag)) {
    return emptyResult({
      abgHeadline,
      abgDetail,
      statusHeadline: 'Unable to compute anion gap.',
      statusDetail: 'Check that electrolytes are finite numbers.',
    });
  }

  const base: AcidBaseResult = {
    anionGap: ag,
    correctedAnionGap: null,
    formattedAnionGap: formatGap(ag),
    formattedCorrected: '',
    abgHeadline,
    abgDetail,
    statusHeadline: 'Anion gap computed.',
    statusDetail:
      alb === null
        ? 'Enter albumin (g/dL) to apply the Figge correction. Missing albumin does not change the primary AG.'
        : 'Corrected AG uses AG plus the albumin term.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (alb === null) {
    return base;
  }

  if (alb < 0) {
    return {
      ...base,
      statusHeadline: 'Albumin must be non-negative.',
      statusDetail: 'Corrected anion gap withheld.',
    };
  }

  const corrected = albuminCorrectedAnionGap(ag, alb);
  return {
    ...base,
    correctedAnionGap: corrected,
    formattedCorrected: formatGap(corrected),
    statusHeadline: 'Anion gap and albumin-corrected AG computed.',
    statusDetail: `cAG = AG + ${ALBUMIN_CORRECTION_FACTOR} × (${NORMAL_ALBUMIN_G_DL} − albumin).`,
  };
}
