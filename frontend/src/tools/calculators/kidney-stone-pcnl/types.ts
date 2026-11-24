/** Okhunov 2013 S.T.O.N.E. nephrolithometry — PCNL (not emergency renal-colic STONE). */

export type StoneSizeBand = 's0_399' | 's400_799' | 's800_1599' | 's1600_plus';
export type TractLengthBand = 'le100' | 'gt100';
export type ObstructionBand = 'none_mild' | 'moderate_severe';
export type CalycesBand = 'c1_2' | 'c3' | 'staghorn';
export type DensityBand = 'le950' | 'gt950';

export interface KidneyStonePcnlInput {
  stoneSize: StoneSizeBand;
  tractLength: TractLengthBand;
  obstruction: ObstructionBand;
  calyces: CalycesBand;
  density: DensityBand;
}

export interface KidneyStonePcnlResult {
  totalScore: number;
  stoneFreePercent: number;
  explanation: string;
  disclaimer: string;
  sourceNote: string;
}

export type KidneyStonePcnlFieldErrors = {
  form?: string;
};

/** Screenshot defaults: first option in each group → score 5. */
export function createDefaultInput(): KidneyStonePcnlInput {
  return {
    stoneSize: 's0_399',
    tractLength: 'le100',
    obstruction: 'none_mild',
    calyces: 'c1_2',
    density: 'le950',
  };
}

export function createEmptyInput(): KidneyStonePcnlInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: KidneyStonePcnlInput,
  b: KidneyStonePcnlInput,
): boolean {
  return (
    a.stoneSize === b.stoneSize &&
    a.tractLength === b.tractLength &&
    a.obstruction === b.obstruction &&
    a.calyces === b.calyces &&
    a.density === b.density
  );
}

export const STONE_SIZE_OPTIONS: readonly {
  value: StoneSizeBand;
  label: string;
}[] = [
  { value: 's0_399', label: '0–399 mm²' },
  { value: 's400_799', label: '400–799 mm²' },
  { value: 's800_1599', label: '800–1599 mm²' },
  { value: 's1600_plus', label: '≥ 1600 mm²' },
];

export const TRACT_OPTIONS: readonly {
  value: TractLengthBand;
  label: string;
}[] = [
  { value: 'le100', label: '≤ 100 mm' },
  { value: 'gt100', label: '> 100 mm' },
];

export const OBSTRUCTION_OPTIONS: readonly {
  value: ObstructionBand;
  label: string;
}[] = [
  { value: 'none_mild', label: 'No/mild hydronephrosis' },
  { value: 'moderate_severe', label: 'Moderate/severe hydronephrosis' },
];

export const CALYCES_OPTIONS: readonly {
  value: CalycesBand;
  label: string;
}[] = [
  { value: 'c1_2', label: '1–2' },
  { value: 'c3', label: '3' },
  { value: 'staghorn', label: 'Full staghorn stone' },
];

export const DENSITY_OPTIONS: readonly {
  value: DensityBand;
  label: string;
}[] = [
  /** Okhunov essence: ≤950 HU (screenshot shows “< 950 HU”). */
  { value: 'le950', label: '≤ 950 HU' },
  { value: 'gt950', label: '> 950 HU' },
];
