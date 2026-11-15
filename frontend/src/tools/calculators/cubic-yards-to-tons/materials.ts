import type { SubstanceCategory } from './types';
import { WATER_DENSITY_KG_PER_M3 } from './types';

/**
 * Verified / conventional density presets only.
 * Values are labeled approximate where temperature, composition, or bulk packing varies.
 * Construction bulk materials (sand, gravel, soil) are omitted as single universal figures —
 * users enter a site-specific bulk density via Custom material.
 */
export interface MaterialDensity {
  id: string;
  name: string;
  category: SubstanceCategory;
  densityKgPerM3: number;
  approximate: boolean;
  densityType: 'material' | 'bulk';
  conditions?: string;
  source: string;
}

export const CUSTOM_MATERIAL_ID = 'custom';

export const MATERIALS: readonly MaterialDensity[] = [
  {
    id: 'water',
    name: 'Water',
    category: 'food',
    densityKgPerM3: WATER_DENSITY_KG_PER_M3,
    approximate: true,
    densityType: 'material',
    conditions: 'Conventional ≈ 1 g/mL; actual density varies with temperature and pressure',
    source: 'Conventional reference (≈1000 kg/m³ near 4 °C)',
  },
  {
    id: 'water-liquid',
    name: 'Water',
    category: 'liquids',
    densityKgPerM3: WATER_DENSITY_KG_PER_M3,
    approximate: true,
    densityType: 'material',
    conditions: 'Conventional ≈ 1 g/mL; actual density varies with temperature and pressure',
    source: 'Conventional reference (≈1000 kg/m³ near 4 °C)',
  },
  {
    id: 'ethanol',
    name: 'Ethanol',
    category: 'liquids',
    densityKgPerM3: 789,
    approximate: true,
    densityType: 'material',
    conditions: 'Approx. pure ethanol near 20 °C',
    source: 'CRC / standard physical-property tables (approx. 789 kg/m³ at 20 °C)',
  },
  {
    id: 'aluminum',
    name: 'Aluminum',
    category: 'metals',
    densityKgPerM3: 2700,
    approximate: true,
    densityType: 'material',
    conditions: 'Pure / wrought aluminum at room temperature',
    source: 'Standard engineering materials handbooks (≈2.70 g/cm³)',
  },
  {
    id: 'iron',
    name: 'Iron',
    category: 'metals',
    densityKgPerM3: 7870,
    approximate: true,
    densityType: 'material',
    conditions: 'Pure iron at room temperature',
    source: 'Standard engineering materials handbooks (≈7.87 g/cm³)',
  },
  {
    id: 'copper',
    name: 'Copper',
    category: 'metals',
    densityKgPerM3: 8960,
    approximate: true,
    densityType: 'material',
    conditions: 'Pure copper at room temperature',
    source: 'Standard engineering materials handbooks (≈8.96 g/cm³)',
  },
  {
    id: 'steel',
    name: 'Steel (mild / carbon)',
    category: 'metals',
    densityKgPerM3: 7850,
    approximate: true,
    densityType: 'material',
    conditions: 'Typical mild / carbon steel; alloy steels vary',
    source: 'Standard engineering materials handbooks (≈7.85 g/cm³)',
  },
  {
    id: 'air',
    name: 'Air (dry)',
    category: 'gases',
    densityKgPerM3: 1.225,
    approximate: true,
    densityType: 'material',
    conditions: 'ICAO standard atmosphere at sea level, 15 °C, 1013.25 hPa',
    source: 'ICAO Standard Atmosphere (1.225 kg/m³)',
  },
  {
    id: 'nitrogen',
    name: 'Nitrogen (N₂)',
    category: 'gases',
    densityKgPerM3: 1.165,
    approximate: true,
    densityType: 'material',
    conditions: 'Approx. dry N₂ near 20 °C, 1 atm',
    source: 'Standard gas property tables (approx. 1.165 kg/m³ at 20 °C, 1 atm)',
  },
  {
    id: 'carbon-dioxide',
    name: 'Carbon dioxide (CO₂)',
    category: 'gases',
    densityKgPerM3: 1.842,
    approximate: true,
    densityType: 'material',
    conditions: 'Approx. CO₂ near 20 °C, 1 atm',
    source: 'Standard gas property tables (approx. 1.84 kg/m³ at 20 °C, 1 atm)',
  },
] as const;

export function materialsForCategory(category: SubstanceCategory): readonly MaterialDensity[] {
  return MATERIALS.filter((m) => m.category === category);
}

export function findMaterial(id: string): MaterialDensity | undefined {
  return MATERIALS.find((m) => m.id === id);
}

export function defaultMaterialIdForCategory(category: SubstanceCategory): string {
  const list = materialsForCategory(category);
  if (list.length > 0) return list[0]!.id;
  return CUSTOM_MATERIAL_ID;
}
