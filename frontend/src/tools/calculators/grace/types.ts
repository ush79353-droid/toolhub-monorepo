/**
 * GRACE 1.0 — Granger CB et al. Arch Intern Med. 2003;163:2345-2353.
 * Point-based in-hospital mortality risk (educational categories).
 */

export type CreatinineUnit = 'mg/dL' | 'µmol/L';

export type KillipClass = 'I' | 'II' | 'III' | 'IV';

/** unset until the user chooses yes or no */
export type YesNoUnset = 'yes' | 'no' | null;

export interface GraceInput {
  ageYears: string;
  heartRateBpm: string;
  systolicBpMmHg: string;
  creatinineValue: string;
  creatinineUnit: CreatinineUnit;
  killipClass: KillipClass | null;
  cardiacArrestAtAdmission: YesNoUnset;
  stSegmentDeviation: YesNoUnset;
  elevatedCardiacEnzymes: YesNoUnset;
}

export interface GraceBreakdown {
  agePoints: number;
  heartRatePoints: number;
  systolicBpPoints: number;
  creatininePoints: number;
  killipPoints: number;
  cardiacArrestPoints: number;
  stDeviationPoints: number;
  elevatedEnzymesPoints: number;
}

export type GraceRiskCategory = 'low' | 'intermediate' | 'high';

export interface GraceResult {
  totalScore: number;
  breakdown: GraceBreakdown;
  formattedScore: string;
  riskCategory: GraceRiskCategory;
  riskCategoryLabel: string;
  riskMortalityRange: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type GraceFieldErrors = {
  ageYears?: string;
  heartRateBpm?: string;
  systolicBpMmHg?: string;
  creatinineValue?: string;
  killipClass?: string;
  cardiacArrestAtAdmission?: string;
  stSegmentDeviation?: string;
  elevatedCardiacEnzymes?: string;
  form?: string;
};

export const CREATININE_UMOL_PER_MG_DL = 88.4;

export const CREATININE_UNIT_LABELS: Record<CreatinineUnit, string> = {
  'mg/dL': 'mg/dL',
  'µmol/L': 'µmol/L',
};

export const KILLIP_OPTIONS: readonly {
  value: KillipClass;
  label: string;
  points: number;
}[] = [
  { value: 'I', label: 'Killip class I', points: 0 },
  { value: 'II', label: 'Killip class II', points: 20 },
  { value: 'III', label: 'Killip class III', points: 39 },
  { value: 'IV', label: 'Killip class IV', points: 59 },
];

export const YES_NO_OPTIONS: readonly { value: 'yes' | 'no'; label: string }[] =
  [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

export function createDefaultInput(): GraceInput {
  return {
    ageYears: '',
    heartRateBpm: '',
    systolicBpMmHg: '',
    creatinineValue: '',
    creatinineUnit: 'mg/dL',
    killipClass: null,
    cardiacArrestAtAdmission: null,
    stSegmentDeviation: null,
    elevatedCardiacEnzymes: null,
  };
}

export function createEmptyInput(): GraceInput {
  return createDefaultInput();
}

/** Granger teaching profile → intermediate/high risk total. */
export function createExampleInput(): GraceInput {
  return {
    ageYears: '68',
    heartRateBpm: '95',
    systolicBpMmHg: '110',
    creatinineValue: '1.3',
    creatinineUnit: 'mg/dL',
    killipClass: 'II',
    cardiacArrestAtAdmission: 'no',
    stSegmentDeviation: 'yes',
    elevatedCardiacEnzymes: 'yes',
  };
}

export function inputsEqual(a: GraceInput, b: GraceInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}