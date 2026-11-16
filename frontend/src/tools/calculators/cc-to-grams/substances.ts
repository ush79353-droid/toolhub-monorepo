import { WATER_DENSITY_G_PER_CM3 } from './types';

/**
 * Illustrative approximate densities in g/cm³.
 * Food/oils vary with temperature, composition, and packing.
 */
export interface SubstanceOption {
  id: string;
  name: string;
  densityGPerCm3: number;
  approximate: boolean;
  conditions: string;
}

export const CUSTOM_SUBSTANCE_ID = 'custom';

export const SUBSTANCES: readonly SubstanceOption[] = [
  {
    id: 'water',
    name: 'Water',
    densityGPerCm3: WATER_DENSITY_G_PER_CM3,
    approximate: true,
    conditions: 'Nominal ≈ 1 g/cm³ near 4 °C; varies with temperature',
  },
  {
    id: 'milk',
    name: 'Milk (typical)',
    densityGPerCm3: 1.03,
    approximate: true,
    conditions: 'Illustrative; fat content and solids change density',
  },
  {
    id: 'honey',
    name: 'Honey (typical)',
    densityGPerCm3: 1.42,
    approximate: true,
    conditions: 'Illustrative; moisture and floral source change density',
  },
  {
    id: 'olive-oil',
    name: 'Olive oil (typical)',
    densityGPerCm3: 0.91,
    approximate: true,
    conditions: 'Illustrative; grade and temperature change density',
  },
  {
    id: 'vegetable-oil',
    name: 'Vegetable oil (typical)',
    densityGPerCm3: 0.92,
    approximate: true,
    conditions: 'Illustrative blend; type and temperature change density',
  },
  {
    id: 'ethanol',
    name: 'Ethanol (~20 °C)',
    densityGPerCm3: 0.789,
    approximate: true,
    conditions: 'Approx. pure ethanol near 20 °C',
  },
  {
    id: 'glycerin',
    name: 'Glycerin (typical)',
    densityGPerCm3: 1.26,
    approximate: true,
    conditions: 'Illustrative; purity and temperature change density',
  },
  {
    id: 'mercury',
    name: 'Mercury (~20 °C)',
    densityGPerCm3: 13.534,
    approximate: true,
    conditions: 'Approx. near 20 °C; hazardous liquid metal',
  },
] as const;

export function findSubstance(id: string): SubstanceOption | undefined {
  return SUBSTANCES.find((s) => s.id === id);
}
