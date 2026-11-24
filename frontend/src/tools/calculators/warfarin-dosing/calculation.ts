/**
 * Warfarin dosing — educational maintenance adjustment (ADR-018).
 *
 * Maintenance % bands: UW Medicine Anticoagulation Services warfarin
 * maintenance dosing nomogram (goal INR 2–3 and 2.5–3.5 columns).
 * https://sites.uw.edu/anticoag/drugs/warfarin/
 *
 * Bleeding pathways: Holbrook et al. ACCP 2012 (Chest 2012;141:e152S–e184S)
 * major-bleeding reversal framing only — no invented PCC milligram orders.
 *
 * Never invent doses outside published percent bands. INR values that fall
 * between published rows (or on an unverified boundary) return incomplete.
 */

import type {
  AdjustmentKind,
  TargetInrRange,
  WarfarinDosingInput,
  WarfarinDosingResult,
} from './types';

export const SOURCE_NOTE =
  'Maintenance % bands: UW Medicine Anticoagulation Services warfarin maintenance nomogram (targets 2–3 and 2.5–3.5). Bleeding pathways: Holbrook et al., ACCP Evidence-Based Management of Anticoagulant Therapy, Chest 2012;141(2 Suppl):e152S–e184S. Educational worksheet only.';

export const DISCLAIMER =
  'Educational anticoagulation worksheet — not a prescription, reversal order, or substitute for anticoagulation-clinic judgment.';

/** Published UW / ACCP citations for tests and UI. */
export const TABLE_SOURCES = {
  uwMedicineMaintenance:
    'UW Medicine Anticoagulation Services — Warfarin maintenance dosing nomogram',
  holbrookAccp2012:
    'Holbrook et al. ACCP 2012 (Chest 2012;141:e152S–e184S) §9.3 major bleeding',
} as const;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Round milligrams once for worksheet display (two decimals). */
export function roundMg(value: number): number {
  return Math.round(value * 100) / 100;
}

function emptyIncomplete(
  detail: string,
  partial: Partial<
    Pick<WarfarinDosingResult, 'inr' | 'weeklyDoseMg' | 'statusHeadline'>
  > = {},
): WarfarinDosingResult {
  return {
    kind: 'incomplete',
    inr: partial.inr ?? null,
    weeklyDoseMg: partial.weeklyDoseMg ?? null,
    adjustedWeeklyLowMg: null,
    adjustedWeeklyHighMg: null,
    adjustedDailyLowMg: null,
    adjustedDailyHighMg: null,
    percentLow: null,
    percentHigh: null,
    statusHeadline: partial.statusHeadline ?? 'Enter INR and total dose',
    statusDetail: detail,
    actionNotes: [],
    recheckNote: '',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

interface MaintenanceBand {
  /** Inclusive lower INR bound; null = open below (use maxExclusive). */
  minInclusive: number | null;
  /** Inclusive upper INR bound; null = open above (use minExclusive). */
  maxInclusive: number | null;
  /** Strict lower bound when row is published as “> x”. */
  minExclusive: number | null;
  /** Strict upper bound when row is published as “< x”. */
  maxExclusive: number | null;
  kind: Exclude<AdjustmentKind, 'incomplete' | 'bleeding_escalation'>;
  percentLow: number | null;
  percentHigh: number | null;
  headline: string;
  detail: string;
  actionNotes: readonly string[];
  recheckNote: string;
}

/**
 * UW Medicine maintenance nomogram — Goal INR 2–3 column.
 * Gaps between published rows are intentional (incomplete).
 */
const BANDS_2_3: readonly MaintenanceBand[] = [
  {
    minInclusive: null,
    maxInclusive: null,
    minExclusive: null,
    maxExclusive: 1.5,
    kind: 'increase',
    percentLow: 10,
    percentHigh: 20,
    headline: 'Below target — consider increase',
    detail:
      'UW Medicine (goal 2–3): INR < 1.5 — if a dosage adjustment is needed, increase maintenance dose by 10%–20%.',
    actionNotes: [
      'Consider a booster dose of 1½–2× the daily maintenance dose.',
      'Consider resumption of the prior maintenance dose if the factor causing the decreased INR is transient (e.g. missed dose).',
    ],
    recheckNote: 'UW monitoring: after a dosage change today, recheck INR within 1–2 weeks.',
  },
  {
    minInclusive: 1.5,
    maxInclusive: 1.7,
    minExclusive: null,
    maxExclusive: null,
    kind: 'increase',
    percentLow: 5,
    percentHigh: 15,
    headline: 'Below target — consider increase',
    detail:
      'UW Medicine (goal 2–3): INR 1.5–1.7 — if a dosage adjustment is needed, increase maintenance dose by 5%–15%.',
    actionNotes: [
      'Consider a booster dose of 1½–2× the daily maintenance dose.',
      'Consider resumption of the prior maintenance dose if the factor causing the decreased INR is transient (e.g. missed dose).',
    ],
    recheckNote: 'UW monitoring: after a dosage change today, recheck INR within 1–2 weeks.',
  },
  {
    minInclusive: 1.8,
    maxInclusive: 1.9,
    minExclusive: null,
    maxExclusive: null,
    kind: 'increase',
    percentLow: 5,
    percentHigh: 10,
    headline: 'Slightly below target — consider increase',
    detail:
      'UW Medicine (goal 2–3): INR 1.8–1.9 — if a dosage adjustment is needed, increase maintenance dose by 5%–10%. No dosage adjustment may be necessary if the last two INRs were in range and the clinician judges thromboembolism risk is not increased.',
    actionNotes: [
      'Consider a booster dose of 1½–2× the daily maintenance dose.',
      'Consider resumption of the prior maintenance dose if the factor causing the decreased INR is transient (e.g. missed dose).',
    ],
    recheckNote: 'UW monitoring: after a dosage change today, recheck INR within 1–2 weeks.',
  },
  {
    minInclusive: 2.0,
    maxInclusive: 3.0,
    minExclusive: null,
    maxExclusive: null,
    kind: 'in_range',
    percentLow: null,
    percentHigh: null,
    headline: 'INR in target range',
    detail:
      'UW Medicine (goal 2–3): INR 2.0–3.0 — desired range; no published percent change to the weekly dose.',
    actionNotes: [],
    recheckNote:
      'UW monitoring: routine follow-up for medically stable & reliable patients every 4–8 weeks (1–2 weeks if unstable/unreliable).',
  },
  {
    minInclusive: 3.1,
    maxInclusive: 3.2,
    minExclusive: null,
    maxExclusive: null,
    kind: 'decrease',
    percentLow: -10,
    percentHigh: -5,
    headline: 'Slightly above target — consider decrease',
    detail:
      'UW Medicine (goal 2–3): INR 3.1–3.2 — if a dosage adjustment is needed, decrease maintenance dose by 5%–10%. No dosage adjustment may be necessary if the last two INRs were in range and hemorrhage risk is not judged increased.',
    actionNotes: [
      'Consider continuation of the prior maintenance dose if the factor causing the elevated INR is transient (e.g. acute alcohol ingestion).',
    ],
    recheckNote: 'UW monitoring: after a dosage change today, recheck INR within 1–2 weeks.',
  },
  {
    minInclusive: 3.3,
    maxInclusive: 3.4,
    minExclusive: null,
    maxExclusive: null,
    kind: 'hold_or_decrease',
    percentLow: -10,
    percentHigh: -5,
    headline: 'Above target — consider hold and decrease',
    detail:
      'UW Medicine (goal 2–3): INR 3.3–3.4 — consider holding ½ to 1 dose; if a dosage adjustment is needed, decrease maintenance dose by 5%–10%.',
    actionNotes: [
      'Consider holding ½ to 1 dose.',
      'Consider resumption of the prior maintenance dose if the factor causing the elevated INR is transient (e.g. acute alcohol ingestion).',
    ],
    recheckNote:
      'UW monitoring: if a dose is held for significant over-anticoagulation, recheck INR in 1–2 days; after a dosage change, within 1–2 weeks.',
  },
  {
    minInclusive: 3.5,
    maxInclusive: 3.9,
    minExclusive: null,
    maxExclusive: null,
    kind: 'hold_or_decrease',
    percentLow: -15,
    percentHigh: -5,
    headline: 'Above target — consider hold and decrease',
    detail:
      'UW Medicine (goal 2–3): INR 3.5–3.9 — consider holding 1 dose; if a dosage adjustment is needed, decrease maintenance dose by 5%–15%.',
    actionNotes: [
      'Consider holding 1 dose.',
      'Consider resumption of the prior maintenance dose if the factor causing the elevated INR is transient (e.g. acute alcohol ingestion).',
    ],
    recheckNote:
      'UW monitoring: if a dose is held for significant over-anticoagulation, recheck INR in 1–2 days; after a dosage change, within 1–2 weeks.',
  },
  {
    minInclusive: null,
    maxInclusive: null,
    minExclusive: 4.0,
    maxExclusive: null,
    kind: 'hold_or_decrease',
    percentLow: -15,
    percentHigh: -5,
    headline: 'Markedly above target — hold and decrease',
    detail:
      'UW Medicine (goal 2–3): INR > 4.0 — hold until INR is below the upper limit of the therapeutic range; if a dosage adjustment is needed, decrease maintenance dose by 5%–15%.',
    actionNotes: [
      'Hold warfarin until INR < upper limit of therapeutic range (3.0 for this target column).',
      'Consider use of mini-dose oral vitamin K (UW Medicine table language).',
      'Consider resumption of the prior maintenance dose if the factor causing the elevated INR is transient (e.g. acute alcohol ingestion).',
      'Holbrook ACCP 2012: for INR 4.5–10 without bleeding, against routine vitamin K; for INR > 10 without bleeding, suggest oral vitamin K — clinic judgment applies.',
    ],
    recheckNote:
      'UW monitoring: if a dose is held for significant over-anticoagulation, recheck INR in 1–2 days; after a dosage change, within 1–2 weeks.',
  },
];

/**
 * UW Medicine maintenance nomogram — Goal INR 2.5–3.5 column.
 * Row “INR 2.0–2.3” is matched before “INR 2.3–2.4”; INR 2.3 therefore
 * uses the 5%–15% increase row (first published match).
 */
const BANDS_2_5_3_5: readonly MaintenanceBand[] = [
  {
    minInclusive: null,
    maxInclusive: null,
    minExclusive: null,
    maxExclusive: 2.0,
    kind: 'increase',
    percentLow: 10,
    percentHigh: 20,
    headline: 'Below target — consider increase',
    detail:
      'UW Medicine (goal 2.5–3.5): INR < 2.0 — if a dosage adjustment is needed, increase maintenance dose by 10%–20%.',
    actionNotes: [
      'Consider a booster dose of 1½–2× the daily maintenance dose.',
      'Consider resumption of the prior maintenance dose if the factor causing the decreased INR is transient (e.g. missed dose).',
    ],
    recheckNote: 'UW monitoring: after a dosage change today, recheck INR within 1–2 weeks.',
  },
  {
    minInclusive: 2.0,
    maxInclusive: 2.3,
    minExclusive: null,
    maxExclusive: null,
    kind: 'increase',
    percentLow: 5,
    percentHigh: 15,
    headline: 'Below target — consider increase',
    detail:
      'UW Medicine (goal 2.5–3.5): INR 2.0–2.3 — if a dosage adjustment is needed, increase maintenance dose by 5%–15%.',
    actionNotes: [
      'Consider a booster dose of 1½–2× the daily maintenance dose.',
      'Consider resumption of the prior maintenance dose if the factor causing the decreased INR is transient (e.g. missed dose).',
    ],
    recheckNote: 'UW monitoring: after a dosage change today, recheck INR within 1–2 weeks.',
  },
  {
    // Published row starts at 2.3; 2.3 already claimed by prior row — match (2.3, 2.4].
    minInclusive: null,
    maxInclusive: 2.4,
    minExclusive: 2.3,
    maxExclusive: null,
    kind: 'increase',
    percentLow: 5,
    percentHigh: 10,
    headline: 'Slightly below target — consider increase',
    detail:
      'UW Medicine (goal 2.5–3.5): INR 2.3–2.4 — if a dosage adjustment is needed, increase maintenance dose by 5%–10%. (INR 2.3 matches the prior 2.0–2.3 row first.)',
    actionNotes: [
      'Consider a booster dose of 1½–2× the daily maintenance dose.',
      'Consider resumption of the prior maintenance dose if the factor causing the decreased INR is transient (e.g. missed dose).',
    ],
    recheckNote: 'UW monitoring: after a dosage change today, recheck INR within 1–2 weeks.',
  },
  {
    minInclusive: 2.5,
    maxInclusive: 3.5,
    minExclusive: null,
    maxExclusive: null,
    kind: 'in_range',
    percentLow: null,
    percentHigh: null,
    headline: 'INR in target range',
    detail:
      'UW Medicine (goal 2.5–3.5): INR 2.5–3.5 — desired range; no published percent change to the weekly dose.',
    actionNotes: [],
    recheckNote:
      'UW monitoring: routine follow-up for medically stable & reliable patients every 4–8 weeks (1–2 weeks if unstable/unreliable).',
  },
  {
    minInclusive: 3.6,
    maxInclusive: 3.7,
    minExclusive: null,
    maxExclusive: null,
    kind: 'decrease',
    percentLow: -10,
    percentHigh: -5,
    headline: 'Slightly above target — consider decrease',
    detail:
      'UW Medicine (goal 2.5–3.5): INR 3.6–3.7 — if a dosage adjustment is needed, decrease maintenance dose by 5%–10%.',
    actionNotes: [
      'Consider continuation of the prior maintenance dose if the factor causing the elevated INR is transient (e.g. acute alcohol ingestion).',
    ],
    recheckNote: 'UW monitoring: after a dosage change today, recheck INR within 1–2 weeks.',
  },
  {
    minInclusive: 3.8,
    maxInclusive: 3.9,
    minExclusive: null,
    maxExclusive: null,
    kind: 'hold_or_decrease',
    percentLow: -10,
    percentHigh: -5,
    headline: 'Above target — consider hold and decrease',
    detail:
      'UW Medicine (goal 2.5–3.5): INR 3.8–3.9 — consider holding ½ to 1 dose; if a dosage adjustment is needed, decrease maintenance dose by 5%–10%.',
    actionNotes: [
      'Consider holding ½ to 1 dose.',
      'Consider resumption of the prior maintenance dose if the factor causing the elevated INR is transient (e.g. acute alcohol ingestion).',
    ],
    recheckNote:
      'UW monitoring: if a dose is held for significant over-anticoagulation, recheck INR in 1–2 days; after a dosage change, within 1–2 weeks.',
  },
  {
    minInclusive: 4.0,
    maxInclusive: 4.4,
    minExclusive: null,
    maxExclusive: null,
    kind: 'hold_or_decrease',
    percentLow: -15,
    percentHigh: -5,
    headline: 'Above target — consider hold and decrease',
    detail:
      'UW Medicine (goal 2.5–3.5): INR 4.0–4.4 — consider holding 1 dose; if a dosage adjustment is needed, decrease maintenance dose by 5%–15%.',
    actionNotes: [
      'Consider holding 1 dose.',
      'Consider resumption of the prior maintenance dose if the factor causing the elevated INR is transient (e.g. acute alcohol ingestion).',
    ],
    recheckNote:
      'UW monitoring: if a dose is held for significant over-anticoagulation, recheck INR in 1–2 days; after a dosage change, within 1–2 weeks.',
  },
  {
    minInclusive: null,
    maxInclusive: null,
    minExclusive: 4.5,
    maxExclusive: null,
    kind: 'hold_or_decrease',
    percentLow: -15,
    percentHigh: -5,
    headline: 'Markedly above target — hold and decrease',
    detail:
      'UW Medicine (goal 2.5–3.5): INR > 4.5 — hold until INR is below the upper limit of the therapeutic range; if a dosage adjustment is needed, decrease maintenance dose by 5%–15%.',
    actionNotes: [
      'Hold warfarin until INR < upper limit of therapeutic range (3.5 for this target column).',
      'Consider use of mini-dose oral vitamin K (UW Medicine table language).',
      'Consider resumption of the prior maintenance dose if the factor causing the elevated INR is transient (e.g. acute alcohol ingestion).',
      'Holbrook ACCP 2012: for INR 4.5–10 without bleeding, against routine vitamin K; for INR > 10 without bleeding, suggest oral vitamin K — clinic judgment applies.',
    ],
    recheckNote:
      'UW monitoring: if a dose is held for significant over-anticoagulation, recheck INR in 1–2 days; after a dosage change, within 1–2 weeks.',
  },
];

function bandMatches(band: MaintenanceBand, inr: number): boolean {
  if (band.maxExclusive != null && !(inr < band.maxExclusive)) return false;
  if (band.minExclusive != null && !(inr > band.minExclusive)) return false;
  if (band.minInclusive != null && !(inr >= band.minInclusive)) return false;
  if (band.maxInclusive != null && !(inr <= band.maxInclusive)) return false;
  // Open-ended rows must have at least one exclusive bound.
  if (
    band.minInclusive == null &&
    band.maxInclusive == null &&
    band.minExclusive == null &&
    band.maxExclusive == null
  ) {
    return false;
  }
  return true;
}

function bandsForTarget(target: TargetInrRange): readonly MaintenanceBand[] {
  return target === '2_3' ? BANDS_2_3 : BANDS_2_5_3_5;
}

/** Exported for tests — first matching published row, or null if gap. */
export function lookupMaintenanceBand(
  inr: number,
  target: TargetInrRange,
): MaintenanceBand | null {
  if (!Number.isFinite(inr)) return null;
  for (const band of bandsForTarget(target)) {
    if (bandMatches(band, inr)) return band;
  }
  return null;
}

function applyPercentBand(
  weeklyMg: number,
  percentLow: number,
  percentHigh: number,
): {
  adjustedWeeklyLowMg: number;
  adjustedWeeklyHighMg: number;
  adjustedDailyLowMg: number;
  adjustedDailyHighMg: number;
} {
  const loPct = Math.min(percentLow, percentHigh);
  const hiPct = Math.max(percentLow, percentHigh);
  const weeklyLow = roundMg(weeklyMg * (1 + loPct / 100));
  const weeklyHigh = roundMg(weeklyMg * (1 + hiPct / 100));
  return {
    adjustedWeeklyLowMg: weeklyLow,
    adjustedWeeklyHighMg: weeklyHigh,
    adjustedDailyLowMg: roundMg(weeklyLow / 7),
    adjustedDailyHighMg: roundMg(weeklyHigh / 7),
  };
}

function bleedingEscalation(
  bleeding: 'serious' | 'life_threatening',
  inr: number | null,
  weeklyDoseMg: number | null,
): WarfarinDosingResult {
  const life = bleeding === 'life_threatening';
  return {
    kind: 'bleeding_escalation',
    inr,
    weeklyDoseMg,
    adjustedWeeklyLowMg: null,
    adjustedWeeklyHighMg: null,
    adjustedDailyLowMg: null,
    adjustedDailyHighMg: null,
    percentLow: null,
    percentHigh: null,
    statusHeadline: life
      ? 'Life-threatening bleeding — emergency escalation'
      : 'Serious bleeding — clinical escalation',
    statusDetail: life
      ? 'Holbrook ACCP 2012: VKA-associated major bleeding — stop warfarin and pursue rapid reversal. Numeric maintenance-dose adjustment is suppressed.'
      : 'Holbrook ACCP 2012: treat as VKA-associated major bleeding pathway — stop warfarin and pursue rapid reversal. Numeric maintenance-dose adjustment is suppressed.',
    actionNotes: [
      'Hold warfarin immediately.',
      'Holbrook ACCP 2012 §9.3: suggest rapid reversal with four-factor PCC rather than plasma (Grade 2C).',
      'Holbrook ACCP 2012 §9.3: suggest vitamin K 5–10 mg by slow IV injection in addition to coagulation-factor reversal (Grade 2C).',
      'This worksheet does not prescribe a PCC product, IU/kg dose, or infusion order — urgent bedside care required.',
    ],
    recheckNote:
      'Urgent clinical evaluation independent of INR. Recheck INR only under treating-team direction after reversal.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

/**
 * Educational maintenance adjustment from published UW Medicine bands.
 * Bleeding serious/life-threatening → ACCP escalation; numeric output suppressed.
 */
export function calculateWarfarinDosing(
  input: WarfarinDosingInput,
): WarfarinDosingResult {
  if (input.bleeding === 'serious' || input.bleeding === 'life_threatening') {
    const inrEarly = parseNumber(input.inrText);
    const doseEarly = parseNumber(input.doseText);
    const weeklyEarly =
      doseEarly != null && doseEarly > 0
        ? input.dosePeriod === 'wk'
          ? doseEarly
          : doseEarly * 7
        : null;
    return bleedingEscalation(
      input.bleeding,
      inrEarly != null && inrEarly > 0 ? inrEarly : null,
      weeklyEarly,
    );
  }

  const inr = parseNumber(input.inrText);
  const dose = parseNumber(input.doseText);

  if (inr === null || dose === null) {
    return emptyIncomplete(
      'Enter current INR and total warfarin dose (mg per week or average mg per day).',
    );
  }

  if (!(inr > 0)) {
    return emptyIncomplete('INR must be greater than zero.');
  }

  if (!(dose > 0)) {
    return emptyIncomplete('Total warfarin dose must be greater than zero.');
  }

  const weeklyDoseMg = roundMg(input.dosePeriod === 'wk' ? dose : dose * 7);
  const band = lookupMaintenanceBand(inr, input.targetRange);

  if (band == null) {
    return emptyIncomplete(
      `No verified UW Medicine maintenance row for INR ${inr} with target ${
        input.targetRange === '2_3' ? '2–3' : '2.5–3.5'
      }. Published table gaps are left incomplete — do not invent a percent band.`,
      {
        inr,
        weeklyDoseMg,
        statusHeadline: 'No published band for this INR',
      },
    );
  }

  if (band.kind === 'in_range') {
    return {
      kind: 'in_range',
      inr,
      weeklyDoseMg,
      adjustedWeeklyLowMg: null,
      adjustedWeeklyHighMg: null,
      adjustedDailyLowMg: null,
      adjustedDailyHighMg: null,
      percentLow: null,
      percentHigh: null,
      statusHeadline: band.headline,
      statusDetail: band.detail,
      actionNotes: band.actionNotes,
      recheckNote: band.recheckNote,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  if (band.percentLow == null || band.percentHigh == null) {
    return emptyIncomplete(
      'Published row has no verifiable percent band for numeric adjustment.',
      { inr, weeklyDoseMg, statusHeadline: 'Incomplete published band' },
    );
  }

  const adjusted = applyPercentBand(
    weeklyDoseMg,
    band.percentLow,
    band.percentHigh,
  );

  return {
    kind: band.kind,
    inr,
    weeklyDoseMg,
    ...adjusted,
    percentLow: Math.min(band.percentLow, band.percentHigh),
    percentHigh: Math.max(band.percentLow, band.percentHigh),
    statusHeadline: band.headline,
    statusDetail: band.detail,
    actionNotes: band.actionNotes,
    recheckNote: band.recheckNote,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
