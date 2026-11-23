export interface LutealPhaseInput {
  ovulationDate: string;
  periodStartDate: string;
}

export interface LutealPhaseResult {
  ovulationIso: string;
  periodStartIso: string;
  lutealPhaseDays: number;
  formattedOvulation: string;
  formattedPeriodStart: string;
  explanation: string;
  disclaimer: string;
}

export type LutealPhaseFieldErrors = {
  form?: string;
  ovulationDate?: string;
  periodStartDate?: string;
};

export function createEmptyInput(): LutealPhaseInput {
  return { ovulationDate: '', periodStartDate: '' };
}

/** Fixture: Nov 10 ovulation → Nov 24 period → 14-day luteal (calendar convention). */
export function createExampleInput(): LutealPhaseInput {
  return { ovulationDate: '2026-11-10', periodStartDate: '2026-11-24' };
}

export function inputsEqual(
  a: LutealPhaseInput,
  b: LutealPhaseInput,
): boolean {
  return (
    a.ovulationDate === b.ovulationDate && a.periodStartDate === b.periodStartDate
  );
}