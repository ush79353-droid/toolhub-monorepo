/**
 * UI stub — real mmol/L ↔ mg/dL formulas land in the engine commit.
 * Exports keep the form/calculator type-checkable without inventing results here.
 */
import {
  ANALYTE_OPTIONS,
  type AnalyteId,
  type MmollToMgdlInput,
  type MmollToMgdlResult,
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

/** Stub: returns null until the engine commit wires published MW conversions. */
export function calculateMmollToMgdl(_input: MmollToMgdlInput): MmollToMgdlResult | null {
  return null;
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
