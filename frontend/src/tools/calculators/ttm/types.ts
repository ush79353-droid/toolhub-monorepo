import type { SupportedCurrency } from '@/tools/shared/currency';

/** Only Original TTM mode is documented in the reference screenshot. */
export type TtmMode = 'original';

export interface TtmInput {
  mode: TtmMode;
  quarter0: string;
  quarter1: string;
  quarter2: string;
  quarter3: string;
  currency: SupportedCurrency;
}

export interface TtmResult {
  trailingTwelveMonthValue: number;
  formattedTtm: string;
}

export type TtmFieldErrors = {
  quarter0?: string;
  quarter1?: string;
  quarter2?: string;
  quarter3?: string;
  form?: string;
};

export const TTM_MODE_OPTIONS: readonly { value: TtmMode; label: string }[] = [
  { value: 'original', label: 'Original TTM mode' },
];

export function createDefaultInput(): TtmInput {
  return {
    mode: 'original',
    quarter0: '',
    quarter1: '',
    quarter2: '',
    quarter3: '',
    currency: 'PKR',
  };
}
