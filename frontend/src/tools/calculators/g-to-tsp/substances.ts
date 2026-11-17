import { SALT_DENSITY_G_PER_ML } from './types';

/**
 * Illustrative approximate densities in g/mL.
 * Cooking/bulk values vary with temperature, packing, and composition.
 */
export interface SubstanceOption {
  id: string;
  name: string;
  densityGPerMl: number;
  approximate: boolean;
  conditions: string;
}

export const CUSTOM_SUBSTANCE_ID = 'custom';

export const SUBSTANCES: readonly SubstanceOption[] = [
  {
    id: 'salt',
    name: 'Salt',
    densityGPerMl: SALT_DENSITY_G_PER_ML,
    approximate: true,
    conditions: 'Illustrative table-salt bulk density; crystal size and packing vary',
  },
  {
    id: 'water',
    name: 'Water',
    densityGPerMl: 1,
    approximate: true,
    conditions: 'Nominal ≈ 1 g/mL near 4 °C; varies with temperature',
  },
  {
    id: 'sugar-bulk',
    name: 'Granulated sugar (bulk)',
    densityGPerMl: 0.85,
    approximate: true,
    conditions: 'Illustrative bulk density; packing and crystal size vary',
  },
  {
    id: 'flour-bulk',
    name: 'All-purpose flour (bulk)',
    densityGPerMl: 0.53,
    approximate: true,
    conditions: 'Illustrative bulk density; packing and moisture vary',
  },
  {
    id: 'honey',
    name: 'Honey',
    densityGPerMl: 1.42,
    approximate: true,
    conditions: 'Illustrative; moisture and floral source change density',
  },
  {
    id: 'whole-milk',
    name: 'Whole milk',
    densityGPerMl: 1.03,
    approximate: true,
    conditions: 'Illustrative; fat content and solids change density',
  },
  {
    id: 'vegetable-oil',
    name: 'Vegetable oil',
    densityGPerMl: 0.92,
    approximate: true,
    conditions: 'Illustrative blend; type and temperature change density',
  },
  {
    id: 'olive-oil',
    name: 'Olive oil',
    densityGPerMl: 0.91,
    approximate: true,
    conditions: 'Illustrative; grade and temperature change density',
  },
  {
    id: 'butter',
    name: 'Butter',
    densityGPerMl: 0.911,
    approximate: true,
    conditions: 'Illustrative; fat and water content vary',
  },
  {
    id: 'cocoa-bulk',
    name: 'Cocoa powder (bulk)',
    densityGPerMl: 0.5,
    approximate: true,
    conditions: 'Illustrative bulk density; packing and brand vary',
  },
] as const;

export function findSubstance(id: string): SubstanceOption | undefined {
  return SUBSTANCES.find((s) => s.id === id);
}
