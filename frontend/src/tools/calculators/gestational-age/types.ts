/** How gestational age is shown in the output field. */
export type GaDisplayUnit = 'weeksDays' | 'days';

export interface GestationalAgeInput {
  dueDate: string;
  currentDate: string;
  gaDisplayUnit: GaDisplayUnit;
}

export interface GestationalAgeResult {
  dueDateIso: string;
  currentDateIso: string;
  gestationalAgeDays: number;
  weeks: number;
  daysRemainder: number;
  formattedDueDate: string;
  formattedCurrentDate: string;
  formattedGestationalAge: string;
  beforeConception: boolean;
  explanation: string;
  disclaimer: string;
}

export type GestationalAgeFieldErrors = {
  form?: string;
  dueDate?: string;
  currentDate?: string;
};

export const GA_DISPLAY_LABELS: Record<GaDisplayUnit, string> = {
  weeksDays: 'wks + days',
  days: 'days',
};

export function createEmptyInput(currentDateIso: string): GestationalAgeInput {
  return {
    dueDate: '',
    currentDate: currentDateIso,
    gaDisplayUnit: 'weeksDays',
  };
}

/** Fixture: EDD today with current today → 40w0d. */
export function createExampleInput(currentDateIso: string): GestationalAgeInput {
  return {
    dueDate: currentDateIso,
    currentDate: currentDateIso,
    gaDisplayUnit: 'weeksDays',
  };
}

export function inputsEqual(
  a: GestationalAgeInput,
  b: GestationalAgeInput,
): boolean {
  return (
    a.dueDate === b.dueDate &&
    a.currentDate === b.currentDate &&
    a.gaDisplayUnit === b.gaDisplayUnit
  );
}