import { WATER_DENSITY_KG_PER_M3 } from './types';

/**
 * Illustrative approximate densities in kg/m³.
 * Cooking/bulk values vary with temperature, packing, and composition.
 */
export interface SubstanceOption {
  id: string;
  name: string;
  densityKgPerM3: number;
  approximate: boolean;
  conditions: string;
}

export const CUSTOM_SUBSTANCE_ID = 'custom';

export const SUBSTANCES: readonly SubstanceOption[] = [
  {
    id: 'water',
    name: 'Water',
    densityKgPerM3: WATER_DENSITY_KG_PER_M3,
    approximate: true,
    conditions: 'Nominal ≈ 1000 kg/m³ near 4 °C; varies with temperature',
  },
  {
    id: 'whole-milk',
    name: 'Whole milk',
    densityKgPerM3: 1030,
    approximate: true,
    conditions: 'Illustrative; fat content and solids change density',
  },
  {
    id: 'honey',
    name: 'Honey',
    densityKgPerM3: 1420,
    approximate: true,
    conditions: 'Illustrative; moisture and floral source change density',
  },
  {
    id: 'vegetable-oil',
    name: 'Vegetable oil',
    densityKgPerM3: 920,
    approximate: true,
    conditions: 'Illustrative blend; type and temperature change density',
  },
  {
    id: 'olive-oil',
    name: 'Olive oil',
    densityKgPerM3: 910,
    approximate: true,
    conditions: 'Illustrative; grade and temperature change density',
  },
  {
    id: 'ethanol',
    name: 'Ethanol at 20 °C',
    densityKgPerM3: 789,
    approximate: true,
    conditions: 'Approx. pure ethanol near 20 °C',
  },
  {
    id: 'maple-syrup',
    name: 'Maple syrup',
    densityKgPerM3: 1330,
    approximate: true,
    conditions: 'Illustrative; sugar content and grade change density',
  },
  {
    id: 'sugar-bulk',
    name: 'Granulated sugar (bulk)',
    densityKgPerM3: 850,
    approximate: true,
    conditions: 'Illustrative bulk density; packing and crystal size vary',
  },
  {
    id: 'flour-bulk',
    name: 'All-purpose flour (bulk)',
    densityKgPerM3: 530,
    approximate: true,
    conditions: 'Illustrative bulk density; packing and moisture vary',
  },
] as const;

export function findSubstance(id: string): SubstanceOption | undefined {
  return SUBSTANCES.find((s) => s.id === id);
}
