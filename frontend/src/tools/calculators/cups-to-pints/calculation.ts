import {
  CUP_UNIT_LABEL,
  LITERS_PER_CUP,
  LITERS_PER_PINT,
  PINT_UNIT_LABEL,
  type CupUnit,
  type CupsToPintsInput,
  type CupsToPintsResult,
  type PintUnit,
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

export function cupsToPints(
  cups: number,
  cupUnit: CupUnit = 'usCustomary',
  pintUnit: PintUnit = 'usLiquid',
): number {
  assertNonNegative(cups);
  const liters = cups * LITERS_PER_CUP[cupUnit];
  const result = liters / LITERS_PER_PINT[pintUnit];
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function pintsToCups(
  pints: number,
  pintUnit: PintUnit = 'usLiquid',
  cupUnit: CupUnit = 'usCustomary',
): number {
  assertNonNegative(pints);
  const liters = pints * LITERS_PER_PINT[pintUnit];
  const result = liters / LITERS_PER_CUP[cupUnit];
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function calculateCupsToPints(input: CupsToPintsInput): CupsToPintsResult {
  let liters: number;
  let cups: number;
  let pints: number;

  if (input.source === 'cups') {
    cups = input.value!;
    liters = cups * LITERS_PER_CUP[input.cupUnit];
    pints = liters / LITERS_PER_PINT[input.pintUnit];
  } else {
    pints = input.value!;
    liters = pints * LITERS_PER_PINT[input.pintUnit];
    cups = liters / LITERS_PER_CUP[input.cupUnit];
  }

  const cupLabel = CUP_UNIT_LABEL[input.cupUnit];
  const pintLabel = PINT_UNIT_LABEL[input.pintUnit];
  const explanation = `${formatVolume(cups)} ${cupLabel} = ${formatVolume(pints)} ${pintLabel} · ${formatVolume(liters)} L`;

  return {
    source: input.source,
    cups,
    pints,
    liters,
    cupUnit: input.cupUnit,
    pintUnit: input.pintUnit,
    explanation,
  };
}

export function shareResultText(result: CupsToPintsResult): string {
  return [
    'Cups to Pints Converter',
    'Omega Calculators',
    '',
    `Cups: ${formatVolume(result.cups)} ${CUP_UNIT_LABEL[result.cupUnit]}`,
    `Pints: ${formatVolume(result.pints)} ${PINT_UNIT_LABEL[result.pintUnit]}`,
  ].join('\n');
}
