import {
  CUP_UNIT_LABEL,
  LITERS_PER_CUP,
  LITERS_PER_QUART,
  QUART_UNIT_LABEL,
  type CupUnit,
  type CupsToQuartsInput,
  type CupsToQuartsResult,
  type QuartUnit,
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

export function cupsToQuarts(
  cups: number,
  cupUnit: CupUnit = 'usCustomary',
  quartUnit: QuartUnit = 'usLiquid',
): number {
  assertNonNegative(cups);
  const liters = cups * LITERS_PER_CUP[cupUnit];
  const result = liters / LITERS_PER_QUART[quartUnit];
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function quartsToCups(
  quarts: number,
  quartUnit: QuartUnit = 'usLiquid',
  cupUnit: CupUnit = 'usCustomary',
): number {
  assertNonNegative(quarts);
  const liters = quarts * LITERS_PER_QUART[quartUnit];
  const result = liters / LITERS_PER_CUP[cupUnit];
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function calculateCupsToQuarts(input: CupsToQuartsInput): CupsToQuartsResult {
  let liters: number;
  let cups: number;
  let quarts: number;

  if (input.source === 'cups') {
    cups = input.value!;
    liters = cups * LITERS_PER_CUP[input.cupUnit];
    quarts = liters / LITERS_PER_QUART[input.quartUnit];
  } else {
    quarts = input.value!;
    liters = quarts * LITERS_PER_QUART[input.quartUnit];
    cups = liters / LITERS_PER_CUP[input.cupUnit];
  }

  const cupLabel = CUP_UNIT_LABEL[input.cupUnit];
  const quartLabel = QUART_UNIT_LABEL[input.quartUnit];
  const explanation = `${formatVolume(cups)} ${cupLabel} = ${formatVolume(quarts)} ${quartLabel} · ${formatVolume(liters)} L`;

  return {
    source: input.source,
    cups,
    quarts,
    liters,
    cupUnit: input.cupUnit,
    quartUnit: input.quartUnit,
    explanation,
  };
}

export function shareResultText(result: CupsToQuartsResult): string {
  return [
    'Cups to Quarts Converter',
    'Omega Calculators',
    '',
    `Cups: ${formatVolume(result.cups)} ${CUP_UNIT_LABEL[result.cupUnit]}`,
    `Quarts: ${formatVolume(result.quarts)} ${QUART_UNIT_LABEL[result.quartUnit]}`,
  ].join('\n');
}
