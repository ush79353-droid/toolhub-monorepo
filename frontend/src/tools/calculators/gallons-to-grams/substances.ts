import { WATER_DENSITY_KG_PER_M3 } from './types';

/**
 * Illustrative approximate densities in kg/m³.
 * Values vary with temperature, formulation, and composition.
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
    id: 'milk',
    name: 'Milk',
    densityKgPerM3: 1030,
    approximate: true,
    conditions: 'Illustrative; fat content and solids change density',
  },
  {
    id: 'olive-oil',
    name: 'Olive oil',
    densityKgPerM3: 910,
    approximate: true,
    conditions: 'Illustrative; grade and temperature change density',
  },
  {
    id: 'vegetable-oil',
    name: 'Vegetable oil',
    densityKgPerM3: 920,
    approximate: true,
    conditions: 'Illustrative blend; type and temperature change density',
  },
  {
    id: 'honey',
    name: 'Honey',
    densityKgPerM3: 1420,
    approximate: true,
    conditions: 'Illustrative; moisture and floral source change density',
  },
  {
    id: 'ethanol',
    name: 'Ethanol',
    densityKgPerM3: 789,
    approximate: true,
    conditions: 'Approx. pure ethanol near 20 °C',
  },
  {
    id: 'gasoline',
    name: 'Gasoline',
    densityKgPerM3: 740,
    approximate: true,
    conditions: 'Illustrative blend; grade and temperature change density',
  },
] as const;

export function findSubstance(id: string): SubstanceOption | undefined {
  return SUBSTANCES.find((s) => s.id === id);
}
