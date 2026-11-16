export const QUANTITY_UNITS = [
  'unit',
  'pair',
  'decade',
  'halfDozen',
  'dozen',
  'bakersDozen',
  'score',
  'gross',
  'greatGross',
] as const;

export type QuantityUnit = (typeof QUANTITY_UNITS)[number];

export type QuantityFieldErrors = Partial<Record<QuantityUnit, string>>;

/** Multiply quantity value by this factor to obtain individual units. */
export const QUANTITY_TO_UNITS: Record<QuantityUnit, number> = {
  unit: 1,
  pair: 2,
  decade: 10,
  halfDozen: 6,
  dozen: 12,
  bakersDozen: 13,
  score: 20,
  gross: 144,
  greatGross: 1728,
};

export const QUANTITY_UNIT_SYMBOLS: Record<QuantityUnit, string> = {
  unit: 'units',
  pair: 'pairs',
  decade: 'decades',
  halfDozen: 'half-dozens',
  dozen: 'dozens',
  bakersDozen: "baker's dozens",
  score: 'scores',
  gross: 'grosses',
  greatGross: 'great grosses',
};

export const QUANTITY_FIELD_LABELS: Record<QuantityUnit, string> = {
  unit: 'Units / Points',
  pair: 'Pairs / Couples / Braces',
  decade: 'Decades',
  halfDozen: 'Half Dozens',
  dozen: 'Dozens',
  bakersDozen: "Baker's Dozens",
  score: 'Scores',
  gross: 'Grosses',
  greatGross: 'Great Grosses',
};

export const MAX_ABS_UNITS = 1e30;
