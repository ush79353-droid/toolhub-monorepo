import type { SupportedCurrency } from '@/tools/shared/currency';

export type MarkupVariable =
  | 'cost'
  | 'markupPercentage'
  | 'revenue'
  | 'profit';

export interface MarkupInput {
  currency: SupportedCurrency;
  cost: string;
  markupPercentage: string;
  revenue: string;
  profit: string;
  /** Last two independently edited fields. */
  authoritativeFields: [MarkupVariable, MarkupVariable] | null;
}

export interface MarkupResult {
  currency: SupportedCurrency;
  cost: number;
  markupPercentage: number;
  revenue: number;
  profit: number;
  marginPercentage: number | null;
  authoritativeFields: [MarkupVariable, MarkupVariable];
  formattedCost: string;
  formattedMarkup: string;
  formattedRevenue: string;
  formattedProfit: string;
  formattedMargin: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type MarkupFieldErrors = {
  form?: string;
  cost?: string;
  markupPercentage?: string;
  revenue?: string;
  profit?: string;
};

export function createDefaultInput(): MarkupInput {
  return {
    currency: 'USD',
    cost: '',
    markupPercentage: '',
    revenue: '',
    profit: '',
    authoritativeFields: null,
  };
}

export function createEmptyInput(): MarkupInput {
  return createDefaultInput();
}

/** Reference: cost $50 · markup 40% → revenue $70 · profit $20 */
export function createExampleInput(): MarkupInput {
  return {
    currency: 'USD',
    cost: '50',
    markupPercentage: '40',
    revenue: '70',
    profit: '20',
    authoritativeFields: ['cost', 'markupPercentage'],
  };
}

/**
 * Prefer keeping cost as the other input when the user edits markup % or profit
 * (anchor on unit cost for retail pricing).
 */
export function pushAuthoritative(
  current: [MarkupVariable, MarkupVariable] | null,
  edited: MarkupVariable,
): [MarkupVariable, MarkupVariable] {
  if (!current) {
    const partner: MarkupVariable =
      edited === 'cost' ? 'markupPercentage' : 'cost';
    return [partner, edited];
  }
  if (
    edited !== 'cost' &&
    (current[0] === 'cost' || current[1] === 'cost')
  ) {
    return ['cost', edited];
  }
  if (current[1] === edited) return current;
  if (current[0] === edited) return [current[1], edited];
  return [current[1], edited];
}
