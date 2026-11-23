import { calculateSpermAnalysis, parseNumber } from './calculation';
import type {
  SpermAnalysisFieldErrors,
  SpermAnalysisInput,
  SpermAnalysisResult,
} from './types';

export interface SpermAnalysisValidation {
  errors: SpermAnalysisFieldErrors;
  result: SpermAnalysisResult | null;
}

function validatePercent(
  raw: string,
  label: string,
): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label}.`;
  if (!(n >= 0) || !(n <= 100)) return `${label} must be between 0 and 100.`;
  return undefined;
}

export function validateSpermAnalysisInput(
  input: SpermAnalysisInput,
): SpermAnalysisValidation {
  const errors: SpermAnalysisFieldErrors = {};

  if (input.volumeText.trim() !== '') {
    const v = parseNumber(input.volumeText);
    if (v === null) errors.volumeText = 'Enter a valid ejaculate volume.';
    else if (!(v >= 0)) errors.volumeText = 'Volume cannot be negative.';
  }

  if (input.concentrationText.trim() !== '') {
    const c = parseNumber(input.concentrationText);
    if (c === null) errors.concentrationText = 'Enter a valid concentration.';
    else if (!(c >= 0))
      errors.concentrationText = 'Concentration cannot be negative.';
  }

  const morphErr = validatePercent(input.morphologyText, 'morphology %');
  if (morphErr) errors.morphologyText = morphErr;
  const motErr = validatePercent(input.motilityText, 'motility %');
  if (motErr) errors.motilityText = motErr;
  const vitErr = validatePercent(input.vitalityText, 'vitality %');
  if (vitErr) errors.vitalityText = vitErr;

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateSpermAnalysis(input) };
}
