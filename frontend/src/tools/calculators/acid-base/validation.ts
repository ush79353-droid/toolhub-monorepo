import type {
  AcidBaseFieldErrors,
  AcidBaseInput,
  AcidBaseResult,
} from './types';

export interface AcidBaseValidation {
  errors: AcidBaseFieldErrors;
  result: AcidBaseResult | null;
}

/** UI shell stub — replaced by engine commit with calculateAcidBase. */
export function validateAcidBaseInput(
  _input: AcidBaseInput,
): AcidBaseValidation {
  return {
    errors: {},
    result: {
      anionGap: null,
      correctedAnionGap: null,
      formattedAnionGap: '',
      formattedCorrected: '',
      abgHeadline: '',
      abgDetail: '',
      statusHeadline: 'Enter Na⁺, Cl⁻, and HCO₃⁻ for the anion gap.',
      statusDetail:
        'pH and PCO₂ frame educational ABG context when all three ABG fields are set.',
      sourceNote: '',
      disclaimer:
        'Educational only — not a laboratory report or clinical acid–base diagnosis.',
    },
  };
}
