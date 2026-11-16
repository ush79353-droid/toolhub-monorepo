export const HARDNESS_SCALES = ['HBW', 'HRB', 'HRC', 'HV'] as const;
export type HardnessScale = (typeof HARDNESS_SCALES)[number];

export const HARDNESS_MATERIALS = ['nonAusteniticSteel'] as const;
export type HardnessMaterial = (typeof HARDNESS_MATERIALS)[number];

export const HARDNESS_SCALE_LABELS: Record<HardnessScale, string> = {
  HBW: 'Brinell hardness (HBW)',
  HRB: 'Rockwell scale B (HRB)',
  HRC: 'Rockwell scale C (HRC)',
  HV: 'Vickers hardness (HV)',
};

export const HARDNESS_SCALE_SHORT: Record<HardnessScale, string> = {
  HBW: 'HBW',
  HRB: 'HRB',
  HRC: 'HRC',
  HV: 'HV',
};

export const HARDNESS_MATERIAL_LABELS: Record<HardnessMaterial, string> = {
  nonAusteniticSteel: 'Non-austenitic steel',
};

export const HARDNESS_REFERENCE =
  'Approximate educational chart aligned with ASTM E140 relationships for non-austenitic steels. Conversions are approximate; prefer direct testing on the specified scale.';

export type HardnessFieldErrors = {
  value?: string;
};

/** One verified reference row. Missing scales use null (unsupported at that point). */
export type HardnessRow = {
  HBW: number | null;
  HRB: number | null;
  HRC: number | null;
  HV: number | null;
};

export type HardnessConversionResult = {
  sourceScale: HardnessScale;
  sourceValue: number;
  material: HardnessMaterial;
  converted: Record<HardnessScale, number | null>;
  reference: string;
  isApproximate: true;
  warnings: readonly string[];
};
