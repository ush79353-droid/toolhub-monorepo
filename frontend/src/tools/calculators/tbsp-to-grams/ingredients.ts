/**
 * Approximate kitchen bulk densities (g/mL) for level US tablespoons.
 * Values vary with packing, moisture, temperature, and product form.
 */
export interface IngredientDensity {
  id: string;
  name: string;
  densityGPerMl: number;
  notes?: string;
}

export const DEFAULT_INGREDIENT_ID = 'butter';

export const INGREDIENT_DENSITIES: readonly IngredientDensity[] = [
  {
    id: 'water',
    name: 'Water',
    densityGPerMl: 1,
    notes: 'Nominal ≈ 1 g/mL near room temperature',
  },
  {
    id: 'milk',
    name: 'Milk',
    densityGPerMl: 1.03,
    notes: 'Illustrative; fat content changes density',
  },
  {
    id: 'butter',
    name: 'Butter',
    densityGPerMl: 0.959,
    notes: 'Illustrative; fat and water content vary',
  },
  {
    id: 'granulated-sugar',
    name: 'Granulated sugar',
    densityGPerMl: 0.845,
    notes: 'Illustrative bulk density; packing varies',
  },
  {
    id: 'brown-sugar',
    name: 'Brown sugar',
    densityGPerMl: 0.75,
    notes: 'Illustrative packed bulk density',
  },
  {
    id: 'all-purpose-flour',
    name: 'All-purpose flour',
    densityGPerMl: 0.53,
    notes: 'Illustrative leveled bulk density',
  },
  {
    id: 'olive-oil',
    name: 'Olive oil',
    densityGPerMl: 0.91,
    notes: 'Illustrative; grade and temperature vary',
  },
  {
    id: 'honey',
    name: 'Honey',
    densityGPerMl: 1.42,
    notes: 'Illustrative; moisture content varies',
  },
  {
    id: 'cocoa-powder',
    name: 'Cocoa powder',
    densityGPerMl: 0.52,
    notes: 'Illustrative unsweetened bulk density',
  },
  {
    id: 'table-salt',
    name: 'Table salt',
    densityGPerMl: 1.27,
    notes: 'Illustrative fine table salt bulk density',
  },
] as const;

export function findIngredient(id: string): IngredientDensity | undefined {
  return INGREDIENT_DENSITIES.find((item) => item.id === id);
}

export function requireIngredient(id: string): IngredientDensity {
  const found = findIngredient(id);
  if (!found) {
    throw new RangeError(`Unknown ingredient: ${id}`);
  }
  return found;
}
