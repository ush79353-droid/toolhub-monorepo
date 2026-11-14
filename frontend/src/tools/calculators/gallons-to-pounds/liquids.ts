import { WATER_DENSITY_G_PER_ML } from './types';

/**
 * Liquid options for the selector.
 * Only water carries a verified conventional density preset.
 * Other listed liquids require a user-supplied density (no invented catalog values).
 */
export interface LiquidOption {
  id: string;
  name: string;
  /** When set, selecting the liquid loads this density in g/mL. */
  densityGPerMl?: number;
  approximate: boolean;
  densityType: 'material' | 'bulk' | 'custom';
  conditions?: string;
  source?: string;
}

export const CUSTOM_LIQUID_ID = 'custom';

export const LIQUIDS: readonly LiquidOption[] = [
  {
    id: 'water',
    name: 'Water',
    densityGPerMl: WATER_DENSITY_G_PER_ML,
    approximate: true,
    densityType: 'material',
    conditions:
      'Conventional ≈ 1 kg/L; actual density varies with temperature and pressure',
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
    id: 'whole-milk',
    name: 'Whole milk',
    approximate: true,
    densityType: 'custom',
    conditions: 'Whole-milk density varies with fat percentage and temperature. Enter a measured density.',
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
    id: 'olive-oil',
    name: 'Olive oil',
    approximate: true,
    densityType: 'custom',
    conditions: 'Olive-oil density varies with grade and temperature. Enter a measured density.',
  },
  {
    id: 'vegetable-oil',
    name: 'Vegetable oil',
    approximate: true,
    densityType: 'custom',
    conditions: 'Enter a measured density for the specific oil blend.',
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
    id: 'ethanol',
    name: 'Ethanol',
    approximate: true,
    densityType: 'custom',
    conditions: 'Ethanol density depends on purity and temperature. Enter a measured density.',
  },
  {
    id: 'gasoline',
    name: 'Gasoline',
    approximate: true,
    densityType: 'custom',
    conditions:
      'Gasoline density varies by blend and temperature. Enter a measured or specification density.',
  },
  {
    id: 'diesel',
    name: 'Diesel fuel',
    approximate: true,
    densityType: 'custom',
    conditions:
      'Diesel density varies by grade and temperature. Enter a measured or specification density.',
  },
  {
    id: CUSTOM_LIQUID_ID,
    name: 'Custom liquid',
    approximate: true,
    densityType: 'custom',
    conditions: 'Enter any positive density for the liquid you are converting.',
  },
] as const;

export function findLiquid(id: string): LiquidOption | undefined {
  return LIQUIDS.find((item) => item.id === id);
}

export function liquidHasPresetDensity(id: string): boolean {
  const item = findLiquid(id);
  return Boolean(item && item.densityGPerMl !== undefined && item.densityGPerMl > 0);
}
