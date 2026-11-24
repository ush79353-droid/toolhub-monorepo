/** Educational labeled-product syringe volume arithmetic (not dosing advice). */

export type MassUnit = 'mg' | 'mcg';

export interface PeptideInput {
  vialMassText: string;
  vialMassUnit: MassUnit;
  diluentMlText: string;
  doseText: string;
  doseUnit: MassUnit;
  /** Explicit syringe calibration: marks per mL (e.g. 100 for U-100). */
  syringeUnitsPerMlText: string;
  showTotalAmount: boolean;
}

export interface PeptideResult {
  concentrationMcgPerMl: number | null;
  drawVolumeMl: number | null;
  syringeUnits: number | null;
  vialMassMcg: number | null;
  doseMcg: number | null;
  formattedConcentration: string;
  formattedDrawMl: string;
  formattedUnits: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type PeptideFieldErrors = {
  vialMassText?: string;
  diluentMlText?: string;
  doseText?: string;
  syringeUnitsPerMlText?: string;
};

export function createDefaultInput(): PeptideInput {
  return {
    vialMassText: '',
    vialMassUnit: 'mg',
    diluentMlText: '1',
    doseText: '',
    doseUnit: 'mcg',
    syringeUnitsPerMlText: '100',
    showTotalAmount: false,
  };
}

export function createEmptyInput(): PeptideInput {
  return createDefaultInput();
}

export function inputsEqual(a: PeptideInput, b: PeptideInput): boolean {
  return (
    a.vialMassText === b.vialMassText &&
    a.vialMassUnit === b.vialMassUnit &&
    a.diluentMlText === b.diluentMlText &&
    a.doseText === b.doseText &&
    a.doseUnit === b.doseUnit &&
    a.syringeUnitsPerMlText === b.syringeUnitsPerMlText &&
    a.showTotalAmount === b.showTotalAmount
  );
}

export const MASS_UNIT_OPTIONS: readonly { value: MassUnit; label: string }[] = [
  { value: 'mg', label: 'mg' },
  { value: 'mcg', label: 'mcg' },
];
