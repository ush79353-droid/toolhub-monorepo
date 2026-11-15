/** Nominal ASTM E11 / US Standard test sieve designation. */
export interface AstmE11Sieve {
  /** Designation without "No." prefix, e.g. "100". */
  designation: string;
  label: string;
  /** Nominal opening in micrometers. */
  openingUm: number;
}

/**
 * ASTM E11 (US Standard) nominal sieve openings (µm).
 * Source: common ASTM E11 nominal aperture chart for test sieves.
 * Values are nominal openings, not guaranteed manufactured apertures.
 */
export const ASTM_E11_SIEVES: readonly AstmE11Sieve[] = [
  { designation: '4', label: 'No. 4', openingUm: 4750 },
  { designation: '5', label: 'No. 5', openingUm: 4000 },
  { designation: '6', label: 'No. 6', openingUm: 3350 },
  { designation: '7', label: 'No. 7', openingUm: 2800 },
  { designation: '8', label: 'No. 8', openingUm: 2360 },
  { designation: '10', label: 'No. 10', openingUm: 2000 },
  { designation: '12', label: 'No. 12', openingUm: 1700 },
  { designation: '14', label: 'No. 14', openingUm: 1400 },
  { designation: '16', label: 'No. 16', openingUm: 1180 },
  { designation: '18', label: 'No. 18', openingUm: 1000 },
  { designation: '20', label: 'No. 20', openingUm: 850 },
  { designation: '25', label: 'No. 25', openingUm: 710 },
  { designation: '30', label: 'No. 30', openingUm: 600 },
  { designation: '35', label: 'No. 35', openingUm: 500 },
  { designation: '40', label: 'No. 40', openingUm: 425 },
  { designation: '45', label: 'No. 45', openingUm: 355 },
  { designation: '50', label: 'No. 50', openingUm: 300 },
  { designation: '60', label: 'No. 60', openingUm: 250 },
  { designation: '70', label: 'No. 70', openingUm: 212 },
  { designation: '80', label: 'No. 80', openingUm: 180 },
  { designation: '100', label: 'No. 100', openingUm: 150 },
  { designation: '120', label: 'No. 120', openingUm: 125 },
  { designation: '140', label: 'No. 140', openingUm: 106 },
  { designation: '170', label: 'No. 170', openingUm: 90 },
  { designation: '200', label: 'No. 200', openingUm: 75 },
  { designation: '230', label: 'No. 230', openingUm: 63 },
  { designation: '270', label: 'No. 270', openingUm: 53 },
  { designation: '325', label: 'No. 325', openingUm: 45 },
  { designation: '400', label: 'No. 400', openingUm: 38 },
] as const;

export const ASTM_E11_BY_DESIGNATION: Record<string, AstmE11Sieve> = Object.fromEntries(
  ASTM_E11_SIEVES.map((s) => [s.designation, s])
);

export type CalculatorMode = 'standard' | 'custom' | 'reverse';

export type WireDiameterUnit = 'mm' | 'um' | 'in';

export interface MeshToMicronInput {
  mode: CalculatorMode;
  /** ASTM E11 designation string, e.g. "100". */
  sieveDesignation: string;
  /** Custom mesh count (openings per linear inch). */
  meshCount: number | null;
  wireDiameter: number | null;
  wireUnit: WireDiameterUnit;
  /** Reverse lookup opening in µm. */
  reverseUm: number | null;
}

export interface OpeningEquivalents {
  um: number;
  mm: number;
  cm: number;
  in: number;
  mil: number;
}

export interface ReverseLookupResult {
  exact: boolean;
  sieve: AstmE11Sieve;
  differenceUm: number;
}

export interface MeshToMicronResult {
  mode: CalculatorMode;
  standard: 'ASTM E11';
  sieveLabel: string | null;
  openingUm: number;
  equivalents: OpeningEquivalents;
  explanation: string;
  reverse: ReverseLookupResult | null;
  /** Present only in custom mode. */
  pitchMm: number | null;
}

export type MeshToMicronFieldErrors = {
  sieve?: string;
  meshCount?: string;
  wireDiameter?: string;
  reverseUm?: string;
};

export const DEFAULT_SIEVE = '100';

export const DEFAULT_MESH_TO_MICRON_INPUT: MeshToMicronInput = {
  mode: 'standard',
  sieveDesignation: DEFAULT_SIEVE,
  meshCount: null,
  wireDiameter: null,
  wireUnit: 'mm',
  reverseUm: null,
};

export const MM_PER_INCH = 25.4;
export const UM_PER_MM = 1000;
export const UM_PER_INCH = 25_400;
export const UM_PER_MIL = 25.4;
export const MAX_ABS_VALUE = 1e12;
