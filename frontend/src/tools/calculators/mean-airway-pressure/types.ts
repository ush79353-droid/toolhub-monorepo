/** Mean airway pressure — educational ventilator worksheet. */

export type EquationMode = 'totalCycleTime' | 'frequency';
export type TimeUnit = 'sec' | 'ms';
export type PressureUnit = 'cmH2O';

export interface MeanAirwayPressureInput {
  mode: EquationMode;
  totalCycleTime: number | null;
  frequency: number | null;
  inspiratoryTime: number | null;
  timeUnit: TimeUnit;
  k: number | null;
  peep: number | null;
  pip: number | null;
  pressureUnit: PressureUnit;
}

export interface MeanAirwayPressureResult {
  meanAirwayPressure: number;
  formatted: string;
  dutyFraction: number;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type MeanAirwayPressureFieldErrors = {
  form?: string;
  totalCycleTime?: string;
  frequency?: string;
  inspiratoryTime?: string;
  k?: string;
  peep?: string;
  pip?: string;
};

export function createDefaultInput(): MeanAirwayPressureInput {
  return {
    mode: 'totalCycleTime',
    totalCycleTime: null,
    frequency: null,
    inspiratoryTime: null,
    timeUnit: 'sec',
    k: 1,
    peep: null,
    pip: null,
    pressureUnit: 'cmH2O',
  };
}

export function createEmptyInput(): MeanAirwayPressureInput {
  return createDefaultInput();
}

/** PEEP 5 · PIP 25 · k 1 · Ti/Ttot 0.25 → Pmean 10 cmH₂O. */
export function createExampleInput(): MeanAirwayPressureInput {
  return {
    mode: 'totalCycleTime',
    totalCycleTime: 4,
    frequency: null,
    inspiratoryTime: 1,
    timeUnit: 'sec',
    k: 1,
    peep: 5,
    pip: 25,
    pressureUnit: 'cmH2O',
  };
}

export function inputsEqual(
  a: MeanAirwayPressureInput,
  b: MeanAirwayPressureInput,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
