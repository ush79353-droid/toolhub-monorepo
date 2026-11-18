import { formatAngle } from '../coordinates/calculation';
import {
  DENSITY_TO_KG_M3,
  DENSITY_UNIT_SYMBOLS,
  MOLAR_CONC_SYMBOLS,
  MOLAR_CONC_TO_MOL_L,
  MOLAR_MASS_SYMBOLS,
  MOLAR_MASS_TO_G_MOL,
  type DensityUnit,
  type MolarConcUnit,
  type MolarMassUnit,
} from './types';

export function formatConc(value: number): string {
  const raw = formatAngle(value, 12);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function densityToKgM3(value: number, unit: DensityUnit): number {
  return value * DENSITY_TO_KG_M3[unit];
}

export function kgM3ToDensity(kgM3: number, unit: DensityUnit): number {
  return kgM3 / DENSITY_TO_KG_M3[unit];
}

export function molarMassToGMol(value: number, unit: MolarMassUnit): number {
  return value * MOLAR_MASS_TO_G_MOL[unit];
}

export function molarConcToMolL(value: number, unit: MolarConcUnit): number {
  return value * MOLAR_CONC_TO_MOL_L[unit];
}

export function molLToMolarConc(molL: number, unit: MolarConcUnit): number {
  return molL / MOLAR_CONC_TO_MOL_L[unit];
}

/** Mass-based ppm → mg/L using density in kg/m³. */
export function ppmToMgL(ppm: number, densityKgM3: number): number {
  return (ppm * densityKgM3) / 1000;
}

export function mgLToPpm(mgL: number, densityKgM3: number): number {
  return (mgL * 1000) / densityKgM3;
}

/** mg/L → mol/L with molar mass in g/mol. */
export function mgLToMolL(mgL: number, molarMassGMol: number): number {
  return mgL / (1000 * molarMassGMol);
}

export function molLToMgL(molL: number, molarMassGMol: number): number {
  return molL * molarMassGMol * 1000;
}

export function shareResultText(input: {
  ppm: number;
  densityKgM3: number;
  densityUnit: DensityUnit;
  densityDisplay: number;
  mgL: number;
  molarMassGMol: number | null;
  molarMassDisplay: number | null;
  molarMassUnit: MolarMassUnit;
  molL: number | null;
  molarConcDisplay: number | null;
  molarConcUnit: MolarConcUnit;
}): string {
  const lines = [
    'PPM to mg/L Converter — Omega Calculators',
    '',
    `PPM (mass-based): ${formatConc(input.ppm)} ppm`,
    `Solution density: ${formatConc(input.densityDisplay)} ${DENSITY_UNIT_SYMBOLS[input.densityUnit]}`,
    `Mass concentration: ${formatConc(input.mgL)} mg/L`,
  ];
  if (input.molarMassGMol != null && input.molarMassDisplay != null) {
    lines.push(
      `Solute molar mass: ${formatConc(input.molarMassDisplay)} ${MOLAR_MASS_SYMBOLS[input.molarMassUnit]}`,
    );
  }
  if (input.molL != null && input.molarConcDisplay != null) {
    lines.push(
      `Molar concentration: ${formatConc(input.molarConcDisplay)} ${MOLAR_CONC_SYMBOLS[input.molarConcUnit]}`,
    );
  }
  lines.push('', 'Calculated with Omega Calculators');
  return lines.join('\n');
}
