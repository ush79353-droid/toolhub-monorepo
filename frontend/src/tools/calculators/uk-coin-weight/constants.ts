/**
 * Royal Mint standard masses for currently circulating UK coins (grams).
 *
 * Sources (Royal Mint designs & specifications):
 * - 1p: 3.56g (copper-plated steel, since Sept 1992)
 * - 2p: 7.12g (copper-plated steel, since Sept 1992)
 * - 5p: 3.25g (smaller cupro-nickel / nickel-plated steel issue)
 * - 10p: 6.50g (smaller issue)
 * - 20p: 5.00g
 * - 50p: 8.00g (smaller issue from 1997)
 * - £1: 8.75g (12-sided bimetallic, from 28 Mar 2017)
 * - £2: 12.00g (bimetallic)
 *
 * Educational estimate for standard circulating pieces; commemorative /
 * historical variants may differ.
 */

export const UK_COIN_IDS = [
  'oneP',
  'twoP',
  'fiveP',
  'tenP',
  'twentyP',
  'fiftyP',
  'onePound',
  'twoPound',
] as const;

export type UkCoinId = (typeof UK_COIN_IDS)[number];

export const UK_COIN_MASS_GRAMS: Readonly<Record<UkCoinId, number>> = {
  oneP: 3.56,
  twoP: 7.12,
  fiveP: 3.25,
  tenP: 6.5,
  twentyP: 5,
  fiftyP: 8,
  onePound: 8.75,
  twoPound: 12,
};

export const UK_COIN_LABELS: Readonly<Record<UkCoinId, string>> = {
  oneP: '1p coins',
  twoP: '2p coins',
  fiveP: '5p coins',
  tenP: '10p coins',
  twentyP: '20p coins',
  fiftyP: '50p coins',
  onePound: '£1 coins',
  twoPound: '£2 coins',
};

/** Face value in pence (for optional face-value summary). */
export const UK_COIN_VALUE_PENCE: Readonly<Record<UkCoinId, number>> = {
  oneP: 1,
  twoP: 2,
  fiveP: 5,
  tenP: 10,
  twentyP: 20,
  fiftyP: 50,
  onePound: 100,
  twoPound: 200,
};

export const MAX_COIN_COUNT = 1_000_000_000;
