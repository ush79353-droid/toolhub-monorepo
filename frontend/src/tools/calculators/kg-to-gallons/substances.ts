import type { SubstanceCategory } from './types';
import { WATER_DENSITY_KG_PER_L } from './types';

/**
 * Verified / conventional density presets only (stored as kg/L).
 * Items without densityKgPerL require the user to enter density — no invented values.
 */
export interface SubstanceOption {
  id: string;
  name: string;
  category: SubstanceCategory;
  densityKgPerL?: number;
  approximate: boolean;
  densityType: 'material' | 'bulk' | 'custom';
  conditions?: string;
  source?: string;
}

export const CUSTOM_SUBSTANCE_ID = 'custom';

export const SUBSTANCES: readonly SubstanceOption[] = [
  {
    id: 'water',
    name: 'Water',
    category: 'liquids',
    densityKgPerL: WATER_DENSITY_KG_PER_L,
    approximate: true,
    densityType: 'material',
    conditions:
      'Conventional ≈ 1 kg/L; actual density varies with temperature and pressure',
    source: 'Conventional reference (≈1 g/mL near 4 °C; ~0.998 g/mL at 20 °C)',
  },
  {
    id: 'ethanol',
    name: 'Ethanol',
    category: 'liquids',
    densityKgPerL: 0.789,
    approximate: true,
    densityType: 'material',
    conditions: 'Approx. pure ethanol near 20 °C',
    source: 'CRC / standard physical-property tables (≈789 kg/m³ at 20 °C)',
  },
  {
    id: 'milk',
    name: 'Milk',
    category: 'liquids',
    approximate: true,
    densityType: 'custom',
    conditions:
      'Density depends on fat content, solids, and temperature. Enter a measured density.',
  },
  {
    id: 'olive-oil',
    name: 'Olive oil',
    category: 'liquids',
    approximate: true,
    densityType: 'custom',
    conditions: 'Olive-oil density varies with grade and temperature. Enter a measured density.',
  },
  {
    id: 'vegetable-oil',
    name: 'Vegetable oil',
    category: 'liquids',
    approximate: true,
    densityType: 'custom',
    conditions: 'Enter a measured density for the specific oil blend.',
  },
  {
    id: 'honey',
    name: 'Honey',
    category: 'liquids',
    approximate: true,
    densityType: 'custom',
    conditions: 'Honey density varies with moisture and floral source. Enter a measured density.',
  },
  {
    id: 'gasoline',
    name: 'Gasoline',
    category: 'liquids',
    approximate: true,
    densityType: 'custom',
    conditions: 'Gasoline density varies by blend and temperature. Enter a specification density.',
  },
  {
    id: 'diesel',
    name: 'Diesel fuel',
    category: 'liquids',
    approximate: true,
    densityType: 'custom',
    conditions: 'Diesel density varies by grade and temperature. Enter a measured density.',
  },
  {
    id: 'water-food',
    name: 'Water',
    category: 'food',
    densityKgPerL: WATER_DENSITY_KG_PER_L,
    approximate: true,
    densityType: 'material',
    conditions:
      'Conventional ≈ 1 kg/L; actual density varies with temperature and pressure',
    source: 'Conventional reference (≈1 g/mL near 4 °C)',
  },
  {
    id: 'flour',
    name: 'Flour',
    category: 'food',
    approximate: true,
    densityType: 'bulk',
    conditions:
      'Bulk density depends on packing, moisture, and flour type. Enter a measured bulk density.',
  },
  {
    id: 'sugar',
    name: 'Sugar',
    category: 'food',
    approximate: true,
    densityType: 'bulk',
    conditions: 'Granulated vs powdered sugar pack differently. Enter a measured bulk density.',
  },
  {
    id: 'rice',
    name: 'Rice',
    category: 'food',
    approximate: true,
    densityType: 'bulk',
    conditions: 'Bulk density varies with grain type and packing. Enter a measured density.',
  },
  {
    id: 'cooking-oil-food',
    name: 'Cooking oil',
    category: 'food',
    approximate: true,
    densityType: 'custom',
    conditions: 'Oils vary by type and temperature. Enter a known density.',
  },
  {
    id: 'honey-food',
    name: 'Honey',
    category: 'food',
    approximate: true,
    densityType: 'custom',
    conditions: 'Enter a measured density for the honey sample.',
  },
  {
    id: 'aluminum',
    name: 'Aluminum',
    category: 'metals',
    densityKgPerL: 2.7,
    approximate: true,
    densityType: 'material',
    conditions: 'Pure / wrought aluminum at room temperature',
    source: 'Standard engineering materials handbooks (≈2.70 g/cm³)',
  },
  {
    id: 'copper',
    name: 'Copper',
    category: 'metals',
    densityKgPerL: 8.96,
    approximate: true,
    densityType: 'material',
    conditions: 'Pure copper at room temperature',
    source: 'Standard engineering materials handbooks (≈8.96 g/cm³)',
  },
  {
    id: 'iron',
    name: 'Iron',
    category: 'metals',
    densityKgPerL: 7.87,
    approximate: true,
    densityType: 'material',
    conditions: 'Pure iron at room temperature',
    source: 'Standard engineering materials handbooks (≈7.87 g/cm³)',
  },
  {
    id: 'steel',
    name: 'Steel (mild / carbon)',
    category: 'metals',
    densityKgPerL: 7.85,
    approximate: true,
    densityType: 'material',
    conditions: 'Typical mild / carbon steel; alloy steels vary',
    source: 'Standard engineering materials handbooks (≈7.85 g/cm³)',
  },
  {
    id: 'gold',
    name: 'Gold',
    category: 'metals',
    approximate: true,
    densityType: 'custom',
    conditions: 'Purity and alloy affect density. Enter a measured or assay density.',
  },
  {
    id: 'silver',
    name: 'Silver',
    category: 'metals',
    approximate: true,
    densityType: 'custom',
    conditions: 'Purity and alloy affect density. Enter a measured density.',
  },
  {
    id: 'ice',
    name: 'Ice',
    category: 'non-metals',
    densityKgPerL: 0.917,
    approximate: true,
    densityType: 'material',
    conditions: 'Approx. ice near 0 °C; porosity and temperature change density',
    source: 'Standard physical-property tables (≈0.917 g/cm³ near 0 °C)',
  },
  {
    id: 'wood',
    name: 'Wood',
    category: 'non-metals',
    approximate: true,
    densityType: 'bulk',
    conditions: 'Species and moisture content dominate. Enter a measured density.',
  },
  {
    id: 'sand',
    name: 'Sand',
    category: 'non-metals',
    approximate: true,
    densityType: 'bulk',
    conditions: 'Bulk density depends on packing and moisture. Enter a site density.',
  },
  {
    id: 'glass',
    name: 'Glass',
    category: 'non-metals',
    approximate: true,
    densityType: 'custom',
    conditions: 'Composition varies by glass type. Enter a measured density.',
  },
  {
    id: 'concrete',
    name: 'Concrete',
    category: 'non-metals',
    approximate: true,
    densityType: 'bulk',
    conditions: 'Mix design and aggregate change density. Enter a measured density.',
  },
  {
    id: 'air',
    name: 'Air (dry)',
    category: 'gases',
    densityKgPerL: 0.001225,
    approximate: true,
    densityType: 'material',
    conditions: 'ICAO standard atmosphere at sea level, 15 °C, 1013.25 hPa',
    source: 'ICAO Standard Atmosphere (1.225 kg/m³)',
  },
  {
    id: 'oxygen',
    name: 'Oxygen (O₂)',
    category: 'gases',
    approximate: true,
    densityType: 'custom',
    conditions: 'Gas density depends strongly on T and P. Enter density for your conditions.',
  },
  {
    id: 'nitrogen',
    name: 'Nitrogen (N₂)',
    category: 'gases',
    densityKgPerL: 0.001165,
    approximate: true,
    densityType: 'material',
    conditions: 'Approx. dry N₂ near 20 °C, 1 atm',
    source: 'Standard gas property tables (≈1.165 kg/m³ at 20 °C, 1 atm)',
  },
  {
    id: 'carbon-dioxide',
    name: 'Carbon dioxide (CO₂)',
    category: 'gases',
    densityKgPerL: 0.001842,
    approximate: true,
    densityType: 'material',
    conditions: 'Approx. CO₂ near 20 °C, 1 atm',
    source: 'Standard gas property tables (≈1.84 kg/m³ at 20 °C, 1 atm)',
  },
  {
    id: CUSTOM_SUBSTANCE_ID,
    name: 'Custom substance',
    category: 'custom',
    approximate: true,
    densityType: 'custom',
    conditions: 'Enter any positive density for the substance you are converting.',
  },
] as const;

export function substancesForCategory(
  category: SubstanceCategory
): readonly SubstanceOption[] {
  if (category === 'custom') {
    return SUBSTANCES.filter((s) => s.id === CUSTOM_SUBSTANCE_ID);
  }
  return SUBSTANCES.filter((s) => s.category === category);
}

export function findSubstance(id: string): SubstanceOption | undefined {
  return SUBSTANCES.find((s) => s.id === id);
}

export function substanceHasPresetDensity(id: string): boolean {
  const item = findSubstance(id);
  return Boolean(item && item.densityKgPerL !== undefined && item.densityKgPerL > 0);
}

export function defaultSubstanceIdForCategory(category: SubstanceCategory): string {
  const list = substancesForCategory(category);
  const withPreset = list.find((s) => s.densityKgPerL !== undefined);
  if (withPreset) return withPreset.id;
  if (list.length > 0) return list[0]!.id;
  return CUSTOM_SUBSTANCE_ID;
}
