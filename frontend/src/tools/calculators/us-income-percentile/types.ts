export type IncomeType = 'individual' | 'household';

export interface IncomeBracket {
  /** Upper income of a bin, or the published income at this percentile. */
  income: number;
  /** Share of the comparison population at or below `income`. */
  percentile: number;
}

export interface IncomeDistributionDataset {
  incomeType: IncomeType;
  referenceYear: number;
  currency: 'USD';
  source: string;
  lastUpdated: string;
  populationLabel: string;
  medianIncome: number;
  meanIncome: number;
  brackets: IncomeBracket[];
}

export interface UsIncomePercentileInput {
  incomeType: IncomeType;
  annualIncome: string;
}

export type RangeStatus = 'inside' | 'below' | 'above' | 'zero';

export interface UsIncomePercentileResult {
  incomeType: IncomeType;
  annualIncome: number;
  /** One-decimal percentile, or null when the dataset cannot rank the value. */
  percentile: number | null;
  rangeStatus: RangeStatus;
  rangeNote: string;
  medianIncome: number;
  meanIncome: number;
  percentageBelow: number | null;
  percentageAbove: number | null;
  referenceYear: number;
  source: string;
  populationLabel: string;
  explanation: string;
}

export type UsIncomePercentileFieldErrors = Partial<
  Record<'annualIncome' | 'form', string>
>;

export function createDefaultInput(): UsIncomePercentileInput {
  return { incomeType: 'individual', annualIncome: '0' };
}

export function hasIncomePercentileChanges(
  input: UsIncomePercentileInput,
): boolean {
  const base = createDefaultInput();
  return (
    input.incomeType !== base.incomeType ||
    input.annualIncome.trim() !== base.annualIncome
  );
}
