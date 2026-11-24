/**
 * Protein Calculator — IOM g/kg RDA + AMDR energy shares + ACSM sport bands (ADR-018).
 *
 * General:
 *   - IOM RDA protein g/kg by life stage × body weight
 *   - AMDR protein 10–35% of energy ÷ 4 kcal/g (reuse IIFYM PROTEIN_SHARE / KCAL_PER_G_PROTEIN)
 * Sport (hidden training focus):
 *   - Endurance 1.2–1.4 g/kg; strength/power 1.6–1.7 g/kg; broad athletic 1.2–2.0 g/kg
 *     (ACSM/AND/DC position-stand teaching ranges)
 * Optional maintenance kcal: Mifflin–St Jeor × PAL when Calories is blank.
 * No FX.
 */

import { mifflinStJeorBmrKcal } from '../calorie/calculation';
import { activityById, type ActivityId } from '../calorie/types';
import { KCAL_PER_G_PROTEIN } from '../iifym/calculation';
import { PROTEIN_SHARE } from '../iifym/types';
import type {
  ProteinGPerKgBand,
  ProteinInput,
  ProteinResult,
  ProteinShareRow,
  SportFocus,
} from './types';

export { KCAL_PER_G_PROTEIN, PROTEIN_SHARE };

/** AMDR protein energy shares shown in the results table (IOM 10–35%). */
export const PROTEIN_SHARE_PERCENTS = [10, 15, 20, 25, 30, 35] as const;

/**
 * IOM Dietary Reference Intakes — Recommended Dietary Allowance protein (g/kg/day)
 * by life-stage group (Food and Nutrition Board / National Academies).
 */
export const IOM_RDA_G_PER_KG_BANDS = [
  { minAge: 1, maxAge: 3, gPerKg: 1.05 },
  { minAge: 4, maxAge: 8, gPerKg: 0.95 },
  { minAge: 9, maxAge: 13, gPerKg: 0.95 },
  { minAge: 14, maxAge: 18, gPerKg: 0.85 },
  { minAge: 19, maxAge: 100, gPerKg: 0.8 },
] as const;

/**
 * ACSM teaching g/kg bands for physically active individuals.
 * Broad athletic band matches ACSM/AND/DC joint position stand 1.2–2.0 g/kg.
 * Endurance / strength sub-bands are the commonly cited ACSM teaching splits.
 */
export const ACSM_SPORT_BANDS: Record<
  SportFocus,
  { minGPerKg: number; maxGPerKg: number; label: string; sourceLabel: string }
> = {
  endurance: {
    minGPerKg: 1.2,
    maxGPerKg: 1.4,
    label: 'Endurance training',
    sourceLabel: 'ACSM teaching endurance band',
  },
  strength: {
    minGPerKg: 1.6,
    maxGPerKg: 1.7,
    label: 'Strength / power training',
    sourceLabel: 'ACSM teaching strength band',
  },
  athletic: {
    minGPerKg: 1.2,
    maxGPerKg: 2.0,
    label: 'Broad athletic',
    sourceLabel: 'ACSM/AND/DC 1.2–2.0 g/kg',
  },
};

export const SOURCE_NOTE =
  'IOM RDA protein g/kg by life stage; IOM AMDR protein 10–35% of energy at 4 kcal/g; optional Mifflin–St Jeor × PAL; sport bands from ACSM/AND/DC position-stand teaching ranges.';

export const DISCLAIMER =
  'Educational nutrition arithmetic from published IOM/AMDR and ACSM guidance — not individualized medical nutrition therapy.';

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function heightToCm(value: number, unit: 'cm' | 'in'): number {
  return unit === 'cm' ? value : value * IN_TO_CM;
}

export function weightToKg(value: number, unit: 'kg' | 'lb'): number {
  return unit === 'kg' ? value : value * LB_TO_KG;
}

/** IOM RDA g/kg for chronological age, or null outside published bands. */
export function iomRdaGPerKg(ageYears: number): number | null {
  if (!Number.isFinite(ageYears)) return null;
  for (const band of IOM_RDA_G_PER_KG_BANDS) {
    if (ageYears >= band.minAge && ageYears <= band.maxAge) return band.gPerKg;
  }
  return null;
}

/** Protein grams from daily energy and percent share (Atwater 4 kcal/g). */
export function proteinGramsFromKcalAndShare(
  kcalPerDay: number,
  sharePercent: number,
): number {
  return (kcalPerDay * (sharePercent / 100)) / KCAL_PER_G_PROTEIN;
}

export function buildAmdrRows(kcalPerDay: number): ProteinShareRow[] {
  return PROTEIN_SHARE_PERCENTS.map((pct) => {
    const kcal = kcalPerDay * (pct / 100);
    return {
      sharePercent: pct,
      proteinKcalPerDay: kcal,
      proteinGramsPerDay: proteinGramsFromKcalAndShare(kcalPerDay, pct),
    };
  });
}

export function estimateMaintenanceKcal(
  sex: 'male' | 'female',
  ageYears: number,
  heightCm: number,
  weightKg: number,
  activityId: ActivityId,
): number | null {
  const bmr = mifflinStJeorBmrKcal(weightKg, heightCm, ageYears, sex);
  if (bmr == null) return null;
  const activity = activityById(activityId);
  return bmr * activity.pal;
}

export function buildSportBand(
  weightKg: number,
  focus: SportFocus,
): ProteinGPerKgBand {
  const meta = ACSM_SPORT_BANDS[focus];
  return {
    minGPerKg: meta.minGPerKg,
    maxGPerKg: meta.maxGPerKg,
    minGramsPerDay: weightKg * meta.minGPerKg,
    maxGramsPerDay: weightKg * meta.maxGPerKg,
    label: meta.label,
    sourceLabel: meta.sourceLabel,
  };
}

function emptyResult(partial?: Partial<ProteinResult>): ProteinResult {
  return {
    totalKcalPerDay: null,
    tdeeFromProfile: null,
    tdeeSource: null,
    weightKg: null,
    rdaGPerKg: null,
    rdaGramsPerDay: null,
    amdrRows: [],
    sportBand: null,
    statusHeadline: 'Enter profile or calories',
    statusDetail:
      'Fill weight (and age for the IOM g/kg RDA), or enter calories for AMDR protein grams. Switch to Recommendations for sport for ACSM g/kg bands.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateProtein(input: ProteinInput): ProteinResult {
  const age = parseNumber(input.ageYearsText);
  const hRaw = parseNumber(input.heightText);
  const wRaw = parseNumber(input.weightText);
  const kcalOverride = parseNumber(input.caloriesText);

  if (input.ageYearsText.trim() && age !== null && !(age >= 1 && age <= 100)) {
    return emptyResult({
      statusHeadline: 'Invalid age',
      statusDetail:
        'Age must be 1–100 years for IOM life-stage RDA and maintenance estimate.',
    });
  }

  const weightKg =
    wRaw !== null && wRaw > 0 ? weightToKg(wRaw, input.weightUnit) : null;

  let totalKcal: number | null = null;
  let tdeeFromProfile: number | null = null;
  let tdeeSource: string | null = null;

  if (kcalOverride !== null && kcalOverride > 0) {
    totalKcal = kcalOverride;
    tdeeSource = 'Calories field';
  } else if (
    age !== null &&
    hRaw !== null &&
    wRaw !== null &&
    age > 0 &&
    hRaw > 0 &&
    wRaw > 0
  ) {
    const heightCm = heightToCm(hRaw, input.heightUnit);
    const est = estimateMaintenanceKcal(
      input.sex,
      age,
      heightCm,
      weightToKg(wRaw, input.weightUnit),
      input.activityId,
    );
    if (est != null) {
      totalKcal = est;
      tdeeFromProfile = est;
      tdeeSource = 'Mifflin–St Jeor × PAL';
    }
  }

  const amdrRows = totalKcal != null ? buildAmdrRows(totalKcal) : [];

  if (input.mode === 'sport') {
    if (weightKg == null) {
      return emptyResult({
        totalKcalPerDay: totalKcal,
        tdeeFromProfile,
        tdeeSource,
        amdrRows,
        statusHeadline: 'Enter current weight',
        statusDetail:
          'Sport recommendations multiply body weight by ACSM g/kg teaching bands. AMDR rows still appear when calories are available.',
      });
    }

    const sportBand = buildSportBand(weightKg, input.sportFocus);
    const mid =
      amdrRows.find((r) => r.sharePercent === 20) ??
      amdrRows.find((r) => r.sharePercent === PROTEIN_SHARE.min);

    return {
      totalKcalPerDay: totalKcal,
      tdeeFromProfile,
      tdeeSource,
      weightKg,
      rdaGPerKg: null,
      rdaGramsPerDay: null,
      amdrRows,
      sportBand,
      statusHeadline: 'Sport protein targets',
      statusDetail: mid
        ? `${sportBand.label}: ${sportBand.minGPerKg}–${sportBand.maxGPerKg} g/kg → ${sportBand.minGramsPerDay.toLocaleString('en-US', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}–${sportBand.maxGramsPerDay.toLocaleString('en-US', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} g/day. AMDR energy shares shown separately when kcal are known.`
        : `${sportBand.label}: ${sportBand.minGPerKg}–${sportBand.maxGPerKg} g/kg × ${weightKg.toLocaleString('en-US', { maximumFractionDigits: 1 })} kg.`,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  // General recommendations
  let rdaGPerKg: number | null = null;
  let rdaGramsPerDay: number | null = null;
  if (weightKg != null && age !== null) {
    rdaGPerKg = iomRdaGPerKg(age);
    if (rdaGPerKg != null) rdaGramsPerDay = weightKg * rdaGPerKg;
  } else if (weightKg != null && !input.ageYearsText.trim()) {
    // Adult default RDA when age blank but weight present (IOM adult 0.80 g/kg).
    rdaGPerKg = 0.8;
    rdaGramsPerDay = weightKg * rdaGPerKg;
  }

  if (rdaGramsPerDay == null && amdrRows.length === 0) {
    return emptyResult();
  }

  const mid = amdrRows.find((r) => r.sharePercent === 20);
  const parts: string[] = [];
  if (rdaGramsPerDay != null && rdaGPerKg != null) {
    parts.push(
      `IOM RDA ${rdaGPerKg.toFixed(2)} g/kg → ${rdaGramsPerDay.toLocaleString('en-US', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} g/day`,
    );
  }
  if (mid && totalKcal != null) {
    parts.push(
      `${Math.round(totalKcal).toLocaleString('en-US')} kcal/day at 20% protein ≈ ${mid.proteinGramsPerDay.toLocaleString('en-US', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} g/day (4 kcal/g)`,
    );
  }

  return {
    totalKcalPerDay: totalKcal,
    tdeeFromProfile,
    tdeeSource,
    weightKg,
    rdaGPerKg,
    rdaGramsPerDay,
    amdrRows,
    sportBand: null,
    statusHeadline: 'Daily protein targets',
    statusDetail: parts.length
      ? `${parts.join('. ')}.`
      : 'Protein targets from published IOM guidance.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
