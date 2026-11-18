import { US_TABLESPOON_ML } from '../mg-to-tablespoon/types';
import { DEFAULT_INGREDIENT_ID } from './ingredients';

export { US_TABLESPOON_ML, DEFAULT_INGREDIENT_ID };

/** Exact: 1 US teaspoon = US tablespoon / 3. */
export const US_TEASPOON_ML = US_TABLESPOON_ML / 3;

export type TbspGramsSource = 'tablespoons' | 'grams';

export interface TbspToGramsInput {
  source: TbspGramsSource;
  ingredientId: string;
  tablespoons: number | null;
  grams: number | null;
}

export interface TbspToGramsResult {
  source: TbspGramsSource;
  ingredientId: string;
  ingredientName: string;
  densityGPerMl: number;
  tablespoons: number;
  grams: number;
  gramsPerTbsp: number;
  explanation: string;
}

export type TbspToGramsFieldErrors = {
  ingredientId?: string;
  tablespoons?: string;
  grams?: string;
};

export const MAX_ABS_VALUE = 1e12;
