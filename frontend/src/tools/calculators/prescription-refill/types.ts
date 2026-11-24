/**
 * Prescription Refill Calculator — input/result types (ADR-018).
 *
 * Screenshot mismatch: peptide syringe UI was attached by mistake. Scope is
 * provisional fixed-schedule refill date arithmetic from the development prompt.
 */

export interface PrescriptionRefillInput {
  /** Dispense / fill start date as HTML `date` value `YYYY-MM-DD`. */
  fillDate: string;
  /** Dispensed quantity (tablets, capsules, mL, etc.) — unit-agnostic count. */
  quantityText: string;
  /** Units taken per calendar day on a fixed schedule (not PRN). */
  unitsPerDayText: string;
}

export interface PrescriptionRefillResult {
  fillIso: string;
  quantity: number;
  unitsPerDay: number;
  /** Whole days of supply: quantity ÷ units per day. */
  daysSupplied: number;
  lastCoveredIso: string;
  nextSupplyIso: string;
  formattedFill: string;
  formattedLastCovered: string;
  formattedNextSupply: string;
  explanation: string;
  disclaimer: string;
}

export type PrescriptionRefillFieldErrors = {
  form?: string;
  fillDate?: string;
  quantityText?: string;
  unitsPerDayText?: string;
};

/** Blank clinical fields — no seeded medically actionable defaults (ADR-023). */
export function createEmptyInput(): PrescriptionRefillInput {
  return {
    fillDate: '',
    quantityText: '',
    unitsPerDayText: '',
  };
}

/** Fixture: 30-day supply starting mid-January crossing month end. */
export function createExampleInput(): PrescriptionRefillInput {
  return {
    fillDate: '2026-01-15',
    quantityText: '30',
    unitsPerDayText: '1',
  };
}

export function inputsEqual(
  a: PrescriptionRefillInput,
  b: PrescriptionRefillInput,
): boolean {
  return (
    a.fillDate === b.fillDate &&
    a.quantityText === b.quantityText &&
    a.unitsPerDayText === b.unitsPerDayText
  );
}
