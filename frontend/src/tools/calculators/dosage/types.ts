export type WeightUnit = 'kg' | 'lb' | 'st';
export type MassUnit = 'mg' | 'mcg' | 'g';
export type ConcUnit = 'mg/mL' | 'mcg/mL' | 'g/mL';
export type DosageBasis = 'per_day' | 'per_administration';

export type FrequencyId =
  | 'once_daily'
  | 'twice_daily'
  | 'three_daily'
  | 'four_daily'
  | 'every_6h'
  | 'every_8h'
  | 'every_12h'
  | 'every_other_day';

export interface FrequencyOption {
  id: FrequencyId;
  label: string;
  dosesPerDay: number;
}

export const FREQUENCY_OPTIONS: readonly FrequencyOption[] = [
  { id: 'once_daily', label: 'Once per day', dosesPerDay: 1 },
  { id: 'twice_daily', label: 'Twice per day', dosesPerDay: 2 },
  { id: 'three_daily', label: '3 times per day', dosesPerDay: 3 },
  { id: 'four_daily', label: '4 times per day', dosesPerDay: 4 },
  { id: 'every_6h', label: 'Every 6 hours', dosesPerDay: 4 },
  { id: 'every_8h', label: 'Every 8 hours', dosesPerDay: 3 },
  { id: 'every_12h', label: 'Every 12 hours', dosesPerDay: 2 },
  { id: 'every_other_day', label: 'Every other day', dosesPerDay: 0.5 },
] as const;

export interface DosageInput {
  weight: string;
  weightUnit: WeightUnit;
  dosagePerKg: string;
  dosageMassUnit: MassUnit;
  dosageBasis: DosageBasis;
  frequencyId: FrequencyId;
  liquidOpen: boolean;
  concentration: string;
  concentrationUnit: ConcUnit;
}

export interface DosageResult {
  weightKg: number;
  dosagePerKg: number;
  dosageMassUnit: MassUnit;
  dosageBasis: DosageBasis;
  dosesPerDay: number;
  frequencyLabel: string;
  /** Mass per administration (in dosageMassUnit). */
  dosePerAdmin: number;
  /** Mass per day (in dosageMassUnit). */
  dosePerDay: number;
  formattedDosePerAdmin: string;
  formattedDosePerDay: string;
  liquidMl: number | null;
  formattedLiquidMl: string | null;
  liquidNote: string | null;
  explanation: string;
  disclaimer: string;
}

export type DosageFieldErrors = {
  form?: string;
  weight?: string;
  dosagePerKg?: string;
  concentration?: string;
};

export function createDefaultInput(): DosageInput {
  return {
    weight: '',
    weightUnit: 'kg',
    dosagePerKg: '',
    dosageMassUnit: 'mg',
    dosageBasis: 'per_day',
    frequencyId: 'once_daily',
    liquidOpen: true,
    concentration: '',
    concentrationUnit: 'mg/mL',
  };
}

export function createEmptyInput(): DosageInput {
  return createDefaultInput();
}

/** 10 kg · 15 mg/kg/day · once · 25 mg/mL → 150 mg · 6 mL */
export function createExampleInput(): DosageInput {
  return {
    weight: '10',
    weightUnit: 'kg',
    dosagePerKg: '15',
    dosageMassUnit: 'mg',
    dosageBasis: 'per_day',
    frequencyId: 'once_daily',
    liquidOpen: true,
    concentration: '25',
    concentrationUnit: 'mg/mL',
  };
}

export function inputsEqual(a: DosageInput, b: DosageInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
