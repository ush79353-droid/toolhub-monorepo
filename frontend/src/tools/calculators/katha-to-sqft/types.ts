/** Which measurement the user last edited. */
export type KathaAreaSource = 'katha' | 'ft2' | 'm2';

export type KathaRegionId =
  | 'nepal'
  | 'bangladesh'
  | 'west-bengal'
  | 'assam'
  | 'patna'
  | 'gaya'
  | 'aurangabad'
  | 'saran';

export interface KathaRegion {
  id: KathaRegionId;
  name: string;
  squareFeetPerKatha: number;
  /** Short citation for why this factor is exposed. */
  source: string;
}

export interface KathaToSqftInput {
  source: KathaAreaSource;
  regionId: KathaRegionId;
  katha: number | null;
  ft2: number | null;
  m2: number | null;
}

export interface KathaToSqftResult {
  source: KathaAreaSource;
  regionId: KathaRegionId;
  regionName: string;
  squareFeetPerKatha: number;
  squareMetersPerKatha: number;
  katha: number;
  ft2: number;
  m2: number;
  explanation: string;
}

export type KathaToSqftFieldErrors = {
  katha?: string;
  ft2?: string;
  m2?: string;
};

/** Exact international square meters per square foot. */
export const SQUARE_METERS_PER_SQUARE_FOOT = 0.09290304;

export const MAX_ABS_VALUE = 1e15;

/**
 * Verified regional katha definitions only.
 * Screenshot-listed options without a confirmed factor stay documented as pending in the guide.
 */
export const KATHA_REGIONS: readonly KathaRegion[] = [
  {
    id: 'nepal',
    name: 'Nepal',
    squareFeetPerKatha: 3645,
    source: 'Nepal Department of Survey (1 katha = 20 dhur = 3,645 ft²)',
  },
  {
    id: 'bangladesh',
    name: 'Bangladesh',
    squareFeetPerKatha: 720,
    source: 'Bangladesh standard: 1 katha = 720 ft²; 20 katha = 1 bigha',
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    squareFeetPerKatha: 720,
    source: 'West Bengal cottah/katha convention: 1 katha = 720 ft²',
  },
  {
    id: 'assam',
    name: 'Assam',
    squareFeetPerKatha: 2880,
    source: 'Assam standard: 1 katha = 2,880 ft² (lower Assam/Cachar may use 720 ft²)',
  },
  {
    id: 'patna',
    name: 'Patna',
    squareFeetPerKatha: 1361.25,
    source: 'Patna / Arrah convention: 1 katha = 1,361.25 ft² (3.125 decimal)',
  },
  {
    id: 'gaya',
    name: 'Gaya',
    squareFeetPerKatha: 1361.25,
    source: 'South Bihar (Gaya) land-record convention: 1 katha = 1,361.25 ft²',
  },
  {
    id: 'aurangabad',
    name: 'Aurangabad',
    squareFeetPerKatha: 1361.25,
    source: 'South Bihar (Aurangabad) land-record convention: 1 katha = 1,361.25 ft²',
  },
  {
    id: 'saran',
    name: 'Saran',
    squareFeetPerKatha: 1742.4,
    source: 'Saran / Chhapra convention: 1 katha = 4 decimal = 1,742.4 ft²',
  },
] as const;

export const DEFAULT_REGION_ID: KathaRegionId = 'nepal';

export const PENDING_REGION_NOTES = [
  'Bigha — a parent land unit, not a katha size; not listed as a region factor.',
  'Chhattisgarh — published katha sizes conflict (≈600 / 720 / 1,000 ft²); left pending.',
  'Generic Bihar — district values range widely (≈720–3,267 ft²); use a district option instead.',
  'South Bihar (umbrella) — use Gaya or Aurangabad where the 1,361.25 ft² convention applies.',
] as const;

export function getKathaRegion(id: KathaRegionId): KathaRegion {
  const region = KATHA_REGIONS.find((entry) => entry.id === id);
  if (!region) {
    throw new RangeError(`Unknown katha region: ${id}`);
  }
  return region;
}
