import type { SubstanceCategory } from './types';
import {
  CONCRETE_DENSITY_LB_PER_FT3,
  WATER_DENSITY_LB_PER_FT3,
} from './types';

/**
 * Illustrative approximate densities in lb/ft³.
 * Real materials vary with composition, moisture, temperature, and compaction.
 */
export interface MaterialOption {
  id: string;
  name: string;
  category: SubstanceCategory;
  /** When set, selecting loads this density in lb/ft³. */
  densityLbPerFt3?: number;
  approximate: boolean;
  densityType: 'material' | 'bulk' | 'custom';
  conditions?: string;
}

export const CUSTOM_MATERIAL_ID = 'custom';

export const MATERIALS: readonly MaterialOption[] = [
  {
    id: 'concrete',
    name: 'Concrete',
    category: 'nonMetals',
    densityLbPerFt3: CONCRETE_DENSITY_LB_PER_FT3,
    approximate: true,
    densityType: 'material',
    conditions: 'Illustrative reference ≈ 149.83 lb/ft³; mix design and moisture vary',
  },
  {
    id: 'dry-sand',
    name: 'Dry sand',
    category: 'nonMetals',
    densityLbPerFt3: 100,
    approximate: true,
    densityType: 'bulk',
    conditions: 'Illustrative bulk density; grain size, moisture, and packing change results',
  },
  {
    id: 'dry-soil',
    name: 'Dry soil',
    category: 'nonMetals',
    densityLbPerFt3: 80,
    approximate: true,
    densityType: 'bulk',
    conditions: 'Illustrative bulk density; soil type and compaction vary widely',
  },
  {
    id: 'steel',
    name: 'Steel',
    category: 'metals',
    densityLbPerFt3: 490,
    approximate: true,
    densityType: 'material',
    conditions: 'Typical mild / carbon steel; alloys differ',
  },
  {
    id: 'aluminum',
    name: 'Aluminum',
    category: 'metals',
    densityLbPerFt3: 168.5,
    approximate: true,
    densityType: 'material',
    conditions: 'Typical wrought aluminum near room temperature',
  },
  {
    id: 'water',
    name: 'Water at approximately 20 °C',
    category: 'liquids',
    densityLbPerFt3: WATER_DENSITY_LB_PER_FT3,
    approximate: true,
    densityType: 'material',
    conditions: 'Approximate near 20 °C; density changes with temperature',
  },
  {
    id: 'concrete-construction',
    name: 'Concrete',
    category: 'construction',
    densityLbPerFt3: CONCRETE_DENSITY_LB_PER_FT3,
    approximate: true,
    densityType: 'material',
    conditions: 'Illustrative reference ≈ 149.83 lb/ft³; mix design and moisture vary',
  },
  {
    id: 'dry-sand-construction',
    name: 'Dry sand',
    category: 'construction',
    densityLbPerFt3: 100,
    approximate: true,
    densityType: 'bulk',
    conditions: 'Illustrative bulk density; moisture and compaction change results',
  },
  {
    id: 'dry-soil-construction',
    name: 'Dry soil',
    category: 'construction',
    densityLbPerFt3: 80,
    approximate: true,
    densityType: 'bulk',
    conditions: 'Illustrative bulk density; soil type and compaction vary',
  },
  {
    id: 'oak',
    name: 'Oak wood',
    category: 'wood',
    densityLbPerFt3: 47,
    approximate: true,
    densityType: 'material',
    conditions: 'Illustrative hardwood density; species and moisture content vary',
  },
  {
    id: 'pine',
    name: 'Pine wood',
    category: 'wood',
    densityLbPerFt3: 30,
    approximate: true,
    densityType: 'material',
    conditions: 'Illustrative softwood density; species and moisture content vary',
  },
  {
    id: 'water-other',
    name: 'Water at approximately 20 °C',
    category: 'other',
    densityLbPerFt3: WATER_DENSITY_LB_PER_FT3,
    approximate: true,
    densityType: 'material',
    conditions: 'Approximate near 20 °C',
  },
  {
    id: 'steel-other',
    name: 'Steel',
    category: 'other',
    densityLbPerFt3: 490,
    approximate: true,
    densityType: 'material',
    conditions: 'Typical mild / carbon steel; alloys differ',
  },
  {
    id: CUSTOM_MATERIAL_ID,
    name: 'Custom material',
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
  return Boolean(item?.densityLbPerFt3 != null && item.densityLbPerFt3 > 0);
}

export function defaultMaterialIdForCategory(category: SubstanceCategory): string {
  const list = materialsForCategory(category);
  const withDensity = list.find((m) => m.densityLbPerFt3 != null && m.densityLbPerFt3 > 0);
  if (withDensity) return withDensity.id;
  if (list.length > 0) return list[0]!.id;
  return CUSTOM_MATERIAL_ID;
}
