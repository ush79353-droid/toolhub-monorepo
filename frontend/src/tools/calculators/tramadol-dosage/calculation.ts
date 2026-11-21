/**
 * Tramadol Dosage Calculator — pure engine (ADR-018).
 *
 * Prompt lock: no public prescribing/titration. This tool only converts a
 * clinician-prescribed daily amount ↔ whole extended-release tablet counts
 * (no ER splitting). Educational maximums are shown as ceilings, not starts.
 *
 * Age <17: FDA-style contraindication path (no conversion).
 * Educational maxima (adult oral ER/chronic teaching values; verify label):
 *   chronic, normal organ: 300 mg/day
 *   acute IR teaching max: 400 mg/day (ER strengths still require whole tablets)
 *   organ insufficiency: 200 mg/day educational ceiling (CrCl <30 / cirrhosis
 *     — clinician must individualize; ER often avoided in severe hepatic disease)
 */

import type {
  AgeBand,
  DoseStatus,
  LastEdited,
  PainKind,
  TabletStrengthMg,
  TramadolDosageInput,
  TramadolDosageResult,
} from './types';

export const TABLET_STRENGTHS: readonly TabletStrengthMg[] = [
  100, 150, 200, 300,
];

export const DISCLAIMER =
  'Tramadol is a controlled opioid analgesic. This tool converts a clinician-prescribed daily milligram amount to whole extended-release tablets only — it does not recommend starting doses or titration schedules. Confirm the product label, interactions, and local law. Contact your health provider before use.';

export const TITRATION_BLOCKED_NOTE =
  'Prescribing and titration are intentionally omitted. Enter only a daily amount your clinician already prescribed.';

export const SOURCE_NOTE =
  'Educational adult oral ceilings summarized from product labeling / reviews (chronic ER teaching max ~300 mg/day; acute IR teaching max ~400 mg/day; reduced educational ceiling ~200 mg/day when CrCl <30 mL/min or cirrhosis is flagged). FDA warns against tramadol in children. Always follow the dispensed product leaflet.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function educationalMaxMg(
  ageBand: AgeBand,
  painKind: PainKind,
  organInsufficiency: boolean,
): number | null {
  if (ageBand === 'under_17') return null;
  if (organInsufficiency) return 200;
  if (painKind === 'acute') return 400;
  return 300;
}

export function formatMg(mg: number): string {
  if (!Number.isFinite(mg)) return '';
  return Math.round(mg).toLocaleString('en-US');
}

export function formatTablets(n: number): string {
  if (!Number.isFinite(n)) return '';
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

export function isWholeTabletCount(n: number): boolean {
  return Number.isFinite(n) && n > 0 && Math.abs(n - Math.round(n)) < 1e-9;
}

/**
 * Derive daily mg ↔ tablets from the last-edited field.
 * ER tablets must not be split: daily mg must be an integer multiple of strength.
 */
export function convertPrescribedAmount(
  strength: TabletStrengthMg,
  dailyMgRaw: string,
  tabletsRaw: string,
  lastEdited: LastEdited | null,
): {
  status: Exclude<DoseStatus, 'contraindicated_age' | 'over_max'>;
  dailyMg: number | null;
  tablets: number | null;
  note: string | null;
} {
  const dailyParsed = parseNumber(dailyMgRaw);
  const tabsParsed = parseNumber(tabletsRaw);

  if (lastEdited === 'tablets' || (lastEdited == null && tabletsRaw.trim() !== '' && dailyMgRaw.trim() === '')) {
    if (tabsParsed == null) {
      return { status: 'awaiting', dailyMg: null, tablets: null, note: null };
    }
    if (!isWholeTabletCount(tabsParsed)) {
      return {
        status: 'not_divisible',
        dailyMg: null,
        tablets: tabsParsed,
        note: 'Extended-release tramadol tablets must not be split. Enter a whole number of tablets.',
      };
    }
    const dailyMg = Math.round(tabsParsed) * strength;
    return {
      status: 'ready',
      dailyMg,
      tablets: Math.round(tabsParsed),
      note: null,
    };
  }

  if (dailyParsed == null) {
    return { status: 'awaiting', dailyMg: null, tablets: null, note: null };
  }
  if (!(dailyParsed > 0)) {
    return {
      status: 'awaiting',
      dailyMg: null,
      tablets: null,
      note: 'Daily amount must be greater than zero.',
    };
  }
  if (Math.abs(dailyParsed % strength) > 1e-9) {
    return {
      status: 'not_divisible',
      dailyMg: dailyParsed,
      tablets: null,
      note: `Daily amount must be a whole multiple of the ${strength} mg tablet strength (no ER splitting).`,
    };
  }
  const tablets = dailyParsed / strength;
  return {
    status: 'ready',
    dailyMg: dailyParsed,
    tablets,
    note: null,
  };
}

export function calculateTramadolDosage(
  input: TramadolDosageInput,
): TramadolDosageResult {
  const base: TramadolDosageResult = {
    status: 'awaiting',
    educationalMaxMg: null,
    dailyMg: null,
    tablets: null,
    formattedDailyMg: null,
    formattedTablets: null,
    statusNote: null,
    maxNote: null,
    titrationBlockedNote: TITRATION_BLOCKED_NOTE,
    disclaimer: DISCLAIMER,
    sourceNote: SOURCE_NOTE,
  };

  if (input.ageBand === 'under_17') {
    return {
      ...base,
      status: 'contraindicated_age',
      statusNote:
        'Tramadol is not for patients under 17 in this educational tool (FDA warns against use in children). Ask a clinician about alternatives.',
    };
  }

  const maxMg = educationalMaxMg(
    input.ageBand,
    input.painKind,
    input.organInsufficiency,
  );

  const converted = convertPrescribedAmount(
    input.tabletStrengthMg,
    input.dailyMg,
    input.tablets,
    input.lastEdited,
  );

  let status: DoseStatus = converted.status;
  let statusNote = converted.note;
  let maxNote: string | null = null;

  if (maxMg != null) {
    maxNote = `Educational maximum for the selected scenario: ${formatMg(maxMg)} mg/day.`;
    if (input.ageBand === 'over_75') {
      maxNote += ' Older adults often need lower doses — follow the prescribing clinician.';
    }
    if (input.organInsufficiency) {
      maxNote +=
        ' Kidney/liver insufficiency flagged: extended-release products are often unsuitable; clinician individualization is required.';
    }
  }

  if (
    converted.status === 'ready' &&
    converted.dailyMg != null &&
    maxMg != null &&
    converted.dailyMg > maxMg + 1e-9
  ) {
    status = 'over_max';
    statusNote = `Prescribed amount exceeds the educational ceiling of ${formatMg(maxMg)} mg/day for this scenario. Confirm with the prescribing clinician.`;
  }

  if (converted.status === 'awaiting' && !statusNote) {
    statusNote =
      'Enter a clinician-prescribed daily amount (mg) or a whole tablet count to convert.';
  }

  return {
    ...base,
    status,
    educationalMaxMg: maxMg,
    dailyMg: converted.dailyMg,
    tablets: converted.tablets,
    formattedDailyMg:
      converted.dailyMg != null ? formatMg(converted.dailyMg) : null,
    formattedTablets:
      converted.tablets != null ? formatTablets(converted.tablets) : null,
    statusNote,
    maxNote,
  };
}

export function syncInputFromResult(
  input: TramadolDosageInput,
  result: TramadolDosageResult,
): Pick<TramadolDosageInput, 'dailyMg' | 'tablets'> {
  let dailyMg = input.dailyMg;
  let tablets = input.tablets;
  if (result.dailyMg != null && input.lastEdited !== 'dailyMg') {
    dailyMg = String(Math.round(result.dailyMg));
  }
  if (result.tablets != null && input.lastEdited !== 'tablets') {
    tablets = String(Math.round(result.tablets));
  }
  return { dailyMg, tablets };
}
