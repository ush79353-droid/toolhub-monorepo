/** Time unit for QT / RR / QTc fields. */
export type QtcTimeUnit = 'ms' | 's';

/** Which linked HR/RR field the user last edited. */
export type HrRrEditSource = 'heartRate' | 'rr';

export interface QtcInput {
  qtValue: string;
  qtUnit: QtcTimeUnit;
  heartRateBpm: string;
  rrValue: string;
  rrUnit: QtcTimeUnit;
  qtcUnit: QtcTimeUnit;
  lastEdited: HrRrEditSource;
  otherMethodsOpen: boolean;
}

export interface QtcMethodResult {
  method: 'bazett' | 'fridericia' | 'framingham' | 'hodges';
  label: string;
  qtcMs: number;
  formatted: string;
}

export interface QtcResult {
  qtMs: number;
  rrSec: number;
  heartRateBpm: number;
  bazettMs: number;
  formattedBazett: string;
  methods: QtcMethodResult[];
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type QtcFieldErrors = {
  form?: string;
  qtValue?: string;
  heartRateBpm?: string;
  rrValue?: string;
};

export const TIME_UNIT_LABELS: Record<QtcTimeUnit, string> = {
  ms: 'ms',
  s: 's',
};

/** Screenshot defaults: blank QT/HR/RR/QTc; ms units; other methods collapsed. */
export function createDefaultInput(): QtcInput {
  return {
    qtValue: '',
    qtUnit: 'ms',
    heartRateBpm: '',
    rrValue: '',
    rrUnit: 'ms',
    qtcUnit: 'ms',
    lastEdited: 'heartRate',
    otherMethodsOpen: false,
  };
}

export function createEmptyInput(): QtcInput {
  return createDefaultInput();
}

/** Prompt fixture: QT 400 ms at HR 60 → Bazett QTc 400 ms (RR 1000 ms). */
export function createExampleInput(): QtcInput {
  return {
    qtValue: '400',
    qtUnit: 'ms',
    heartRateBpm: '60',
    rrValue: '1000',
    rrUnit: 'ms',
    qtcUnit: 'ms',
    lastEdited: 'heartRate',
    otherMethodsOpen: false,
  };
}

export function inputsEqual(a: QtcInput, b: QtcInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
