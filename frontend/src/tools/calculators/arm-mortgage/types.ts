import type { SupportedCurrency } from '@/tools/shared/currency';

export const ARM_STRUCTURES = ['3/1', '5/1', '7/1', '10/1', '5/6', '7/6', '10/6'] as const;
export type ArmStructureId = (typeof ARM_STRUCTURES)[number];

export const RATE_SCENARIOS = ['constant', 'rising', 'falling'] as const;
export type RateScenario = (typeof RATE_SCENARIOS)[number];

export interface ArmMortgageInput {
  principal: number;
  termYears: number;
  initialAnnualRate: number;
  structure: ArmStructureId;
  scenario: RateScenario;
  /** Assumed fully indexed / target annual rate for the constant scenario. Not a forecast. */
  projectedAnnualRate: number;
  /** Percentage-point change applied each adjustment in rising/falling scenarios. */
  scenarioStepPercent: number;
  useIndexMargin: boolean;
  indexRate: number;
  margin: number;
  initialCap: number;
  subsequentCap: number;
  lifetimeCap: number;
  /** Null means no contractual floor was entered. */
  rateFloor: number | null;
  startDate: string;
  propertyTaxMonthly: number;
  insuranceMonthly: number;
  hoaMonthly: number;
  mortgageInsuranceMonthly: number;
  currency: SupportedCurrency;
}

export interface ArmScheduleRow {
  paymentNumber: number;
  date: string;
  annualRate: number;
  paymentCents: number;
  principalCents: number;
  interestCents: number;
  balanceCents: number;
  rateAdjusted: boolean;
}

export interface ArmMortgageResult {
  currency: SupportedCurrency;
  fixedMonths: number;
  adjustEveryMonths: number;
  initialPaymentCents: number;
  firstAdjustedPaymentCents: number | null;
  firstAdjustmentPaymentNumber: number | null;
  maxPaymentCents: number;
  minPaymentCents: number;
  totalInterestCents: number;
  totalPrincipalCents: number;
  totalPaymentsCents: number;
  payoffDate: string;
  paymentCount: number;
  housingExtrasCents: number;
  initialHousingPaymentCents: number;
  schedule: ArmScheduleRow[];
  balanceCurve: { month: number; balanceCents: number }[];
  paymentCurve: { month: number; paymentCents: number; adjusted: boolean }[];
}

export type ArmFieldErrors = Record<string, string>;

export function createDefaultArmInput(startDate: string): ArmMortgageInput {
  return {
    principal: 250000,
    termYears: 30,
    initialAnnualRate: 5.5,
    structure: '5/1',
    scenario: 'constant',
    projectedAnnualRate: 6.5,
    scenarioStepPercent: 0.25,
    useIndexMargin: false,
    indexRate: 4.5,
    margin: 2,
    initialCap: 2,
    subsequentCap: 2,
    lifetimeCap: 5,
    rateFloor: null,
    startDate,
    propertyTaxMonthly: 0,
    insuranceMonthly: 0,
    hoaMonthly: 0,
    mortgageInsuranceMonthly: 0,
    currency: 'USD',
  };
}

export function structureTiming(structure: ArmStructureId): {
  fixedMonths: number;
  adjustEveryMonths: number;
} {
  const [years, second] = structure.split('/').map(Number);
  return {
    fixedMonths: years * 12,
    adjustEveryMonths: second === 1 ? 12 : 6,
  };
}
