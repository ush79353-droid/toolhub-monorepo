/** CHA₂DS₂-VASc educational stroke-risk score for nonvalvular AF. */

export type YesNo = 'yes' | 'no';
export type AgeBand = 'under65' | '65to74' | 'ge75';

export interface Cha2ds2VascInput {
  chf: YesNo;
  hypertension: YesNo;
  ageBand: AgeBand;
  diabetes: YesNo;
  female: YesNo;
  priorStrokeTie: YesNo;
  vascularDisease: YesNo;
}

export type RiskBand = 'low' | 'intermediate' | 'high';

export interface Cha2ds2VascResult {
  score: number;
  formattedScore: string;
  riskBand: RiskBand;
  riskBandLabel: string;
  strokeRiskPercent: number;
  compositeRiskPercent: number;
  formattedStrokeRisk: string;
  formattedCompositeRisk: string;
  interpretation: string;
  femaleSexOnly: boolean;
  femaleSexOnlyNote: string | null;
  rateSourceNote: string;
}

export type Cha2ds2VascFieldErrors = {
  form?: string;
};

/** Screenshot defaults: all No / age <65 → score 0. */
export function createDefaultInput(): Cha2ds2VascInput {
  return {
    chf: 'no',
    hypertension: 'no',
    ageBand: 'under65',
    diabetes: 'no',
    female: 'no',
    priorStrokeTie: 'no',
    vascularDisease: 'no',
  };
}

export function createEmptyInput(): Cha2ds2VascInput {
  return createDefaultInput();
}

export function inputsEqual(a: Cha2ds2VascInput, b: Cha2ds2VascInput): boolean {
  return (
    a.chf === b.chf &&
    a.hypertension === b.hypertension &&
    a.ageBand === b.ageBand &&
    a.diabetes === b.diabetes &&
    a.female === b.female &&
    a.priorStrokeTie === b.priorStrokeTie &&
    a.vascularDisease === b.vascularDisease
  );
}
