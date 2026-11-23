/** Physical distance vs time for the R–R interval field. */
export type RrIntervalUnit = 'mm' | 's' | 'ms';

export type EcgBoxType = 'small' | 'big';

export type EcgPaperSpeed = 25 | 50;

/** Which linked representation the user last edited (avoids circular sync). */
export type RrEditSource = 'interval' | 'boxes';

export interface EcgHeartRateInput {
  intervalValue: string;
  intervalUnit: RrIntervalUnit;
  boxType: EcgBoxType;
  boxesValue: string;
  paperSpeed: EcgPaperSpeed;
  lastEdited: RrEditSource;
}

export interface EcgHeartRateResult {
  distanceMm: number;
  durationSec: number;
  bpm: number;
  formattedBpm: string;
  formattedDurationSec: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type EcgHeartRateFieldErrors = {
  form?: string;
  intervalValue?: string;
  boxesValue?: string;
};

/**
 * Screenshot defaults: blank R–R mm, Small boxes, blank box count, 25 mm/s, blank BPM.
 */
export function createDefaultInput(): EcgHeartRateInput {
  return {
    intervalValue: '',
    intervalUnit: 'mm',
    boxType: 'small',
    boxesValue: '',
    paperSpeed: 25,
    lastEdited: 'interval',
  };
}

export function createEmptyInput(): EcgHeartRateInput {
  return createDefaultInput();
}

/** Prompt fixture: 20 mm at 25 mm/s → 75 bpm (also four large boxes). */
export function createExampleInput(): EcgHeartRateInput {
  return {
    intervalValue: '20',
    intervalUnit: 'mm',
    boxType: 'big',
    boxesValue: '4',
    paperSpeed: 25,
    lastEdited: 'interval',
  };
}

export function inputsEqual(a: EcgHeartRateInput, b: EcgHeartRateInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const INTERVAL_UNIT_LABELS: Record<RrIntervalUnit, string> = {
  mm: 'mm',
  s: 's',
  ms: 'ms',
};
