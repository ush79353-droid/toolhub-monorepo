import { formatAngle } from '../coordinates/calculation';
import {
  ABSORBED_TO_GRAY,
  ABSORBED_UNITS,
  EQUIVALENT_TO_SIEVERT,
  EQUIVALENT_UNITS,
  RADIATION_UNIT_SYMBOLS,
  type AbsorbedUnit,
  type EquivalentUnit,
} from './types';

export function formatDose(value: number): string {
  const raw = formatAngle(value, 12);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function toGray(value: number, unit: AbsorbedUnit): number {
  return value * ABSORBED_TO_GRAY[unit];
}

export function fromGray(gray: number, unit: AbsorbedUnit): number {
  return gray / ABSORBED_TO_GRAY[unit];
}

export function allFromGray(gray: number): Record<AbsorbedUnit, number> {
  const out = {} as Record<AbsorbedUnit, number>;
  for (const unit of ABSORBED_UNITS) out[unit] = fromGray(gray, unit);
  return out;
}

export function toSievert(value: number, unit: EquivalentUnit): number {
  return value * EQUIVALENT_TO_SIEVERT[unit];
}

export function fromSievert(sievert: number, unit: EquivalentUnit): number {
  return sievert / EQUIVALENT_TO_SIEVERT[unit];
}

export function allFromSievert(sievert: number): Record<EquivalentUnit, number> {
  const out = {} as Record<EquivalentUnit, number>;
  for (const unit of EQUIVALENT_UNITS) out[unit] = fromSievert(sievert, unit);
  return out;
}

export function shareResultText(opts: {
  gray: number | null;
  sievert: number | null;
}): string {
  const lines = ['Radiation Converter | Omega Calculators', ''];
  if (opts.gray != null) {
    const a = allFromGray(opts.gray);
    lines.push(
      'Absorbed dose:',
      `${formatDose(a.milliGray)} mGy = ${formatDose(a.gray)} Gy = ${formatDose(a.rad)} rad`,
      '',
    );
  }
  if (opts.sievert != null) {
    const e = allFromSievert(opts.sievert);
    lines.push(
      'Equivalent dose:',
      `${formatDose(e.microSievert)} µSv = ${formatDose(e.milliSievert)} mSv = ${formatDose(e.rem)} rem`,
      '',
    );
  }
  lines.push(
    'Note: Gy (absorbed) and Sv (equivalent) are not universally interchangeable.',
    '',
    'Calculated with Omega Calculators',
  );
  return lines.join('\n');
}

export { RADIATION_UNIT_SYMBOLS };
