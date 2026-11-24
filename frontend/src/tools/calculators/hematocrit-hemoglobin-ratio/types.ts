/**
 * Hematocrit / hemoglobin ratio — educational CBC “rule of three” worksheet.
 */

export interface HematocritHemoglobinRatioInput {
  hematocritPercentText: string;
  hemoglobinGdlText: string;
}

export interface HematocritHemoglobinRatioResult {
  /** Hct ÷ Hb when both entered; otherwise approximate teaching factor 3. */
  ratio: number;
  /** True when ratio is the incomplete-state approximate factor. */
  isApproximateRuleOfThree: boolean;
  formattedRatio: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type HematocritHemoglobinRatioFieldErrors = {
  hematocritPercentText?: string;
  hemoglobinGdlText?: string;
};

export function createDefaultInput(): HematocritHemoglobinRatioInput {
  return {
    hematocritPercentText: '',
    hemoglobinGdlText: '',
  };
}

export function createEmptyInput(): HematocritHemoglobinRatioInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: HematocritHemoglobinRatioInput,
  b: HematocritHemoglobinRatioInput,
): boolean {
  return (
    a.hematocritPercentText === b.hematocritPercentText &&
    a.hemoglobinGdlText === b.hemoglobinGdlText
  );
}
