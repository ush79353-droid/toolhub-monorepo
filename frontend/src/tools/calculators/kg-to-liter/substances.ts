import { WATER_DENSITY_KG_PER_L } from './types';

/**
 * Approximate reference densities in kg/L for this converter.
 * Temperature, composition, and formulation change real values.
 */
export interface SubstanceOption {
  id: string;
  name: string;
  densityKgPerL: number;
  approximate: boolean;
  conditions: string;
}

export const CUSTOM_SUBSTANCE_ID = 'custom';

export const SUBSTANCES: readonly SubstanceOption[] = [
  {
    id: 'fresh-water',
    name: 'Fresh water',
    densityKgPerL: WATER_DENSITY_KG_PER_L,
    approximate: true,
    conditions:
      'Simplifying reference ≈ 1 kg/L. Actual water density varies with temperature and pressure (near 1 g/mL around 4 °C; slightly lower near 20 °C).',
  },
  {
    id: 'olive-oil',
    name: 'Olive oil',
    densityKgPerL: 0.918,
    approximate: true,
    conditions: 'Approx. reference; grade and temperature change density',
  },
  {
    id: 'vegetable-oil',
    name: 'Vegetable oil',
    densityKgPerL: 0.92,
    approximate: true,
    conditions: 'Approx. blend reference; type and temperature change density',
  },
  {
    id: 'whole-milk',
    name: 'Whole milk',
    densityKgPerL: 1.03,
    approximate: true,
    conditions: 'Approx. reference; fat content and solids change density',
  },
  {
    id: 'honey',
    name: 'Honey',
    densityKgPerL: 1.42,
    approximate: true,
    conditions: 'Approx. reference; moisture and floral source change density',
  },
  {
    id: 'ethanol',
    name: 'Ethanol',
    densityKgPerL: 0.789,
    approximate: true,
    conditions: 'Approx. pure ethanol near 20 °C',
  },
  {
    id: 'glycerin',
    name: 'Glycerin',
    densityKgPerL: 1.26,
    approximate: true,
    conditions: 'Approx. reference near room temperature; purity and temperature vary',
  },
  {
    id: 'seawater',
    name: 'Seawater',
    densityKgPerL: 1.025,
    approximate: true,
    conditions: 'Approx. typical seawater; salinity and temperature change density',
  },
  {
    id: 'gasoline',
    name: 'Gasoline',
    densityKgPerL: 0.74,
    approximate: true,
    conditions: 'Approx. blend reference; grade and temperature change density',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    densityKgPerL: 13.534,
    approximate: true,
    conditions: 'Approx. liquid mercury near room temperature',
  },
] as const;

export function findSubstance(id: string): SubstanceOption | undefined {
  return SUBSTANCES.find((s) => s.id === id);
}
