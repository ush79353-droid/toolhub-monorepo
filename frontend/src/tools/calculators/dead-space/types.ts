/** Bohr physiologic dead space — educational worksheet. */

export type PressureUnit = 'mmHg' | 'kPa';
export type VolumeUnit = 'mL' | 'L';

export interface DeadSpaceInput {
  alveolarCo2: number | null;
  exhaledCo2: number | null;
  pressureUnit: PressureUnit;
  tidalVolume: number | null;
  tidalUnit: VolumeUnit;
  resultUnit: VolumeUnit;
}

export interface DeadSpaceResult {
  deadSpaceMl: number;
  vdVtRatio: number;
  formattedDeadSpace: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type DeadSpaceFieldErrors = {
  form?: string;
  alveolarCo2?: string;
  exhaledCo2?: string;
  tidalVolume?: string;
};

export function createDefaultInput(): DeadSpaceInput {
  return {
    alveolarCo2: null,
    exhaledCo2: null,
    pressureUnit: 'mmHg',
    tidalVolume: null,
    tidalUnit: 'mL',
    resultUnit: 'mL',
  };
}

export function createEmptyInput(): DeadSpaceInput {
  return createDefaultInput();
}

/** PACO₂ 40 · PECO₂ 28 mmHg · VT 500 mL → VD 150 mL. */
export function createExampleInput(): DeadSpaceInput {
  return {
    alveolarCo2: 40,
    exhaledCo2: 28,
    pressureUnit: 'mmHg',
    tidalVolume: 500,
    tidalUnit: 'mL',
    resultUnit: 'mL',
  };
}

export function inputsEqual(a: DeadSpaceInput, b: DeadSpaceInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
