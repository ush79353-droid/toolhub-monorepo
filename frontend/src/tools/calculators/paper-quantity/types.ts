export const PAPER_UNITS = ['sheets', 'quires', 'reams', 'bundles', 'bales'] as const;

export type PaperUnit = (typeof PAPER_UNITS)[number];

export type PaperQuantityFieldErrors = Partial<Record<PaperUnit, string>>;

/** Modern paper-count convention: sheets per unit. */
export const SHEETS_PER_UNIT: Record<PaperUnit, number> = {
  sheets: 1,
  quires: 25,
  reams: 500,
  bundles: 1_000,
  bales: 5_000,
};

export const PAPER_UNIT_LABELS: Record<PaperUnit, string> = {
  sheets: 'sheets',
  quires: 'quires',
  reams: 'reams',
  bundles: 'bundles',
  bales: 'bales',
};

export const PAPER_FIELD_LABELS: Record<PaperUnit, string> = {
  sheets: 'Paper quantity in sheets',
  quires: 'Paper quantity in quires',
  reams: 'Paper quantity in reams',
  bundles: 'Paper quantity in bundles',
  bales: 'Paper quantity in bales',
};

export const MAX_ABS_SHEETS = 1e18;
export const PAPER_STANDARD_LABEL = 'Modern (500 sheets per ream)';
