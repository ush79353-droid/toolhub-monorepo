/** Lung volumes → capacities worksheet (ADR-023). */

export type VolumeUnit = 'L' | 'mL';

export interface LungCapacityInput {
  irvText: string;
  tvText: string;
  ervText: string;
  rvText: string;
  unit: VolumeUnit;
}

export interface LungCapacityResult {
  tlc: number | null;
  vc: number | null;
  frc: number | null;
  ic: number | null;
  formattedTlc: string;
  formattedVc: string;
  formattedFrc: string;
  formattedIc: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type LungCapacityFieldErrors = {
  irvText?: string;
  tvText?: string;
  ervText?: string;
  rvText?: string;
};

export function createDefaultInput(): LungCapacityInput {
  return {
    irvText: '',
    tvText: '',
    ervText: '',
    rvText: '',
    unit: 'L',
  };
}

export function createEmptyInput(): LungCapacityInput {
  return createDefaultInput();
}

/** Prompt fixture: 3, 0.5, 1, 1.5 L → TLC 6, VC 4.5, FRC 2.5, IC 3.5. */
export function createExampleInput(): LungCapacityInput {
  return {
    irvText: '3',
    tvText: '0.5',
    ervText: '1',
    rvText: '1.5',
    unit: 'L',
  };
}

export function inputsEqual(a: LungCapacityInput, b: LungCapacityInput): boolean {
  return (
    a.irvText === b.irvText &&
    a.tvText === b.tvText &&
    a.ervText === b.ervText &&
    a.rvText === b.rvText &&
    a.unit === b.unit
  );
}
