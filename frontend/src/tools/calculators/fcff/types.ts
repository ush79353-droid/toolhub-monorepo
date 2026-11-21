import type { SupportedCurrency } from '@/tools/shared/currency';

export type FcffSource = 'net_income' | 'ebitda' | 'ebit' | 'cfo';

export const FCFF_SOURCE_OPTIONS: readonly {
  value: FcffSource;
  label: string;
  shortLabel: string;
}[] = [
  { value: 'net_income', label: 'Net income', shortLabel: 'Net income' },
  {
    value: 'ebitda',
    label:
      'Earnings before interest, taxes, depreciation and amortization (EBITDA)',
    shortLabel: 'EBITDA',
  },
  {
    value: 'ebit',
    label: 'Earnings before interest and taxes (EBIT)',
    shortLabel: 'EBIT',
  },
  {
    value: 'cfo',
    label: 'Cash flow from operation (CFO)',
    shortLabel: 'CFO',
  },
] as const;

export interface FcffInput {
  source: FcffSource;
  sourceValue: string;
  sourceValueCurrency: SupportedCurrency;
  depreciation: string;
  depreciationCurrency: SupportedCurrency;
  interest: string;
  interestCurrency: SupportedCurrency;
  /** Corporate tax rate as a percent string (0–100). Never FX-converted. */
  taxRatePercent: string;
  capex: string;
  capexCurrency: SupportedCurrency;
  nwc: string;
  nwcCurrency: SupportedCurrency;
  fcffCurrency: SupportedCurrency;
  sourceOpen: boolean;
  adjustmentsOpen: boolean;
}

export interface FcffResult {
  /** Full-precision FCFF in the result currency (may be negative). */
  fcff: number;
  currency: SupportedCurrency;
  formattedFcff: string;
  source: FcffSource;
  formulaLabel: string;
}

export type FcffFieldErrors = {
  sourceValue?: string;
  depreciation?: string;
  interest?: string;
  taxRatePercent?: string;
  capex?: string;
  nwc?: string;
  form?: string;
};

export function sourceValueLabel(source: FcffSource): string {
  switch (source) {
    case 'net_income':
      return 'Net income';
    case 'ebitda':
      return 'EBITDA';
    case 'ebit':
      return 'EBIT';
    case 'cfo':
      return 'Cash flow from operation (CFO)';
  }
}

/** D&A enters NI / EBITDA / EBIT formulas; omitted for CFO. */
export function showsDepreciation(source: FcffSource): boolean {
  return source === 'net_income' || source === 'ebitda' || source === 'ebit';
}

/** Interest tax shield enters NI / CFO formulas; omitted for EBITDA / EBIT. */
export function showsInterest(source: FcffSource): boolean {
  return source === 'net_income' || source === 'cfo';
}

/** CapEx is an outflow in every source formula. */
export function showsCapex(_source: FcffSource): boolean {
  return true;
}

/**
 * ΔNWC is deducted for NI / EBITDA / EBIT. CFO already reflects working-capital
 * movements, so ΔNWC is hidden and not subtracted again.
 */
export function showsNwc(source: FcffSource): boolean {
  return source === 'net_income' || source === 'ebitda' || source === 'ebit';
}

export function createDefaultInput(): FcffInput {
  return {
    source: 'net_income',
    sourceValue: '',
    sourceValueCurrency: 'PKR',
    depreciation: '',
    depreciationCurrency: 'PKR',
    interest: '',
    interestCurrency: 'PKR',
    taxRatePercent: '',
    capex: '',
    capexCurrency: 'PKR',
    nwc: '',
    nwcCurrency: 'PKR',
    fcffCurrency: 'PKR',
    sourceOpen: true,
    adjustmentsOpen: true,
  };
}
