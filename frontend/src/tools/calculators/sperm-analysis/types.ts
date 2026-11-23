/**
 * Sperm Analysis Calculator — educational total & functional sperm counts.
 *
 * Screenshot fields: ejaculate volume, concentration, morphology %, motility %,
 * vitality %, read-only total sperm (mln) and functional sperm (mln).
 */

export type VolumeUnit = 'mL' | 'uL';
export type ConcentrationUnit = 'mln_per_mL' | 'mln_per_uL';

export interface SpermAnalysisInput {
  volumeText: string;
  volumeUnit: VolumeUnit;
  concentrationText: string;
  concentrationUnit: ConcentrationUnit;
  morphologyText: string;
  motilityText: string;
  vitalityText: string;
}

export interface SpermAnalysisResult {
  totalSpermMillion: number | null;
  functionalSpermMillion: number | null;
  volumeMl: number | null;
  concentrationMlnPerMl: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type SpermAnalysisFieldErrors = {
  volumeText?: string;
  concentrationText?: string;
  morphologyText?: string;
  motilityText?: string;
  vitalityText?: string;
};

export function createDefaultInput(): SpermAnalysisInput {
  return {
    volumeText: '',
    volumeUnit: 'mL',
    concentrationText: '',
    concentrationUnit: 'mln_per_mL',
    morphologyText: '',
    motilityText: '',
    vitalityText: '',
  };
}

export function createEmptyInput(): SpermAnalysisInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: SpermAnalysisInput,
  b: SpermAnalysisInput,
): boolean {
  return (
    a.volumeText === b.volumeText &&
    a.volumeUnit === b.volumeUnit &&
    a.concentrationText === b.concentrationText &&
    a.concentrationUnit === b.concentrationUnit &&
    a.morphologyText === b.morphologyText &&
    a.motilityText === b.motilityText &&
    a.vitalityText === b.vitalityText
  );
}
