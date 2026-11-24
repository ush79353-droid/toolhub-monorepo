import type { DietFrequency, DietRiskItemId } from './types';

/** Johnston et al. DRS item scoring (0–3 per item; processed meat = 3 unless never). */
export const DRS_SCORE_MATRIX: Readonly<
  Record<
    DietRiskItemId,
    Readonly<Record<DietFrequency, number>>
  >
> = {
  fast_food: { daily: 3, two_three_week: 2, once_week: 1, never: 0 },
  breads: { daily: 3, two_three_week: 2, once_week: 1, never: 0 },
  snacks: { daily: 3, two_three_week: 2, once_week: 1, never: 0 },
  processed_meats: { daily: 3, two_three_week: 3, once_week: 3, never: 0 },
  sweet_drinks: { daily: 3, two_three_week: 2, once_week: 1, never: 0 },
  nuts: { daily: 0, two_three_week: 0, once_week: 2, never: 3 },
  fish: { daily: 0, two_three_week: 0, once_week: 1, never: 3 },
  vegetables: { daily: 0, two_three_week: 3, once_week: 3, never: 3 },
  fruit: { daily: 0, two_three_week: 3, once_week: 3, never: 3 },
};