import {
  POUNDS_PER_STONE,
  type LbsToStoneInput,
  type LbsToStoneResult,
} from './types';

/** Readable weight display without ugly trailing zeros. */
export function formatWeight(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
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

export function poundsToStone(pounds: number): number {
  return pounds / POUNDS_PER_STONE;
}

export function stoneToPounds(stones: number): number {
  return stones * POUNDS_PER_STONE;
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
  return `${formatWeight(wholeStones)} st ${formatWeight(remainingPounds)} lb`;
}

export function calculateLbsToStone(input: LbsToStoneInput): LbsToStoneResult {
  let pounds: number;
  let stones: number;

  if (input.source === 'pounds') {
    pounds = input.pounds!;
    stones = poundsToStone(pounds);
  } else {
    stones = input.stones!;
    pounds = stoneToPounds(stones);
  }

  const { wholeStones, remainingPounds } = splitPoundsToStoneAndPounds(pounds);

  const explanation =
    input.source === 'pounds'
      ? `${formatWeight(pounds)} lb ÷ ${POUNDS_PER_STONE} = ${formatWeight(stones)} st`
      : `${formatWeight(stones)} st × ${POUNDS_PER_STONE} = ${formatWeight(pounds)} lb`;

  return {
    source: input.source,
    pounds,
    stones,
    wholeStones,
    remainingPounds,
    explanation,
  };
}

export function shareResultText(result: LbsToStoneResult): string {
  return [
    'Lbs to Stone Converter',
    '',
    `${formatWeight(result.pounds)} lb = ${formatWeight(result.stones)} st`,
    `(also ${formatMixedStonePounds(result.wholeStones, result.remainingPounds)})`,
    '',
    'Omega Calculators',
  ].join('\n');
}
