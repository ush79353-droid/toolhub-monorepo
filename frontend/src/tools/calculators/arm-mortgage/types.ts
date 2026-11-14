import type { SupportedCurrency } from '@/tools/shared/currency';

export const ARM_STRUCTURES = ['1/1', '3/1', '5/1', '7/1', '10/1', '5/6', '7/6', '10/6', 'custom'] as const;
export type ArmStructureId = (typeof ARM_STRUCTURES)[number];

export const BALANCE_MODES = ['balance', 'home-price'] as const;
export type BalanceMode = (typeof BALANCE_MODES)[number];

export const DOWN_PAYMENT_MODES = ['amount', 'percent'] as const;
export type DownPaymentMode = (typeof DOWN_PAYMENT_MODES)[number];

export const ADJUSTMENT_METHODS = ['expected-rate', 'index-margin'] as const;
export type AdjustmentMethod = (typeof ADJUSTMENT_METHODS)[number];

export const RATE_SCENARIOS = ['constant', 'rising', 'falling'] as const;
export type RateScenario = (typeof RATE_SCENARIOS)[number];

export const COMPOUNDING_FREQUENCIES = ['monthly', 'semi-annual', 'annual'] as const;
export type CompoundingFrequency = (typeof COMPOUNDING_FREQUENCIES)[number];

export interface ArmMortgageInput {
  balanceMode: BalanceMode;
  /** Direct mortgage balance / loan amount (when balanceMode is 'balance'). */
  mortgageBalance: number;
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
  adjustmentMethod: AdjustmentMethod;
  /** Expected percentage point change at each reset (e.g. 0.5% per reset). */
  expectedAdjustment: number;
  /** Absolute maximum interest rate (e.g. 8.0%). */
  rateCap: number;
  /** Absolute minimum interest rate floor (e.g. 0.0%). */
  rateFloor: number;
  /** Maximum rate change permitted in a single adjustment period. */
  periodicCap: number;
  compounding: CompoundingFrequency;
  /** Upfront finance charges, closing costs or origination points. */
  upfrontFees: number;
  /**
   * How the assumed fully indexed rate (index + margin) moves after the first reset.
   * Used when adjustmentMethod is 'index-margin'.
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

export interface ArmAdjustmentMilestone {
  year: number;
  month: number;
  rate: number;
  monthlyPaymentCents: number;
  annualInterestCents: number;
  annualPrincipalCents: number;
  endingBalanceCents: number;
  isAdjustment: boolean;
}

export interface ArmMortgageResult {
  currency: SupportedCurrency;
  principalCents: number;
  downPaymentCents: number;
  termYears: number;
  fixedMonths: number;
  adjustEveryMonths: number;
  initialRate: number;
  /** Absolute rate cap. */
  rateCap: number;
  /** Absolute rate floor. */
  rateFloor: number;
  /** Index + margin before caps. A user assumption. */
  fullyIndexedRate: number;
  projectedRateAfterFirstReset: number | null;
  /** Contract ceiling: initial rate + lifetime increase cap, or rateCap. */
  maximumPermittedRate: number;
  /** Contract floor: max(0, initial rate − lifetime decrease cap, rateFloor). */
  minimumPermittedRate: number;
  initialPaymentCents: number;
  firstAdjustedPaymentCents: number | null;
  firstAdjustmentPaymentNumber: number | null;
  paymentDifferenceCents: number | null;
  minPaymentCents: number;
  maxPaymentCents: number;
  paymentRangeDisplay: string;
  /** Arithmetic average annual interest rate over the term (matches reference screenshot APR convention). */
  averageRate: number;
  /** Actuarial Truth in Lending APR based on cash-flow IRR and upfront fees. */
  actuarialApr: number;
  maxProjectedPaymentCents: number;
  minProjectedPaymentCents: number;
  maxProjectedRate: number;
  /** Highest P&I if the rate rises as fast as the caps allow up to maximum rate. */
  contractualMaxPaymentCents: number;
  totalInterestCents: number;
  totalPrincipalCents: number;
  totalPaymentsCents: number;
  upfrontFeesCents: number;
  additionalCostsCents: number;
  totalCostWithExtrasCents: number;
  payoffDate: string;
  paymentCount: number;
  housingExtrasCents: number;
  initialHousingPaymentCents: number;
  adjustmentMilestones: ArmAdjustmentMilestone[];
  schedule: ArmScheduleRow[];
  yearlySchedule: ArmYearRow[];
}

export type ArmFieldErrors = Record<string, string>;

export function createDefaultArmInput(startDate: string): ArmMortgageInput {
  return {
    balanceMode: 'home-price',
    mortgageBalance: 250000,
    homePrice: 400000,
    downPaymentMode: 'percent',
    downPayment: 20,
    termYears: 30,
    initialAnnualRate: 5.5,
    structure: '5/1',
    customFixedYears: 5,
    customAdjustMonths: 12,
    adjustmentMethod: 'index-margin',
    expectedAdjustment: 0.5,
    rateCap: 10.5,
    rateFloor: 0.5,
    periodicCap: 2.0,
    compounding: 'monthly',
    upfrontFees: 0,
    scenario: 'constant',
    indexRate: 4.5,
    margin: 2.0,
    scenarioStepPercent: 0.25,
    initialCap: 2.0,
    subsequentCap: 2.0,
    lifetimeIncreaseCap: 5.0,
    lifetimeDecreaseCap: 5.0,
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
