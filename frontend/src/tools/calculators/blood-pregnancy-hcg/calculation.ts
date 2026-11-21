/**
 * Educational “when to test” timing for natural conception and IVF transfer.
 * Approximate calendar math only — not lab hCG interpretation or viability judgment.
 */

import { addDaysToIsoDate } from '../loan/calculation';
import type {
  BloodPregnancyHcgInput,
  BloodPregnancyHcgResult,
  EmbryoAgeDays,
  TestSensitivityMiu,
} from './types';

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const DISCLAIMER =
  'Educational timing estimates only — not medical advice, not a lab hCG interpreter, and not a viability assessment. Confirm dates with your clinician and follow the test package insert.';

export function isValidIsoDate(iso: string): boolean {
  const match = ISO_DATE.exec(iso.trim());
  if (!match) return false;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const utc = new Date(Date.UTC(y, m - 1, d));
  return (
    utc.getUTCFullYear() === y &&
    utc.getUTCMonth() === m - 1 &&
    utc.getUTCDate() === d
  );
}

export function formatDisplayDate(isoDate: string): string {
  if (!isValidIsoDate(isoDate)) return isoDate;
  const match = ISO_DATE.exec(isoDate.trim())!;
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  );
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(date);
}

export function parseCycleLength(raw: string): number | 'invalid' {
  const trimmed = raw.trim();
  if (trimmed === '') return 'invalid';
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return 'invalid';
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 20 || value > 45) return 'invalid';
  return Math.round(value);
}

/** Days after ovulation for earliest urine test by labeled sensitivity (educational). */
export function urineDaysAfterOvulation(
  sensitivity: TestSensitivityMiu,
  useSensitivity: boolean,
): number {
  if (!useSensitivity) return 14; // typical missed-period / ~25 mIU/mL
  switch (sensitivity) {
    case '10':
      return 10;
    case '15':
      return 11;
    case '20':
      return 12;
    case '25':
    default:
      return 14;
  }
}

/** Qualitative blood testing is often detectable earlier than urine; educational default +10 DPO. */
export function bloodDaysAfterOvulation(): number {
  return 10;
}

/**
 * IVF clinic beta schedules vary. Educational defaults:
 * day-5 blastocyst → blood +9 / urine +14 from transfer;
 * earlier embryos add (5 − age) days so “equivalent” is closer to a day-5 calendar.
 */
export function ivfBloodDaysAfterTransfer(embryoAge: EmbryoAgeDays): number {
  return 9 + (5 - embryoAge);
}

export function ivfUrineDaysAfterTransfer(
  embryoAge: EmbryoAgeDays,
  sensitivity: TestSensitivityMiu,
  useSensitivity: boolean,
): number {
  const base = 14 + (5 - embryoAge);
  if (!useSensitivity) return base;
  const earlyPull =
    sensitivity === '10' ? 4 : sensitivity === '15' ? 3 : sensitivity === '20' ? 2 : 0;
  return Math.max(ivfBloodDaysAfterTransfer(embryoAge), base - earlyPull);
}

export function suggestOvulationIso(
  lastPeriodIso: string,
  cycleLengthDays: number,
): string {
  return addDaysToIsoDate(lastPeriodIso, cycleLengthDays - 14);
}

export function calculateBloodPregnancyHcg(
  input: BloodPregnancyHcgInput,
): BloodPregnancyHcgResult {
  const cycleParsed = parseCycleLength(input.cycleLengthDaysText);
  const cycleLengthDays = cycleParsed === 'invalid' ? null : cycleParsed;

  let ovulationIso: string | null = null;
  if (input.ovulationManual && isValidIsoDate(input.ovulationIso)) {
    ovulationIso = input.ovulationIso.trim();
  } else if (cycleLengthDays != null && isValidIsoDate(input.lastPeriodIso)) {
    ovulationIso = suggestOvulationIso(input.lastPeriodIso.trim(), cycleLengthDays);
  } else if (isValidIsoDate(input.ovulationIso)) {
    ovulationIso = input.ovulationIso.trim();
  }

  const useSens = input.selectTestSensitivity;
  const naturalReady = ovulationIso != null;
  const naturalUrineIso = naturalReady
    ? addDaysToIsoDate(
        ovulationIso!,
        urineDaysAfterOvulation(input.testSensitivityMiu, useSens),
      )
    : null;
  const naturalBloodIso = naturalReady
    ? addDaysToIsoDate(ovulationIso!, bloodDaysAfterOvulation())
    : null;

  const ivfReady = isValidIsoDate(input.ivfTransferIso);
  const transfer = ivfReady ? input.ivfTransferIso.trim() : null;
  const ivfBloodIso = transfer
    ? addDaysToIsoDate(transfer, ivfBloodDaysAfterTransfer(input.embryoAgeDays))
    : null;
  const ivfUrineIso = transfer
    ? addDaysToIsoDate(
        transfer,
        ivfUrineDaysAfterTransfer(
          input.embryoAgeDays,
          input.testSensitivityMiu,
          useSens,
        ),
      )
    : null;

  const sensitivityNote = useSens
    ? `Urine timing uses an educational ${input.testSensitivityMiu} mIU/mL early-detection assumption. Package inserts differ.`
    : null;

  const parts: string[] = [];
  if (naturalReady && naturalBloodIso && naturalUrineIso) {
    parts.push(
      `Natural conception (approx.): blood test around ${formatDisplayDate(naturalBloodIso)}; urine test around ${formatDisplayDate(naturalUrineIso)}.`,
    );
  }
  if (ivfReady && ivfBloodIso && ivfUrineIso) {
    parts.push(
      `IVF day-${input.embryoAgeDays} transfer (approx.): blood test around ${formatDisplayDate(ivfBloodIso)}; urine test around ${formatDisplayDate(ivfUrineIso)}.`,
    );
  }
  if (parts.length === 0) {
    parts.push(
      'Enter last period (or ovulation) for natural timing, and/or IVF transfer day for clinic-style estimates.',
    );
  }

  return {
    naturalReady,
    ivfReady,
    cycleLengthDays,
    lastPeriodIso: isValidIsoDate(input.lastPeriodIso)
      ? input.lastPeriodIso.trim()
      : null,
    ovulationIso,
    naturalUrineIso,
    naturalBloodIso,
    ivfTransferIso: transfer,
    embryoAgeDays: input.embryoAgeDays,
    ivfUrineIso,
    ivfBloodIso,
    sensitivityNote,
    interpretation: parts.join(' '),
    disclaimer: DISCLAIMER,
  };
}
