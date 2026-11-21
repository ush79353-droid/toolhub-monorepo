import type { UkCoinId } from './constants';

export type WeightUnit = 'g' | 'kg';

export type UkCoinCountFields = Record<UkCoinId, string>;

export interface UkCoinWeightInput extends UkCoinCountFields {
  weightUnit: WeightUnit;
}

export interface UkCoinWeightBreakdownRow {
  id: UkCoinId;
  label: string;
  count: number;
  massPerCoinGrams: number;
  subtotalGrams: number;
  formattedSubtotalGrams: string;
}

export interface UkCoinWeightResult {
  weightUnit: WeightUnit;
  totalGrams: number;
  totalKilograms: number;
  displayWeight: number;
  formattedDisplayWeight: string;
  totalCoins: number;
  totalValuePence: number;
  formattedFaceValue: string;
  breakdown: UkCoinWeightBreakdownRow[];
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type UkCoinWeightFieldErrors = Partial<
  Record<UkCoinId | 'form' | 'weightUnit', string>
>;

function emptyCounts(): UkCoinCountFields {
  return {
    oneP: '',
    twoP: '',
    fiveP: '',
    tenP: '',
    twentyP: '',
    fiftyP: '',
    onePound: '',
    twoPound: '',
  };
}

export function createDefaultInput(): UkCoinWeightInput {
  return {
    ...emptyCounts(),
    oneP: '0',
    twoP: '0',
    fiveP: '0',
    tenP: '0',
    twentyP: '0',
    fiftyP: '0',
    onePound: '0',
    twoPound: '0',
    weightUnit: 'g',
  };
}

export function createEmptyInput(): UkCoinWeightInput {
  return {
    ...emptyCounts(),
    weightUnit: 'g',
  };
}

/** 100 of each denomination → 5,418 g (54.18 kg). */
export function createExampleInput(): UkCoinWeightInput {
  return {
    oneP: '100',
    twoP: '100',
    fiveP: '100',
    tenP: '100',
    twentyP: '100',
    fiftyP: '100',
    onePound: '100',
    twoPound: '100',
    weightUnit: 'g',
  };
}
