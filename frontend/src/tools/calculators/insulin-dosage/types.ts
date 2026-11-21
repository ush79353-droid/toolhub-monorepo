export type GlucoseUnit = 'mg/dL' | 'mmol/L';

export interface InsulinDosageInput {
  /** Collapsed by default — educational TDD / rule-of-500 note only. */
  knowTotalDailyDose: boolean;
  totalDailyDose: string;
  carbsGrams: string;
  /** Sample educational ICR (g per unit); not a prescribed default. */
  carbRatio: string;
  currentGlucose: string;
  targetGlucose: string;
  /** Sample educational ISF; same unit as glucose fields. */
  sensitivity: string;
  glucoseUnit: GlucoseUnit;
}

export interface InsulinDosageResult {
  carbCoverageUnits: number | null;
  correctionUnits: number | null;
  totalUnits: number | null;
  formattedCarbCoverage: string;
  formattedCorrection: string;
  formattedTotal: string;
  suggestedCarbRatio: number | null;
  suggestedSensitivityMgDl: number | null;
  lowGlucoseGuard: boolean;
  notes: string[];
  disclaimer: string;
}

export type InsulinDosageFieldErrors = {
  form?: string;
  totalDailyDose?: string;
  carbsGrams?: string;
  carbRatio?: string;
  currentGlucose?: string;
  targetGlucose?: string;
  sensitivity?: string;
};

/** Screenshot defaults: unchecked TDD; blank carbs/glucose; sample ratio 15, target 100, ISF 50. */
export function createDefaultInput(): InsulinDosageInput {
  return {
    knowTotalDailyDose: false,
    totalDailyDose: '',
    carbsGrams: '',
    carbRatio: '15',
    currentGlucose: '',
    targetGlucose: '100',
    sensitivity: '50',
    glucoseUnit: 'mg/dL',
  };
}

export function createEmptyInput(): InsulinDosageInput {
  return {
    knowTotalDailyDose: false,
    totalDailyDose: '',
    carbsGrams: '',
    carbRatio: '',
    currentGlucose: '',
    targetGlucose: '',
    sensitivity: '',
    glucoseUnit: 'mg/dL',
  };
}

export function inputsEqual(a: InsulinDosageInput, b: InsulinDosageInput): boolean {
  return (
    a.knowTotalDailyDose === b.knowTotalDailyDose &&
    a.totalDailyDose === b.totalDailyDose &&
    a.carbsGrams === b.carbsGrams &&
    a.carbRatio === b.carbRatio &&
    a.currentGlucose === b.currentGlucose &&
    a.targetGlucose === b.targetGlucose &&
    a.sensitivity === b.sensitivity &&
    a.glucoseUnit === b.glucoseUnit
  );
}
