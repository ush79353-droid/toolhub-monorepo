/**
 * mmol/L ↔ mg/dL conversion using published molar masses / clinical conventions.
 * mg/dL = mmol/L × (MW g/mol) / 10. Pure — no React, DOM, or FX.
 */
import {
  ANALYTE_OPTIONS,
  MAX_ABS_VALUE,
  type AnalyteId,
  type ConcentrationPair,
  type MmollToMgdlInput,
  type MmollToMgdlResult,
  type PanelConversion,
} from './types';

export function getAnalyteOption(analyte: AnalyteId) {
  const option = ANALYTE_OPTIONS.find((row) => row.value === analyte);
  if (!option) {
    throw new Error(`Unknown analyte: ${analyte}`);
  }
  return option;
}

/** mg/dL per mmol/L = molar mass (g/mol) / 10 */
export function conversionFactor(molarMassGPerMol: number): number {
  return molarMassGPerMol / 10;
}

export function mmolLToMgDl(mmolL: number, molarMassGPerMol: number): number {
  return mmolL * conversionFactor(molarMassGPerMol);
}

export function mgDlToMmolL(mgDl: number, molarMassGPerMol: number): number {
  return mgDl / conversionFactor(molarMassGPerMol);
}

export function formatMeasure(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  else digits = 18;
  return String(Number(value.toFixed(digits)));
}

function isUsableConcentration(value: number | null): value is number {
  return value !== null && Number.isFinite(value) && value >= 0 && value <= MAX_ABS_VALUE;
}

export function isPositiveMolarMass(value: number | null): value is number {
  return value !== null && Number.isFinite(value) && value > 0 && value <= MAX_ABS_VALUE;
}

function convertPair(
  panel: 'preset' | 'custom',
  pair: ConcentrationPair,
  molarMassGPerMol: number,
  label: string
): PanelConversion | null {
  if (!isPositiveMolarMass(molarMassGPerMol)) return null;
  const factor = conversionFactor(molarMassGPerMol);
  const sourceValue = pair.source === 'mmolL' ? pair.mmolL : pair.mgDl;
  if (!isUsableConcentration(sourceValue)) return null;

  const mmolL =
    pair.source === 'mmolL' ? sourceValue : mgDlToMmolL(sourceValue, molarMassGPerMol);
  const mgDl =
    pair.source === 'mgDl' ? sourceValue : mmolLToMgDl(sourceValue, molarMassGPerMol);

  return {
    panel,
    molarMassGPerMol,
    mmolL,
    mgDl,
    factor,
    label,
    explanation: `${formatMeasure(mmolL)} mmol/L × ${formatMeasure(molarMassGPerMol)} ÷ 10 = ${formatMeasure(mgDl)} mg/dL (${label}).`,
  };
}

/**
 * Convert each panel independently. Missing/incomplete panels stay null.
 * Returns null only when neither panel produces a conversion.
 */
export function calculateMmollToMgdl(input: MmollToMgdlInput): MmollToMgdlResult | null {
  const analyte = getAnalyteOption(input.analyte);
  const preset = convertPair('preset', input.preset, analyte.molarMassGPerMol, analyte.label);

  let custom: PanelConversion | null = null;
  if (input.customOpen && isPositiveMolarMass(input.customMolarMass)) {
    custom = convertPair(
      'custom',
      input.custom,
      input.customMolarMass,
      `Custom MW ${formatMeasure(input.customMolarMass)} g/mol`
    );
  }

  if (!preset && !custom) return null;
  return { preset, custom };
}

export function shareResultText(result: MmollToMgdlResult): string {
  const lines = ['mmol/L to mg/dL Calculator | Omega Calculators'];
  if (result.preset) {
    lines.push(
      `${result.preset.label}: ${formatMeasure(result.preset.mmolL)} mmol/L ↔ ${formatMeasure(result.preset.mgDl)} mg/dL (MW ${formatMeasure(result.preset.molarMassGPerMol)} g/mol)`
    );
  }
  if (result.custom) {
    lines.push(
      `Custom MW ${formatMeasure(result.custom.molarMassGPerMol)} g/mol: ${formatMeasure(result.custom.mmolL)} mmol/L ↔ ${formatMeasure(result.custom.mgDl)} mg/dL`
    );
  }
  return lines.join('\n');
}
