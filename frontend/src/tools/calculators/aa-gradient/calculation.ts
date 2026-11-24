/**
 * A–a oxygen gradient from the alveolar gas equation.
 * PAO₂ = FiO₂ × (Patm − PH₂O) − PaCO₂ / R
 * A–a = PAO₂ − PaO₂
 * Expected (mmHg) ≈ age/4 + 4
 */

import { DISCLAIMER, SOURCE_LABEL } from './content';
import type { AaGradientInput, AaGradientResult, PressureUnit } from './types';

export { DISCLAIMER, SOURCE_LABEL };

/** Ideal water vapor pressure at 37 °C (body temperature), mmHg. */
export const PH2O_MMHG = 47;

/** Respiratory quotient (dimensionless). */
export const R_QUOTIENT = 0.8;

/** Exact mmHg ↔ kPa factor (IUPAC-style conversion used in ABG tools). */
export const KPA_PER_MMHG = 0.133322387415;

export function mmHgToKpa(mmHg: number): number {
  return mmHg * KPA_PER_MMHG;
}

export function kpaToMmHg(kPa: number): number {
  return kPa / KPA_PER_MMHG;
}

export function toMmHg(value: number, unit: PressureUnit): number {
  return unit === 'mmHg' ? value : kpaToMmHg(value);
}

export function fromMmHg(mmHg: number, unit: PressureUnit): number {
  return unit === 'mmHg' ? mmHg : mmHgToKpa(mmHg);
}

export function formatPressure(mmHg: number, unit: PressureUnit): string {
  const v = fromMmHg(mmHg, unit);
  if (unit === 'mmHg') {
    return `${round1(v)} mmHg`;
  }
  return `${round2(v)} kPa`;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function expectedAaGradientMmHg(ageYears: number): number {
  return ageYears / 4 + 4;
}

export function calculateAaGradient(input: AaGradientInput): AaGradientResult {
  const fio2Fraction = (input.fio2Percent as number) / 100;
  const paco2MmHg = toMmHg(input.paco2 as number, input.gasUnit);
  const pao2MmHg = toMmHg(input.pao2 as number, input.gasUnit);
  const patmMmHg = toMmHg(input.atmPressure as number, input.atmUnit);

  const inspired = fio2Fraction * (patmMmHg - PH2O_MMHG);
  const pao2AlveolarMmHg = inspired - paco2MmHg / R_QUOTIENT;
  const aaGradientMmHg = pao2AlveolarMmHg - pao2MmHg;

  const expectedForAgeMmHg =
    input.ageYears != null && Number.isFinite(input.ageYears)
      ? expectedAaGradientMmHg(input.ageYears)
      : null;

  return {
    aaGradientMmHg,
    expectedForAgeMmHg,
    pao2AlveolarMmHg,
    formattedGradient: formatPressure(aaGradientMmHg, input.resultUnit),
    formattedExpected:
      expectedForAgeMmHg == null
        ? '—'
        : formatPressure(expectedForAgeMmHg, input.resultUnit),
    explanation: `PAO₂ = FiO₂×(Patm−${PH2O_MMHG} mmHg) − PaCO₂/${R_QUOTIENT} → ${round1(pao2AlveolarMmHg)} mmHg; A–a = PAO₂ − PaO₂. Expected uses age/4 + 4 mmHg when age is entered. Assumed body temperature 37 °C for water vapor.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
