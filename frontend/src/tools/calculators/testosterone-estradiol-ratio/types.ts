/** Educational T/E2 mixed-unit numerical index. */

export type TestosteroneUnit = 'ng_dl' | 'ng_ml' | 'nmol_l';
export type EstradiolUnit = 'pg_ml' | 'ng_ml' | 'pmol_l';

export const TESTOSTERONE_UNIT_LABELS: Record<TestosteroneUnit, string> = {
  ng_dl: 'ng/dL',
  ng_ml: 'ng/mL',
  nmol_l: 'nmol/L',
};

export const ESTRADIOL_UNIT_LABELS: Record<EstradiolUnit, string> = {
  pg_ml: 'pg/mL',
  ng_ml: 'ng/mL',
  pmol_l: 'pmol/L',
};

export interface Te2Input {
  testosterone: string;
  testosteroneUnit: TestosteroneUnit;
  estradiol: string;
  estradiolUnit: EstradiolUnit;
}

export interface Te2Result {
  ratio: number;
  formattedRatio: string;
}

export type Te2FieldErrors = {
  testosterone?: string;
  estradiol?: string;
};

export function createDefaultInput(): Te2Input {
  return {
    testosterone: '',
    testosteroneUnit: 'ng_dl',
    estradiol: '',
    estradiolUnit: 'pg_ml',
  };
}

export function createEmptyInput(): Te2Input {
  return createDefaultInput();
}

export function inputsEqual(a: Te2Input, b: Te2Input): boolean {
  return (
    a.testosterone === b.testosterone &&
    a.testosteroneUnit === b.testosteroneUnit &&
    a.estradiol === b.estradiol &&
    a.estradiolUnit === b.estradiolUnit
  );
}