import {
  POUNDS_PER_STONE,
  type PoundsToStoneInput,
  type PoundsToStoneResult,
} from './types';

export { POUNDS_PER_STONE };

/** Readable mass display without ugly trailing zeros. */
export function formatMass(value: number): string {
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

export function poundsToStone(pounds: number): number {
  if (!Number.isFinite(pounds) || pounds < 0) {
    throw new Error('Invalid pounds value');
  }
  return pounds / POUNDS_PER_STONE;
}

export function stoneToPounds(stone: number): number {
  if (!Number.isFinite(stone) || stone < 0) {
    throw new Error('Invalid stone value');
  }
  return stone * POUNDS_PER_STONE;
}

/** Split total pounds into whole stones + remaining pounds. */
export function splitPoundsToStoneAndPounds(pounds: number): {
  wholeStones: number;
  remainingPounds: number;
} {
  const wholeStones = Math.floor(pounds / POUNDS_PER_STONE);
  const remainingPounds = pounds - wholeStones * POUNDS_PER_STONE;
  return { wholeStones, remainingPounds };
}

export function formatMixedStonePounds(wholeStones: number, remainingPounds: number): string {
  return `${formatMass(wholeStones)} st ${formatMass(remainingPounds)} lb`;
}

export function calculatePoundsToStone(input: PoundsToStoneInput): PoundsToStoneResult {
  let pounds: number;
  let stone: number;

  if (input.source === 'pounds') {
    pounds = input.pounds!;
    stone = poundsToStone(pounds);
  } else {
    stone = input.stone!;
    pounds = stoneToPounds(stone);
  }

  const { wholeStones, remainingPounds } = splitPoundsToStoneAndPounds(pounds);

  const explanation =
    input.source === 'pounds'
      ? `${formatMass(pounds)} lb ÷ ${POUNDS_PER_STONE} = ${formatMass(stone)} st`
      : `${formatMass(stone)} st × ${POUNDS_PER_STONE} = ${formatMass(pounds)} lb`;

  return {
    source: input.source,
    pounds,
    stone,
    wholeStones,
    remainingPounds,
    explanation,
  };
}

export function shareResultText(result: PoundsToStoneResult): string {
  return [
    'Pounds to Stone Converter — Omega Calculators',
    '',
    `${formatMass(result.pounds)} lb = ${formatMass(result.stone)} st`,
    '',
    '/tools/pounds-to-stone-converter',
  ].join('\n');
}
