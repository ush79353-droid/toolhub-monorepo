import type { SupportedCurrency } from '@/tools/shared/currency';

export type InvestmentScenario = 'optimistic' | 'conservative' | 'pessimistic';

export const INVESTMENT_SCENARIOS: readonly {
  value: InvestmentScenario;
  label: string;
  annualReturnPercent: number;
  description: string;
}[] = [
  {
    value: 'optimistic',
    label: 'Optimistic',
    annualReturnPercent: 10,
    description: '10% annual return rate',
  },
  {
    value: 'conservative',
    label: 'Conservative',
    annualReturnPercent: 6,
    description: '6% annual return rate',
  },
  {
    value: 'pessimistic',
    label: 'Pessimistic',
    annualReturnPercent: 4,
    description: '4% annual return rate',
  },
] as const;

export interface TrumpAccountsInput {
  startingAge: string;
  targetAge: string;
  startingBalance: string;
  annualContribution: string;
  investmentScenario: InvestmentScenario;
  includeInflation: boolean;
  inflationRate: string;
  currency: SupportedCurrency;
}

export interface TrumpAccountsResult {
  startingAge: number;
  targetAge: number;
  investmentYears: number;
  startingBalance: number;
  annualContribution: number;
  investmentScenario: InvestmentScenario;
  annualReturnPercent: number;
  includeInflation: boolean;
  inflationRatePercent: number;
  futureValueOfStartingBalance: number;
  futureValueOfContributions: number;
  totalContributions: number;
  investmentGrowth: number;
  finalBalance: number;
  inflationAdjustedBalance: number | null;
  contributionsSharePercent: number;
  growthSharePercent: number;
  explanation: string;
  currency: SupportedCurrency;
}

export type TrumpAccountsFieldErrors = Partial<
  Record<
    | 'startingAge'
    | 'targetAge'
    | 'startingBalance'
    | 'annualContribution'
    | 'inflationRate'
    | 'form',
    string
  >
>;

export function getScenarioReturnPercent(
  scenario: InvestmentScenario,
): number {
  return (
    INVESTMENT_SCENARIOS.find((s) => s.value === scenario)?.annualReturnPercent ??
    6
  );
}

export function createDefaultInput(): TrumpAccountsInput {
  return {
    startingAge: '0',
    targetAge: '18',
    startingBalance: '1000',
    annualContribution: '5000',
    investmentScenario: 'conservative',
    includeInflation: false,
    inflationRate: '2.5',
    currency: 'USD',
  };
}

export function createBlankInput(
  currency: SupportedCurrency = 'USD',
): TrumpAccountsInput {
  return {
    startingAge: '',
    targetAge: '',
    startingBalance: '',
    annualContribution: '',
    investmentScenario: 'conservative',
    includeInflation: false,
    inflationRate: '',
    currency,
  };
}

export function hasTrumpAccountsChanges(input: TrumpAccountsInput): boolean {
  const blank = createBlankInput(input.currency);
  return (
    input.startingAge.trim() !== blank.startingAge ||
    input.targetAge.trim() !== blank.targetAge ||
    input.startingBalance.trim() !== blank.startingBalance ||
    input.annualContribution.trim() !== blank.annualContribution ||
    input.inflationRate.trim() !== blank.inflationRate ||
    input.includeInflation ||
    input.investmentScenario !== blank.investmentScenario
  );
}
