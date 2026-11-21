export type Sex = 'female' | 'male';
export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';
export type EnergyUnit = 'kcal' | 'kJ';

/**
 * Screenshot four-option PAL map (Omni Maintenance Calorie FAQ values).
 * Athlete uses 2.4 per that FAQ (not the 2.3 Calorie Calculator sibling).
 */
export const ACTIVITY_OPTIONS = [
  { id: 'none', label: 'I do not exercise', pal: 1.2 },
  { id: 'regular', label: 'I exercise regularly', pal: 1.55 },
  { id: 'job', label: 'I have a physical job', pal: 2.0 },
  { id: 'athlete', label: 'I am a professional athlete', pal: 2.4 },
] as const;

export type ActivityId = (typeof ACTIVITY_OPTIONS)[number]['id'];

export interface MaintenanceCalorieInput {
  sex: Sex;
  heightValue: string;
  heightUnit: HeightUnit;
  weightValue: string;
  weightUnit: WeightUnit;
  ageYears: string;
  activityId: ActivityId;
  energyUnit: EnergyUnit;
  showMacroPercent: boolean;
  showMacroKcal: boolean;
  showIdealWeight: boolean;
  showChangeWeight: boolean;
  /** Macro energy shares (%); must sum to 100 when either macro panel is on. */
  proteinPct: string;
  carbPct: string;
  fatPct: string;
  /** Target weight for change panel. */
  goalWeightValue: string;
  goalWeightUnit: WeightUnit;
  /** Weekly change magnitude in kg/week (positive number). */
  weeklyChangeKg: string;
  /** lose | gain */
  changeDirection: 'lose' | 'gain';
}

export interface MacroBreakdown {
  proteinPct: number;
  carbPct: number;
  fatPct: number;
  proteinKcal: number;
  carbKcal: number;
  fatKcal: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
}

export interface IdealWeightResult {
  /** Devine IBW (kg) — most medically cited of the classic formulas. */
  devineKg: number;
  formattedDevineKg: string;
  bmiHealthyMinKg: number;
  bmiHealthyMaxKg: number;
  formattedBmiRange: string;
}

export interface WeightChangePlan {
  goalWeightKg: number;
  weeklyChangeKg: number;
  direction: 'lose' | 'gain';
  dailyDeltaKcal: number;
  plannedIntakeKcal: number;
  formattedPlannedIntake: string;
  weeksEstimate: number | null;
  warning: string | null;
}

export interface MaintenanceCalorieResult {
  sex: Sex;
  ageYears: number;
  heightCm: number;
  weightKg: number;
  activityId: ActivityId;
  activityLabel: string;
  pal: number;
  bmrKcal: number;
  maintenanceKcal: number;
  formattedMaintenance: string;
  energyUnit: EnergyUnit;
  macros: MacroBreakdown | null;
  idealWeight: IdealWeightResult | null;
  changePlan: WeightChangePlan | null;
  explanation: string;
  disclaimer: string;
}

export type MaintenanceCalorieFieldErrors = {
  form?: string;
  heightValue?: string;
  weightValue?: string;
  ageYears?: string;
  proteinPct?: string;
  carbPct?: string;
  fatPct?: string;
  goalWeightValue?: string;
  weeklyChangeKg?: string;
};

export function activityById(id: ActivityId) {
  return ACTIVITY_OPTIONS.find((o) => o.id === id) ?? ACTIVITY_OPTIONS[0];
}

/** Screenshot: Male selected; blank numerics; “I do not exercise”. */
export function createDefaultInput(): MaintenanceCalorieInput {
  return {
    sex: 'male',
    heightValue: '',
    heightUnit: 'cm',
    weightValue: '',
    weightUnit: 'kg',
    ageYears: '',
    activityId: 'none',
    energyUnit: 'kcal',
    showMacroPercent: false,
    showMacroKcal: false,
    showIdealWeight: false,
    showChangeWeight: false,
    proteinPct: '20',
    carbPct: '50',
    fatPct: '30',
    goalWeightValue: '',
    goalWeightUnit: 'kg',
    weeklyChangeKg: '0.5',
    changeDirection: 'lose',
  };
}

export function createEmptyInput(): MaintenanceCalorieInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: MaintenanceCalorieInput,
  b: MaintenanceCalorieInput,
): boolean {
  return (
    a.sex === b.sex &&
    a.heightValue === b.heightValue &&
    a.heightUnit === b.heightUnit &&
    a.weightValue === b.weightValue &&
    a.weightUnit === b.weightUnit &&
    a.ageYears === b.ageYears &&
    a.activityId === b.activityId &&
    a.energyUnit === b.energyUnit &&
    a.showMacroPercent === b.showMacroPercent &&
    a.showMacroKcal === b.showMacroKcal &&
    a.showIdealWeight === b.showIdealWeight &&
    a.showChangeWeight === b.showChangeWeight &&
    a.proteinPct === b.proteinPct &&
    a.carbPct === b.carbPct &&
    a.fatPct === b.fatPct &&
    a.goalWeightValue === b.goalWeightValue &&
    a.goalWeightUnit === b.goalWeightUnit &&
    a.weeklyChangeKg === b.weeklyChangeKg &&
    a.changeDirection === b.changeDirection
  );
}
