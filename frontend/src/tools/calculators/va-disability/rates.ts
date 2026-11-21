/**
 * VA disability compensation, effective December 1, 2025 (2026 pay rates).
 * Source: https://www.va.gov/disability/compensation-rates/veteran-rates/
 * 10% and 20% do not increase for dependents.
 * 30%+ “with 1 child” rates include one child under 18.
 * Each further child under 18 uses the additional-under-18 amount.
 * Each child over 18 in a qualifying school program uses the school amount,
 * added to the no-child rate when there is no child under 18.
 * Aid and Attendance is not included.
 */

export const VA_COMPENSATION_YEAR = 2026;
export const VA_COMPENSATION_EFFECTIVE = '2025-12-01';
export const VA_RATES_SOURCE =
  'https://www.va.gov/disability/compensation-rates/veteran-rates/';

const RATINGS_30_TO_100 = [30, 40, 50, 60, 70, 80, 90, 100] as const;

const FLAT_10_20: Record<10 | 20, number> = {
  10: 180.42,
  20: 356.66,
};

type RateRow = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

const ALONE: RateRow = [552.47, 795.84, 1132.9, 1435.02, 1808.45, 2102.15, 2362.3, 3938.58];
const SPOUSE: RateRow = [617.47, 882.84, 1241.9, 1566.02, 1961.45, 2277.15, 2559.3, 4158.17];
const SPOUSE_1_PARENT: RateRow = [669.47, 952.84, 1329.9, 1671.02, 2084.45, 2417.15, 2717.3, 4334.41];
const SPOUSE_2_PARENTS: RateRow = [721.47, 1022.84, 1417.9, 1776.02, 2207.45, 2557.15, 2875.3, 4510.65];
const ONE_PARENT: RateRow = [604.47, 865.84, 1220.9, 1540.02, 1931.45, 2242.15, 2520.3, 4114.82];
const TWO_PARENTS: RateRow = [656.47, 935.84, 1308.9, 1645.02, 2054.45, 2382.15, 2678.3, 4291.06];

const CHILD: RateRow = [596.47, 853.84, 1205.9, 1523.02, 1910.45, 2219.15, 2494.3, 4085.43];
const CHILD_SPOUSE: RateRow = [666.47, 947.84, 1322.9, 1663.02, 2074.45, 2406.15, 2704.3, 4318.99];
const CHILD_SPOUSE_1_PARENT: RateRow = [718.47, 1017.84, 1410.9, 1768.02, 2197.45, 2546.15, 2862.3, 4495.23];
const CHILD_SPOUSE_2_PARENTS: RateRow = [770.47, 1087.84, 1498.9, 1873.02, 2320.45, 2686.15, 3020.3, 4671.47];
const CHILD_1_PARENT: RateRow = [648.47, 923.84, 1293.9, 1628.02, 2033.45, 2359.15, 2652.3, 4261.67];
const CHILD_2_PARENTS: RateRow = [700.47, 993.84, 1381.9, 1733.02, 2156.45, 2499.15, 2810.3, 4437.91];

const EXTRA_CHILD_UNDER_18: RateRow = [32, 43, 54, 65, 76, 87, 98, 109.11];
const SCHOOL_CHILD: RateRow = [105, 140, 176, 211, 246, 281, 317, 352.45];

function indexFor(rating: number): number {
  return RATINGS_30_TO_100.indexOf(rating as (typeof RATINGS_30_TO_100)[number]);
}

function pick(row: RateRow, rating: number): number {
  const index = indexFor(rating);
  if (index < 0) return 0;
  return row[index] ?? 0;
}

export function monthlyCompensation(input: {
  combinedRating: number;
  married: boolean;
  childrenUnder18: number;
  childrenOver18InSchool: number;
  dependentParents: 0 | 1 | 2;
}): number | null {
  const rating = input.combinedRating;
  if (!Number.isInteger(rating) || rating < 0 || rating > 100 || rating % 10 !== 0) {
    return null;
  }
  if (
    input.childrenUnder18 < 0 ||
    input.childrenOver18InSchool < 0 ||
    input.dependentParents < 0 ||
    input.dependentParents > 2
  ) {
    return null;
  }
  if (rating === 0) return 0;
  if (rating === 10 || rating === 20) return FLAT_10_20[rating];

  const parents = input.dependentParents;
  const minors = input.childrenUnder18;
  const school = input.childrenOver18InSchool;
  const married = input.married;
  const includeMinorInBase = minors > 0;

  let baseRow: RateRow;
  if (includeMinorInBase) {
    if (married && parents === 2) baseRow = CHILD_SPOUSE_2_PARENTS;
    else if (married && parents === 1) baseRow = CHILD_SPOUSE_1_PARENT;
    else if (married) baseRow = CHILD_SPOUSE;
    else if (parents === 2) baseRow = CHILD_2_PARENTS;
    else if (parents === 1) baseRow = CHILD_1_PARENT;
    else baseRow = CHILD;
  } else if (married && parents === 2) baseRow = SPOUSE_2_PARENTS;
  else if (married && parents === 1) baseRow = SPOUSE_1_PARENT;
  else if (married) baseRow = SPOUSE;
  else if (parents === 2) baseRow = TWO_PARENTS;
  else if (parents === 1) baseRow = ONE_PARENT;
  else baseRow = ALONE;

  const extraMinors = includeMinorInBase ? minors - 1 : 0;
  const amount =
    pick(baseRow, rating) +
    extraMinors * pick(EXTRA_CHILD_UNDER_18, rating) +
    school * pick(SCHOOL_CHILD, rating);
  return Math.round(amount * 100) / 100;
}

export interface ChartRow {
  rating: number;
  alone: number;
  withSpouse: number;
  withOneChild: number;
  withSpouseAndChild: number;
}

export function compensationChart(): ChartRow[] {
  return [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((rating) => ({
    rating,
    alone: monthlyCompensation({
      combinedRating: rating,
      married: false,
      childrenUnder18: 0,
      childrenOver18InSchool: 0,
      dependentParents: 0,
    })!,
    withSpouse: monthlyCompensation({
      combinedRating: rating,
      married: true,
      childrenUnder18: 0,
      childrenOver18InSchool: 0,
      dependentParents: 0,
    })!,
    withOneChild: monthlyCompensation({
      combinedRating: rating,
      married: false,
      childrenUnder18: 1,
      childrenOver18InSchool: 0,
      dependentParents: 0,
    })!,
    withSpouseAndChild: monthlyCompensation({
      combinedRating: rating,
      married: true,
      childrenUnder18: 1,
      childrenOver18InSchool: 0,
      dependentParents: 0,
    })!,
  }));
}
