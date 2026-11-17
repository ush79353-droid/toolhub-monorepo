import { KG_PER_STONE } from '../weight-converter/types';

/** Which field the user last edited. */
export type KgStSource = 'kg' | 'st';

export interface KgToStonesInput {
  source: KgStSource;
  kg: number | null;
  st: number | null;
}

export type KgToStonesFieldErrors = {
  kg?: string;
  st?: string;
};

/** Exact: 1 British imperial stone = 14 lb = 6.35029318 kg. */
export { KG_PER_STONE };

/** Reciprocal: stones per kg. */
export const STONES_PER_KG = 1 / KG_PER_STONE;

export const MAX_ABS_VALUE = 1e15;
