/**
 * Approximate kitchen bulk densities (g/mL) for level teaspoons.
 * Values vary with packing, moisture, temperature, particle size, and product form.
 * Granulated sugar 0.845 g/mL (= 845 kg/m³) matches the catalog reference example.
 */

export interface IngredientType {
  id: string;
  name: string;
  densityGPerMl: number;
  notes?: string;
}

export interface IngredientCategory {
  id: string;
  name: string;
  types: readonly IngredientType[];
}

export const CUSTOM_CATEGORY_ID = 'custom';
export const CUSTOM_TYPE_ID = 'custom';
export const DEFAULT_CATEGORY_ID = 'sugar';
export const DEFAULT_TYPE_ID = 'granulated-sugar';
/** Reference density for granulated sugar: 845 kg/m³ = 0.845 g/mL. */
export const GRANULATED_SUGAR_KG_PER_M3 = 845;

export const INGREDIENT_CATEGORIES: readonly IngredientCategory[] = [
  {
    id: 'sugar',
    name: 'Sugar',
    types: [
      {
        id: 'granulated-sugar',
        name: 'Granulated sugar',
        densityGPerMl: 0.845,
        notes: 'Illustrative bulk density; packing and crystal size vary',
      },
      {
        id: 'powdered-sugar',
        name: 'Powdered sugar',
        densityGPerMl: 0.56,
        notes: 'Illustrative sifted/unsifted bulk density varies widely',
      },
      {
        id: 'brown-sugar',
        name: 'Brown sugar',
        densityGPerMl: 0.75,
        notes: 'Illustrative packed bulk density',
      },
    ],
  },
  {
    id: 'flour',
    name: 'Flour',
    types: [
      {
        id: 'all-purpose-flour',
        name: 'All-purpose flour',
        densityGPerMl: 0.53,
        notes: 'Illustrative leveled bulk density',
      },
      {
        id: 'bread-flour',
        name: 'Bread flour',
        densityGPerMl: 0.55,
        notes: 'Illustrative leveled bulk density',
      },
      {
        id: 'whole-wheat-flour',
        name: 'Whole wheat flour',
        densityGPerMl: 0.55,
        notes: 'Illustrative leveled bulk density',
      },
    ],
  },
  {
    id: 'salt',
    name: 'Salt',
    types: [
      {
        id: 'table-salt',
        name: 'Table salt',
        densityGPerMl: 1.217,
        notes: 'Illustrative fine table-salt bulk density',
      },
      {
        id: 'fine-sea-salt',
        name: 'Fine sea salt',
        densityGPerMl: 1.2,
        notes: 'Illustrative; grain size and packing vary',
      },
      {
        id: 'coarse-salt',
        name: 'Coarse salt',
        densityGPerMl: 0.95,
        notes: 'Illustrative coarse/kosher-style bulk density',
      },
    ],
  },
  {
    id: 'water',
    name: 'Water',
    types: [
      {
        id: 'water',
        name: 'Water',
        densityGPerMl: 1,
        notes: 'Nominal ≈ 1 g/mL near room temperature',
      },
    ],
  },
  {
    id: 'milk',
    name: 'Milk',
    types: [
      {
        id: 'whole-milk',
        name: 'Whole milk',
        densityGPerMl: 1.03,
        notes: 'Illustrative; fat content and solids change density',
      },
    ],
  },
  {
    id: 'butter',
    name: 'Butter',
    types: [
      {
        id: 'butter',
        name: 'Butter',
        densityGPerMl: 0.959,
        notes: 'Illustrative; fat and water content vary',
      },
    ],
  },
  {
    id: 'honey',
    name: 'Honey',
    types: [
      {
        id: 'honey',
        name: 'Honey',
        densityGPerMl: 1.42,
        notes: 'Illustrative; moisture and floral source change density',
      },
    ],
  },
  {
    id: 'cooking-oil',
    name: 'Cooking oil',
    types: [
      {
        id: 'olive-oil',
        name: 'Olive oil',
        densityGPerMl: 0.91,
        notes: 'Illustrative; grade and temperature change density',
      },
      {
        id: 'vegetable-oil',
        name: 'Vegetable oil',
        densityGPerMl: 0.92,
        notes: 'Illustrative blend; type and temperature change density',
      },
    ],
  },
  {
    id: 'cocoa-powder',
    name: 'Cocoa powder',
    types: [
      {
        id: 'cocoa-powder',
        name: 'Cocoa powder',
        densityGPerMl: 0.52,
        notes: 'Illustrative unsweetened bulk density',
      },
    ],
  },
  {
    id: 'baking-powder',
    name: 'Baking powder',
    types: [
      {
        id: 'baking-powder',
        name: 'Baking powder',
        densityGPerMl: 0.9,
        notes: 'Illustrative bulk density; brand and packing vary',
      },
    ],
  },
  {
    id: 'baking-soda',
    name: 'Baking soda',
    types: [
      {
        id: 'baking-soda',
        name: 'Baking soda',
        densityGPerMl: 1.2,
        notes: 'Illustrative bulk density; packing varies',
      },
    ],
  },
  {
    id: 'rice',
    name: 'Rice',
    types: [
      {
        id: 'white-rice',
        name: 'White rice (uncooked)',
        densityGPerMl: 0.85,
        notes: 'Illustrative uncooked bulk density',
      },
    ],
  },
  {
    id: 'syrup',
    name: 'Syrup',
    types: [
      {
        id: 'maple-syrup',
        name: 'Maple syrup',
        densityGPerMl: 1.32,
        notes: 'Illustrative; grade and temperature change density',
      },
    ],
  },
] as const;

export function findCategory(id: string): IngredientCategory | undefined {
  return INGREDIENT_CATEGORIES.find((c) => c.id === id);
}

export function findType(
  categoryId: string,
  typeId: string,
): IngredientType | undefined {
  return findCategory(categoryId)?.types.find((t) => t.id === typeId);
}

export function defaultTypeIdForCategory(categoryId: string): string {
  const category = findCategory(categoryId);
  return category?.types[0]?.id ?? CUSTOM_TYPE_ID;
}

export function requireType(categoryId: string, typeId: string): IngredientType {
  const found = findType(categoryId, typeId);
  if (!found) {
    throw new RangeError(`Unknown ingredient type: ${categoryId}/${typeId}`);
  }
  return found;
}

/** Flat list used for reference tables and FAQs. */
export function allIngredientTypes(): readonly (IngredientType & {
  categoryId: string;
  categoryName: string;
})[] {
  return INGREDIENT_CATEGORIES.flatMap((category) =>
    category.types.map((type) => ({
      ...type,
      categoryId: category.id,
      categoryName: category.name,
    })),
  );
}
