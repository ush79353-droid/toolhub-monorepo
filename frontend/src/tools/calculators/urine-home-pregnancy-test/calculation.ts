/**
 * Urine Home Pregnancy Test — educational timing (natural + IVF).
 * Reuses blood-pregnancy-hcg calendar helpers; dual sensitivity toggles are independent.
 * Does not interpret a specific urine/blood result or diagnose pregnancy.
 */

import { addDaysToIsoDate } from '../loan/calculation';
import {
  bloodDaysAfterOvulation,
  formatDisplayDate,
  isValidIsoDate,
  ivfBloodDaysAfterTransfer,
  ivfUrineDaysAfterTransfer,
  parseCycleLength,
  suggestOvulationIso,
  urineDaysAfterOvulation,
} from '../blood-pregnancy-hcg/calculation';
import type {
  UrineHomePregnancyTestInput,
  UrineHomePregnancyTestResult,
} from './types';

export {
  bloodDaysAfterOvulation,
  formatDisplayDate,
  isValidIsoDate,
  parseCycleLength,
  suggestOvulationIso,
  urineDaysAfterOvulation,
};

const DISCLAIMER =
  'Educational timing estimates only — not medical advice, not a lab result interpreter, and not a viability assessment. Confirm dates with your clinician and follow the test package insert.';

export function calculateUrineHomePregnancyTest(
  input: UrineHomePregnancyTestInput,
): UrineHomePregnancyTestResult {
  const cycleParsed = parseCycleLength(input.cycleLengthDaysText);
  const cycleLengthDays = cycleParsed === 'invalid' ? null : cycleParsed;

  let ovulationIso: string | null = null;
  if (input.ovulationManual && isValidIsoDate(input.ovulationIso)) {
    ovulationIso = input.ovulationIso.trim();
  } else if (cycleLengthDays != null && isValidIsoDate(input.lastPeriodIso)) {
    ovulationIso = suggestOvulationIso(
      input.lastPeriodIso.trim(),
      cycleLengthDays,
    );
  } else if (isValidIsoDate(input.ovulationIso)) {
    ovulationIso = input.ovulationIso.trim();
  }

  const naturalReady = ovulationIso != null;
  const naturalUrineIso = naturalReady
    ? addDaysToIsoDate(
        ovulationIso!,
        urineDaysAfterOvulation(
          input.naturalSensitivityMiu,
          input.showNaturalSensitivity,
        ),
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
          input.ivfSensitivityMiu,
          input.showIvfSensitivity,
        ),
      )
    : null;

  const notes: string[] = [];
  if (input.showNaturalSensitivity) {
    notes.push(
      `Natural urine timing uses an educational ${input.naturalSensitivityMiu} mIU/mL threshold assumption.`,
    );
  }
  if (input.showIvfSensitivity) {
    notes.push(
      `IVF urine timing uses an educational ${input.ivfSensitivityMiu} mIU/mL threshold assumption.`,
    );
  }
  const sensitivityNote =
    notes.length > 0
      ? `${notes.join(' ')} Package inserts differ.`
      : null;

  const parts: string[] = [];
  if (naturalReady && naturalBloodIso && naturalUrineIso) {
    parts.push(
      `Natural conception (approx.): blood test around ${formatDisplayDate(naturalBloodIso)}; urine home test around ${formatDisplayDate(naturalUrineIso)}.`,
    );
  }
  if (ivfReady && ivfBloodIso && ivfUrineIso) {
    parts.push(
      `IVF day-${input.embryoAgeDays} transfer (approx.): blood test around ${formatDisplayDate(ivfBloodIso)}; urine home test around ${formatDisplayDate(ivfUrineIso)}.`,
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

export function shareUrineHomePregnancyTestText(pageUrl: string): string {
  return [
    'Urine Home Pregnancy Test | Omega Calculators',
    '',
    'Educational timing for when a urine home pregnancy test may be informative (natural or IVF).',
    pageUrl,
  ].join('\n');
}
