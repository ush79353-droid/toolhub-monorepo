/** Day-count basis for annualizing forward premium (repository convention). */
export const FORWARD_PREMIUM_DAY_COUNT_BASIS = 365 as const;

export type ForwardPremiumEditedField =
  | 'spotRate'
  | 'forwardRate'
  | 'forwardPremiumPercent'
  | 'durationDays'
  | 'annualizedForwardPremiumPercent';

export interface ForwardPremiumInput {
  spotRate: string;
  forwardRate: string;
  forwardPremiumPercent: string;
  durationDays: string;
  annualizedForwardPremiumPercent: string;
  /** Last field the user edited — drives linked recalculation. */
  lastEdited: ForwardPremiumEditedField;
}

export interface ForwardPremiumResult {
  spotRate: number;
  forwardRate: number;
  forwardPremiumPercent: number;
  durationDays: number;
  annualizedForwardPremiumPercent: number;
  dayCountBasis: number;
  isDiscount: boolean;
  formattedSpot: string;
  formattedForward: string;
  formattedPremium: string;
  formattedDuration: string;
  formattedAnnualized: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type ForwardPremiumFieldErrors = {
  form?: string;
  spotRate?: string;
  forwardRate?: string;
  forwardPremiumPercent?: string;
  durationDays?: string;
  annualizedForwardPremiumPercent?: string;
};

export function createEmptyInput(): ForwardPremiumInput {
  return {
    spotRate: '',
    forwardRate: '',
    forwardPremiumPercent: '',
    durationDays: '',
    annualizedForwardPremiumPercent: '',
    lastEdited: 'spotRate',
  };
}

/**
 * Worked example: S=1.25, F=1.28, 90 days
 * premium = ((1.28−1.25)/1.25)×100 = 2.4%
 * annualized = 2.4 × (365/90) ≈ 9.733333%
 */
export function createExampleInput(): ForwardPremiumInput {
  return {
    spotRate: '1.25',
    forwardRate: '1.28',
    forwardPremiumPercent: '',
    durationDays: '90',
    annualizedForwardPremiumPercent: '',
    lastEdited: 'forwardRate',
  };
}
