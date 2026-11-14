import { WATER_DENSITY_G_PER_ML } from './types';

/**
 * Ingredient options for the selector.
 * Only water carries a verified conventional density preset.
 * Milk, oil, honey, flour, and sugar are listed for workflow convenience
 * but require a user-supplied density (no invented catalog values).
 */
export interface IngredientOption {
  id: string;
  name: string;
  /** When set, selecting the ingredient loads this density in g/mL. */
  densityGPerMl?: number;
  approximate: boolean;
  densityType: 'material' | 'bulk' | 'custom';
  conditions?: string;
  source?: string;
}

export const CUSTOM_INGREDIENT_ID = 'custom';

export const INGREDIENTS: readonly IngredientOption[] = [
  {
    id: 'water',
    name: 'Water',
    densityGPerMl: WATER_DENSITY_G_PER_ML,
    approximate: true,
    densityType: 'material',
    conditions:
      'Conventional ≈ 1 g/mL; actual density varies with temperature and pressure',
    source: 'Conventional reference (≈1 g/mL near 4 °C; ~0.998 g/mL at 20 °C)',
  },
  {
    id: 'milk',
    name: 'Milk',
    approximate: true,
    densityType: 'custom',
    conditions:
      'Density depends on fat content, solids, and temperature. Enter a measured or labeled density.',
  },
  {
    id: 'cooking-oil',
    name: 'Cooking oil',
    approximate: true,
    densityType: 'custom',
    conditions:
      'Oils vary by type (olive, canola, etc.) and temperature. Enter a known density.',
  },
  {
    id: 'honey',
    name: 'Honey',
    approximate: true,
    densityType: 'custom',
    conditions:
      'Honey density varies with moisture and floral source. Enter a measured density.',
  },
  {
    id: 'flour',
    name: 'Flour',
    approximate: true,
    densityType: 'bulk',
    conditions:
      'Bulk density varies with flour type, packing, and moisture. Enter a recipe or lab bulk density.',
  },
  {
    id: 'sugar',
    name: 'Sugar',
    approximate: true,
    densityType: 'bulk',
    conditions:
      'Granulated, powdered, and brown sugar pack differently. Enter a measured bulk density.',
  },
  {
    id: CUSTOM_INGREDIENT_ID,
    name: 'Custom ingredient',
    approximate: true,
    densityType: 'custom',
    conditions: 'Enter any positive density for the substance you are converting.',
  },
] as const;

export function findIngredient(id: string): IngredientOption | undefined {
  return INGREDIENTS.find((item) => item.id === id);
}

export function ingredientHasPresetDensity(id: string): boolean {
  const item = findIngredient(id);
  return Boolean(item && item.densityGPerMl !== undefined && item.densityGPerMl > 0);
}
