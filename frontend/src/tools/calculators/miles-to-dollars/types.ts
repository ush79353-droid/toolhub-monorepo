/**
 * Miles to Dollars Calculator — airline loyalty miles valuation (not geographic miles).
 * Assumed ¢/mi or $/mi is user-editable and illustrative — not a live market rate.
 * Currency: USD display only — no live FX.
 */

export type MileValueUnit = 'cents' | 'usd';

export type AirlineProgramId =
  | 'aa'
  | 'delta'
  | 'united'
  | 'alaska'
  | 'southwest'
  | 'jetblue'
  | 'aeroplan'
  | 'ba'
  | 'qatar'
  | 'emirates'
  | 'etihad'
  | 'singapore'
  | 'turkish'
  | 'flyingblue'
  | 'virgin'
  | 'cathay'
  | 'qantas'
  | 'custom';

export const AIRLINE_PROGRAMS: ReadonlyArray<{
  id: AirlineProgramId;
  label: string;
}> = [
  { id: 'aa', label: 'American Airlines AAdvantage' },
  { id: 'delta', label: 'Delta SkyMiles' },
  { id: 'united', label: 'United MileagePlus' },
  { id: 'alaska', label: 'Alaska Airlines Mileage Plan' },
  { id: 'southwest', label: 'Southwest Rapid Rewards' },
  { id: 'jetblue', label: 'JetBlue TrueBlue' },
  { id: 'aeroplan', label: 'Air Canada Aeroplan' },
  { id: 'ba', label: 'British Airways Club (Avios)' },
  { id: 'qatar', label: 'Qatar Airways Privilege Club (Avios)' },
  { id: 'emirates', label: 'Emirates Skywards' },
  { id: 'etihad', label: 'Etihad Guest' },
  { id: 'singapore', label: 'Singapore Airlines KrisFlyer' },
  { id: 'turkish', label: 'Turkish Airlines Miles&Smiles' },
  { id: 'flyingblue', label: 'Air France-KLM Flying Blue' },
  { id: 'virgin', label: 'Virgin Atlantic Flying Club' },
  { id: 'cathay', label: 'Cathay Pacific Asia Miles' },
  { id: 'qantas', label: 'Qantas Frequent Flyer' },
  { id: 'custom', label: 'Other / Custom Value' },
];

export const MILE_VALUE_UNIT_LABELS: Record<MileValueUnit, string> = {
  cents: '¢ / mile',
  usd: '$ / mile',
};

/** Illustrative default only — not a published market valuation. */
export const ILLUSTRATIVE_CENTS_PER_MILE = 1.5;

export interface MilesToDollarsInput {
  airlineProgram: AirlineProgramId;
  valuePerMile: string;
  mileValueUnit: MileValueUnit;
  milesRequired: string;
  additionalFees: string;
  cashTicketPrice: string;
  /** Optional: convert a balance */
  showConvert: boolean;
  convertMiles: string;
  /** Optional: compare two awards */
  showCompare: boolean;
  optionBMiles: string;
  optionBFees: string;
  optionBCash: string;
  /** Optional: miles needed for target $ */
  showTarget: boolean;
  targetDollars: string;
}

export interface AwardOptionResult {
  milesRequired: number;
  additionalFees: number;
  cashTicketPrice: number;
  estimatedMilesValue: number;
  awardEquivalentCost: number;
  priceDifference: number;
  savingsPercentage: number | null;
  actualRedemptionCentsPerMile: number | null;
}

export interface MilesToDollarsResult {
  airlineLabel: string;
  valuePerMileUSD: number;
  valuePerMileCents: number;
  estimatedMilesValue: number;
  additionalFees: number;
  awardEquivalentCost: number;
  cashTicketPrice: number;
  priceDifference: number;
  savingsPercentage: number | null;
  actualRedemptionCentsPerMile: number | null;
  recommendation: string;
  convertEstimatedValue: number | null;
  optionB: AwardOptionResult | null;
  compareNote: string | null;
  milesForTarget: number | null;
  formulaSteps: string[];
  interpretation: string;
}

export type MilesToDollarsFieldErrors = {
  valuePerMile?: string;
  milesRequired?: string;
  additionalFees?: string;
  cashTicketPrice?: string;
  convertMiles?: string;
  optionBMiles?: string;
  optionBFees?: string;
  optionBCash?: string;
  targetDollars?: string;
  form?: string;
};

export function airlineLabel(id: AirlineProgramId): string {
  return AIRLINE_PROGRAMS.find((p) => p.id === id)?.label ?? 'Custom';
}

/** Spec fixture: AA · 1.5¢ · 25,000 mi · $50 fees · $600 cash */
export function createEmptyInput(): MilesToDollarsInput {
  return {
    airlineProgram: 'aa',
    valuePerMile: '1.5',
    mileValueUnit: 'cents',
    milesRequired: '25000',
    additionalFees: '50',
    cashTicketPrice: '600',
    showConvert: false,
    convertMiles: '40000',
    showCompare: false,
    optionBMiles: '30000',
    optionBFees: '75',
    optionBCash: '650',
    showTarget: false,
    targetDollars: '300',
  };
}
