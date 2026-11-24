/**
 * Medicine 3 Times a Day Calculator — pure dosing-interval engine (ADR-018).
 *
 * Around-the-clock modes: interval = 24h / n (2 → 12h, 3 → 8h, q6h → 6h).
 * Four waking-hours: evenly space 4 doses across a fixed 15-hour first-to-last
 * waking window (interval = 15h / 3 = 5h) — Omni educational QID daytime example
 * (e.g. 07:00 → 12:00 → 17:00 → 22:00). Not personal wake/bed inputs.
 *
 * TID on a label is not always q8h; the “3 doses” mode is educational 24÷3 only.
 */

import {
  DOSE_SCHEDULE_MODE_LABELS,
  doseCountForMode,
  type DoseScheduleMode,
  type Medicine3TimesADayInput,
  type Medicine3TimesADayResult,
} from './types';

export const SOURCE_LABEL =
  'Educational clock arithmetic — around-the-clock 24÷n hours; four waking-hours uses a fixed 15-hour first-to-last window.';

export const DISCLAIMER =
  'Educational interval worksheet only. Not a prescription, clinical schedule, or medical advice. Confirm timing with your pharmacist or clinician.';

/** Minutes in a calendar day. */
export const MINUTES_PER_DAY = 24 * 60;

/**
 * Fixed educational waking window (first dose → last dose) for 4× waking-hours.
 * Matches common teaching example 7:00 AM … 10:00 PM (15 hours).
 */
export const WAKING_WINDOW_MINUTES = 15 * 60;

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function parseHhMm(raw: string): number | null {
  const t = raw.trim();
  if (!TIME_RE.test(t)) return null;
  const [h, m] = t.split(':').map((p) => Number(p));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

/** Screenshot-style clock: `07:00 AM`, `03:00 PM`, `12:00 AM`. */
export function formatMinutesOfDay12h(minutesOfDay: number): string {
  const mod =
    ((Math.trunc(minutesOfDay) % MINUTES_PER_DAY) + MINUTES_PER_DAY) %
    MINUTES_PER_DAY;
  const hours24 = Math.floor(mod / 60);
  const minutes = mod % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const hh = String(hours12).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `${hh}:${mm} ${period}`;
}

export function intervalMinutesForMode(mode: DoseScheduleMode): number {
  const n = doseCountForMode(mode);
  if (mode === 'four_waking') {
    return WAKING_WINDOW_MINUTES / (n - 1);
  }
  return MINUTES_PER_DAY / n;
}

export function buildDoseMinutesOfDay(
  firstMinutes: number,
  doseCount: number,
  intervalMinutes: number,
): number[] {
  const out: number[] = [];
  for (let i = 0; i < doseCount; i += 1) {
    const raw = firstMinutes + i * intervalMinutes;
    out.push(
      ((Math.trunc(raw) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY,
    );
  }
  return out;
}

function intervalLabel(minutes: number): string {
  if (minutes % 60 === 0) {
    const h = minutes / 60;
    return `${h} hour${h === 1 ? '' : 's'}`;
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} minutes`;
  return `${h} h ${m} min`;
}

export function calculateMedicine3TimesADay(
  input: Medicine3TimesADayInput,
): Medicine3TimesADayResult | null {
  const first = parseHhMm(input.firstDoseTime);
  if (first == null) return null;

  const mode = input.mode;
  const doseCount = doseCountForMode(mode);
  const intervalMinutes = intervalMinutesForMode(mode);
  if (!Number.isFinite(intervalMinutes) || intervalMinutes <= 0) return null;

  const doseMinutesOfDay = buildDoseMinutesOfDay(
    first,
    doseCount,
    intervalMinutes,
  );
  const formattedDoseTimes = doseMinutesOfDay.map(formatMinutesOfDay12h);

  const modeLabel = DOSE_SCHEDULE_MODE_LABELS[mode];
  const spacingNote =
    mode === 'four_waking'
      ? `four doses evenly across a ${intervalLabel(WAKING_WINDOW_MINUTES)} waking window (first → last)`
      : `around-the-clock every ${intervalLabel(intervalMinutes)} (24 ÷ ${doseCount})`;

  return {
    mode,
    doseCount,
    intervalMinutes,
    doseMinutesOfDay,
    formattedDoseTimes,
    explanation: `${modeLabel}: ${spacingNote}. Schedule: ${formattedDoseTimes.join(' · ')}.`,
    disclaimer: DISCLAIMER,
  };
}
