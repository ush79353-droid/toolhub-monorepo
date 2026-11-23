/**
 * Added sugar per serving — label-derived reference values for educational totals.
 * Each entry: product id, label, serving description, grams of added sugar per serving unit.
 */

export const GRAMS_PER_TEASPOON = 4;

export type Sex = 'female' | 'male';

export interface FoodOption {
  id: string;
  label: string;
  servingLabel: string;
  /** Grams of added sugar in one serving unit (quantity multiplier applies). */
  gramsAddedSugarPerServing: number;
}

export const DRINK_OPTIONS: readonly FoodOption[] = [
  {
    id: 'coca_cola_original',
    label: 'Coca-Cola Original',
    servingLabel: 'cup (8 fl oz)',
    gramsAddedSugarPerServing: 25,
  },
  {
    id: 'orange_juice_sweetened',
    label: 'Sweetened orange juice',
    servingLabel: 'cup (8 fl oz)',
    gramsAddedSugarPerServing: 22,
  },
  {
    id: 'sports_drink',
    label: 'Sports drink',
    servingLabel: 'cup (8 fl oz)',
    gramsAddedSugarPerServing: 14,
  },
];

export const DAIRY_OPTIONS: readonly FoodOption[] = [
  {
    id: 'vanilla_ice_cream_half_cup',
    label: 'Vanilla ice cream (0.5 cup)',
    servingLabel: 'portion (0.5 cup)',
    gramsAddedSugarPerServing: 12,
  },
  {
    id: 'flavored_yogurt',
    label: 'Flavored yogurt',
    servingLabel: 'container (6 oz)',
    gramsAddedSugarPerServing: 18,
  },
];

export const CEREAL_OPTIONS: readonly FoodOption[] = [
  {
    id: 'corn_flakes',
    label: 'Corn Flakes',
    servingLabel: 'cup',
    gramsAddedSugarPerServing: 2,
  },
  {
    id: 'frosted_flakes',
    label: 'Frosted flakes',
    servingLabel: 'cup',
    gramsAddedSugarPerServing: 12,
  },
];

export const OBVIOUS_BAKED_OPTIONS: readonly FoodOption[] = [
  {
    id: 'frosted_doughnut',
    label: 'Frosted doughnut',
    servingLabel: 'piece',
    gramsAddedSugarPerServing: 15,
  },
  {
    id: 'chocolate_muffin',
    label: 'Chocolate muffin',
    servingLabel: 'piece',
    gramsAddedSugarPerServing: 22,
  },
];

export const CANDY_OPTIONS: readonly FoodOption[] = [
  {
    id: 'large_marshmallow',
    label: 'Large marshmallow',
    servingLabel: 'piece',
    gramsAddedSugarPerServing: 3,
  },
  {
    id: 'chocolate_bar',
    label: 'Milk chocolate bar',
    servingLabel: 'piece (1.5 oz)',
    gramsAddedSugarPerServing: 24,
  },
];

export const HIDDEN_SNACK_OPTIONS: readonly FoodOption[] = [
  {
    id: 'potato_chips_cup',
    label: 'Potato chips (1 cup)',
    servingLabel: 'portion (1 cup)',
    gramsAddedSugarPerServing: 0.5,
  },
  {
    id: 'granola_bar',
    label: 'Granola bar',
    servingLabel: 'bar',
    gramsAddedSugarPerServing: 11,
  },
];

export const HIDDEN_BREAD_OPTIONS: readonly FoodOption[] = [
  {
    id: 'oat_bran_bread',
    label: 'Oat bran bread',
    servingLabel: 'piece (1 slice)',
    gramsAddedSugarPerServing: 2,
  },
  {
    id: 'white_bread',
    label: 'White bread',
    servingLabel: 'piece (1 slice)',
    gramsAddedSugarPerServing: 1.5,
  },
];

export const DRESSING_OPTIONS: readonly FoodOption[] = [
  {
    id: 'thousand_island',
    label: 'Thousand Island dressing',
    servingLabel: 'tablespoon',
    gramsAddedSugarPerServing: 1,
  },
  {
    id: 'bbq_sauce',
    label: 'BBQ sauce',
    servingLabel: 'tablespoon',
    gramsAddedSugarPerServing: 6,
  },
];

/** AHA-style daily added-sugar limits (grams), not the 10% energy rule. */
export const SEX_SPECIFIC_LIMIT_G: Record<Sex, number> = {
  female: 25,
  male: 36,
};

export function findFoodOption(
  options: readonly FoodOption[],
  id: string,
): FoodOption | undefined {
  return options.find((o) => o.id === id);
}