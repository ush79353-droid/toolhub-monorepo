export const FUEL_UNITS = ['usMpg', 'ukMpg', 'lPer100Km', 'kmPerLiter'] as const;

export type FuelEconomyUnit = (typeof FUEL_UNITS)[number];

export type FuelFieldErrors = Partial<Record<FuelEconomyUnit, string>>;

/** Exact SI / customary definitions. */
export const KILOMETERS_PER_MILE = 1.609344;
export const LITERS_PER_US_GALLON = 3.785411784;
export const LITERS_PER_UK_GALLON = 4.54609;

/** km/L per 1 US mpg (and vice versa via reciprocal). */
export const US_MPG_TO_KM_PER_L = KILOMETERS_PER_MILE / LITERS_PER_US_GALLON;
/** km/L per 1 UK mpg. */
export const UK_MPG_TO_KM_PER_L = KILOMETERS_PER_MILE / LITERS_PER_UK_GALLON;

export const FUEL_UNIT_SYMBOLS: Record<FuelEconomyUnit, string> = {
  usMpg: 'US mpg',
  ukMpg: 'UK mpg',
  lPer100Km: 'L/100 km',
  kmPerLiter: 'km/L',
};

export const FUEL_FIELD_LABELS: Record<FuelEconomyUnit, string> = {
  usMpg: 'Miles per US gallon',
  ukMpg: 'Miles per UK gallon',
  lPer100Km: 'Liters per 100 kilometers',
  kmPerLiter: 'Kilometers per liter',
};

export const MAX_ABS_KM_PER_L = 1e15;
