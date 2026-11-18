import { formatAngle } from '../coordinates/calculation';
import { CPS_TO_UNIT, CPS_UNITS, CPS_UNIT_SYMBOLS, type CpsUnit } from './types';

export function formatCps(value: number): string {
  const raw = formatAngle(value, 12);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function toCps(value: number, unit: CpsUnit): number {
  return value / CPS_TO_UNIT[unit];
}

export function fromCps(cps: number, unit: CpsUnit): number {
  return cps * CPS_TO_UNIT[unit];
}

export function allFromCps(cps: number): Record<CpsUnit, number> {
  const out = {} as Record<CpsUnit, number>;
  for (const unit of CPS_UNITS) {
    out[unit] = fromCps(cps, unit);
  }
  return out;
}

export function shareResultText(cps: number): string {
  const a = allFromCps(cps);
  return [
    'CPS Calculator',
    'Omega Calculators',
    '',
    `Cycles per second: ${formatCps(a.cps)} ${CPS_UNIT_SYMBOLS.cps}`,
    `Cycles per minute: ${formatCps(a.cpm)} ${CPS_UNIT_SYMBOLS.cpm}`,
    `Revolutions per minute: ${formatCps(a.rpm)} ${CPS_UNIT_SYMBOLS.rpm}`,
    `Hertz: ${formatCps(a.hz)} ${CPS_UNIT_SYMBOLS.hz}`,
    `Kilohertz: ${formatCps(a.khz)} ${CPS_UNIT_SYMBOLS.khz}`,
    `Megahertz: ${formatCps(a.mhz)} ${CPS_UNIT_SYMBOLS.mhz}`,
    `Gigahertz: ${formatCps(a.ghz)} ${CPS_UNIT_SYMBOLS.ghz}`,
    `Degrees per second: ${formatCps(a.degPerSec)} ${CPS_UNIT_SYMBOLS.degPerSec}`,
    `Radians per second: ${formatCps(a.radPerSec)} ${CPS_UNIT_SYMBOLS.radPerSec}`,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
