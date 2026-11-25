import { daysBetweenUtc, isValidIsoDate } from '../edd/calculation';
import {
  calculatePsaKinetics,
  daysToDoublingUnit,
  DISCLAIMER,
  formatNumber,
  SOURCE_LABEL,
} from './calculation';
import type {
  PsaDoublingTimeFieldErrors,
  PsaDoublingTimeInput,
  PsaDoublingTimeResult,
} from './types';

function parsePositivePsa(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function validatePsaDoublingTimeInput(input: PsaDoublingTimeInput): {
  errors: PsaDoublingTimeFieldErrors;
  result: PsaDoublingTimeResult | null;
} {
  const errors: PsaDoublingTimeFieldErrors = {};

  const anyField =
    input.olderDate.trim() ||
    input.olderPsa.trim() ||
    input.newerDate.trim() ||
    input.newerPsa.trim();

  if (!anyField) {
    return { errors, result: null };
  }

  if (input.olderDate.trim() && !isValidIsoDate(input.olderDate)) {
    errors.olderDate = 'Enter a valid older test date.';
  }
  if (input.newerDate.trim() && !isValidIsoDate(input.newerDate)) {
    errors.newerDate = 'Enter a valid newer test date.';
  }

  if (input.olderPsa.trim() && parsePositivePsa(input.olderPsa) == null) {
    errors.olderPsa = 'Enter a positive PSA level.';
  }
  if (input.newerPsa.trim() && parsePositivePsa(input.newerPsa) == null) {
    errors.newerPsa = 'Enter a positive PSA level.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const older = input.olderDate.trim();
  const newer = input.newerDate.trim();
  const psa1 = parsePositivePsa(input.olderPsa);
  const psa2 = parsePositivePsa(input.newerPsa);

  if (!older || !newer || psa1 == null || psa2 == null) {
    return { errors, result: null };
  }

  const elapsed = daysBetweenUtc(older, newer);
  if (elapsed == null) {
    errors.form = 'Unable to read the test dates.';
    return { errors, result: null };
  }
  if (elapsed <= 0) {
    errors.form = 'The newer test date must be after the older test date.';
    return { errors, result: null };
  }

  const core = calculatePsaKinetics(psa1, psa2, elapsed);
  if (!core) {
    errors.form = 'Unable to calculate PSA kinetics from the values entered.';
    return { errors, result: null };
  }

  let formattedDoublingTime: string | null = null;
  if (core.doublingTimeDays != null) {
    const display = daysToDoublingUnit(
      core.doublingTimeDays,
      input.doublingTimeUnit,
    );
    formattedDoublingTime = formatNumber(display);
  }

  const formattedPsaVelocity =
    input.showSlopeAndVelocity && core.psaVelocityNgMlPerYear != null
      ? formatNumber(core.psaVelocityNgMlPerYear)
      : null;
  const formattedLogSlope =
    input.showSlopeAndVelocity && core.logSlopePerYear != null
      ? formatNumber(core.logSlopePerYear)
      : null;

  const unitLabel = input.doublingTimeUnit;
  const explanation =
    core.trend === 'rising'
      ? `Rising serial PSA over ${elapsed} days: doubling time ${
          formattedDoublingTime ?? '—'
        } ${unitLabel}.`
      : core.trend === 'falling'
        ? `Falling serial PSA over ${elapsed} days. Doubling time is not shown for non-rising values.`
        : `Unchanged PSA over ${elapsed} days. Doubling time is not applicable.`;

  return {
    errors,
    result: {
      formattedDoublingTime,
      formattedPsaVelocity,
      formattedLogSlope,
      trend: core.trend,
      elapsedDays: elapsed,
      explanation,
      disclaimer: DISCLAIMER,
      sourceLabel: SOURCE_LABEL,
    },
  };
}