/**
 * Iron Deficiency Calculator — Ganzoni iron deficit (educational).
 * Screenshot: weight, actual/target Hb, derived iron stores (mg), deficit (mg).
 */

export type WeightUnit = 'kg' | 'lb';
export type HemoglobinUnit = 'g/dL' | 'g/L';

export interface IronDeficiencyInput {
  weightText: string;
  weightUnit: WeightUnit;
  actualHemoglobinText: string;
  actualHemoglobinUnit: HemoglobinUnit;
  targetHemoglobinText: string;
  targetHemoglobinUnit: HemoglobinUnit;
}

export interface IronDeficiencyResult {
  /** Body weight normalized to kg; null when incomplete/invalid. */
  weightKg: number | null;
  /** Actual Hb in g/dL. */
  actualHemoglobinGPerDl: number | null;
  /** Target Hb in g/dL. */
  targetHemoglobinGPerDl: number | null;
  /**
   * Iron store allowance (mg) from weight band:
   * ≥35 kg → 500 mg; &lt;35 kg → 15 mg/kg.
   */
  ironStoresMg: number | null;
  /**
   * Ganzoni total iron deficit (mg). Educational estimate only —
   * not an IV product dose or prescription.
   */
  deficitMg: number | null;
  /** Hb component of deficit before stores (mg). */
  hemoglobinDeficitMg: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type IronDeficiencyFieldErrors = {
  weightText?: string;
  actualHemoglobinText?: string;
  targetHemoglobinText?: string;
};

export function createDefaultInput(): IronDeficiencyInput {
  return {
    weightText: '',
    weightUnit: 'kg',
    actualHemoglobinText: '',
    actualHemoglobinUnit: 'g/dL',
    targetHemoglobinText: '',
    targetHemoglobinUnit: 'g/dL',
  };
}

export function createEmptyInput(): IronDeficiencyInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: IronDeficiencyInput,
  b: IronDeficiencyInput,
): boolean {
  return (
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.actualHemoglobinText === b.actualHemoglobinText &&
    a.actualHemoglobinUnit === b.actualHemoglobinUnit &&
    a.targetHemoglobinText === b.targetHemoglobinText &&
    a.targetHemoglobinUnit === b.targetHemoglobinUnit
  );
}
