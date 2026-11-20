export type ValuationMode = 'present' | 'past';

export interface IndexObservation {
  period: string;
  value: number;
}

export interface IndexSeriesSnapshot {
  seriesKey: string;
  fredSeriesId: string;
  label: string;
  source: string;
  frequency: 'monthly';
  firstPeriod: string;
  latestPeriod: string;
  fetchedAt: string;
  observations: IndexObservation[];
  stale: boolean;
}

export interface HomeValueMetroOption {
  id: string;
  state: string;
  city: string;
  label: string;
  fredSeriesId: string;
  frequency: 'monthly';
  source: string;
  indexName: string;
  firstPeriod: string | null;
  latestPeriod: string | null;
}

export interface HomeValueUsInput {
  metroId: string;
  purchaseYear: string;
  purchaseMonth: string;
  purchasePrice: string;
  valuationMode: ValuationMode;
  valuationYear: string;
  valuationMonth: string;
  yourHomeOpen: boolean;
  valuationOpen: boolean;
}

export interface HomeValueUsResult {
  metroLabel: string;
  purchasePeriod: string;
  valuationPeriod: string;
  purchasePrice: number;
  purchaseIndex: number;
  valuationIndex: number;
  estimatedHomeValue: number;
  nominalDollarChange: number;
  nominalPercentChange: number | null;
  inflationAdjustedPurchasePrice: number | null;
  realDollarChange: number | null;
  realPercentChange: number | null;
  purchaseCpi: number | null;
  valuationCpi: number | null;
  homeIndexSource: string;
  cpiSource: string | null;
  homeIndexFredId: string;
  cpiFredId: string | null;
  retrospective: boolean;
  staleData: boolean;
  explanation: string;
  formattedPurchasePrice: string;
  formattedEstimatedValue: string;
  formattedNominalDollar: string;
  formattedNominalPercent: string | null;
  formattedInflationAdjustedPurchase: string | null;
  formattedRealDollar: string | null;
  formattedRealPercent: string | null;
}

export type HomeValueUsFieldErrors = Partial<
  Record<
    | 'metroId'
    | 'purchaseYear'
    | 'purchaseMonth'
    | 'purchasePrice'
    | 'valuationYear'
    | 'valuationMonth'
    | 'form'
    | 'data',
    string
  >
>;

export const MONTH_OPTIONS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
] as const;

export function createDefaultInput(): HomeValueUsInput {
  return {
    metroId: 'miami',
    purchaseYear: '',
    purchaseMonth: '',
    purchasePrice: '',
    valuationMode: 'present',
    valuationYear: '',
    valuationMonth: '',
    yourHomeOpen: true,
    valuationOpen: true,
  };
}

export function periodLabel(period: string): string {
  const [y, m] = period.split('-');
  const month = MONTH_OPTIONS.find((opt) => opt.value === m);
  return month ? `${month.label} ${y}` : period;
}
