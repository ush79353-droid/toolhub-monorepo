export type CupUnit = 'usCustomary' | 'usLegal' | 'metric' | 'imperial';

export type QuartUnit = 'usLiquid' | 'usDry' | 'imperial';

export type CupsToQuartsSource = 'cups' | 'quarts';

export interface CupsToQuartsInput {
  source: CupsToQuartsSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
  cupUnit: CupUnit;
  quartUnit: QuartUnit;
}

export interface CupsToQuartsResult {
  source: CupsToQuartsSource;
  cups: number;
  quarts: number;
  liters: number;
  cupUnit: CupUnit;
  quartUnit: QuartUnit;
  explanation: string;
}

export type CupsToQuartsFieldErrors = {
  cups?: string;
  quarts?: string;
};

/** Exact liters per cup definition. */
export const LITERS_PER_CUP: Record<CupUnit, number> = {
  usCustomary: 0.2365882365,
  usLegal: 0.24,
  metric: 0.25,
  imperial: 0.284130625,
};

/** Exact liters per quart definition. */
export const LITERS_PER_QUART: Record<QuartUnit, number> = {
  usLiquid: 0.946352946,
  usDry: 1.101220942715,
  imperial: 1.1365225,
};

export const CUP_UNIT_OPTIONS: readonly { value: CupUnit; label: string }[] = [
  { value: 'usCustomary', label: 'US cup' },
  { value: 'usLegal', label: 'US legal cup' },
  { value: 'metric', label: 'Metric cup' },
  { value: 'imperial', label: 'UK cup' },
] as const;

export const QUART_UNIT_OPTIONS: readonly { value: QuartUnit; label: string }[] = [
  { value: 'usLiquid', label: 'US qt' },
  { value: 'usDry', label: 'US dry qt' },
  { value: 'imperial', label: 'imp qt' },
] as const;

export const CUP_UNIT_LABEL: Record<CupUnit, string> = {
  usCustomary: 'US cup',
  usLegal: 'US legal cup',
  metric: 'Metric cup',
  imperial: 'UK cup',
};

export const QUART_UNIT_LABEL: Record<QuartUnit, string> = {
  usLiquid: 'US qt',
  usDry: 'US dry qt',
  imperial: 'imp qt',
};

export const DEFAULT_CUP_UNIT: CupUnit = 'usCustomary';
export const DEFAULT_QUART_UNIT: QuartUnit = 'usLiquid';

export const MAX_ABS_VALUE = 1e15;
