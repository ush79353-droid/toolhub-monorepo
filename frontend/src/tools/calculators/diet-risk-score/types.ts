/**
 * 9-item Diet Risk Score (DRS) — Johnston et al., BMJ Nutr Prev Health 2020.
 */

export type DietFrequency = 'daily' | 'two_three_week' | 'once_week' | 'never';

export type DietRiskItemId =
  | 'fast_food'
  | 'breads'
  | 'snacks'
  | 'processed_meats'
  | 'sweet_drinks'
  | 'nuts'
  | 'fish'
  | 'vegetables'
  | 'fruit';

export type DietRiskScoreInput = Record<DietRiskItemId, DietFrequency | null>;

export type DietRiskBand = 'low' | 'moderate' | 'high';

export interface DietRiskScoreResult {
  totalScore: number | null;
  formattedScore: string;
  riskBand: DietRiskBand | null;
  riskLabel: string;
  complete: boolean;
  unansweredItems: DietRiskItemId[];
  itemScores: Partial<Record<DietRiskItemId, number>>;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type DietRiskScoreFieldErrors = { form?: string };

export const DIET_RISK_ITEMS: readonly {
  id: DietRiskItemId;
  label: string;
}[] = [
  { id: 'fast_food', label: 'Fast food (take-out, frozen dinners, pizza)' },
  { id: 'breads', label: 'Bread, rolls, sandwiches' },
  { id: 'snacks', label: 'Chips, salty snacks, or pretzels' },
  { id: 'processed_meats', label: 'Hot dogs, sausages, deli or cured meats' },
  { id: 'sweet_drinks', label: 'Sweet drinks (soda, sweet tea, flavored drinks)' },
  { id: 'nuts', label: 'Peanuts, seeds, or nut butter' },
  { id: 'fish', label: 'Fish or shellfish' },
  { id: 'vegetables', label: 'Vegetables (not potatoes, peas, corn, beans)' },
  { id: 'fruit', label: 'Fruit (not juice)' },
];

export const FREQUENCY_OPTIONS: readonly { value: DietFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'two_three_week', label: '2–3 times a week' },
  { value: 'once_week', label: 'Once a week' },
  { value: 'never', label: 'Never' },
];

export function createDefaultInput(): DietRiskScoreInput {
  return {
    fast_food: null,
    breads: null,
    snacks: null,
    processed_meats: null,
    sweet_drinks: null,
    nuts: null,
    fish: null,
    vegetables: null,
    fruit: null,
  };
}

export function createEmptyInput(): DietRiskScoreInput {
  return createDefaultInput();
}

export function inputsEqual(a: DietRiskScoreInput, b: DietRiskScoreInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}