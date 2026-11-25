import { DISCLAIMER, SOURCE_LABEL } from './content';
import type { OxygenationIndexInput, OxygenationIndexResult, PaO2Unit } from './types';

export { DISCLAIMER, SOURCE_LABEL };

const KPA_TO_MMHG = 7.50061683;

export function pao2ToMmHg(value: number, unit: PaO2Unit): number {
  return unit === 'mmHg' ? value : value * KPA_TO_MMHG;
}

/** FiO₂ % → fraction; reject double conversion by requiring percent input. */
export function fio2FractionFromPercent(percent: number): number {
  return percent / 100;
}

function roundDisplay(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * P/F = PaO₂_mmHg / FiO₂_fraction
 * OI = 100 × FiO₂_fraction × MAP_cmH2O / PaO₂_mmHg
 */
export function calculateOxygenationIndex(
  input: OxygenationIndexInput,
): OxygenationIndexResult {
  const fio2Frac = fio2FractionFromPercent(input.fio2Percent as number);
  const map = input.map as number;
  const pao2MmHg = pao2ToMmHg(input.pao2 as number, input.pao2Unit);

  const pfRatio = pao2MmHg / fio2Frac;
  const oi = (100 * fio2Frac * map) / pao2MmHg;

  return {
    pfRatio,
    oi,
    formattedPf: String(roundDisplay(pfRatio)),
    formattedOi: String(roundDisplay(oi)),
    explanation: `P/F = PaO₂ ÷ FiO₂ fraction. OI = 100 × FiO₂ fraction × MAP ÷ PaO₂. FiO₂ ${input.fio2Percent}% → ${fio2Frac}.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
