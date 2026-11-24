/**
 * Tylenol Overdose Calculator — Rumack–Matthew educational engine (ADR-018).
 *
 * Published single-acute oral acetaminophen guidance ONLY — never invent thresholds.
 * No FX. No NAC dosing orders. No safe-at-home determination.
 *
 * Sources (labeled):
 * - Rumack BH, Matthew H. Acetaminophen poisoning and toxicity. Pediatrics.
 *   1975;55(6):871-876. Probable hepatotoxicity line: 200 µg/mL at 4 h,
 *   declining with a 4-hour half-life.
 * - US poison-center / FDA teaching “treatment” (possible toxicity) line:
 *   150 µg/mL at 4 h, same 4-hour half-life slope.
 * - Classic timed window for nomogram interpretation: 4–24 hours after a
 *   single acute oral ingestion with known time.
 * - Unit identity: 1 µg/mL ≡ 1 mg/L for acetaminophen concentration.
 *
 * IV, unknown-time, repeated/chronic, and out-of-window exposures are not
 * scored on this oral nomogram plot. Suspected exposure → emergency / poison
 * center referral regardless of incomplete data.
 */

import type {
  TylenolOverdoseInput,
  TylenolOverdosePathway,
  TylenolOverdoseResult,
} from './types';

/** Classic Rumack–Matthew probable hepatotoxicity line at 4 hours (µg/mL). */
export const PROBABLE_LINE_4H_UG_PER_ML = 200;

/** US treatment / “possible toxicity” line at 4 hours (µg/mL). */
export const TREATMENT_LINE_4H_UG_PER_ML = 150;

/** Published line half-life used by both nomogram lines (hours). */
export const LINE_HALF_LIFE_HOURS = 4;

/** Earliest hour for classic single-acute oral nomogram interpretation. */
export const NOMOGRAM_MIN_HOURS = 4;

/** Latest hour for classic single-acute oral nomogram interpretation. */
export const NOMOGRAM_MAX_HOURS = 24;

/** Acetaminophen molecular weight (g/mol) for µmol/L ↔ µg/mL equivalence checks. */
export const ACETAMINOPHEN_MW_G_PER_MOL = 151.163;

export const LB_PER_KG = 2.2046226218;

export const SOURCE_NOTE =
  'Educational Rumack–Matthew nomogram framing (Rumack BH, Matthew H. Pediatrics. 1975;55(6):871–876 — probable line 200 µg/mL at 4 h; US treatment/possible line 150 µg/mL at 4 h from the multicenter NAC study design, e.g. Rumack et al. Arch Intern Med. 1981;141:380–385; both decline with a 4-hour half-life). Classic timed window 4–24 h. µg/mL ≡ mg/L. IV, unknown-time, and out-of-window exposures are not scored on this plot.';

export const DISCLAIMER =
  'Always double-check the calculations, the dosing information, and the contraindications on the leaflet. Consult your health provider before administering. Educational only — not a diagnosis, treatment order, or safe-at-home determination. In any suspected overdose, contact Poison Control (1-800-222-1222 in the US) or emergency services immediately.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: 'kg' | 'lb'): number {
  return unit === 'kg' ? value : value / LB_PER_KG;
}

/** µg/mL and mg/L are numerically identical for acetaminophen. */
export function ugPerMlToMgPerL(ugPerMl: number): number {
  return ugPerMl;
}

export function mgPerLToUgPerMl(mgPerL: number): number {
  return mgPerL;
}

/** µmol/L → µg/mL using acetaminophen MW 151.163 g/mol. */
export function umolPerLToUgPerMl(umolPerL: number): number {
  return (umolPerL * ACETAMINOPHEN_MW_G_PER_MOL) / 1000;
}

/** µg/mL → µmol/L using acetaminophen MW 151.163 g/mol. */
export function ugPerMlToUmolPerL(ugPerMl: number): number {
  return (ugPerMl * 1000) / ACETAMINOPHEN_MW_G_PER_MOL;
}

/**
 * Nomogram line concentration at `hours` after ingestion.
 * C(t) = C4 × 2^(-(t − 4) / 4)
 */
export function lineConcentrationAtHours(
  hours: number,
  lineAt4hUgPerMl: number,
): number {
  return (
    lineAt4hUgPerMl *
    Math.pow(2, -(hours - NOMOGRAM_MIN_HOURS) / LINE_HALF_LIFE_HOURS)
  );
}

export function treatmentLineAtHours(hours: number): number {
  return lineConcentrationAtHours(hours, TREATMENT_LINE_4H_UG_PER_ML);
}

export function probableLineAtHours(hours: number): number {
  return lineConcentrationAtHours(hours, PROBABLE_LINE_4H_UG_PER_ML);
}

function baseResult(
  partial: Partial<TylenolOverdoseResult> & {
    pathway: TylenolOverdosePathway;
    statusHeadline: string;
    statusDetail: string;
  },
): TylenolOverdoseResult {
  return {
    weightKg: null,
    hoursAfterIngestion: null,
    serumLevelUgPerMl: null,
    treatmentLineUgPerMl: null,
    probableLineUgPerMl: null,
    aboveTreatmentLine: null,
    aboveProbableLine: null,
    emergencyReferralRequired: true,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateTylenolOverdose(
  input: TylenolOverdoseInput,
): TylenolOverdoseResult {
  const weightRaw = parseNumber(input.weightText);
  const weightKg =
    weightRaw !== null && weightRaw > 0
      ? weightToKg(weightRaw, input.weightUnit)
      : null;

  if (input.route === 'iv') {
    return baseResult({
      weightKg,
      pathway: 'iv_ineligible',
      statusHeadline: 'IV pathway — nomogram not applied',
      statusDetail:
        'The Rumack–Matthew oral concentration-vs-time nomogram is not validated for intravenous acetaminophen. Seek immediate poison-center or emergency toxicology guidance. This worksheet never determines that it is safe to stay home.',
    });
  }

  const hours = parseNumber(input.hoursAfterIngestionText);
  const level = parseNumber(input.serumLevelText);

  if (hours === null || level === null) {
    return baseResult({
      weightKg,
      hoursAfterIngestion: hours,
      serumLevelUgPerMl: level,
      pathway: 'incomplete',
      statusHeadline: 'Enter timed oral level data',
      statusDetail:
        'Suspected acetaminophen exposure requires immediate poison-center or emergency evaluation regardless of incomplete fields. The Rumack–Matthew reference plot is shown only for single acute oral ingestions with a serum level drawn in the classic 4–24 hour window.',
    });
  }

  if (!(hours > 0)) {
    throw new Error('Hours after ingestion must be greater than zero.');
  }
  if (!(level >= 0)) {
    throw new Error('Serum level must be zero or greater.');
  }

  if (hours < NOMOGRAM_MIN_HOURS) {
    return baseResult({
      weightKg,
      hoursAfterIngestion: hours,
      serumLevelUgPerMl: level,
      pathway: 'before_window',
      statusHeadline: 'Before the 4-hour nomogram window',
      statusDetail:
        'Serum acetaminophen levels drawn earlier than 4 hours after a single acute oral ingestion are not interpreted on the Rumack–Matthew plot (absorption may still be incomplete). Contact Poison Control or emergency services now — this is not a safe-at-home determination.',
    });
  }

  if (hours > NOMOGRAM_MAX_HOURS) {
    return baseResult({
      weightKg,
      hoursAfterIngestion: hours,
      serumLevelUgPerMl: level,
      pathway: 'after_window',
      statusHeadline: 'Outside the classic 4–24 hour window',
      statusDetail:
        'The classic Rumack–Matthew teaching window for a single acute oral ingestion is 4–24 hours. Later or unknown-time / repeated exposures need poison-center or emergency toxicology pathways — not this oral timed plot. Never treat a blank or late result as safe to stay home.',
    });
  }

  const treatmentLineUgPerMl = treatmentLineAtHours(hours);
  const probableLineUgPerMl = probableLineAtHours(hours);
  const aboveTreatmentLine = level >= treatmentLineUgPerMl;
  const aboveProbableLine = level >= probableLineUgPerMl;

  const comparison = aboveProbableLine
    ? `Entered level ${formatUgPerMl(level)} µg/mL is at or above the probable hepatotoxicity line (${formatUgPerMl(probableLineUgPerMl)} µg/mL) at ${formatHours(hours)} h.`
    : aboveTreatmentLine
      ? `Entered level ${formatUgPerMl(level)} µg/mL is at or above the US treatment line (${formatUgPerMl(treatmentLineUgPerMl)} µg/mL) and below the probable line (${formatUgPerMl(probableLineUgPerMl)} µg/mL) at ${formatHours(hours)} h.`
      : `Entered level ${formatUgPerMl(level)} µg/mL is below the US treatment line (${formatUgPerMl(treatmentLineUgPerMl)} µg/mL) at ${formatHours(hours)} h. This is educational framing only — not clearance to stay home.`;

  return baseResult({
    weightKg,
    hoursAfterIngestion: hours,
    serumLevelUgPerMl: level,
    pathway: 'nomogram_eligible',
    treatmentLineUgPerMl,
    probableLineUgPerMl,
    aboveTreatmentLine,
    aboveProbableLine,
    statusHeadline: aboveProbableLine
      ? 'At/above probable hepatotoxicity line'
      : aboveTreatmentLine
        ? 'At/above US treatment line'
        : 'Below US treatment line (educational)',
    statusDetail: `${comparison} Single acute oral ingestion, classic 4–24 h window. Always contact Poison Control or emergency services for suspected overdose.`,
  });
}

export function formatUgPerMl(n: number): string {
  const f = n.toFixed(1);
  return f.replace(/\.0$/, '');
}

export function formatHours(n: number): string {
  const f = n.toFixed(2);
  return f.replace(/\.?0+$/, '');
}
