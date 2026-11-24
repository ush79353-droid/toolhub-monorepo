/**
 * Warfarin Dosing Calculator — educational maintenance-adjustment worksheet.
 * Screenshot-first fields only (ADR-023). No FX.
 */

/** Bleeding severity (screenshot radios). */
export type BleedingStatus =
  | 'none'
  | 'serious'
  | 'life_threatening';

/** Target INR range (screenshot radios). */
export type TargetInrRange = '2_3' | '2_5_3_5';

/** Dose entry unit: total mg per week or per day (screenshot default: wk). */
export type DosePeriod = 'wk' | 'day';

export interface WarfarinDosingInput {
  /** Current INR — blank by default (no seeded clinical value). */
  inrText: string;
  bleeding: BleedingStatus;
  /** Total warfarin dose text — blank by default. */
  doseText: string;
  dosePeriod: DosePeriod;
  targetRange: TargetInrRange;
}

export type AdjustmentKind =
  | 'incomplete'
  | 'in_range'
  | 'increase'
  | 'decrease'
  | 'hold_or_decrease'
  | 'bleeding_escalation';

export interface WarfarinDosingResult {
  kind: AdjustmentKind;
  /** Parsed INR when valid; otherwise null. */
  inr: number | null;
  /** Current total weekly dose (mg) when computable. */
  weeklyDoseMg: number | null;
  /**
   * Suggested weekly dose bounds from the published % band (mg).
   * Null when numeric adjustment must be suppressed (incomplete, in-range,
   * or any bleeding pathway).
   */
  adjustedWeeklyLowMg: number | null;
  adjustedWeeklyHighMg: number | null;
  /** Same bounds as average daily (÷7) for display. */
  adjustedDailyLowMg: number | null;
  adjustedDailyHighMg: number | null;
  /** Published percent band (e.g. +5 to +15). Null when N/A. */
  percentLow: number | null;
  percentHigh: number | null;
  statusHeadline: string;
  statusDetail: string;
  actionNotes: readonly string[];
  recheckNote: string;
  sourceNote: string;
  disclaimer: string;
}

export type WarfarinDosingFieldErrors = {
  inrText?: string;
  doseText?: string;
};

/** Screenshot defaults: blank INR/dose; no significant bleeding; wk; target 2–3. */
export function createDefaultInput(): WarfarinDosingInput {
  return {
    inrText: '',
    bleeding: 'none',
    doseText: '',
    dosePeriod: 'wk',
    targetRange: '2_3',
  };
}

export function createEmptyInput(): WarfarinDosingInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: WarfarinDosingInput,
  b: WarfarinDosingInput,
): boolean {
  return (
    a.inrText === b.inrText &&
    a.bleeding === b.bleeding &&
    a.doseText === b.doseText &&
    a.dosePeriod === b.dosePeriod &&
    a.targetRange === b.targetRange
  );
}
