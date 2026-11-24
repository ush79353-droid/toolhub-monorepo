/** CAGE alcohol screen (Ewing 1984) — educational. */

export interface CageInput {
  cutDown: boolean;
  annoyed: boolean;
  guilty: boolean;
  eyeOpener: boolean;
}

export type CageBand = 'low' | 'positive';

export interface CageResult {
  score: number;
  screenBand: CageBand;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type CageFieldErrors = Record<string, never>;

export function createDefaultInput(): CageInput {
  return {
    cutDown: false,
    annoyed: false,
    guilty: false,
    eyeOpener: false,
  };
}

export function createEmptyInput(): CageInput {
  return createDefaultInput();
}

export function inputsEqual(a: CageInput, b: CageInput): boolean {
  return (
    a.cutDown === b.cutDown &&
    a.annoyed === b.annoyed &&
    a.guilty === b.guilty &&
    a.eyeOpener === b.eyeOpener
  );
}

export const CAGE_ITEMS: readonly {
  key: keyof CageInput;
  label: string;
}[] = [
  {
    key: 'cutDown',
    label: 'Felt the need to Cut down your drinking',
  },
  {
    key: 'annoyed',
    label: 'Felt Annoyed by people criticizing your drinking',
  },
  {
    key: 'guilty',
    label: 'Felt Guilty about your drinking',
  },
  {
    key: 'eyeOpener',
    label: 'Needed a drink first thing in the morning (Eye-opener)',
  },
];
