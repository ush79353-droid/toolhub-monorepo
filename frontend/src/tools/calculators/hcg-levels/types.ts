export type TimeUnit = 'days' | 'hours';

export interface HcgLevelsInput {
  firstLevel: string;
  secondLevel: string;
  elapsedValue: string;
  elapsedUnit: TimeUnit;
  doublingTimeUnit: TimeUnit;
}

export interface HcgLevelsResult {
  difference: number;
  percentageChange: number;
  /** Doubling time in days when rising; null if not rising. */
  doublingTimeDays: number | null;
  doublingTimeDisplay: number | null;
  oneDayIncreasePct: number | null;
  twoDayIncreasePct: number | null;
  formattedDifference: string;
  formattedPercentageChange: string;
  formattedDoublingTime: string;
  formattedOneDayIncrease: string;
  formattedTwoDayIncrease: string;
  trend: 'rising' | 'falling' | 'unchanged';
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type HcgLevelsFieldErrors = {
  form?: string;
  firstLevel?: string;
  secondLevel?: string;
  elapsedValue?: string;
};

export function createDefaultInput(): HcgLevelsInput {
  return {
    firstLevel: '',
    secondLevel: '',
    elapsedValue: '',
    elapsedUnit: 'days',
    doublingTimeUnit: 'days',
  };
}

export function createEmptyInput(): HcgLevelsInput {
  return createDefaultInput();
}

/** Fixture: 100 → 200 over 2 days. */
export function createExampleInput(): HcgLevelsInput {
  return {
    firstLevel: '100',
    secondLevel: '200',
    elapsedValue: '2',
    elapsedUnit: 'days',
    doublingTimeUnit: 'days',
  };
}

export function inputsEqual(a: HcgLevelsInput, b: HcgLevelsInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const TIME_UNIT_LABELS: Record<TimeUnit, string> = {
  days: 'days',
  hours: 'hours',
};
