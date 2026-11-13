import type { SupportedCurrency } from '@/tools/shared/currency';

export const MAX_MONEY = 1_000_000_000_000_000;
export const MAX_SHARES = 1_000_000_000_000_000;

export const REPORTING_PERIODS = ['annual', 'quarterly', 'monthly'] as const;
export type ReportingPeriod = (typeof REPORTING_PERIODS)[number];

export const PERIOD_LABELS: Record<ReportingPeriod, string> = {
  annual: 'Annual',
  quarterly: 'Quarterly',
  monthly: 'Monthly',
};

/** Simplified bridge. Interest income is recorded and is not applied again. */
export interface AffoInput {
  currency: SupportedCurrency;
  period: ReportingPeriod;
  netIncome: number;
  /** Eligible real-estate depreciation and amortization to add. Not every D&A account. */
  realEstateDepreciation: number;
  /** Eligible losses on property sales to add. */
  propertySaleLosses: number;
  /** Eligible gains on property sales to subtract. */
  propertySaleGains: number;
  /** Already inside net income. Shown for reference and excluded from the bridge. */
  interestIncome: number;
  /** Noncash straight-line rent income already inside FFO. Subtracted. */
  straightLineRentAdjustment: number;
  /** Recurring maintenance capital expenditure. Not growth or development spend. */
  recurringMaintenanceCapex: number;
  /** Incremental maintenance adjustment that is not already inside FFO. */
  maintenanceAdjustment: number;
  /** Noncash compensation already expensed. Added back when entered. */
  noncashCompensation: number;
  /** Amortization of debt issuance costs already expensed. Added back when entered. */
  debtIssuanceAmortization: number;
  /** Signed above/below-market lease amortization. Positive adds, negative subtracts. */
  leaseAmortizationAdjustment: number;
  dilutedShares: number | null;
  /** Dividends for the same reporting period as the other amounts. */
  dividends: number | null;
}

export interface AdjustmentLine {
  id: string;
  label: string;
  amount: number;
  treatment: 'add' | 'subtract' | 'base' | 'note';
}

export interface AffoResult {
  currency: SupportedCurrency;
  period: ReportingPeriod;
  periodLabel: string;
  netIncome: number;
  interestIncome: number;
  ffo: number;
  affo: number;
  /** AFFO − FFO. A bridge, not profit and not distributable cash. */
  affoAdjustment: number;
  ffoAdditions: number;
  ffoDeductions: number;
  affoAdditions: number;
  affoDeductions: number;
  ffoPerShare: number | null;
  affoPerShare: number | null;
  payoutRatio: number | null;
  lines: AdjustmentLine[];
  simplified: true;
}

export type AffoField =
  | 'netIncome'
  | 'realEstateDepreciation'
  | 'propertySaleLosses'
  | 'propertySaleGains'
  | 'interestIncome'
  | 'straightLineRentAdjustment'
  | 'recurringMaintenanceCapex'
  | 'maintenanceAdjustment'
  | 'noncashCompensation'
  | 'debtIssuanceAmortization'
  | 'leaseAmortizationAdjustment'
  | 'dilutedShares'
  | 'dividends'
  | 'currency'
  | 'period';

export type AffoFieldErrors = Partial<Record<AffoField, string>>;

export const DEFAULT_AFFO_INPUT: AffoInput = {
  currency: 'USD',
  period: 'annual',
  netIncome: 1_000_000,
  realEstateDepreciation: 400_000,
  propertySaleLosses: 20_000,
  propertySaleGains: 50_000,
  interestIncome: 30_000,
  straightLineRentAdjustment: 25_000,
  recurringMaintenanceCapex: 120_000,
  maintenanceAdjustment: 0,
  noncashCompensation: 15_000,
  debtIssuanceAmortization: 5_000,
  leaseAmortizationAdjustment: 0,
  dilutedShares: null,
  dividends: null,
};
