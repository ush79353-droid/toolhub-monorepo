/** ECG paper small vs large grid box. */
export type EcgBoxType = 'small' | 'big';

/** Standard ECG paper speeds (mm/s). */
export type EcgPaperSpeed = 25 | 50;

/** Display unit for computed duration (canonical math uses seconds). */
export type DurationUnit = 'sec' | 'ms' | 'min';

export interface EcgBoxesToSecondsInput {
  boxCount: string;
  boxType: EcgBoxType;
  paperSpeed: EcgPaperSpeed;
  durationUnit: DurationUnit;
}

export interface EcgBoxesToSecondsResult {
  /** Canonical duration in seconds. */
  durationSeconds: number;
  /** Duration expressed in the selected display unit. */
  durationDisplay: number;
  durationUnit: DurationUnit;
  formattedDuration: string;
  boxWidthMm: number;
  paperSpeedMmPerSec: number;
  boxCount: number;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type EcgBoxesToSecondsFieldErrors = {
  form?: string;
  boxCount?: string;
};

/**
 * Screenshot defaults: blank box count; Small + 25 mm/s selected; duration unit sec.
 */
export function createDefaultInput(): EcgBoxesToSecondsInput {
  return {
    boxCount: '',
    boxType: 'small',
    paperSpeed: 25,
    durationUnit: 'sec',
  };
}

export function createEmptyInput(): EcgBoxesToSecondsInput {
  return createDefaultInput();
}

/** Fixture: one small box at 25 mm/s → 0.04 s. */
export function createExampleInput(): EcgBoxesToSecondsInput {
  return {
    boxCount: '1',
    boxType: 'small',
    paperSpeed: 25,
    durationUnit: 'sec',
  };
}

export function inputsEqual(
  a: EcgBoxesToSecondsInput,
  b: EcgBoxesToSecondsInput
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const BOX_TYPE_OPTIONS: readonly {
  value: EcgBoxType;
  label: string;
}[] = [
  { value: 'small', label: 'Small' },
  { value: 'big', label: 'Big' },
];

export const PAPER_SPEED_OPTIONS: readonly {
  value: EcgPaperSpeed;
  label: string;
}[] = [
  { value: 25, label: '25 mm/s' },
  { value: 50, label: '50 mm/s' },
];

export const DURATION_UNIT_LABELS: Record<DurationUnit, string> = {
  sec: 'sec',
  ms: 'ms',
  min: 'min',
};
