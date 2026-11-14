import type { SupportedCurrency } from '@/tools/shared/currency';

export const CUP_SIZE_OPTIONS = [
  { id: '8oz', label: '8 fl. oz. / 0.25 L' },
  { id: '12oz', label: '12 fl. oz. / 0.35 L' },
  { id: '16oz', label: '16 fl. oz. / 0.5 L' },
] as const;

export type CupSizeId = (typeof CUP_SIZE_OPTIONS)[number]['id'];
export type YesNo = 'yes' | 'no';
export type IngredientsMode = 'known' | 'recipe';

export interface LemonadeStandDraft {
  hasTargetGoal: YesNo;
  targetProfit: string;
  servings: string;
  cupSize: CupSizeId;
  /** Editable unit cup cost when not overriding total cups. */
  costPerCup: string;
  modifyCupCosts: YesNo;
  cupsTotalOverride: string;
  requiresPermit: YesNo;
  permitCost: string;
  ingredientsMode: IngredientsMode;
  ingredientsCost: string;
  lemonsCost: string;
  sugarCost: string;
  waterCost: string;
  otherCosts: string;
  sellingPrice: string;
  currency: SupportedCurrency;
  otherOpen: boolean;
}

export interface LemonadeStandResult {
  servings: number;
  cupsCost: number;
  ingredientsCost: number;
  permitCost: number;
  otherCosts: number;
  totalCost: number;
  costPerServing: number;
  sellingPrice: number;
  totalRevenue: number;
  totalProfit: number;
  breakEvenPrice: number;
  targetProfit: number | null;
  currency: SupportedCurrency;
  cupsDisplay: string;
  ingredientsDisplay: string;
  totalCostDisplay: string;
  costPerServingDisplay: string;
  profitDisplay: string;
  breakEvenDisplay: string;
  shareTotalCost: string;
  shareProfit: string;
  shareBreakEven: string;
  explanation: string;
}

export type LemonadeStandFieldErrors = Record<string, string>;

export function createDefaultDraft(): LemonadeStandDraft {
  return {
    hasTargetGoal: 'no',
    targetProfit: '',
    servings: '1',
    cupSize: '8oz',
    costPerCup: '',
    modifyCupCosts: 'no',
    cupsTotalOverride: '',
    requiresPermit: 'no',
    permitCost: '',
    ingredientsMode: 'known',
    ingredientsCost: '',
    lemonsCost: '',
    sugarCost: '',
    waterCost: '',
    otherCosts: '',
    sellingPrice: '',
    currency: 'PKR',
    otherOpen: false,
  };
}
