import {
  CUP_UNIT_LABEL,
  LITERS_PER_CUP,
  LITERS_PER_FLUID_OUNCE,
  OUNCE_UNIT_LABEL,
  type CupUnit,
  type CupsToOzInput,
  type CupsToOzResult,
  type FluidOunceUnit,
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
  return String(rounded);
}

function assertNonNegative(value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('Invalid volume');
  }
}

export function cupsToFluidOunces(
  cups: number,
  cupUnit: CupUnit = 'usCustomary',
  ounceUnit: FluidOunceUnit = 'usFlOz',
): number {
  assertNonNegative(cups);
  const liters = cups * LITERS_PER_CUP[cupUnit];
  const result = liters / LITERS_PER_FLUID_OUNCE[ounceUnit];
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function fluidOuncesToCups(
  ounces: number,
  ounceUnit: FluidOunceUnit = 'usFlOz',
  cupUnit: CupUnit = 'usCustomary',
): number {
  assertNonNegative(ounces);
  const liters = ounces * LITERS_PER_FLUID_OUNCE[ounceUnit];
  const result = liters / LITERS_PER_CUP[cupUnit];
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function calculateCupsToOz(input: CupsToOzInput): CupsToOzResult {
  let liters: number;
  let cups: number;
  let ounces: number;

  if (input.source === 'cups') {
    cups = input.value!;
    liters = cups * LITERS_PER_CUP[input.cupUnit];
    ounces = liters / LITERS_PER_FLUID_OUNCE[input.ounceUnit];
  } else {
    ounces = input.value!;
    liters = ounces * LITERS_PER_FLUID_OUNCE[input.ounceUnit];
    cups = liters / LITERS_PER_CUP[input.cupUnit];
  }

  const cupLabel = CUP_UNIT_LABEL[input.cupUnit];
  const ozLabel = OUNCE_UNIT_LABEL[input.ounceUnit];
  const explanation = `${formatVolume(cups)} ${cupLabel} = ${formatVolume(ounces)} ${ozLabel} · ${formatVolume(liters)} L`;

  return {
    source: input.source,
    cups,
    ounces,
    liters,
    cupUnit: input.cupUnit,
    ounceUnit: input.ounceUnit,
    explanation,
  };
}

export function shareResultText(result: CupsToOzResult): string {
  return [
    'Cups to Oz Converter',
    'Omega Calculators',
    '',
    `Cups: ${formatVolume(result.cups)} ${CUP_UNIT_LABEL[result.cupUnit]}`,
    `Fluid Ounces: ${formatVolume(result.ounces)} ${OUNCE_UNIT_LABEL[result.ounceUnit]}`,
  ].join('\n');
}
