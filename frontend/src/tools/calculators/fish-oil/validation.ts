import type {
  FishOilFieldErrors,
  FishOilInput,
  FishOilResult,
} from './types';

export interface FishOilValidation {
  errors: FishOilFieldErrors;
  result: FishOilResult | null;
}

const UI_SHELL_DISCLAIMER =
  'Educational omega-3 guidance shell — engine formulas land in the next commit.';

/**
 * UI-phase stub: accepts screenshot defaults and returns an empty educational
 * result shell. Replaced by the engine commit with calculateFishOil wiring.
 */
export function validateFishOilInput(input: FishOilInput): FishOilValidation {
  const errors: FishOilFieldErrors = {};
  void input;

  return {
    errors,
    result: {
      ageGuidance: null,
      specialGuidance: null,
      statusHeadline: 'Select an age band or special requirement',
      statusDetail:
        'Screenshot defaults leave both panels empty until a selection is made.',
      sourceNote:
        'NIH ODS Omega-3 fact sheets; AHA advisories; FDA supplement upper limit.',
      disclaimer: UI_SHELL_DISCLAIMER,
    },
  };
}
