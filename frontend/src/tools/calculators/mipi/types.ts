/** Continuous MIPI / MIPI-b — Hoster et al., Blood 2008. */

export type EcogBand = 'zero_one' | 'two_four';

export type MipiRiskGroup = 'low' | 'intermediate' | 'high';

export type MipiVariant = 'mipi' | 'mipi_b';

export interface MipiInput {
  ageYearsText: string;
  ecog: EcogBand;
  serumLdhText: string;
  ldhUlnText: string;
  /** User value in ×1000/µL (screenshot unit). */
  wbcThousandPerUlText: string;
  knowKi67: boolean;
  ki67PercentText: string;
}

export interface MipiResult {
  score: number | null;
  formattedScore: string;
  variant: MipiVariant;
  riskGroup: MipiRiskGroup | null;
  riskGroupLabel: string;
  medianOsNote: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type MipiFieldErrors = {
  ageYearsText?: string;
  serumLdhText?: string;
  ldhUlnText?: string;
  wbcThousandPerUlText?: string;
  ki67PercentText?: string;
};

export const DEFAULT_LDH_ULN = '160';

export function createDefaultInput(): MipiInput {
  return {
    ageYearsText: '',
    ecog: 'zero_one',
    serumLdhText: '',
    ldhUlnText: DEFAULT_LDH_ULN,
    wbcThousandPerUlText: '',
    knowKi67: false,
    ki67PercentText: '',
  };
}

export function createEmptyInput(): MipiInput {
  return createDefaultInput();
}

export function inputsEqual(a: MipiInput, b: MipiInput): boolean {
  return (
    a.ageYearsText === b.ageYearsText &&
    a.ecog === b.ecog &&
    a.serumLdhText === b.serumLdhText &&
    a.ldhUlnText === b.ldhUlnText &&
    a.wbcThousandPerUlText === b.wbcThousandPerUlText &&
    a.knowKi67 === b.knowKi67 &&
    a.ki67PercentText === b.ki67PercentText
  );
}

export const ECOG_OPTIONS: readonly { value: EcogBand; label: string }[] = [
  { value: 'zero_one', label: '0–1' },
  { value: 'two_four', label: '2–4' },
];
