/** Which field the user last edited. The other field is derived. */
export type CcLiterSource = 'cc' | 'liters';

/** Display labels for the cubic-centimeter side (identical volumes). */
export type CcDisplayUnit = 'cm3' | 'cc' | 'mL';

export interface CcToLiterInput {
  source: CcLiterSource;
  /** null while the active source field is blank or incomplete. */
  cc: number | null;
  liters: number | null;
}

export interface CcToLiterResult {
  source: CcLiterSource;
  cc: number;
  liters: number;
  explanation: string;
}

export type CcToLiterFieldErrors = {
  cc?: string;
  liters?: string;
};

/** Exact: 1 L = 1000 cm³ = 1000 cc. */
export const CC_PER_LITER = 1000;

export const MAX_ABS_VALUE = 1e15;

export const CC_DISPLAY_OPTIONS: readonly { value: CcDisplayUnit; label: string }[] = [
  { value: 'cm3', label: 'cm³' },
  { value: 'cc', label: 'cc' },
  { value: 'mL', label: 'mL' },
] as const;

/** Empty default per brief. */
export const DEFAULT_CC_TO_LITER_INPUT: CcToLiterInput = {
  source: 'cc',
  cc: null,
  liters: null,
};
