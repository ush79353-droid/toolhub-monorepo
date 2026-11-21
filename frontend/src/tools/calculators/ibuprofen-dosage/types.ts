export type WeightUnit = 'kg' | 'lb';

export type IbuprofenDoseStatus =
  | 'awaiting_weight'
  | 'age_gate_blocked'
  | 'ask_doctor'
  | 'labeled_dose'
  | 'out_of_chart';

export type IbuprofenProductId = 'infants_drops' | 'childrens_suspension';

export interface IbuprofenDosageInput {
  /** Screenshot default: checked. Alone does not authorize a dose. */
  isSixMonthsOrOlder: boolean;
  weightText: string;
  weightUnit: WeightUnit;
}

export interface IbuprofenDosageResult {
  status: IbuprofenDoseStatus;
  weightKg: number | null;
  weightLb: number | null;
  productId: IbuprofenProductId | null;
  productLabel: string | null;
  concentrationNote: string | null;
  doseMl: number | null;
  doseMg: number | null;
  doseLine: string | null;
  frequencyNote: string;
  maxDosesPer24Hours: number;
  interpretation: string;
  disclaimer: string;
  sourceNote: string;
}

export type IbuprofenDosageFieldErrors = {
  weightText?: string;
  form?: string;
};

export function createDefaultInput(): IbuprofenDosageInput {
  return {
    isSixMonthsOrOlder: true,
    weightText: '',
    weightUnit: 'kg',
  };
}

export function createEmptyInput(): IbuprofenDosageInput {
  return createDefaultInput();
}
