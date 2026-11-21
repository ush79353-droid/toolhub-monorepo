/**
 * Illustrative Brexit cost parameters.
 *
 * Documented educational defaults inspired by commonly cited CER / Bloomberg-style
 * GDP-loss rates and public unit-cost comparisons (Omni Calculator sources note,
 * retrieved 2019-10-17). These are NOT official HM Treasury figures and must not be
 * presented as current government accounting.
 */

/** EU referendum evening (local civil time treated as UTC for deterministic math). */
export const REFERENDUM_ISO = '2016-06-23T21:00:00.000Z';

/** Dual-rate regime boundary used by the reference model. */
export const POST_BREXIT_RATE_START_ISO = '2020-01-01T00:00:00.000Z';

/** Centre for European Reform-style pre-2020 unrealised GDP loss (£ / week). */
export const PRE_2020_WEEKLY_LOSS_GBP = 440_000_000;

/** Bloomberg-style post-2020 annual unrealised GDP loss (£ / year). */
export const POST_2020_ANNUAL_LOSS_GBP = 70_000_000_000;

/** Default editable weekly rate ≈ £70bn / 52. */
export const DEFAULT_CURRENT_WEEKLY_LOSS_GBP = Math.round(
  POST_2020_ANNUAL_LOSS_GBP / 52
);

export const MS_PER_SECOND = 1000;
export const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
export const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

/** Default lump-sum “direct government spending” add-on (£). */
export const DEFAULT_GOVERNMENT_SPENDING_GBP = 8_578_558_000;

/** Expandable illustrative line items that sum near the default add-on. */
export const DEFAULT_SPENDING_DETAILS = {
  euReferendum: 129_100_000,
  generalElections: 140_850_000,
  mpWindingUp: 4_600_000,
  departmentSpending: 6_300_000_000,
  euElections2019: 156_000_000,
  /** Residual so details sum exactly to DEFAULT_GOVERNMENT_SPENDING_GBP. */
  otherDocumented: 1_848_008_000,
} as const;

export type OpportunityId =
  | 'hospitals'
  | 'schools'
  | 'windTurbines'
  | 'hs2Miles'
  | 'childMeals'
  | 'trees'
  | 'rubbishTonnes'
  | 'freddos'
  | 'ambulances'
  | 'londonBuses'
  | 'spacexDragons'
  | 'nurses'
  | 'police'
  | 'teachers'
  | 'borisJohnsons';

export type OpportunityGroup = 'build' | 'fund' | 'recycle' | 'buy' | 'hire';

export interface OpportunityItem {
  id: OpportunityId;
  group: OpportunityGroup;
  label: string;
  /** Unit cost in GBP (one hospital, one nurse-year, etc.). */
  unitCostGbp: number;
  note?: string;
}

/**
 * Unit costs from the reference sources note (GBP, as of 2019-10-17 conversions).
 * SpaceX Dragon uses £697,473,983 (the “million” suffix in some secondary notes is treated as a typo).
 */
export const OPPORTUNITY_ITEMS: readonly OpportunityItem[] = [
  { id: 'hospitals', group: 'build', label: 'Hospitals', unitCostGbp: 90_000_000 },
  { id: 'schools', group: 'build', label: 'Schools', unitCostGbp: 35_000_000 },
  {
    id: 'windTurbines',
    group: 'build',
    label: 'Large wind turbines',
    unitCostGbp: 3_130_000,
  },
  {
    id: 'hs2Miles',
    group: 'build',
    label: 'Miles of HS2',
    unitCostGbp: 403_000_000,
  },
  {
    id: 'childMeals',
    group: 'fund',
    label: 'Meals for children',
    unitCostGbp: 8,
  },
  { id: 'trees', group: 'fund', label: 'Trees planted', unitCostGbp: 1.18 },
  {
    id: 'rubbishTonnes',
    group: 'recycle',
    label: 'Tonnes of rubbish',
    unitCostGbp: 171.96,
  },
  { id: 'freddos', group: 'buy', label: 'Freddos', unitCostGbp: 0.3 },
  { id: 'ambulances', group: 'buy', label: 'Ambulances', unitCostGbp: 250_000 },
  {
    id: 'londonBuses',
    group: 'buy',
    label: 'New London buses',
    unitCostGbp: 355_000,
    note: 'Arriving 4 at a time, 20 minutes late, of course.',
  },
  {
    id: 'spacexDragons',
    group: 'buy',
    label: 'SpaceX Dragons',
    unitCostGbp: 697_473_983,
  },
  { id: 'nurses', group: 'hire', label: 'Nurses', unitCostGbp: 22_128 },
  { id: 'police', group: 'hire', label: 'Police officers', unitCostGbp: 19_971 },
  {
    id: 'teachers',
    group: 'hire',
    label: 'School teachers',
    unitCostGbp: 23_720,
  },
  {
    id: 'borisJohnsons',
    group: 'hire',
    label: 'Boris Johnsons',
    unitCostGbp: 151_451,
  },
] as const;

export const GROUP_LABELS: Record<OpportunityGroup, string> = {
  build: 'We could build…',
  fund: 'Or fund…',
  recycle: 'Or recycle…',
  buy: 'Or buy…',
  hire: 'Or hire…',
};

/** Metropolitan France area (km²) for rubbish illustration. */
export const FRANCE_AREA_KM2 = 543_940;
/** Assumed household-rubbish density (kg/m³) at 1 m depth. */
export const RUBBISH_DENSITY_KG_PER_M3 = 481;

export const SOURCE_SUMMARY =
  'Illustrative model: pre-2020 £440m/week GDP-loss rate; post-2020 £70bn/year (editable weekly rate); plus a lump-sum government-spending add-on. Opportunity counts use fixed unit costs from educational reference notes (not live market quotes).';
