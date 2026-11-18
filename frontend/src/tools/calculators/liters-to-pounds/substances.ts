import type { SubstanceCategory } from './types';
import { WATER_DENSITY_KG_PER_L } from './types';

/**
 * Illustrative approximate densities (kg/L), labeled approximate in the UI.
 * Real products vary with temperature, composition, and packing (bulk).
 */
export interface SubstanceOption {
  id: string;
  name: string;
  category: SubstanceCategory;
  /** When set, selecting loads this density in kg/L. */
  densityKgPerL?: number;
  approximate: boolean;
  densityType: 'material' | 'bulk' | 'custom';
  conditions?: string;
}

export const CUSTOM_SUBSTANCE_ID = 'custom';

export const SUBSTANCES: readonly SubstanceOption[] = [
  {
    id: 'water',
    name: 'Water',
    category: 'food',
    densityKgPerL: WATER_DENSITY_KG_PER_L,
    approximate: true,
    densityType: 'material',
    conditions: 'Conventional ≈ 1 kg/L near 4 °C; varies with temperature',
  },
  {
    id: 'honey',
    name: 'Honey (typical)',
    category: 'food',
    densityKgPerL: 1.42,
    approximate: true,
    densityType: 'material',
    conditions: 'Illustrative; moisture and floral source change density',
  },
  {
    id: 'water-bev',
    name: 'Water',
    category: 'beverages',
    densityKgPerL: WATER_DENSITY_KG_PER_L,
    approximate: true,
    densityType: 'material',
    conditions: 'Conventional ≈ 1 kg/L; varies with temperature',
  },
  {
    id: 'milk',
    name: 'Milk (typical)',
    category: 'beverages',
    densityKgPerL: 1.03,
    approximate: true,
    densityType: 'material',
    conditions: 'Illustrative; fat content and solids change density',
  },
  {
    id: 'ethanol',
    name: 'Ethanol at ~20 °C',
    category: 'beverages',
    densityKgPerL: 0.789,
    approximate: true,
    densityType: 'material',
    conditions: 'Approx. pure ethanol near 20 °C',
  },
  {
    id: 'vegetable-oil',
    name: 'Vegetable oil (typical)',
    category: 'oils',
    densityKgPerL: 0.92,
    approximate: true,
    densityType: 'material',
    conditions: 'Illustrative blend; type and temperature change density',
  },
  {
    id: 'olive-oil',
    name: 'Olive oil (typical)',
    category: 'oils',
    densityKgPerL: 0.91,
    approximate: true,
    densityType: 'material',
    conditions: 'Illustrative; grade and temperature change density',
  },
  {
    id: 'milk-dairy',
    name: 'Milk (typical)',
    category: 'dairy',
    densityKgPerL: 1.03,
    approximate: true,
    densityType: 'material',
    conditions: 'Illustrative; fat percentage changes density',
  },
  {
    id: 'water-cooking',
    name: 'Water',
    category: 'cooking',
    densityKgPerL: WATER_DENSITY_KG_PER_L,
    approximate: true,
    densityType: 'material',
    conditions: 'Conventional ≈ 1 kg/L',
  },
  {
    id: 'honey-cooking',
    name: 'Honey (typical)',
    category: 'cooking',
    densityKgPerL: 1.42,
    approximate: true,
    densityType: 'material',
    conditions: 'Illustrative cooking honey density',
  },
  {
    id: 'glycerin',
    name: 'Glycerin at ~20 °C',
    category: 'other',
    densityKgPerL: 1.26,
    approximate: true,
    densityType: 'material',
    conditions: 'Approx. pure glycerin near 20 °C',
  },
  {
    id: 'ethanol-other',
    name: 'Ethanol at ~20 °C',
    category: 'other',
    densityKgPerL: 0.789,
    approximate: true,
    densityType: 'material',
    conditions: 'Approx. pure ethanol near 20 °C',
  },
  {
    id: CUSTOM_SUBSTANCE_ID,
    name: 'Custom substance',
    category: 'custom',
    approximate: true,
    densityType: 'custom',
    conditions: 'Enter any positive density for the material you are converting',
  },
] as const;

export function findSubstance(id: string): SubstanceOption | undefined {
  return SUBSTANCES.find((item) => item.id === id);
}

export function substancesForCategory(category: SubstanceCategory): readonly SubstanceOption[] {
  if (category === 'custom') {
    return SUBSTANCES.filter((item) => item.id === CUSTOM_SUBSTANCE_ID);
  }
  return SUBSTANCES.filter((item) => item.category === category);
}

export function defaultSubstanceIdForCategory(category: SubstanceCategory): string {
  const list = substancesForCategory(category);
  return list[0]?.id ?? CUSTOM_SUBSTANCE_ID;
}

export function substanceHasPresetDensity(id: string): boolean {
  const item = findSubstance(id);
  return Boolean(item && item.densityKgPerL !== undefined && item.densityKgPerL > 0);
}
