export type CapacitanceUnit = 'F' | 'mF' | 'uF' | 'nF' | 'pF';

export interface RationalFactor {
  numerator: bigint;
  denominator: bigint;
}

export interface CapacitanceUnitDef {
  id: CapacitanceUnit;
  label: string;
  symbol: string;
  /** Exact factor relative to farads: F = quantity × numerator / denominator. */
  factor: RationalFactor;
}

export type CapacitanceFieldErrors = Partial<Record<CapacitanceUnit, string>>;

export const MAX_INPUT_LENGTH = 64;
export const DISPLAY_FRAC_DIGITS = 18;

export const CAPACITANCE_UNITS: readonly CapacitanceUnitDef[] = [
  {
    id: 'F',
    label: 'Capacitance in farads',
    symbol: 'F',
    factor: { numerator: 1n, denominator: 1n },
  },
  {
    id: 'mF',
    label: 'Capacitance in millifarads',
    symbol: 'mF',
    factor: { numerator: 1n, denominator: 1000n },
  },
  {
    id: 'uF',
    label: 'Capacitance in microfarads',
    symbol: 'µF',
    factor: { numerator: 1n, denominator: 1_000_000n },
  },
  {
    id: 'nF',
    label: 'Capacitance in nanofarads',
    symbol: 'nF',
    factor: { numerator: 1n, denominator: 1_000_000_000n },
  },
  {
    id: 'pF',
    label: 'Capacitance in picofarads',
    symbol: 'pF',
    factor: { numerator: 1n, denominator: 1_000_000_000_000n },
  },
];

export const CAPACITANCE_UNIT_BY_ID: Readonly<Record<CapacitanceUnit, CapacitanceUnitDef>> =
  Object.freeze(
    Object.fromEntries(CAPACITANCE_UNITS.map((u) => [u.id, u])) as Record<
      CapacitanceUnit,
      CapacitanceUnitDef
    >
  );

export const CAP_FIELDS: readonly CapacitanceUnit[] = ['F', 'mF', 'uF', 'nF', 'pF'];

export const DEFAULT_FARADS = '1';
