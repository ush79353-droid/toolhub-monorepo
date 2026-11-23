export interface OvulationInput {
  cycleDurationDays: string;
  lastPeriodIso: string;
  firstCycleOpen: boolean;
  secondCycleOpen: boolean;
  thirdCycleOpen: boolean;
}

export interface OvulationCycleResult {
  cycleIndex: number;
  cycleStartIso: string;
  ovulationIso: string;
  fertileStartIso: string;
  fertileEndIso: string;
  dueDateIso: string;
  formattedOvulation: string;
  formattedFertileStart: string;
  formattedFertileEnd: string;
  formattedDueDate: string;
}

export interface OvulationResult {
  cycleLengthDays: number;
  cycles: readonly OvulationCycleResult[];
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type OvulationFieldErrors = {
  form?: string;
  cycleDurationDays?: string;
  lastPeriodIso?: string;
};

/** Screenshot defaults: cycle 28; blank LMP; first cycle expanded. */
export function createDefaultInput(): OvulationInput {
  return {
    cycleDurationDays: '28',
    lastPeriodIso: '',
    firstCycleOpen: true,
    secondCycleOpen: false,
    thirdCycleOpen: false,
  };
}

export function createEmptyInput(): OvulationInput {
  return createDefaultInput();
}

/** Educational fixture: LMP 2026-01-01 · 28d → ovulation day 14. */
export function createExampleInput(): OvulationInput {
  return {
    ...createDefaultInput(),
    lastPeriodIso: '2026-01-01',
  };
}

export function inputsEqual(a: OvulationInput, b: OvulationInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
