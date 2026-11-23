/** Yeh 2016 DAPT score age bands (points applied in calculation). */
export type DaptAgeBand = 'under65' | 'age65to74' | 'age75plus';

export interface DaptInput {
  ageBand: DaptAgeBand;
  diabetes: boolean;
  priorMiOrPci: boolean;
  miAtPresentation: boolean;
  stentDiameterLt3mm: boolean;
  veinGraftStent: boolean;
  chfOrLowEf: boolean;
  /** Screenshot label: “Current or past smoker”; Yeh model: current or within past year. */
  smoker: boolean;
  paclitaxelElutingStent: boolean;
}

export interface DaptBreakdown {
  agePoints: number;
  diabetesPoints: number;
  priorMiOrPciPoints: number;
  miAtPresentationPoints: number;
  stentLt3Points: number;
  veinGraftPoints: number;
  chfOrLowEfPoints: number;
  smokerPoints: number;
  paclitaxelPoints: number;
}

export interface DaptResult {
  totalScore: number;
  breakdown: DaptBreakdown;
  formattedScore: string;
  /** Yeh/ACC: score ≥2 associated with favorable prolonged-DAPT benefit/risk in the derivation framing. */
  highScoreBand: boolean;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type DaptFieldErrors = {
  form?: string;
};

/** Screenshot defaults: age &lt;65 selected; all eight boxes unchecked → score 0. */
export function createDefaultInput(): DaptInput {
  return {
    ageBand: 'under65',
    diabetes: false,
    priorMiOrPci: false,
    miAtPresentation: false,
    stentDiameterLt3mm: false,
    veinGraftStent: false,
    chfOrLowEf: false,
    smoker: false,
    paclitaxelElutingStent: false,
  };
}

export function createEmptyInput(): DaptInput {
  return createDefaultInput();
}

/** Educational fixture: age ≥75 alone → −2. */
export function createExampleInput(): DaptInput {
  return {
    ...createDefaultInput(),
    ageBand: 'age75plus',
  };
}

export function inputsEqual(a: DaptInput, b: DaptInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const AGE_OPTIONS: readonly { value: DaptAgeBand; label: string }[] = [
  { value: 'under65', label: '< 65 years' },
  { value: 'age65to74', label: '65-74 years' },
  /** Screenshot shows “> 75 years”; Yeh/ACC scoring uses age ≥75 (−2). */
  { value: 'age75plus', label: '≥ 75 years' },
];

export const FACTOR_OPTIONS: readonly {
  key: keyof Omit<DaptInput, 'ageBand'>;
  label: string;
}[] = [
  { key: 'diabetes', label: 'Presence of diabetes mellitus' },
  {
    key: 'priorMiOrPci',
    label: 'Prior myocardial infarction or percutaneous coronary intervention',
  },
  { key: 'miAtPresentation', label: 'Myocardial infarction at presentation' },
  { key: 'stentDiameterLt3mm', label: 'Stent diameter less than 3 mm' },
  { key: 'veinGraftStent', label: 'Vein graft stent' },
  {
    key: 'chfOrLowEf',
    label: 'History of congestive heart failure or LVEF < 30%',
  },
  { key: 'smoker', label: 'Current or past smoker' },
  { key: 'paclitaxelElutingStent', label: 'Paclitaxel-Eluting stent' },
];
