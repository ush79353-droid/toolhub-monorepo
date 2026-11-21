export type RuleOf72Field = 'increase' | 'doublingTime';

export interface RuleOf72Input {
  /** Percent increase per period (e.g. 8 means 8%/period). */
  increasePercent: string;
  /** Approximate doubling time in periods via Rule of 72. */
  doublingTime: string;
  /** Last-edited field drives the reciprocal (avoids update loops). */
  lastEdited: RuleOf72Field;
}

export interface RuleOf72Result {
  increasePercent: number;
  doublingTime: number;
  /** Exact compound doubling periods: ln(2)/ln(1+r), when r > −1 and ≠ 0. */
  exactDoublingTime: number | null;
  formattedIncrease: string;
  formattedDoublingTime: string;
  formattedExactDoublingTime: string | null;
  source: RuleOf72Field;
  formulaBreakdown: string;
  explanation: string;
}

export type RuleOf72FieldErrors = {
  form?: string;
  increasePercent?: string;
  doublingTime?: string;
};

/** Rule-of-72 constant (mental-math approximation). */
export const RULE_OF_72 = 72;

/** Screenshot defaults: empty linked fields. */
export function createDefaultInput(): RuleOf72Input {
  return {
    increasePercent: '',
    doublingTime: '',
    lastEdited: 'increase',
  };
}

export function createEmptyInput(): RuleOf72Input {
  return createDefaultInput();
}

/** Worked example: 8%/period → ≈ 9 periods (72 ÷ 8). */
export function createExampleInput(): RuleOf72Input {
  return {
    increasePercent: '8',
    doublingTime: '',
    lastEdited: 'increase',
  };
}
