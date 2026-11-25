import { DISCLAIMER, SOURCE_LABEL } from './content';
import type { Fio2Unit, PfRatioInput, PfRatioResult, PressureUnit } from './types';

export { DISCLAIMER, SOURCE_LABEL };

/** 1 mmHg = 0.133322387415 kPa (IUPAC conventional). */
export const MMHG_TO_KPA = 0.133322387415;

export function toMmHg(value: number, unit: PressureUnit): number {
  return unit === 'mmHg' ? value : value / MMHG_TO_KPA;
}

export function fromMmHg(mmHg: number, unit: PressureUnit): number {
  return unit === 'mmHg' ? mmHg : mmHg * MMHG_TO_KPA;
}

export function toFraction(value: number, unit: Fio2Unit): number {
  return unit === 'fraction' ? value : value / 100;
}

export function berlinBandHint(ratioMmHg: number): string {
  if (ratioMmHg > 300) {
    return 'Above the Berlin mild-ARDS P/F ceiling (>300 mmHg) — ratio alone is not a diagnosis.';
  }
  if (ratioMmHg > 200) {
    return 'Educational Berlin mild band (P/F ≤300 and >200 mmHg) — requires full ARDS criteria.';
  }
  if (ratioMmHg > 100) {
    return 'Educational Berlin moderate band (P/F ≤200 and >100 mmHg) — requires full ARDS criteria.';
  }
  return 'Educational Berlin severe band (P/F ≤100 mmHg) — requires full ARDS criteria.';
}

export function formatRatio(display: number, unit: PressureUnit): string {
  const rounded = Math.round(display * 10) / 10;
  return `${rounded} ${unit}`;
}

/** P/F = PaO₂ ÷ FiO₂(fraction). Result unit follows selected pressure display. */
export function calculatePfRatio(input: PfRatioInput): PfRatioResult {
  const pao2MmHg = toMmHg(input.pao2 as number, input.pao2Unit);
  const fio2Frac = toFraction(input.fio2 as number, input.fio2Unit);
  const ratioMmHg = pao2MmHg / fio2Frac;
  const ratioDisplay = fromMmHg(ratioMmHg, input.resultUnit);

  return {
    ratioMmHg,
    ratioDisplay,
    formattedRatio: formatRatio(ratioDisplay, input.resultUnit),
    berlinBandHint: berlinBandHint(ratioMmHg),
    explanation: `PaO₂/FiO₂ = ${formatRatio(ratioDisplay, input.resultUnit)} (${Math.round(ratioMmHg * 10) / 10} mmHg when FiO₂ = ${Math.round(fio2Frac * 1000) / 1000}). ${berlinBandHint(ratioMmHg)}`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
