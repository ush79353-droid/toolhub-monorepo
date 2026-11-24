/**
 * Prescription Refill Calculator — UI stub (engine commit replaces with formulas).
 * ADR-018: pure module; no React/HTTP/Mongo. No FX.
 */

import type {
  PrescriptionRefillInput,
  PrescriptionRefillResult,
} from './types';

export const SOURCE_LABEL =
  'Educational fixed-schedule supply math: days supplied = dispensed quantity ÷ units per day; last covered day = fill + days − 1; next supply date = fill + days (date-only UTC). PRN / as-needed schedules excluded.';

export const DISCLAIMER =
  'Educational refill-date worksheet only — not dispensing authorization, insurance eligibility, controlled-substance rules, or medical advice. Confirm with your pharmacist.';

/** Stub — real refill arithmetic lands in the engine commit. */
export function calculatePrescriptionRefill(
  _input: PrescriptionRefillInput,
): PrescriptionRefillResult | null {
  return null;
}
