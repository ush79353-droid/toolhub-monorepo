import type { SupportedCurrency } from '@/tools/shared/currency';

export const ARM_STRUCTURES = ['3/1', '5/1', '7/1', '10/1', '5/6', '7/6', '10/6', 'custom'] as const;
export type ArmStructureId = (typeof ARM_STRUCTURES)[number];

export const DOWN_PAYMENT_MODES = ['amount', 'percent'] as const;
export type DownPaymentMode = (typeof DOWN_PAYMENT_MODES)[number];

export const RATE_SCENARIOS = ['constant', 'rising', 'falling'] as const;
export type RateScenario = (typeof RATE_SCENARIOS)[number];

export interface ArmMortgageInput {
  homePrice: number;
  downPaymentMode: DownPaymentMode;
  downPayment: number;
  termYears: number;
  initialAnnualRate: number;
  structure: ArmStructureId;
  /** Used only when structure is `custom`. Whole years before the first reset. */
  customFixedYears: number;
  /** Used only when structure is `custom`. Months between resets. */
  customAdjustMonths: number;
  /**
   * How the assumed fully indexed rate (index + margin) moves after the first reset.
   * These are user assumptions, not a forecast.
   */
  scenario: RateScenario;
  /** Assumed index at the first reset. Not a live market quote. */
  indexRate: number;
  margin: number;
  /** Percentage-point change in the uncapped target at each reset after the first. */
  scenarioStepPercent: number;
  initialCap: number;
  subsequentCap: number;
  /** Maximum rise above the initial note rate, in percentage points. */
  lifetimeIncreaseCap: number;
  /** Maximum fall below the initial note rate, in percentage points. Floor is never below 0%. */
  lifetimeDecreaseCap: number;
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

export interface ArmYearRow {
  year: number;
  endingRate: number;
  lastPaymentCents: number;
  principalCents: number;
  interestCents: number;
  balanceCents: number;
  adjusted: boolean;
}

export interface ArmMortgageResult {
  currency: SupportedCurrency;
  principalCents: number;
  downPaymentCents: number;
  fixedMonths: number;
  adjustEveryMonths: number;
  initialRate: number;
  /** Index + margin before caps. A user assumption. */
  fullyIndexedRate: number;
  projectedRateAfterFirstReset: number | null;
  /** Contract ceiling: initial rate + lifetime increase cap. */
  maximumPermittedRate: number;
  /** Contract floor: max(0, initial rate − lifetime decrease cap). */
  minimumPermittedRate: number;
  initialPaymentCents: number;
  firstAdjustedPaymentCents: number | null;
  firstAdjustmentPaymentNumber: number | null;
  paymentDifferenceCents: number | null;
  maxProjectedPaymentCents: number;
  minProjectedPaymentCents: number;
  maxProjectedRate: number;
  /** Highest P&I if the rate rises as fast as the caps allow. Not the scenario result. */
  contractualMaxPaymentCents: number;
  totalInterestCents: number;
  totalPrincipalCents: number;
  totalPaymentsCents: number;
  payoffDate: string;
  paymentCount: number;
  housingExtrasCents: number;
  initialHousingPaymentCents: number;
  schedule: ArmScheduleRow[];
  yearlySchedule: ArmYearRow[];
}

export type ArmFieldErrors = Record<string, string>;

export function createDefaultArmInput(startDate: string): ArmMortgageInput {
  return {
    homePrice: 400000,
    downPaymentMode: 'percent',
    downPayment: 20,
    termYears: 30,
    initialAnnualRate: 5.5,
    structure: '5/1',
    customFixedYears: 5,
    customAdjustMonths: 12,
    scenario: 'constant',
    indexRate: 4.5,
    margin: 2,
    scenarioStepPercent: 0.25,
    initialCap: 2,
    subsequentCap: 2,
    lifetimeIncreaseCap: 5,
    lifetimeDecreaseCap: 5,
    startDate,
    propertyTaxMonthly: 0,
    insuranceMonthly: 0,
    hoaMonthly: 0,
    mortgageInsuranceMonthly: 0,
    currency: 'USD',
  };
}

export function structureTiming(
  input: Pick<ArmMortgageInput, 'structure' | 'customFixedYears' | 'customAdjustMonths'>
): { fixedMonths: number; adjustEveryMonths: number } {
  if (input.structure === 'custom') {
    return {
      fixedMonths: input.customFixedYears * 12,
      adjustEveryMonths: input.customAdjustMonths,
    };
  }
  const [years, second] = input.structure.split('/').map(Number);
  return {
    fixedMonths: years * 12,
    adjustEveryMonths: second === 1 ? 12 : 6,
  };
}
