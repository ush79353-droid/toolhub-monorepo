/**
 * Prescription Refill Calculator — pure engine (ADR-018). No FX.
 *
 * Screenshot mismatch: peptide syringe image was attached by mistake.
 * Scope = provisional fixed-schedule refill date arithmetic from the brief:
 *   days supplied = dispensed quantity ÷ units per day
 *   last covered day = fill + days − 1
 *   next supply date = fill + days
 * PRN / as-needed schedules excluded. Partial (non-integer) days rejected.
 */

import {
  addDaysToIsoDate,
  formatDueDateDisplay,
  isValidIsoDate,
} from '../edd/calculation';
import type {
  PrescriptionRefillInput,
  PrescriptionRefillResult,
} from './types';

export const SOURCE_LABEL =
  'Educational fixed-schedule supply math: days supplied = dispensed quantity ÷ units per day; last covered day = fill + days − 1; next supply date = fill + days (date-only UTC). PRN / as-needed schedules excluded.';

export const DISCLAIMER =
  'Educational refill-date worksheet only — not dispensing authorization, insurance eligibility, controlled-substance rules, or medical advice. Confirm with your pharmacist.';

/** Educational bounds for whole days of supply. */
export const MIN_DAYS_SUPPLIED = 1;
export const MAX_DAYS_SUPPLIED = 366;

const WHOLE_DAY_EPS = 1e-9;

export function parsePositiveNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

/** True when quantity ÷ unitsPerDay is a positive whole number of days. */
export function wholeDaysSupplied(
  quantity: number,
  unitsPerDay: number,
): number | null {
  if (
    !Number.isFinite(quantity) ||
    !Number.isFinite(unitsPerDay) ||
    quantity <= 0 ||
    unitsPerDay <= 0
  ) {
    return null;
  }
  const days = quantity / unitsPerDay;
  if (!Number.isFinite(days) || days < MIN_DAYS_SUPPLIED - WHOLE_DAY_EPS) {
    return null;
  }
  const nearest = Math.round(days);
  if (Math.abs(days - nearest) > WHOLE_DAY_EPS) return null;
  if (nearest < MIN_DAYS_SUPPLIED || nearest > MAX_DAYS_SUPPLIED) return null;
  return nearest;
}

export function calculatePrescriptionRefill(
  input: PrescriptionRefillInput,
): PrescriptionRefillResult | null {
  const fill = input.fillDate.trim();
  if (!fill || !isValidIsoDate(fill)) return null;

  const quantity = parsePositiveNumber(input.quantityText);
  const unitsPerDay = parsePositiveNumber(input.unitsPerDayText);
  if (quantity == null || unitsPerDay == null) return null;

  const daysSupplied = wholeDaysSupplied(quantity, unitsPerDay);
  if (daysSupplied == null) return null;

  const lastCoveredIso = addDaysToIsoDate(fill, daysSupplied - 1);
  const nextSupplyIso = addDaysToIsoDate(fill, daysSupplied);

  return {
    fillIso: fill,
    quantity,
    unitsPerDay,
    daysSupplied,
    lastCoveredIso,
    nextSupplyIso,
    formattedFill: formatDueDateDisplay(fill),
    formattedLastCovered: formatDueDateDisplay(lastCoveredIso),
    formattedNextSupply: formatDueDateDisplay(nextSupplyIso),
    explanation: `Days supplied = ${quantity} ÷ ${unitsPerDay} → ${daysSupplied}. Last covered = ${fill} + ${daysSupplied - 1} → ${lastCoveredIso}. Next supply = ${fill} + ${daysSupplied} → ${nextSupplyIso}.`,
    disclaimer: DISCLAIMER,
  };
}
