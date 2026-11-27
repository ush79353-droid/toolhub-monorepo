/**
 * Alcohol Unit Calculator — screenshot-first educational worksheet (ADR-023).
 *
 * UK unit (NHS): volume_ml × ABV% / 1000  ≡ 10 ml pure ethanol ≈ 8 g.
 * Other countries: convert via ethanol grams (UK units × 8) ÷ country grams/standard.
 */

export type BeerSizeId = 'pint' | 'halfPint' | 'bottle' | 'can' | 'third' | 'smallBottle';

export type CountryId =
  | 'uk'
  | 'australia'
  | 'usa'
  | 'canada'
  | 'newZealand'
  | 'ireland'
  | 'france'
  | 'germany'
  | 'denmark'
  | 'japan';

export interface AlcoholUnitInput {
  lowBeerCount: number | null;
  lowBeerSize: BeerSizeId;
  standardBeerCount: number | null;
  standardBeerSize: BeerSizeId;
  strongBeerCount: number | null;
  strongBeerSize: BeerSizeId;
  wineStandardCount: number | null;
  showMoreSizes: boolean;
  wineSmallCount: number | null;
  wineLargeCount: number | null;
  champagneCount: number | null;
  alcopopCount: number | null;
  spiritCount: number | null;
  customOpen: boolean;
  customVolumeMl: number | null;
  customAbvPercent: number | null;
  customCount: number | null;
  margaritaCount: number | null;
  mojitoCount: number | null;
  martiniCount: number | null;
  rumCokeCount: number | null;
  vodkaTonicCount: number | null;
  country: CountryId;
}

export interface AlcoholUnitResult {
  ukUnits: number;
  ethanolGrams: number;
  displayUnits: number;
  formattedDisplay: string;
  unitLabel: string;
  countryLabel: string;
  gramsPerStandard: number;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type AlcoholUnitFieldErrors = {
  form?: string;
  lowBeerCount?: string;
  standardBeerCount?: string;
  strongBeerCount?: string;
  wineStandardCount?: string;
  wineSmallCount?: string;
  wineLargeCount?: string;
  champagneCount?: string;
  alcopopCount?: string;
  spiritCount?: string;
  customVolumeMl?: string;
  customAbvPercent?: string;
  customCount?: string;
  margaritaCount?: string;
  mojitoCount?: string;
  martiniCount?: string;
  rumCokeCount?: string;
  vodkaTonicCount?: string;
};

export const BEER_SIZE_OPTIONS: readonly {
  id: BeerSizeId;
  label: string;
  volumeMl: number;
  moreOnly?: boolean;
}[] = [
  { id: 'pint', label: 'pints', volumeMl: 568 },
  { id: 'halfPint', label: 'half-pints', volumeMl: 284 },
  { id: 'bottle', label: 'bottles', volumeMl: 330 },
  { id: 'can', label: 'cans', volumeMl: 440 },
  { id: 'third', label: 'thirds', volumeMl: 189, moreOnly: true },
  { id: 'smallBottle', label: 'small bottles (275 ml)', volumeMl: 275, moreOnly: true },
];

/** Documented preset ABV (%). Beer bands align with common NHS/Omni educational examples. */
export const PRESET_ABV = {
  lowBeer: 3.5,
  standardBeer: 5,
  strongBeer: 8,
  wine: 12,
  champagne: 12,
  alcopop: 4.6,
  spirit: 40,
} as const;

/** Wine glass volumes (ml). */
export const WINE_VOLUMES = {
  small: 125,
  standard: 175,
  large: 250,
} as const;

export const CHAMPAGNE_ML = 150;
export const ALCOPOP_ML = 275;
export const SPIRIT_ML = 25;

/**
 * Cocktail educational servings as spirit-equivalent volume × ABV
 * (mixers ignored). Sources: alcoholunits.com UK pub measures.
 */
export const COCKTAIL_SERVINGS: readonly {
  id: keyof Pick<
    AlcoholUnitInput,
    | 'margaritaCount'
    | 'mojitoCount'
    | 'martiniCount'
    | 'rumCokeCount'
    | 'vodkaTonicCount'
  >;
  label: string;
  volumeMl: number;
  abvPercent: number;
  note: string;
}[] = [
  {
    id: 'margaritaCount',
    label: 'Margarita',
    volumeMl: 50,
    abvPercent: 40,
    note: '50 ml tequila 40%',
  },
  {
    id: 'mojitoCount',
    label: 'Mojito',
    volumeMl: 50,
    abvPercent: 40,
    note: '50 ml rum 40%',
  },
  {
    id: 'martiniCount',
    label: 'Martini',
    volumeMl: 65,
    abvPercent: 40,
    note: 'spirit-equivalent ≈ 2.6 UK units (65 ml @ 40%)',
  },
  {
    id: 'rumCokeCount',
    label: 'Rum & coke',
    volumeMl: 25,
    abvPercent: 40,
    note: '25 ml rum 40% single',
  },
  {
    id: 'vodkaTonicCount',
    label: 'Vodka & tonic',
    volumeMl: 25,
    abvPercent: 40,
    note: '25 ml vodka 40% single',
  },
];

/** Grams of pure ethanol per national “unit” / standard drink (authoritative sources in content.ts). */
export const COUNTRY_OPTIONS: readonly {
  id: CountryId;
  label: string;
  grams: number;
}[] = [
  { id: 'uk', label: 'United Kingdom (8g)', grams: 8 },
  { id: 'australia', label: 'Australia (10g)', grams: 10 },
  { id: 'newZealand', label: 'New Zealand (10g)', grams: 10 },
  { id: 'ireland', label: 'Ireland (10g)', grams: 10 },
  { id: 'france', label: 'France (10g)', grams: 10 },
  { id: 'germany', label: 'Germany (10g)', grams: 10 },
  { id: 'japan', label: 'Japan (10g drink)', grams: 10 },
  { id: 'denmark', label: 'Denmark (12g)', grams: 12 },
  { id: 'canada', label: 'Canada (13.45g)', grams: 13.45 },
  { id: 'usa', label: 'United States (14g)', grams: 14 },
];

export function createDefaultInput(): AlcoholUnitInput {
  return {
    lowBeerCount: null,
    lowBeerSize: 'pint',
    standardBeerCount: null,
    standardBeerSize: 'bottle',
    strongBeerCount: null,
    strongBeerSize: 'can',
    wineStandardCount: null,
    showMoreSizes: false,
    wineSmallCount: null,
    wineLargeCount: null,
    champagneCount: null,
    alcopopCount: null,
    spiritCount: null,
    customOpen: false,
    customVolumeMl: null,
    customAbvPercent: null,
    customCount: null,
    margaritaCount: null,
    mojitoCount: null,
    martiniCount: null,
    rumCokeCount: null,
    vodkaTonicCount: null,
    country: 'uk',
  };
}

export function createEmptyInput(): AlcoholUnitInput {
  return createDefaultInput();
}

/** Fixture: one custom 500 ml 5% beer → 2.5 UK units. */
export function createExampleInput(): AlcoholUnitInput {
  return {
    ...createDefaultInput(),
    customOpen: true,
    customVolumeMl: 500,
    customAbvPercent: 5,
    customCount: 1,
  };
}

export function inputsEqual(a: AlcoholUnitInput, b: AlcoholUnitInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
