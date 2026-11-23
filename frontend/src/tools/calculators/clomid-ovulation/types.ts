export interface ClomidOvulationInput {
  /** ISO YYYY-MM-DD treatment start (first pill day). */
  treatmentStart: string;
  /** Inclusive course length in whole days (blank until prescribed). */
  durationDays: string;
}

export interface ClomidOvulationResult {
  treatmentStartIso: string;
  durationDays: number;
  lastTreatmentIso: string;
  ovulationWindowStartIso: string;
  ovulationWindowEndIso: string;
  /** Display for the screenshot “Ovulation date” field (window, not a single confirmed day). */
  formattedOvulationField: string;
  formattedLastTreatment: string;
  formattedWindow: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type ClomidOvulationFieldErrors = {
  form?: string;
  treatmentStart?: string;
  durationDays?: string;
};

/** Local calendar today as YYYY-MM-DD (date-only; not medically seeded duration). */
export function localTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Screenshot defaults: treatment start = today; duration blank; ovulation blank.
 * Do not prefill a treatment duration (prompt / ADR-023).
 */
export function createDefaultInput(): ClomidOvulationInput {
  return {
    treatmentStart: localTodayIso(),
    durationDays: '',
  };
}

export function createEmptyInput(): ClomidOvulationInput {
  return createDefaultInput();
}

/** Educational fixture: 5-day course starting 2026-01-01 → last 2026-01-05 → window Jan 10–15. */
export function createExampleInput(): ClomidOvulationInput {
  return {
    treatmentStart: '2026-01-01',
    durationDays: '5',
  };
}

export function inputsEqual(
  a: ClomidOvulationInput,
  b: ClomidOvulationInput
): boolean {
  return (
    a.treatmentStart === b.treatmentStart && a.durationDays === b.durationDays
  );
}
