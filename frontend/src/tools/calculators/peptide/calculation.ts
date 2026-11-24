/**
 * Educational syringe volume arithmetic for an already labeled product (ADR-018).
 *
 * concentration = vial mass / diluent volume
 * draw volume = dose / concentration
 * syringe marks = draw volume × (marks per mL) — calibration must be explicit.
 *
 * Not reconstitution advice, injection instructions, or peptide dosing guidance.
 */

import type { MassUnit, PeptideInput, PeptideResult } from './types';

export const SOURCE_NOTE =
  'Dimensional concentration arithmetic only: mass ÷ volume. Syringe “units” require an explicit marks-per-mL calibration (e.g. U-100 = 100 marks/mL). Not product-specific dosing.';

export const DISCLAIMER =
  'Educational labeled-product worksheet only — not medical advice, reconstitution guidance, or endorsement of any unapproved substance.';

export function parseNumber(text: string): number | null {
  const t = text.trim();
  if (t === '') return null;
  const n = Number(t.replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

export function toMcg(amount: number, unit: MassUnit): number {
  return unit === 'mg' ? amount * 1000 : amount;
}

export function formatFixed(n: number, digits: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
    useGrouping: false,
  }).format(n);
}

export function calculatePeptide(input: PeptideInput): PeptideResult {
  const empty: PeptideResult = {
    concentrationMcgPerMl: null,
    drawVolumeMl: null,
    syringeUnits: null,
    vialMassMcg: null,
    doseMcg: null,
    formattedConcentration: '',
    formattedDrawMl: '',
    formattedUnits: '',
    statusHeadline: 'Enter vial mass, diluent, dose, and syringe scale',
    statusDetail: 'Concentration = mass ÷ volume; syringe marks need marks/mL.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const vial = parseNumber(input.vialMassText);
  const diluent = parseNumber(input.diluentMlText);
  const dose = parseNumber(input.doseText);
  const scale = parseNumber(input.syringeUnitsPerMlText);

  if (vial === null || diluent === null || dose === null || scale === null) {
    return empty;
  }
  if (!(vial > 0) || !(diluent > 0) || !(dose > 0) || !(scale > 0)) {
    return empty;
  }

  const vialMcg = toMcg(vial, input.vialMassUnit);
  const doseMcg = toMcg(dose, input.doseUnit);
  if (doseMcg > vialMcg) {
    return {
      ...empty,
      statusHeadline: 'Dose exceeds vial mass',
      statusDetail: 'Entered dose is larger than labeled vial contents.',
    };
  }

  const concentrationMcgPerMl = vialMcg / diluent;
  const drawVolumeMl = doseMcg / concentrationMcgPerMl;
  const syringeUnits = drawVolumeMl * scale;

  return {
    concentrationMcgPerMl,
    drawVolumeMl,
    syringeUnits,
    vialMassMcg: vialMcg,
    doseMcg,
    formattedConcentration: formatFixed(concentrationMcgPerMl, 4),
    formattedDrawMl: formatFixed(drawVolumeMl, 4),
    formattedUnits: formatFixed(syringeUnits, 2),
    statusHeadline: `Draw ${formatFixed(syringeUnits, 2)} syringe marks`,
    statusDetail: `Concentration ${formatFixed(concentrationMcgPerMl, 2)} mcg/mL; volume ${formatFixed(drawVolumeMl, 4)} mL at ${formatFixed(scale, 0)} marks/mL.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
