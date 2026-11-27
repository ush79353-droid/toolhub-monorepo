/**
 * Winters' formula — expected compensatory pCO₂ in metabolic acidosis (ADR-018).
 *
 * Expected pCO₂ (mmHg) = 1.5 × [HCO₃⁻] + 8
 * Teaching range: expected ± 2 mmHg
 *
 * Convert center and endpoints to kPa only after mmHg math.
 * 1 mmHg = 0.133322387415 kPa (same bridge as A–a / ABG tools).
 */

import type {
  BicarbUnit,
  PressureUnit,
  WintersFormulaInput,
  WintersFormulaResult,
} from './types';

export const SOURCE_NOTE =
  "Winters' formula (metabolic acidosis compensation): expected pCO₂ (mmHg) = 1.5 × HCO₃ + 8, with teaching range ±2 mmHg. Convert to kPa after the mmHg calculation. Educational only — not a measured pCO₂.";

export const DISCLAIMER =
  'Not a diagnosis or ventilator order — confirm ABG interpretation with your clinician.';

export const KPA_PER_MMHG = 0.133322387415;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** mmol/L and mEq/L are numerically equal for bicarbonate. */
export function bicarbonateToMmolL(
  value: number,
  _unit: BicarbUnit,
): number {
  return value;
}

export function mmHgToKpa(mmHg: number): number {
  return mmHg * KPA_PER_MMHG;
}

export function fromMmHg(mmHg: number, unit: PressureUnit): number {
  return unit === 'mmHg' ? mmHg : mmHgToKpa(mmHg);
}

export function expectedPco2MmHg(bicarbonateMmolL: number): number {
  return 1.5 * bicarbonateMmolL + 8;
}

export function formatPressure(
  value: number | null,
  unit: PressureUnit,
): string {
  if (value == null || !Number.isFinite(value)) return '';
  const digits = unit === 'mmHg' ? 1 : 2;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function calculateWintersFormula(
  input: WintersFormulaInput,
): WintersFormulaResult {
  const empty = {
    bicarbonateMmolL: null,
    expectedMmHg: null,
    lowerMmHg: null,
    upperMmHg: null,
    expectedDisplay: null,
    lowerDisplay: null,
    upperDisplay: null,
    formattedExpected: '',
    formattedLower: '',
    formattedUpper: '',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const hco3Raw = parseNumber(input.bicarbonateText);
  if (hco3Raw === null) {
    return {
      ...empty,
      statusHeadline: 'Enter bicarbonate',
      statusDetail:
        'Enter HCO₃ to estimate expected compensatory pCO₂ (Winters).',
    };
  }

  if (!(hco3Raw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid bicarbonate',
      statusDetail: 'HCO₃ must be greater than zero.',
    };
  }

  const bicarbonateMmolL = bicarbonateToMmolL(
    hco3Raw,
    input.bicarbonateUnit,
  );
  const expectedMmHg = expectedPco2MmHg(bicarbonateMmolL);
  const lowerMmHg = expectedMmHg - 2;
  const upperMmHg = expectedMmHg + 2;

  const round = (v: number) =>
    input.resultUnit === 'mmHg'
      ? Math.round(v * 10) / 10
      : Math.round(v * 100) / 100;

  const expectedDisplay = round(fromMmHg(expectedMmHg, input.resultUnit));
  const lowerDisplay = round(fromMmHg(lowerMmHg, input.resultUnit));
  const upperDisplay = round(fromMmHg(upperMmHg, input.resultUnit));
  const unitLabel = input.resultUnit === 'mmHg' ? 'mmHg' : 'kPa';

  return {
    bicarbonateMmolL,
    expectedMmHg,
    lowerMmHg,
    upperMmHg,
    expectedDisplay,
    lowerDisplay,
    upperDisplay,
    formattedExpected: formatPressure(expectedDisplay, input.resultUnit),
    formattedLower: formatPressure(lowerDisplay, input.resultUnit),
    formattedUpper: formatPressure(upperDisplay, input.resultUnit),
    statusHeadline: "Winters' expected pCO₂",
    statusDetail: `Expected compensatory pCO₂ ≈ ${formatPressure(expectedDisplay, input.resultUnit)} ${unitLabel} (range ${formatPressure(lowerDisplay, input.resultUnit)}–${formatPressure(upperDisplay, input.resultUnit)}).`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
