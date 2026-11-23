/** Educational Pg/E2 (P/E2) mass-concentration ratio. */

export type ProgesteroneUnit = 'ng_ml' | 'pg_ml' | 'nmol_l';
export type EstradiolUnit = 'pg_ml' | 'ng_ml' | 'pmol_l';

export const PROGESTERONE_UNIT_LABELS: Record<ProgesteroneUnit, string> = {
  ng_ml: 'ng/mL',
  pg_ml: 'pg/mL',
  nmol_l: 'nmol/L',
};

export const ESTRADIOL_UNIT_LABELS: Record<EstradiolUnit, string> = {
  pg_ml: 'pg/mL',
  ng_ml: 'ng/mL',
  pmol_l: 'pmol/L',
};

export interface PgE2Input {
  progesterone: string;
  progesteroneUnit: ProgesteroneUnit;
  estradiol: string;
  estradiolUnit: EstradiolUnit;
}

export interface PgE2Result {
  ratio: number;
  formattedRatio: string;
}

export type PgE2FieldErrors = {
  progesterone?: string;
  estradiol?: string;
};

export function createDefaultInput(): PgE2Input {
  return {
    progesterone: '',
    progesteroneUnit: 'ng_ml',
    estradiol: '',
    estradiolUnit: 'pg_ml',
  };
}

export function createEmptyInput(): PgE2Input {
  return createDefaultInput();
}

export function inputsEqual(a: PgE2Input, b: PgE2Input): boolean {
  return (
    a.progesterone === b.progesterone &&
    a.progesteroneUnit === b.progesteroneUnit &&
    a.estradiol === b.estradiol &&
    a.estradiolUnit === b.estradiolUnit
  );
}
