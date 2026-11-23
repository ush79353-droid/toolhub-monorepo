/** LVOT diameter display unit (canonical math uses cm). */
export type LengthUnit = 'mm' | 'cm';

/** VTI display unit (canonical math uses cm). */
export type VtiUnit = 'cm' | 'm';

/** AVA display unit (canonical math uses cm²). */
export type AreaUnit = 'cm2' | 'mm2';

export type AsSeverityBand = 'severe' | 'moderate' | 'mild' | 'normal';

export interface AorticValveAreaInput {
  lvotValue: string;
  lvotUnit: LengthUnit;
  /** VTI₁ — LVOT stroke distance. */
  vti1Value: string;
  vti1Unit: VtiUnit;
  /** VTI₂ — transaortic (AV) jet stroke distance. */
  vti2Value: string;
  vti2Unit: VtiUnit;
  avaUnit: AreaUnit;
}

export interface AorticValveAreaResult {
  avaCm2: number;
  avaDisplay: number;
  formattedAva: string;
  severityBand: AsSeverityBand;
  severityLabel: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type AorticValveAreaFieldErrors = {
  form?: string;
  lvotValue?: string;
  vti1Value?: string;
  vti2Value?: string;
};

/** Screenshot defaults: blank numeric fields; LVOT mm, VTI cm, AVA cm². */
export function createDefaultInput(): AorticValveAreaInput {
  return {
    lvotValue: '',
    lvotUnit: 'mm',
    vti1Value: '',
    vti1Unit: 'cm',
    vti2Value: '',
    vti2Unit: 'cm',
    avaUnit: 'cm2',
  };
}

export function createEmptyInput(): AorticValveAreaInput {
  return createDefaultInput();
}

/** Educational fixture from prompt: 20 mm · 20 cm · 80 cm → ≈ 0.7854 cm². */
export function createExampleInput(): AorticValveAreaInput {
  return {
    lvotValue: '20',
    lvotUnit: 'mm',
    vti1Value: '20',
    vti1Unit: 'cm',
    vti2Value: '80',
    vti2Unit: 'cm',
    avaUnit: 'cm2',
  };
}

export function inputsEqual(
  a: AorticValveAreaInput,
  b: AorticValveAreaInput
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const LENGTH_UNIT_LABELS: Record<LengthUnit, string> = {
  mm: 'mm',
  cm: 'cm',
};

export const VTI_UNIT_LABELS: Record<VtiUnit, string> = {
  cm: 'cm',
  m: 'm',
};

export const AREA_UNIT_LABELS: Record<AreaUnit, string> = {
  cm2: 'cm²',
  mm2: 'mm²',
};

export const SEVERITY_TABLE_ROWS: readonly {
  range: string;
  label: string;
  band: AsSeverityBand;
}[] = [
  { range: '< 1', label: 'Severe', band: 'severe' },
  { range: '1 – 1.5', label: 'Moderate', band: 'moderate' },
  { range: '1.5 – 3', label: 'Mild', band: 'mild' },
  { range: '> 3', label: 'Normal', band: 'normal' },
];
