/** Pressure display units — values normalize to mmHg before math. */
export type PressureUnit = 'mmHg' | 'kPa';

/** Output resistance unit (screenshot default dyn·s·cm⁻⁵; Wood units optional). */
export type ResistanceUnit = 'dyn' | 'wood';

export interface PvrInput {
  mpapText: string;
  mpapUnit: PressureUnit;
  lapText: string;
  lapUnit: PressureUnit;
  coText: string;
  /** Display unit for the read-only PVR field. */
  resistanceUnit: ResistanceUnit;
}

export interface PvrResult {
  /** Wood units = (mPAP − LAP) / CO at full precision. */
  woodUnits: number;
  /** dyn·s·cm⁻⁵ = Wood × 80 at full precision. */
  dynesSecCm5: number;
  mpapMmHg: number;
  lapMmHg: number;
  coLPerMin: number;
  formattedPrimary: string;
  formattedWood: string;
  formattedDynes: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type PvrFieldErrors = {
  form?: string;
  mpapText?: string;
  lapText?: string;
  coText?: string;
};

/** Screenshot defaults: blank pressures/CO, mmHg, dyn·s·cm⁻⁵ display. */
export function createDefaultInput(): PvrInput {
  return {
    mpapText: '',
    mpapUnit: 'mmHg',
    lapText: '',
    lapUnit: 'mmHg',
    coText: '',
    resistanceUnit: 'dyn',
  };
}

export function createEmptyInput(): PvrInput {
  return createDefaultInput();
}

/** Prompt fixture: mPAP 30, LAP 10, CO 5 → 320 dyn·s·cm⁻⁵. */
export function createExampleInput(): PvrInput {
  return {
    mpapText: '30',
    mpapUnit: 'mmHg',
    lapText: '10',
    lapUnit: 'mmHg',
    coText: '5',
    resistanceUnit: 'dyn',
  };
}

export function inputsEqual(a: PvrInput, b: PvrInput): boolean {
  return (
    a.mpapText === b.mpapText &&
    a.mpapUnit === b.mpapUnit &&
    a.lapText === b.lapText &&
    a.lapUnit === b.lapUnit &&
    a.coText === b.coText &&
    a.resistanceUnit === b.resistanceUnit
  );
}

export const PRESSURE_UNIT_OPTIONS: readonly {
  value: PressureUnit;
  label: string;
}[] = [
  { value: 'mmHg', label: 'mmHg' },
  { value: 'kPa', label: 'kPa' },
];

export const RESISTANCE_UNIT_OPTIONS: readonly {
  value: ResistanceUnit;
  label: string;
}[] = [
  { value: 'dyn', label: 'dynes · sec · cm⁻⁵' },
  { value: 'wood', label: 'Wood units (WU)' },
];
