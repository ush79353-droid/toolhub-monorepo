/** Which field the user last edited. The other field is derived. */
export type DagGSource = 'dag' | 'g';

export interface DecagramToGramInput {
  source: DagGSource;
  /** null while the active source field is blank or incomplete. */
  dag: number | null;
  g: number | null;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface DecagramToGramResult {
  source: DagGSource;
  dag: number;
  g: number;
  otherUnits: readonly OtherUnitRow[];
}

export type DecagramToGramFieldErrors = {
  dag?: string;
  g?: string;
};

/** Exact: 1 dag = 10 g. */
export const GRAMS_PER_DECAGRAM = 10;
/** Exact: 1 g = 1000 mg. */
export const MILLIGRAMS_PER_GRAM = 1000;
/** Exact: 1 g = 100 cg. */
export const CENTIGRAMS_PER_GRAM = 100;
/** Exact: 1 g = 10 dg. */
export const DECIGRAMS_PER_GRAM = 10;
/** Exact: 1 g = 1_000_000 µg. */
export const MICROGRAMS_PER_GRAM = 1_000_000;
/** Exact: 1 hg = 100 g. */
export const GRAMS_PER_HECTOGRAM = 100;
/** Exact: 1 kg = 1000 g. */
export const GRAMS_PER_KILOGRAM = 1000;
/** Exact: 1 t = 1_000_000 g. */
export const GRAMS_PER_TONNE = 1_000_000;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 3 dag = 30 g. */
export const DEFAULT_DECAGRAM_TO_GRAM_INPUT: DecagramToGramInput = {
  source: 'dag',
  dag: 3,
  g: null,
};

export const EMPTY_DECAGRAM_TO_GRAM_INPUT: DecagramToGramInput = {
  source: 'dag',
  dag: null,
  g: null,
};
