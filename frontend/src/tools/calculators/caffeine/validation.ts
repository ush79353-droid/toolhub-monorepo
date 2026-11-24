import type {
  CaffeineFieldErrors,
  CaffeineInput,
  CaffeineResult,
} from './types';

export interface CaffeineValidation {
  isValid: boolean;
  errors: CaffeineFieldErrors;
  result: CaffeineResult | null;
}

/** UI stub — engine commit replaces with serving sums. */
export function validateCaffeineInput(
  _input: CaffeineInput,
): CaffeineValidation {
  return {
    isValid: true,
    errors: {},
    result: {
      totalMg: 0,
      maxRecommendedMg: 400,
      formattedTotal: '0',
      formattedMax: '400',
      overLimit: false,
      explanation: 'Scoring engine pending.',
      disclaimer: '',
      sourceLabel: '',
    },
  };
}
