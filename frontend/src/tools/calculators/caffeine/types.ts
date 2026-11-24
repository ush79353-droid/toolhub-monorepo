/** Daily caffeine intake worksheet (Omni-documented servings + population caps). */

export type CaffeineDrinkId =
  | 'filterCoffeeMug'
  | 'instantCoffeeMug'
  | 'teaCup'
  | 'greenTeaCup'
  | 'colaCan'
  | 'energyDrink'
  | 'espressoShot';

export type CaffeinePopulation = 'adult' | 'pregnant' | 'teenager' | 'child';

export interface CaffeineInput {
  drink1: CaffeineDrinkId;
  count1: number | null;
  drink2: CaffeineDrinkId;
  count2: number | null;
  drink3: CaffeineDrinkId;
  count3: number | null;
  population: CaffeinePopulation;
}

export interface CaffeineResult {
  totalMg: number;
  maxRecommendedMg: number;
  formattedTotal: string;
  formattedMax: string;
  overLimit: boolean;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type CaffeineFieldErrors = {
  form?: string;
  count1?: string;
  count2?: string;
  count3?: string;
};

export function createDefaultInput(): CaffeineInput {
  return {
    drink1: 'filterCoffeeMug',
    count1: null,
    drink2: 'teaCup',
    count2: 0,
    drink3: 'colaCan',
    count3: 0,
    population: 'adult',
  };
}

export function createEmptyInput(): CaffeineInput {
  return createDefaultInput();
}

/** 2 filter coffee mugs → 280 mg (under adult 400). */
export function createExampleInput(): CaffeineInput {
  return {
    drink1: 'filterCoffeeMug',
    count1: 2,
    drink2: 'teaCup',
    count2: 0,
    drink3: 'colaCan',
    count3: 0,
    population: 'adult',
  };
}

export function inputsEqual(a: CaffeineInput, b: CaffeineInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const DRINK_OPTIONS: readonly {
  id: CaffeineDrinkId;
  label: string;
  mgPerServing: number;
  servingNote: string;
}[] = [
  {
    id: 'filterCoffeeMug',
    label: 'mugs of filter coffee',
    mgPerServing: 140,
    servingNote: '350 g mug · 140 mg',
  },
  {
    id: 'instantCoffeeMug',
    label: 'mugs of instant coffee',
    mgPerServing: 100,
    servingNote: '350 g mug · 100 mg',
  },
  {
    id: 'teaCup',
    label: 'cups of tea',
    mgPerServing: 50,
    servingNote: '190 g cup · 50 mg',
  },
  {
    id: 'greenTeaCup',
    label: 'cups of green tea',
    mgPerServing: 40,
    servingNote: '190 g cup · 40 mg',
  },
  {
    id: 'colaCan',
    label: 'cans of cola',
    mgPerServing: 40,
    servingNote: '330 ml can · 40 mg',
  },
  {
    id: 'energyDrink',
    label: 'energy drinks',
    mgPerServing: 80,
    servingNote: '250 ml can · 80 mg',
  },
  {
    id: 'espressoShot',
    label: 'shots of espresso',
    mgPerServing: 45,
    servingNote: '45 mg per shot',
  },
];

export const POPULATION_OPTIONS: readonly {
  value: CaffeinePopulation;
  label: string;
}[] = [
  { value: 'adult', label: 'an adult' },
  { value: 'pregnant', label: 'pregnant' },
  { value: 'teenager', label: 'a teenager (13-18)' },
  { value: 'child', label: 'a child (0-12)' },
];
