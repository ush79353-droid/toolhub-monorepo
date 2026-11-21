import type { SupportedCurrency } from '@/tools/shared/currency';

export type MarkdownVariable =
  | 'originalPrice'
  | 'actualPrice'
  | 'markdownAmount'
  | 'markdownPercentage';

export interface MarkdownInput {
  currency: SupportedCurrency;
  originalPrice: string;
  actualPrice: string;
  markdownAmount: string;
  markdownPercentage: string;
  /** Last two independently edited fields (oldest → newest). */
  authoritativeFields: [MarkdownVariable, MarkdownVariable] | null;
}

export interface MarkdownResult {
  currency: SupportedCurrency;
  originalPrice: number;
  actualPrice: number;
  markdownAmount: number;
  markdownPercentage: number;
  authoritativeFields: [MarkdownVariable, MarkdownVariable];
  formattedOriginal: string;
  formattedActual: string;
  formattedMarkdown: string;
  formattedPercent: string;
  formulaBreakdown: string;
  steps: string[];
  interpretation: string;
  explanation: string;
}

export type MarkdownFieldErrors = {
  form?: string;
  originalPrice?: string;
  actualPrice?: string;
  markdownAmount?: string;
  markdownPercentage?: string;
};

export function createDefaultInput(): MarkdownInput {
  return {
    currency: 'USD',
    originalPrice: '',
    actualPrice: '',
    markdownAmount: '',
    markdownPercentage: '',
    authoritativeFields: null,
  };
}

export function createEmptyInput(): MarkdownInput {
  return createDefaultInput();
}

/** Reference: original $100 · actual $75 → markdown $25 · 25% */
export function createExampleInput(): MarkdownInput {
  return {
    currency: 'USD',
    originalPrice: '100',
    actualPrice: '75',
    markdownAmount: '25',
    markdownPercentage: '25',
    authoritativeFields: ['originalPrice', 'actualPrice'],
  };
}

/**
 * Push a newly edited field into the authoritative pair.
 * Prefer keeping originalPrice as the other input when the user edits
 * markdown amount/% (retail “anchor on list price” rule from the brief).
 */
export function pushAuthoritative(
  current: [MarkdownVariable, MarkdownVariable] | null,
  edited: MarkdownVariable,
): [MarkdownVariable, MarkdownVariable] {
  if (!current) {
    const partner: MarkdownVariable =
      edited === 'originalPrice' ? 'actualPrice' : 'originalPrice';
    return [partner, edited];
  }
  if (current[0] === edited && current[1] === edited) {
    return current;
  }
  if (
    edited !== 'originalPrice' &&
    (current[0] === 'originalPrice' || current[1] === 'originalPrice')
  ) {
    return ['originalPrice', edited];
  }
  if (current[1] === edited) return current;
  if (current[0] === edited) return [current[1], edited];
  return [current[1], edited];
}
