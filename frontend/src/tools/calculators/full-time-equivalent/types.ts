export interface FullTimeEquivalentInput {
  fullTimeEmployees: string;
  fullTimeHours: string;
  partTimeEmployees: string;
  partTimeHours: string;
}

export interface FullTimeEquivalentResult {
  fullTimeEmployees: number;
  fullTimeHours: number;
  partTimeEmployees: number;
  partTimeHours: number;
  fte: number;
  formattedFte: string;
}

export type FullTimeEquivalentFieldErrors = {
  fullTimeEmployees?: string;
  fullTimeHours?: string;
  partTimeEmployees?: string;
  partTimeHours?: string;
  form?: string;
};

export function createDefaultInput(): FullTimeEquivalentInput {
  return {
    fullTimeEmployees: '',
    fullTimeHours: '',
    partTimeEmployees: '',
    partTimeHours: '',
  };
}
