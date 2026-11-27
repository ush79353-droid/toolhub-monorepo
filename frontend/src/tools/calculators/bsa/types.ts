export type WeightUnit = 'kg' | 'lb';
export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type BsaUnit = 'm2' | 'ft2';

export interface BsaInput {
  weightText: string;
  weightUnit: WeightUnit;
  heightText: string;
  heightUnit: HeightUnit;
  resultUnit: BsaUnit;
  showAdditional: boolean;
}

export interface BsaMethodValues {
  duBois: number;
  mosteller: number;
  fujimoto: number;
  gehanGeorge: number;
  haycock: number;
}

export interface BsaResult {
  weightKg: number | null;
  heightCm: number | null;
  methods: BsaMethodValues | null;
  primaryDisplay: number | null;
  formattedPrimary: string;
  formattedAdditional: {
    mosteller: string;
    fujimoto: string;
    gehanGeorge: string;
    haycock: string;
  } | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type BsaFieldErrors = {
  weightText?: string;
  heightText?: string;
};

export function createDefaultInput(): BsaInput {
  return {
    weightText: '',
    weightUnit: 'kg',
    heightText: '',
    heightUnit: 'cm',
    resultUnit: 'm2',
    showAdditional: false,
  };
}

export function createEmptyInput(): BsaInput {
  return createDefaultInput();
}

export function inputsEqual(a: BsaInput, b: BsaInput): boolean {
  return (
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.resultUnit === b.resultUnit &&
    a.showAdditional === b.showAdditional
  );
}
