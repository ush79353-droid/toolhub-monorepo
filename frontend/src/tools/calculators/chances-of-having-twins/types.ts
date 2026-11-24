export type TwinsStratumMode = 'by_age' | 'by_race';

export type TwinsRaceEthnicity =
  | 'nh_white'
  | 'nh_black'
  | 'hispanic'
  | 'asian'
  | 'aian'
  | 'nhopi';

export interface TwinsInput {
  stratumMode: TwinsStratumMode;
  motherAgeYears: string;
  raceEthnicity: TwinsRaceEthnicity | '';
}

export interface TwinsResult {
  twinBirthsPerThousand: number;
  percentTwinBirths: number;
  formattedPercent: string;
  formattedRatePerThousand: string;
  oneInN: number;
  formattedOneInN: string;
  stratumDescription: string;
  sourceLabel: string;
  overallUsReferenceRate: number;
  formattedOverallUsRate: string;
  disclaimer: string;
  endpointNote: string;
  artNote: string;
}

export type TwinsFieldErrors = {
  form?: string;
  motherAgeYears?: string;
  raceEthnicity?: string;
};

export const RACE_ETHNICITY_OPTIONS: readonly {
  value: TwinsRaceEthnicity;
  label: string;
}[] = [
  { value: 'nh_white', label: 'Non-Hispanic White' },
  { value: 'nh_black', label: 'Non-Hispanic Black' },
  { value: 'hispanic', label: 'Hispanic' },
  { value: 'asian', label: 'Asian' },
  { value: 'aian', label: 'American Indian/Alaska Native' },
  { value: 'nhopi', label: 'Native Hawaiian/Other Pacific Islander' },
];

export function createEmptyInput(): TwinsInput {
  return {
    stratumMode: 'by_age',
    motherAgeYears: '',
    raceEthnicity: '',
  };
}

/** Age 32 → 30–34 CDC stratum (33.2 per 1,000 births). */
export function createExampleInput(): TwinsInput {
  return {
    stratumMode: 'by_age',
    motherAgeYears: '32',
    raceEthnicity: '',
  };
}

export function inputsEqual(a: TwinsInput, b: TwinsInput): boolean {
  return (
    a.stratumMode === b.stratumMode &&
    a.motherAgeYears === b.motherAgeYears &&
    a.raceEthnicity === b.raceEthnicity
  );
}