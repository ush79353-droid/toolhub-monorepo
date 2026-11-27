export type LengthUnit = 'cm' | 'in';
export type MassUnit = 'kg' | 'lb';
export type Sex = 'male' | 'female';
export type Race = 'white' | 'black';

export type HeightStudy =
  | 'mitchellLipschitz'
  | 'who'
  | 'rabitoArmSemi'
  | 'rabitoSemi'
  | 'gray'
  | 'chumlea'
  | 'cereda'
  | 'kneeHeight'
  | 'demiSpan'
  | 'forearm';

export type WeightStudy = 'chumlea' | 'rabito' | 'ross';
export type RabitoWeightVariant = 'withSkinfold' | 'noSkinfold' | 'withSex';

export interface BedriddenInput {
  heightStudy: HeightStudy;
  semiSpanText: string;
  semiSpanUnit: LengthUnit;
  halfArmSpanText: string;
  halfArmSpanUnit: LengthUnit;
  armLengthText: string;
  armLengthUnit: LengthUnit;
  recumbentText: string;
  recumbentUnit: LengthUnit;
  kneeHeightText: string;
  kneeHeightUnit: LengthUnit;
  forearmText: string;
  forearmUnit: LengthUnit;
  demiSpanText: string;
  demiSpanUnit: LengthUnit;
  heightAgeText: string;
  heightSex: Sex;
  heightRace: Race;
  heightOutUnit: LengthUnit;

  weightStudy: WeightStudy;
  rabitoVariant: RabitoWeightVariant;
  weightSex: Sex;
  weightRace: Race;
  armCircText: string;
  armCircUnit: LengthUnit;
  kneeWeightText: string;
  kneeWeightUnit: LengthUnit;
  calfText: string;
  calfUnit: LengthUnit;
  subscapularText: string;
  subscapularUnit: LengthUnit;
  abdominalText: string;
  abdominalUnit: LengthUnit;
  weightOutUnit: MassUnit;
}

export interface BedriddenResult {
  heightCm: number | null;
  weightKg: number | null;
  formattedHeight: string;
  formattedWeight: string;
  heightStatus: string;
  weightStatus: string;
  sourceNote: string;
  disclaimer: string;
}

export type BedriddenFieldErrors = Partial<Record<keyof BedriddenInput, string>>;

export function createDefaultInput(): BedriddenInput {
  return {
    heightStudy: 'mitchellLipschitz',
    semiSpanText: '',
    semiSpanUnit: 'cm',
    halfArmSpanText: '',
    halfArmSpanUnit: 'cm',
    armLengthText: '',
    armLengthUnit: 'cm',
    recumbentText: '',
    recumbentUnit: 'cm',
    kneeHeightText: '',
    kneeHeightUnit: 'cm',
    forearmText: '',
    forearmUnit: 'cm',
    demiSpanText: '',
    demiSpanUnit: 'cm',
    heightAgeText: '',
    heightSex: 'male',
    heightRace: 'white',
    heightOutUnit: 'cm',

    weightStudy: 'ross',
    rabitoVariant: 'noSkinfold',
    weightSex: 'male',
    weightRace: 'white',
    armCircText: '',
    armCircUnit: 'cm',
    kneeWeightText: '',
    kneeWeightUnit: 'cm',
    calfText: '',
    calfUnit: 'cm',
    subscapularText: '',
    subscapularUnit: 'cm',
    abdominalText: '',
    abdominalUnit: 'cm',
    weightOutUnit: 'kg',
  };
}

export function createEmptyInput(): BedriddenInput {
  return createDefaultInput();
}

export function inputsEqual(a: BedriddenInput, b: BedriddenInput): boolean {
  return (Object.keys(a) as (keyof BedriddenInput)[]).every((k) => a[k] === b[k]);
}

/** Clear measurement texts that the newly selected height study does not use. */
export function clearIncompatibleHeightFields(
  input: BedriddenInput,
  nextStudy: HeightStudy,
): BedriddenInput {
  const base = { ...input, heightStudy: nextStudy };
  const keep = heightFieldsFor(nextStudy);
  const blankIf = (key: keyof BedriddenInput, needed: boolean) => {
    if (!needed && typeof base[key] === 'string') {
      (base as Record<string, unknown>)[key] = '';
    }
  };
  blankIf('semiSpanText', keep.has('semiSpan'));
  blankIf('halfArmSpanText', keep.has('halfArmSpan'));
  blankIf('armLengthText', keep.has('armLength'));
  blankIf('recumbentText', keep.has('recumbent'));
  blankIf('kneeHeightText', keep.has('kneeHeight'));
  blankIf('forearmText', keep.has('forearm'));
  blankIf('demiSpanText', keep.has('demiSpan'));
  blankIf('heightAgeText', keep.has('age'));
  return base;
}

export function clearIncompatibleWeightFields(
  input: BedriddenInput,
  nextStudy: WeightStudy,
): BedriddenInput {
  const base = { ...input, weightStudy: nextStudy };
  const keep = weightFieldsFor(nextStudy, base.rabitoVariant);
  const blankIf = (key: keyof BedriddenInput, needed: boolean) => {
    if (!needed && typeof base[key] === 'string') {
      (base as Record<string, unknown>)[key] = '';
    }
  };
  blankIf('armCircText', keep.has('armCirc'));
  blankIf('kneeWeightText', keep.has('knee'));
  blankIf('calfText', keep.has('calf'));
  blankIf('subscapularText', keep.has('subscapular'));
  blankIf('abdominalText', keep.has('abdominal'));
  return base;
}

export function heightFieldsFor(study: HeightStudy): Set<string> {
  switch (study) {
    case 'mitchellLipschitz':
      return new Set(['semiSpan']);
    case 'who':
      return new Set(['halfArmSpan']);
    case 'rabitoArmSemi':
      return new Set(['armLength', 'semiSpan', 'age', 'sex']);
    case 'rabitoSemi':
      return new Set(['semiSpan', 'age', 'sex']);
    case 'gray':
      return new Set(['recumbent']);
    case 'chumlea':
      return new Set(['kneeHeight', 'age', 'sex', 'race']);
    case 'cereda':
      return new Set(['kneeHeight', 'age', 'sex']);
    case 'kneeHeight':
      return new Set(['kneeHeight', 'age', 'sex']);
    case 'demiSpan':
      return new Set(['demiSpan', 'sex']);
    case 'forearm':
      return new Set(['forearm', 'age', 'sex']);
  }
}

export function weightFieldsFor(
  study: WeightStudy,
  rabito: RabitoWeightVariant,
): Set<string> {
  if (study === 'chumlea') {
    return new Set(['calf', 'knee', 'armCirc', 'subscapular', 'sex']);
  }
  if (study === 'ross') {
    return new Set(['knee', 'armCirc', 'sex', 'race']);
  }
  // rabito
  if (rabito === 'withSkinfold') {
    return new Set(['armCirc', 'abdominal', 'calf', 'subscapular']);
  }
  if (rabito === 'withSex') {
    return new Set(['armCirc', 'abdominal', 'calf', 'sex']);
  }
  return new Set(['armCirc', 'abdominal', 'calf']);
}
