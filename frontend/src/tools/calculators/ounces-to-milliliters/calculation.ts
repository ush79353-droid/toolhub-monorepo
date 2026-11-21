import {
  ML_PER_UK_FL_OZ,
  ML_PER_US_FL_OZ,
  type FluidOunceSystem,
  type OuncesToMillilitersInput,
  type OuncesToMillilitersResult,
} from './types';

export { ML_PER_UK_FL_OZ, ML_PER_US_FL_OZ };

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

export function mlPerFluidOz(system: FluidOunceSystem): number {
  return system === 'uk' ? ML_PER_UK_FL_OZ : ML_PER_US_FL_OZ;
}

export function fluidOuncesToMilliliters(
  fluidOunces: number,
  system: FluidOunceSystem = 'us',
): number {
  return fluidOunces * mlPerFluidOz(system);
}

export function millilitersToFluidOunces(
  milliliters: number,
  system: FluidOunceSystem = 'us',
): number {
  return milliliters / mlPerFluidOz(system);
}

export function systemLabel(system: FluidOunceSystem): string {
  return system === 'uk' ? 'UK fl oz' : 'US fl oz';
}

export function calculateOuncesToMilliliters(
  input: OuncesToMillilitersInput,
): OuncesToMillilitersResult {
  let oz: number;
  let ml: number;

  if (input.source === 'oz') {
    oz = input.oz!;
    ml = fluidOuncesToMilliliters(oz, input.system);
  } else {
    ml = input.ml!;
    oz = millilitersToFluidOunces(ml, input.system);
  }

  const label = systemLabel(input.system);
  const factor = mlPerFluidOz(input.system);
  const explanation =
    input.source === 'oz'
      ? `${formatVolume(oz)} ${label} × ${factor} = ${formatVolume(ml)} mL`
      : `${formatVolume(ml)} mL ÷ ${factor} = ${formatVolume(oz)} ${label}`;

  return { source: input.source, system: input.system, oz, ml, explanation };
}

export function shareResultText(result: OuncesToMillilitersResult): string {
  const label = systemLabel(result.system);
  return [
    'Ounces to Milliliters Converter | Omega Calculators',
    '',
    `${formatVolume(result.oz)} ${label} = ${formatVolume(result.ml)} mL`,
    '',
    '/tools/ounces-to-milliliters-converter',
  ].join('\n');
}
