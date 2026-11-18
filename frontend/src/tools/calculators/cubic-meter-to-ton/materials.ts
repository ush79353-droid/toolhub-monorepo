import type { SubstanceCategory } from './types';
import { WATER_DENSITY_KG_PER_M3 } from './types';

/**
 * Illustrative approximate densities in kg/m³.
 * Real materials vary with temperature, moisture, composition, and compaction.
 */
export interface MaterialOption {
  id: string;
  name: string;
  category: SubstanceCategory;
  /** When set, selecting loads this density in kg/m³. */
  densityKgPerM3?: number;
  approximate: boolean;
  densityType: 'material' | 'bulk' | 'custom';
  conditions?: string;
}

export const CUSTOM_MATERIAL_ID = 'custom';

export const MATERIALS: readonly MaterialOption[] = [
  {
    id: 'fresh-water-4c',
    name: 'Water (fresh, 4 °C)',
    category: 'liquids',
    densityKgPerM3: WATER_DENSITY_KG_PER_M3,
    approximate: true,
    densityType: 'material',
    conditions: 'Conventional ≈ 1000 kg/m³ near 4 °C; density varies slightly with temperature',
  },
  {
    id: 'seawater',
    name: 'Seawater',
    category: 'liquids',
    densityKgPerM3: 1025,
    approximate: true,
    densityType: 'material',
    conditions: 'Illustrative; salinity and temperature change density',
  },
  {
    id: 'ethanol-20c',
    name: 'Ethanol at 20 °C',
    category: 'liquids',
    densityKgPerM3: 789,
    approximate: true,
    densityType: 'material',
    conditions: 'Approx. pure ethanol near 20 °C',
  },
  {
    id: 'gasoline',
    name: 'Gasoline',
    category: 'liquids',
    densityKgPerM3: 740,
    approximate: true,
    densityType: 'material',
    conditions: 'Illustrative blend; grade and temperature change density',
  },
  {
    id: 'olive-oil',
    name: 'Olive oil',
    category: 'liquids',
    densityKgPerM3: 910,
    approximate: true,
    densityType: 'material',
    conditions: 'Illustrative; grade and temperature change density',
  },
  {
    id: 'concrete',
    name: 'Normal-weight concrete',
    category: 'construction',
    densityKgPerM3: 2400,
    approximate: true,
    densityType: 'material',
    conditions: 'Illustrative; mix design and moisture vary',
  },
  {
    id: 'portland-cement-bulk',
    name: 'Portland cement, bulk',
    category: 'construction',
    densityKgPerM3: 1440,
    approximate: true,
    densityType: 'bulk',
    conditions: 'Illustrative bulk density; packing and moisture vary',
  },
  {
    id: 'dry-sand-bulk',
    name: 'Dry sand, bulk',
    category: 'construction',
    densityKgPerM3: 1600,
    approximate: true,
    densityType: 'bulk',
    conditions: 'Illustrative bulk density; grain size, moisture, and packing vary',
  },
  {
    id: 'gravel-bulk',
    name: 'Gravel, bulk',
    category: 'construction',
    densityKgPerM3: 1680,
    approximate: true,
    densityType: 'bulk',
    conditions: 'Illustrative bulk density; grading and moisture vary',
  },
  {
    id: 'aluminum',
    name: 'Aluminum',
    category: 'metals',
    densityKgPerM3: 2700,
    approximate: true,
    densityType: 'material',
    conditions: 'Typical wrought aluminum near room temperature',
  },
  {
    id: 'steel',
    name: 'Steel',
    category: 'metals',
    densityKgPerM3: 7850,
    approximate: true,
    densityType: 'material',
    conditions: 'Typical mild / carbon steel; alloys differ',
  },
  {
    id: 'copper',
    name: 'Copper',
    category: 'metals',
    densityKgPerM3: 8960,
    approximate: true,
    densityType: 'material',
    conditions: 'Typical pure copper near room temperature',
  },
  {
    id: 'lead',
    name: 'Lead',
    category: 'metals',
    densityKgPerM3: 11340,
    approximate: true,
    densityType: 'material',
    conditions: 'Typical pure lead near room temperature',
  },
  {
    id: 'pine',
    name: 'Pine, representative dry',
    category: 'wood',
    densityKgPerM3: 500,
    approximate: true,
    densityType: 'material',
    conditions: 'Illustrative softwood density; species and moisture vary',
  },
  {
    id: 'oak',
    name: 'Oak, representative dry',
    category: 'wood',
    densityKgPerM3: 750,
    approximate: true,
    densityType: 'material',
    conditions: 'Illustrative hardwood density; species and moisture vary',
  },
  {
    id: 'dry-soil',
    name: 'Dry soil, bulk',
    category: 'soil',
    densityKgPerM3: 1300,
    approximate: true,
    densityType: 'bulk',
    conditions: 'Illustrative bulk density; soil type and compaction vary',
  },
  {
    id: 'moist-soil',
    name: 'Moist soil, bulk',
    category: 'soil',
    densityKgPerM3: 1600,
    approximate: true,
    densityType: 'bulk',
    conditions: 'Illustrative bulk density; moisture and compaction vary',
  },
  {
    id: 'fresh-water-other',
    name: 'Water (fresh, 4 °C)',
    category: 'other',
    densityKgPerM3: WATER_DENSITY_KG_PER_M3,
    approximate: true,
    densityType: 'material',
    conditions: 'Conventional ≈ 1000 kg/m³ near 4 °C',
  },
  {
    id: 'steel-other',
    name: 'Steel',
    category: 'other',
    densityKgPerM3: 7850,
    approximate: true,
    densityType: 'material',
    conditions: 'Typical mild / carbon steel; alloys differ',
  },
  {
    id: CUSTOM_MATERIAL_ID,
    name: 'Custom density',
    category: 'custom',
    approximate: true,
    densityType: 'custom',
    conditions: 'Enter your own density; units can be switched without changing physical density',
  },
] as const;

export function materialsForCategory(category: SubstanceCategory): readonly MaterialOption[] {
  return MATERIALS.filter((m) => m.category === category);
}

export function findMaterial(id: string): MaterialOption | undefined {
  return MATERIALS.find((m) => m.id === id);
}

export function materialHasPresetDensity(id: string): boolean {
  const item = findMaterial(id);
  return Boolean(item?.densityKgPerM3 != null && item.densityKgPerM3 > 0);
}

export function defaultMaterialIdForCategory(category: SubstanceCategory): string {
  const list = materialsForCategory(category);
  const withDensity = list.find((m) => m.densityKgPerM3 != null && m.densityKgPerM3 > 0);
  if (withDensity) return withDensity.id;
  if (list.length > 0) return list[0]!.id;
  return CUSTOM_MATERIAL_ID;
}
