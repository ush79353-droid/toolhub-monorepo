import { WATER_DENSITY_KG_PER_M3 } from './types';

/**
 * Approximate reference densities in kg/m³ for this converter.
 * Temperature, composition, and formulation change real values.
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
    conditions:
      'Simplifying reference ≈ 1000 kg/m³. Actual water density varies with temperature and pressure.',
  },
  {
    id: 'milk',
    name: 'Milk',
    densityKgPerM3: 1030,
    approximate: true,
    conditions: 'Approx. reference; fat content and solids change density',
  },
  {
    id: 'olive-oil',
    name: 'Olive oil',
    densityKgPerM3: 918,
    approximate: true,
    conditions: 'Approx. reference; grade and temperature change density',
  },
  {
    id: 'vegetable-oil',
    name: 'Vegetable oil',
    densityKgPerM3: 920,
    approximate: true,
    conditions: 'Approx. blend reference; type and temperature change density',
  },
  {
    id: 'honey',
    name: 'Honey',
    densityKgPerM3: 1420,
    approximate: true,
    conditions: 'Approx. reference; moisture and floral source change density',
  },
  {
    id: 'ethanol',
    name: 'Ethanol',
    densityKgPerM3: 789,
    approximate: true,
    conditions: 'Approx. pure ethanol near 20 °C',
  },
  {
    id: 'glycerin',
    name: 'Glycerin',
    densityKgPerM3: 1260,
    approximate: true,
    conditions: 'Approx. reference near room temperature; purity and temperature vary',
  },
  {
    id: 'seawater',
    name: 'Seawater',
    densityKgPerM3: 1025,
    approximate: true,
    conditions: 'Approx. typical seawater; salinity and temperature change density',
  },
  {
    id: 'gasoline',
    name: 'Gasoline',
    densityKgPerM3: 740,
    approximate: true,
    conditions: 'Approx. blend reference; grade and temperature change density',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    densityKgPerM3: 13_534,
    approximate: true,
    conditions: 'Approx. liquid mercury near room temperature',
  },
] as const;

export function findSubstance(id: string): SubstanceOption | undefined {
  return SUBSTANCES.find((s) => s.id === id);
}
