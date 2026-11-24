/**
 * Vitamin D Calculator — pure engine (ADR-018).
 *
 * Two independent tracks (never fused into a treatment dose):
 * 1) Dietary Reference Intake by chronological age (IOM / NIH ODS Table 2).
 * 2) Optional serum 25(OH)D interpretation (NIH ODS Table 1 bands only).
 *
 * Primary sources:
 * - NIH ODS Vitamin D Fact Sheet for Health Professionals (FNB/NASEM DRI;
 *   serum 25(OH)D status Table 1; 1 mcg = 40 IU; 1 ng/mL = 2.5 nmol/L).
 * - Dietary Reference Intakes for Calcium and Vitamin D (IOM 2011) UL table.
 *
 * Reuses mcg↔IU helpers from mcg-to-iu (same NIH ODS factor 0.025 mcg/IU).
 */

import { iuToMcg, mcgToIu } from '../mcg-to-iu/calculation';
import type {
  SerumStatusBand,
  SerumUnit,
  VitaminDDriRow,
  VitaminDInput,
  VitaminDResult,
  VitaminDSerumInterpretation,
} from './types';

/** NIH ODS / FDA: 1 IU vitamin D = 0.025 mcg (1 mcg = 40 IU). */
export const VITAMIN_D_MCG_PER_IU = 0.025;

/** NIH ODS: 1 ng/mL 25(OH)D = 2.5 nmol/L. */
export const NMOL_PER_NG_ML = 2.5;

export const SOURCE_NOTE =
  'NIH ODS Vitamin D (Health Professional): FNB/NASEM DRI Table 2 (AI infants; RDA age 1+); serum 25(OH)D status Table 1; conversions 1 mcg = 40 IU and 1 ng/mL = 2.5 nmol/L. IOM Dietary Reference Intakes for Calcium and Vitamin D (2011) UL table. Educational citation only — not a treatment dose from serum.';

export const DISCLAIMER =
  'Always double-check the calculations, the dosing information, and the contraindications on the leaflet. Consult your health provider before administering any medication or supplements. This tool cannot replace real medical consultation.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function ageToYears(value: number, unit: 'yrs' | 'mo'): number {
  return unit === 'yrs' ? value : value / 12;
}

export function mcgToVitaminDIu(mcg: number): number {
  return mcgToIu(mcg, VITAMIN_D_MCG_PER_IU);
}

export function iuToVitaminDMcg(iu: number): number {
  return iuToMcg(iu, VITAMIN_D_MCG_PER_IU);
}

export function serumToNgPerMl(value: number, unit: SerumUnit): number {
  return unit === 'ng_mL' ? value : value / NMOL_PER_NG_ML;
}

export function ngPerMlToNmol(ngPerMl: number): number {
  return ngPerMl * NMOL_PER_NG_ML;
}

/**
 * IOM / NIH ODS Vitamin D DRI by completed age in years.
 * Pregnancy/lactation rows are not inferred (no status field on screenshot).
 */
export function lookupVitaminDDri(ageYears: number): VitaminDDriRow | null {
  if (!Number.isFinite(ageYears) || ageYears < 0) return null;

  // Birth–6 months: AI 10 mcg (400 IU); UL 25 mcg (1,000 IU)
  if (ageYears < 0.5) {
    return driRow('0–6 months', 'ai', 10, 25);
  }
  // 7–12 months: AI 10 mcg; UL 38 mcg (1,500 IU)
  if (ageYears < 1) {
    return driRow('7–12 months', 'ai', 10, 38);
  }
  // 1–3 years: RDA 15 mcg; UL 63 mcg (2,500 IU)
  if (ageYears < 4) {
    return driRow('1–3 years', 'rda', 15, 63);
  }
  // 4–8 years: RDA 15 mcg; UL 75 mcg (3,000 IU)
  if (ageYears < 9) {
    return driRow('4–8 years', 'rda', 15, 75);
  }
  // 9–70 years: RDA 15 mcg; UL 100 mcg (4,000 IU)
  // NIH ODS Table 2 splits 9–13 / 14–18 / 19–50 / 51–70 — same RDA 15 mcg.
  if (ageYears <= 70) {
    const label =
      ageYears < 14
        ? '9–13 years'
        : ageYears < 19
          ? '14–18 years'
          : ageYears < 51
            ? '19–50 years'
            : '51–70 years';
    return driRow(label, 'rda', 15, 100);
  }
  // >70 years: RDA 20 mcg (800 IU); UL 100 mcg (4,000 IU)
  return driRow('>70 years', 'rda', 20, 100);
}

function driRow(
  lifeStageLabel: string,
  kind: 'ai' | 'rda',
  mcgPerDay: number,
  ulMcgPerDay: number,
): VitaminDDriRow {
  return {
    lifeStageLabel,
    kind,
    mcgPerDay,
    iuPerDay: mcgToVitaminDIu(mcgPerDay),
    ulMcgPerDay,
    ulIuPerDay: mcgToVitaminDIu(ulMcgPerDay),
  };
}

/**
 * NIH ODS Table 1 — serum 25(OH)D status bands (ng/mL thresholds).
 * Does not invent a supplement dose from the lab value.
 */
export function interpretSerum25OhdNgPerMl(
  ngPerMl: number,
): Pick<VitaminDSerumInterpretation, 'band' | 'bandLabel' | 'detail'> {
  if (!(ngPerMl >= 0) || !Number.isFinite(ngPerMl)) {
    return {
      band: 'deficiency_risk',
      bandLabel: 'Invalid',
      detail: 'Serum concentration must be a non-negative finite number.',
    };
  }

  if (ngPerMl < 12) {
    return {
      band: 'deficiency_risk',
      bandLabel: 'Associated with vitamin D deficiency',
      detail:
        'NIH ODS Table 1: <12 ng/mL (<30 nmol/L) is associated with vitamin D deficiency (rickets / osteomalacia risk framing). Not a prescription dose.',
    };
  }
  if (ngPerMl < 20) {
    return {
      band: 'inadequate',
      bandLabel: 'Generally considered inadequate',
      detail:
        'NIH ODS Table 1: 12 to <20 ng/mL (30 to <50 nmol/L) is generally considered inadequate for bone and overall health in healthy individuals.',
    };
  }
  if (ngPerMl <= 50) {
    return {
      band: 'adequate',
      bandLabel: 'Generally considered adequate',
      detail:
        'NIH ODS Table 1: ≥20 ng/mL (≥50 nmol/L) is generally considered adequate for bone and overall health in healthy individuals. Values ≤50 ng/mL stay below the adverse-effects band.',
    };
  }
  return {
    band: 'potential_adverse',
    bandLabel: 'Linked to potential adverse effects',
    detail:
      'NIH ODS Table 1: >50 ng/mL (>125 nmol/L) is linked to potential adverse effects, particularly at >60 ng/mL (>150 nmol/L). This tool does not invent a taper or treatment dose.',
  };
}

export function formatMeasure(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const fixed = value.toFixed(digits);
  return fixed.replace(/\.?0+$/, '');
}

function emptyResult(partial?: Partial<VitaminDResult>): VitaminDResult {
  return {
    ageYears: null,
    dri: null,
    serum: null,
    statusHeadline: 'Enter age',
    statusDetail:
      'Enter chronological age to look up the NIH ODS / IOM vitamin D AI or RDA. Optional serum 25(OH)D uses Table 1 bands only — never a derived treatment dose.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateVitaminD(input: VitaminDInput): VitaminDResult {
  const ageRaw = parseNumber(input.ageText);
  const ageYears =
    ageRaw === null ? null : ageToYears(ageRaw, input.ageUnit);

  const dri =
    ageYears !== null && ageYears >= 0 && ageYears <= 120
      ? lookupVitaminDDri(ageYears)
      : null;

  let serum: VitaminDSerumInterpretation | null = null;
  if (input.serumKnown === 'yes') {
    const serumRaw = parseNumber(input.serumValueText);
    if (serumRaw !== null) {
      const valueNgPerMl = serumToNgPerMl(serumRaw, input.serumUnit);
      const bandInfo = interpretSerum25OhdNgPerMl(valueNgPerMl);
      serum = {
        analyteLabel: '25(OH)D',
        valueNgPerMl,
        valueNmolPerL: ngPerMlToNmol(valueNgPerMl),
        ...bandInfo,
      };
    }
  }

  if (ageYears === null) {
    return emptyResult({
      serum,
      statusHeadline:
        input.serumKnown === 'yes' && !serum
          ? 'Enter age and serum 25(OH)D'
          : 'Enter age',
      statusDetail: serum
        ? `Serum band ready (${serum.bandLabel}). Enter age for the separate DRI lookup.`
        : emptyResult().statusDetail,
    });
  }

  if (!(ageYears >= 0 && ageYears <= 120) || !dri) {
    return emptyResult({
      ageYears,
      serum,
      statusHeadline: 'Age out of DRI table range',
      statusDetail:
        'Use age 0–120 years (or equivalent months) for NIH ODS life-stage rows.',
    });
  }

  const driLine = `${dri.kind.toUpperCase()} ${formatMeasure(dri.mcgPerDay)} mcg/day (${formatMeasure(dri.iuPerDay, 0)} IU) — ${dri.lifeStageLabel}.`;
  const serumLine = serum
    ? ` Serum 25(OH)D ${formatMeasure(serum.valueNgPerMl)} ng/mL (${formatMeasure(serum.valueNmolPerL)} nmol/L): ${serum.bandLabel}.`
    : input.serumKnown === 'yes'
      ? ' Enter serum 25(OH)D to add NIH ODS Table 1 interpretation (separate from DRI).'
      : '';

  return {
    ageYears,
    dri,
    serum,
    statusHeadline: 'Educational vitamin D DRI' + (serum ? ' + serum band' : ''),
    statusDetail: driLine + serumLine,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function serumBandShortLabel(band: SerumStatusBand): string {
  switch (band) {
    case 'deficiency_risk':
      return 'Deficiency risk (<12 ng/mL)';
    case 'inadequate':
      return 'Inadequate (12–<20 ng/mL)';
    case 'adequate':
      return 'Adequate (≥20 ng/mL)';
    case 'potential_adverse':
      return 'Potential adverse (>50 ng/mL)';
  }
}
