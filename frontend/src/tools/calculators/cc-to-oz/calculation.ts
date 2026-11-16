import {
  CC_PER_UK_FL_OZ,
  CC_PER_US_FL_OZ,
  type CcToOzInput,
  type CcToOzResult,
  type FluidOunceSystem,
} from './types';

/** Readable volume display without ugly trailing zeros. */
export function formatVolume(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  const rounded = Number(value.toFixed(digits));
  const raw = String(rounded);
  if (raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function ccPerFluidOz(system: FluidOunceSystem): number {
  return system === 'uk' ? CC_PER_UK_FL_OZ : CC_PER_US_FL_OZ;
}

export function ccToFluidOunces(cc: number, system: FluidOunceSystem = 'us'): number {
  return cc / ccPerFluidOz(system);
}

export function fluidOuncesToCc(fluidOunces: number, system: FluidOunceSystem = 'us'): number {
  return fluidOunces * ccPerFluidOz(system);
}

export function systemLabel(system: FluidOunceSystem): string {
  return system === 'uk' ? 'UK fl oz' : 'US fl oz';
}

export function calculateCcToOz(input: CcToOzInput): CcToOzResult {
  let cc: number;
  let oz: number;

  if (input.source === 'cc') {
    cc = input.cc!;
    oz = ccToFluidOunces(cc, input.system);
  } else {
    oz = input.oz!;
    cc = fluidOuncesToCc(oz, input.system);
  }

  const label = systemLabel(input.system);
  const factor = ccPerFluidOz(input.system);
  const explanation =
    input.source === 'cc'
      ? `${formatVolume(cc)} cc ÷ ${factor} = ${formatVolume(oz)} ${label}`
      : `${formatVolume(oz)} ${label} × ${factor} = ${formatVolume(cc)} cc`;

  return { source: input.source, system: input.system, cc, oz, explanation };
}

export function shareResultText(result: CcToOzResult): string {
  const label = systemLabel(result.system);
  const factor = ccPerFluidOz(result.system);
  return [
    'CC to OZ Converter — Omega Calculators',
    '',
    `${formatVolume(result.cc)} cc = ${formatVolume(result.oz)} ${label}`,
    '',
    'Formula:',
    `${label} = cc / ${factor}`,
    result.explanation,
  ].join('\n');
}
