import { DISCLAIMER, SOURCE_LABEL } from './content';
import type {
  CaffeineDrinkId,
  CaffeineInput,
  CaffeinePopulation,
  CaffeineResult,
} from './types';
import { DRINK_OPTIONS } from './types';

export { DISCLAIMER, SOURCE_LABEL };

const MG_BY_DRINK: Record<CaffeineDrinkId, number> = Object.fromEntries(
  DRINK_OPTIONS.map((d) => [d.id, d.mgPerServing]),
) as Record<CaffeineDrinkId, number>;

/** Population upper-limit references — not intake goals. */
export function maxRecommendedMg(population: CaffeinePopulation): number {
  switch (population) {
    case 'adult':
      return 400;
    case 'pregnant':
      return 200;
    case 'teenager':
      return 100;
    case 'child':
      return 0;
  }
}

export function drinkMg(id: CaffeineDrinkId, count: number): number {
  return MG_BY_DRINK[id] * count;
}

export function calculateCaffeine(input: CaffeineInput): CaffeineResult {
  const c1 = input.count1 ?? 0;
  const c2 = input.count2 ?? 0;
  const c3 = input.count3 ?? 0;
  const totalMg =
    drinkMg(input.drink1, c1) +
    drinkMg(input.drink2, c2) +
    drinkMg(input.drink3, c3);
  const maxRecommended = maxRecommendedMg(input.population);
  const rounded = Math.round(totalMg * 10) / 10;

  return {
    totalMg: rounded,
    maxRecommendedMg: maxRecommended,
    formattedTotal: `${rounded}`,
    formattedMax: `${maxRecommended}`,
    overLimit: rounded > maxRecommended,
    explanation:
      input.population === 'child'
        ? 'Children are generally advised to avoid caffeine; the max field shows 0 mg as that framing, not a dosing target.'
        : `Sum of servings × documented mg/serving. Max ${maxRecommended} mg is a population upper-limit reference, not a goal.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
