import type { SupportedCurrency } from '@/tools/shared/currency';

export type BirthControlSex = 'female' | 'male';

export type FemaleMethod =
  | 'iud'
  | 'injection'
  | 'pill'
  | 'implant'
  | 'patch'
  | 'ring'
  | 'female_condom'
  | 'sterilization';

export type MaleMethod = 'condoms' | 'vasectomy';

export type DurationUnit = 'days' | 'weeks' | 'months' | 'years';

export interface BirthControlInput {
  sex: BirthControlSex;
  femaleMethod: FemaleMethod;
  maleMethod: MaleMethod;
  /** Pill / patch / ring cost for one 28-day cycle. */
  costPerCycle: string;
  costPerCycleCurrency: SupportedCurrency;
  /** IUD / injection / implant device or course price. */
  longActingPrice: string;
  longActingPriceCurrency: SupportedCurrency;
  longevity: string;
  longevityUnit: DurationUnit;
  /** Tubal ligation / vasectomy procedure cost. */
  procedureCost: string;
  procedureCostCurrency: SupportedCurrency;
  buyCondoms: boolean;
  amountInPackage: string;
  condomUsage: string;
  condomUsageUnit: DurationUnit;
  pricePerPackage: string;
  pricePerPackageCurrency: SupportedCurrency;
  horizon: string;
  horizonUnit: DurationUnit;
  resultCurrency: SupportedCurrency;
}

export interface BirthControlResult {
  total: number;
  currency: SupportedCurrency;
  formattedTotal: string;
  methodCost: number;
  condomCost: number;
  horizonDays: number;
  explanation: string;
}

export type BirthControlFieldErrors = {
  form?: string;
  costPerCycle?: string;
  longActingPrice?: string;
  longevity?: string;
  procedureCost?: string;
  amountInPackage?: string;
  condomUsage?: string;
  pricePerPackage?: string;
  horizon?: string;
};

export const FEMALE_METHOD_OPTIONS: readonly {
  value: FemaleMethod;
  label: string;
}[] = [
  { value: 'iud', label: 'IUD' },
  { value: 'injection', label: 'Injection' },
  { value: 'pill', label: 'Pill' },
  { value: 'implant', label: 'Implant' },
  { value: 'patch', label: 'Patch' },
  { value: 'ring', label: 'Ring' },
  { value: 'female_condom', label: 'Female condom' },
  { value: 'sterilization', label: 'Sterilization (tubal ligation)' },
];

export const MALE_METHOD_OPTIONS: readonly {
  value: MaleMethod;
  label: string;
}[] = [
  { value: 'condoms', label: 'Condoms' },
  { value: 'vasectomy', label: 'Vasectomy' },
];

export const DURATION_UNIT_LABELS: Record<DurationUnit, string> = {
  days: 'days',
  weeks: 'wks',
  months: 'mos',
  years: 'yrs',
};

/** Omni menstrual-cycle cadence for pill / patch / ring (days). */
export const CYCLE_DAYS = 28;

/** Omni year length used by duration unit conversions. */
export const DAYS_PER_YEAR = 365.25;

export function createDefaultInput(): BirthControlInput {
  return {
    sex: 'female',
    femaleMethod: 'pill',
    maleMethod: 'condoms',
    costPerCycle: '20',
    costPerCycleCurrency: 'PKR',
    longActingPrice: '1000',
    longActingPriceCurrency: 'PKR',
    longevity: '4',
    longevityUnit: 'years',
    procedureCost: '600',
    procedureCostCurrency: 'PKR',
    buyCondoms: false,
    amountInPackage: '10',
    condomUsage: '10',
    condomUsageUnit: 'years',
    pricePerPackage: '8',
    pricePerPackageCurrency: 'PKR',
    horizon: '1',
    horizonUnit: 'years',
    resultCurrency: 'PKR',
  };
}

export function createEmptyInput(): BirthControlInput {
  return {
    ...createDefaultInput(),
    costPerCycle: '',
    longActingPrice: '',
    longevity: '',
    procedureCost: '',
    amountInPackage: '',
    condomUsage: '',
    pricePerPackage: '',
    horizon: '',
  };
}
