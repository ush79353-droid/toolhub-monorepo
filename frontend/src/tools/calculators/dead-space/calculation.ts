import { DISCLAIMER, SOURCE_LABEL } from './content';
import type { DeadSpaceInput, DeadSpaceResult, VolumeUnit } from './types';

export { DISCLAIMER, SOURCE_LABEL };

export function toMl(value: number, unit: VolumeUnit): number {
  return unit === 'mL' ? value : value * 1000;
}

export function fromMl(ml: number, unit: VolumeUnit): number {
  return unit === 'mL' ? ml : ml / 1000;
}

export function formatVolume(ml: number, unit: VolumeUnit): string {
  const v = fromMl(ml, unit);
  if (unit === 'mL') return `${Math.round(v * 10) / 10} mL`;
  return `${Math.round(v * 1000) / 1000} L`;
}

/** Bohr: VD = VT × (PACO₂ − PECO₂) / PACO₂ */
export function calculateDeadSpace(input: DeadSpaceInput): DeadSpaceResult {
  const paco2 = input.alveolarCo2 as number;
  const peco2 = input.exhaledCo2 as number;
  const vtMl = toMl(input.tidalVolume as number, input.tidalUnit);
  const ratio = (paco2 - peco2) / paco2;
  const deadSpaceMl = vtMl * ratio;

  return {
    deadSpaceMl,
    vdVtRatio: ratio,
    formattedDeadSpace: formatVolume(deadSpaceMl, input.resultUnit),
    explanation: `Bohr VD = VT × (PACO₂ − PECO₂) / PACO₂. VD/VT = ${Math.round(ratio * 1000) / 1000}. Enter alveolar (or clearly labeled Enghoff arterial) CO₂ with mixed-expired PECO₂ in matching units.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
