import type { SupportedCurrency } from '@/tools/shared/currency';

/**
 * Screenshot-first Car Depreciation Calculator inputs.
 * Initial value and every money output have independent FX selectors.
 * Car age is years only (never FX-converted). Annual rate is a documented
 * illustrative constant — not an invented screenshot field.
 */
export interface CarDepreciationInput {
  initialValue: string;
  initialValueCurrency: SupportedCurrency;
  /** Current age in years (≥ 0). */
  carAgeYears: string;
  reducedValueCurrency: SupportedCurrency;
  after1MinuteCurrency: SupportedCurrency;
  after1YearCurrency: SupportedCurrency;
  after2YearsCurrency: SupportedCurrency;
  after3YearsCurrency: SupportedCurrency;
  after4YearsCurrency: SupportedCurrency;
  after5YearsCurrency: SupportedCurrency;
  /** Collapsible future-value section (open by default per screenshot). */
  afterOpen: boolean;
}

export interface CarDepreciationResult {
  /** Full-precision amounts in initial-value currency. */
  reducedValueCanonical: number;
  after1MinuteCanonical: number;
  after1YearCanonical: number;
  after2YearsCanonical: number;
  after3YearsCanonical: number;
  after4YearsCanonical: number;
  after5YearsCanonical: number;
  totalDepreciationToDateCanonical: number;
  annualRatePercent: number;
  initialValueCurrency: SupportedCurrency;
  reducedValue: number;
  after1Minute: number;
  after1Year: number;
  after2Years: number;
  after3Years: number;
  after4Years: number;
  after5Years: number;
  reducedValueCurrency: SupportedCurrency;
  after1MinuteCurrency: SupportedCurrency;
  after1YearCurrency: SupportedCurrency;
  after2YearsCurrency: SupportedCurrency;
  after3YearsCurrency: SupportedCurrency;
  after4YearsCurrency: SupportedCurrency;
  after5YearsCurrency: SupportedCurrency;
  formattedReducedValue: string;
  formattedAfter1Minute: string;
  formattedAfter1Year: string;
  formattedAfter2Years: string;
  formattedAfter3Years: string;
  formattedAfter4Years: string;
  formattedAfter5Years: string;
}

export type CarDepreciationFieldErrors = {
  initialValue?: string;
  carAgeYears?: string;
  form?: string;
};

export function createDefaultInput(): CarDepreciationInput {
  return {
    initialValue: '',
    initialValueCurrency: 'PKR',
    carAgeYears: '',
    reducedValueCurrency: 'PKR',
    after1MinuteCurrency: 'PKR',
    after1YearCurrency: 'PKR',
    after2YearsCurrency: 'PKR',
    after3YearsCurrency: 'PKR',
    after4YearsCurrency: 'PKR',
    after5YearsCurrency: 'PKR',
    afterOpen: true,
  };
}
