export type UnitCategory = 'length' | 'mass' | 'time' | 'area' | 'volume';

export type ConversionDirection = 'regular-to-weird' | 'weird-to-regular';

export interface RegularUnitDef {
  id: string;
  label: string;
  symbol: string;
  /** Multiply by this to reach the category base unit. */
  toBase: number;
}

export interface WeirdUnitDef {
  id: string;
  label: string;
  category: UnitCategory;
  /** Size of one weird unit in the category base unit. */
  baseValue: number;
  description: string;
  approximate: boolean;
  sourceNote?: string;
}

export const CATEGORY_OPTIONS: readonly {
  id: UnitCategory;
  label: string;
  baseLabel: string;
}[] = [
  { id: 'length', label: 'Height / length', baseLabel: 'meters' },
  { id: 'mass', label: 'Mass / weight', baseLabel: 'kilograms' },
  { id: 'time', label: 'Time', baseLabel: 'seconds' },
  { id: 'area', label: 'Area', baseLabel: 'square meters' },
  { id: 'volume', label: 'Volume', baseLabel: 'cubic meters' },
];

export const DIRECTION_OPTIONS: readonly {
  id: ConversionDirection;
  label: string;
}[] = [
  { id: 'regular-to-weird', label: 'Regular → weird' },
  { id: 'weird-to-regular', label: 'Weird → regular' },
];

/** Length regular units → meters. */
export const LENGTH_REGULAR: readonly RegularUnitDef[] = [
  { id: 'mm', label: 'Millimeters', symbol: 'mm', toBase: 0.001 },
  { id: 'cm', label: 'Centimeters', symbol: 'cm', toBase: 0.01 },
  { id: 'm', label: 'Meters', symbol: 'm', toBase: 1 },
  { id: 'km', label: 'Kilometers', symbol: 'km', toBase: 1000 },
  { id: 'in', label: 'Inches', symbol: 'in', toBase: 0.0254 },
  { id: 'ft', label: 'Feet', symbol: 'ft', toBase: 0.3048 },
  { id: 'yd', label: 'Yards', symbol: 'yd', toBase: 0.9144 },
  { id: 'mi', label: 'Miles', symbol: 'mi', toBase: 1609.344 },
];

/** Mass regular units → kilograms. */
export const MASS_REGULAR: readonly RegularUnitDef[] = [
  { id: 'mg', label: 'Milligrams', symbol: 'mg', toBase: 1e-6 },
  { id: 'g', label: 'Grams', symbol: 'g', toBase: 0.001 },
  { id: 'kg', label: 'Kilograms', symbol: 'kg', toBase: 1 },
  { id: 't', label: 'Metric tons', symbol: 't', toBase: 1000 },
  { id: 'oz', label: 'Ounces', symbol: 'oz', toBase: 0.028349523125 },
  { id: 'lb', label: 'Pounds', symbol: 'lb', toBase: 0.45359237 },
];

/** Time regular units → seconds. Year = Julian year (365.25 d). */
export const TIME_REGULAR: readonly RegularUnitDef[] = [
  { id: 'ms', label: 'Milliseconds', symbol: 'ms', toBase: 0.001 },
  { id: 's', label: 'Seconds', symbol: 's', toBase: 1 },
  { id: 'min', label: 'Minutes', symbol: 'min', toBase: 60 },
  { id: 'h', label: 'Hours', symbol: 'h', toBase: 3600 },
  { id: 'd', label: 'Days', symbol: 'd', toBase: 86_400 },
  { id: 'week', label: 'Weeks', symbol: 'wk', toBase: 604_800 },
  { id: 'year', label: 'Years (Julian)', symbol: 'yr', toBase: 31_557_600 },
];

/** Area regular units → square meters. */
export const AREA_REGULAR: readonly RegularUnitDef[] = [
  { id: 'mm2', label: 'Square millimeters', symbol: 'mm²', toBase: 1e-6 },
  { id: 'cm2', label: 'Square centimeters', symbol: 'cm²', toBase: 1e-4 },
  { id: 'm2', label: 'Square meters', symbol: 'm²', toBase: 1 },
  { id: 'km2', label: 'Square kilometers', symbol: 'km²', toBase: 1e6 },
  { id: 'ft2', label: 'Square feet', symbol: 'ft²', toBase: 0.09290304 },
  { id: 'yd2', label: 'Square yards', symbol: 'yd²', toBase: 0.83612736 },
  { id: 'acre', label: 'Acres', symbol: 'ac', toBase: 4046.8564224 },
  { id: 'ha', label: 'Hectares', symbol: 'ha', toBase: 10_000 },
];

/** Volume regular units → cubic meters. */
export const VOLUME_REGULAR: readonly RegularUnitDef[] = [
  { id: 'ml', label: 'Milliliters', symbol: 'mL', toBase: 1e-6 },
  { id: 'L', label: 'Liters', symbol: 'L', toBase: 0.001 },
  { id: 'm3', label: 'Cubic meters', symbol: 'm³', toBase: 1 },
  { id: 'floz', label: 'US fluid ounces', symbol: 'fl oz', toBase: 2.95735295625e-5 },
  { id: 'gal', label: 'US gallons', symbol: 'gal', toBase: 0.003785411784 },
  { id: 'ft3', label: 'Cubic feet', symbol: 'ft³', toBase: 0.028316846592 },
];

export const WEIRD_UNITS: readonly WeirdUnitDef[] = [
  {
    id: 'lego-brick-height',
    label: 'LEGO brick heights',
    category: 'length',
    baseValue: 0.0096,
    description: 'One standard LEGO brick standing on its studs (9.6 mm including studs).',
    approximate: false,
    sourceNote: 'Commonly cited brick height with studs; orientation fixed as studs-up.',
  },
  {
    id: 'mount-everest-height',
    label: 'Mount Everest heights',
    category: 'length',
    baseValue: 8848.86,
    description: 'Official joint survey height of Mount Everest above sea level (2020).',
    approximate: false,
    sourceNote: '8,848.86 m (China–Nepal joint announcement).',
  },
  {
    id: 'golden-gate-bridge',
    label: 'Golden Gate Bridge lengths',
    category: 'length',
    baseValue: 2737,
    description: 'Total length of the Golden Gate Bridge structure.',
    approximate: false,
    sourceNote: '2,737 m total length reference.',
  },
  {
    id: 'basketball-hoop',
    label: 'Basketball hoop heights',
    category: 'length',
    baseValue: 3.048,
    description: 'Standard rim height (10 ft) above the court.',
    approximate: false,
  },
  {
    id: 'olympic-pool-length',
    label: 'Olympic pool lengths',
    category: 'length',
    baseValue: 50,
    description: 'Length of a standard Olympic swimming pool course.',
    approximate: false,
  },
  {
    id: 'african-elephant',
    label: 'African elephant masses',
    category: 'mass',
    baseValue: 6000,
    description: 'Representative adult African elephant body mass.',
    approximate: true,
    sourceNote: 'Illustrative ~6,000 kg; real animals vary widely.',
  },
  {
    id: 'blue-whale',
    label: 'Blue whale masses',
    category: 'mass',
    baseValue: 150_000,
    description: 'Representative adult blue whale body mass.',
    approximate: true,
    sourceNote: 'Illustrative ~150,000 kg.',
  },
  {
    id: 'bowling-ball',
    label: 'Bowling balls',
    category: 'mass',
    baseValue: 7.26,
    description: 'About 16 lb bowling ball mass.',
    approximate: true,
  },
  {
    id: 'paperclip',
    label: 'Paperclips',
    category: 'mass',
    baseValue: 0.001,
    description: 'About 1 g for a typical small metal paperclip.',
    approximate: true,
  },
  {
    id: 'adult-cat',
    label: 'Adult cat masses',
    category: 'mass',
    baseValue: 4.5,
    description: 'Representative average adult domestic cat mass.',
    approximate: true,
  },
  {
    id: 'movie',
    label: 'Feature movies (2 h)',
    category: 'time',
    baseValue: 7200,
    description: 'Illustrative feature film duration of 120 minutes.',
    approximate: true,
  },
  {
    id: 'episode',
    label: 'TV episodes (30 min)',
    category: 'time',
    baseValue: 1800,
    description: 'Illustrative half-hour episode including commercials convention.',
    approximate: true,
  },
  {
    id: 'school-lesson',
    label: 'School lessons (45 min)',
    category: 'time',
    baseValue: 2700,
    description: 'Illustrative 45-minute lesson block.',
    approximate: true,
  },
  {
    id: 'workday',
    label: 'Workdays (8 h)',
    category: 'time',
    baseValue: 28_800,
    description: 'Illustrative standard 8-hour workday.',
    approximate: true,
  },
  {
    id: 'century',
    label: 'Centuries (Julian)',
    category: 'time',
    baseValue: 3_155_760_000,
    description: '100 Julian years (365.25 days each).',
    approximate: false,
  },
  {
    id: 'american-football-field',
    label: 'American football fields',
    category: 'area',
    baseValue: 5351.215,
    description: 'NFL field including end zones: 120 yd × 53⅓ yd.',
    approximate: false,
    sourceNote: '120 × 53.333… yd ≈ 5,351.215 m².',
  },
  {
    id: 'tennis-court',
    label: 'Tennis courts (doubles)',
    category: 'area',
    baseValue: 260.8714,
    description: 'ITF doubles court 23.77 m × 10.97 m.',
    approximate: false,
  },
  {
    id: 'basketball-court',
    label: 'NBA basketball courts',
    category: 'area',
    baseValue: 436.6413,
    description: 'NBA court 94 ft × 50 ft.',
    approximate: false,
  },
  {
    id: 'olympic-pool-surface',
    label: 'Olympic pool surfaces',
    category: 'area',
    baseValue: 1250,
    description: '50 m × 25 m competition pool water surface.',
    approximate: false,
  },
  {
    id: 'beverage-can',
    label: 'Beverage cans (355 mL)',
    category: 'volume',
    baseValue: 0.000355,
    description: 'Standard 12 fl oz (355 mL) soft-drink can capacity.',
    approximate: true,
  },
  {
    id: 'bathtub',
    label: 'Bathtubs (150 L)',
    category: 'volume',
    baseValue: 0.15,
    description: 'Illustrative bathtub fill of about 150 liters.',
    approximate: true,
  },
  {
    id: 'olympic-pool-volume',
    label: 'Olympic pools (volume)',
    category: 'volume',
    baseValue: 2500,
    description: '50 m × 25 m × 2 m illustrative competition pool volume.',
    approximate: true,
    sourceNote: 'Depth assumed 2 m for volume; real pools vary.',
  },
  {
    id: 'water-bottle',
    label: 'Water bottles (500 mL)',
    category: 'volume',
    baseValue: 0.0005,
    description: 'Common 500 mL bottle capacity.',
    approximate: true,
  },
];

export const MAX_ABS_BASE = 1e30;

export function regularUnitsFor(category: UnitCategory): readonly RegularUnitDef[] {
  switch (category) {
    case 'length':
      return LENGTH_REGULAR;
    case 'mass':
      return MASS_REGULAR;
    case 'time':
      return TIME_REGULAR;
    case 'area':
      return AREA_REGULAR;
    case 'volume':
      return VOLUME_REGULAR;
  }
}

export function weirdUnitsFor(category: UnitCategory): readonly WeirdUnitDef[] {
  return WEIRD_UNITS.filter((unit) => unit.category === category);
}

export function defaultRegularId(category: UnitCategory): string {
  switch (category) {
    case 'length':
      return 'm';
    case 'mass':
      return 'kg';
    case 'time':
      return 'h';
    case 'area':
      return 'm2';
    case 'volume':
      return 'L';
  }
}

export function defaultWeirdId(category: UnitCategory): string {
  return weirdUnitsFor(category)[0]?.id ?? '';
}

export function defaultValueText(category: UnitCategory): string {
  switch (category) {
    case 'length':
      return '100';
    case 'mass':
      return '70';
    case 'time':
      return '1';
    case 'area':
      return '1';
    case 'volume':
      return '1';
  }
}
