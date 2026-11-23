import type { Sex } from './food-data';

export interface AddedSugarIntakeInput {
  sex: Sex;
  drinkId: string;
  drinkQtyText: string;
  dairyId: string;
  dairyQtyText: string;
  cerealId: string;
  cerealQtyText: string;
  obviousBakedId: string;
  obviousBakedQtyText: string;
  candyId: string;
  candyQtyText: string;
  teaCoffeeTspText: string;
  otherObviousGramsText: string;
  hiddenSnackId: string;
  hiddenSnackQtyText: string;
  hiddenBreadId: string;
  hiddenBreadQtyText: string;
  dressingId: string;
  dressingQtyText: string;
  otherHiddenGramsText: string;
}

export interface AddedSugarIntakeResult {
  totalGrams: number | null;
  approximateTeaspoons: number | null;
  guidelineGrams: number | null;
  differenceFromGuideline: number | null;
  overGuideline: boolean | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type AddedSugarIntakeFieldErrors = {
  drinkQtyText?: string;
  dairyQtyText?: string;
  cerealQtyText?: string;
  obviousBakedQtyText?: string;
  candyQtyText?: string;
  teaCoffeeTspText?: string;
  otherObviousGramsText?: string;
  hiddenSnackQtyText?: string;
  hiddenBreadQtyText?: string;
  dressingQtyText?: string;
  otherHiddenGramsText?: string;
};

export function createDefaultInput(): AddedSugarIntakeInput {
  return {
    sex: 'female',
    drinkId: 'coca_cola_original',
    drinkQtyText: '',
    dairyId: 'vanilla_ice_cream_half_cup',
    dairyQtyText: '',
    cerealId: 'corn_flakes',
    cerealQtyText: '',
    obviousBakedId: 'frosted_doughnut',
    obviousBakedQtyText: '',
    candyId: 'large_marshmallow',
    candyQtyText: '',
    teaCoffeeTspText: '',
    otherObviousGramsText: '',
    hiddenSnackId: 'potato_chips_cup',
    hiddenSnackQtyText: '',
    hiddenBreadId: 'oat_bran_bread',
    hiddenBreadQtyText: '',
    dressingId: 'thousand_island',
    dressingQtyText: '',
    otherHiddenGramsText: '',
  };
}

export function createScreenshotFixtureInput(): AddedSugarIntakeInput {
  return {
    sex: 'female',
    drinkId: 'coca_cola_original',
    drinkQtyText: '1',
    dairyId: 'vanilla_ice_cream_half_cup',
    dairyQtyText: '2',
    cerealId: 'corn_flakes',
    cerealQtyText: '0',
    obviousBakedId: 'frosted_doughnut',
    obviousBakedQtyText: '0',
    candyId: 'large_marshmallow',
    candyQtyText: '5',
    teaCoffeeTspText: '2',
    otherObviousGramsText: '0',
    hiddenSnackId: 'potato_chips_cup',
    hiddenSnackQtyText: '0',
    hiddenBreadId: 'oat_bran_bread',
    hiddenBreadQtyText: '1',
    dressingId: 'thousand_island',
    dressingQtyText: '1',
    otherHiddenGramsText: '0',
  };
}

export function createEmptyInput(): AddedSugarIntakeInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: AddedSugarIntakeInput,
  b: AddedSugarIntakeInput,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}