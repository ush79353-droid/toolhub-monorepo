/** Weight display units (screenshot default: kg). */
export type WeightUnit = 'kg' | 'lb';

/** Unit-volume display units (screenshot: mL). */
export type VolumeUnit = 'mL';

export interface FreshFrozenPlasmaDoseInput {
  /** Patient weight text (blank by default — no seeded clinical weight). */
  weightText: string;
  weightUnit: WeightUnit;
  /** Bag/unit volume text (screenshot default 200 mL — AABB typical unit size). */
  unitVolumeText: string;
  volumeUnit: VolumeUnit;
  /** Ordered dose in mL/kg (screenshot default 15 — AABB Circular ~15 mL/kg). */
  doseMlPerKgText: string;
}

export interface FreshFrozenPlasmaDoseResult {
  /** Total plasma volume = weightKg × doseMlPerKg (null until weight entered). */
  totalPlasmaDoseMl: number | null;
  /**
   * Equivalent units = total / unit volume (exact fractional value).
   * Not a blood-bank issue quantity — never silently rounded or ceiled.
   */
  equivalentUnits: number | null;
  weightKg: number | null;
  doseMlPerKg: number | null;
  unitVolumeMl: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
  assumptions: string;
}

export type FreshFrozenPlasmaDoseFieldErrors = {
  weightText?: string;
  unitVolumeText?: string;
  doseMlPerKgText?: string;
};

/**
 * Screenshot defaults: blank weight; unit volume 200 mL; dose 15 mL/kg.
 * 200 mL and 15 mL/kg are AABB Circular of Information figures — not patient data.
 */
export function createDefaultInput(): FreshFrozenPlasmaDoseInput {
  return {
    weightText: '',
    weightUnit: 'kg',
    unitVolumeText: '200',
    volumeUnit: 'mL',
    doseMlPerKgText: '15',
  };
}

/** Clear patient weight and restore published unit-volume / dose defaults. */
export function createEmptyInput(): FreshFrozenPlasmaDoseInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: FreshFrozenPlasmaDoseInput,
  b: FreshFrozenPlasmaDoseInput,
): boolean {
  return (
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.unitVolumeText === b.unitVolumeText &&
    a.volumeUnit === b.volumeUnit &&
    a.doseMlPerKgText === b.doseMlPerKgText
  );
}
