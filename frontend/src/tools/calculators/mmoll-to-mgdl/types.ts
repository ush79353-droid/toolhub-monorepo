/**
 * mmol/L ↔ mg/dL educational converter for common lab analytes.
 * Screenshot: Glucose preset (MW 180.156), paired fields, expanded custom molar mass.
 * Formula: mg/dL = mmol/L × (molar mass g/mol) / 10. No FX.
 */

/** Which concentration field the user last edited within a panel. */
export type ConcentrationSource = 'mmolL' | 'mgDl';

/**
 * Preset analytes with published molecular weights / clinical reporting conventions.
 * Do not invent analytes without a primary molar-mass source.
 */
export type AnalyteId =
  | 'glucose'
  | 'cholesterol'
  | 'triglycerides'
  | 'creatinine'
  | 'urea'
  | 'bun'
  | 'uricAcid'
  | 'calcium'
  | 'magnesium'
  | 'bilirubin';

export interface ConcentrationPair {
  source: ConcentrationSource;
  mmolL: number | null;
  mgDl: number | null;
}

export interface MmollToMgdlInput {
  analyte: AnalyteId;
  /** Preset molecule panel (independent of custom). */
  preset: ConcentrationPair;
  /** Screenshot shows Custom molar mass expanded. */
  customOpen: boolean;
  /** Custom panel molar mass in g/mol; null while blank. */
  customMolarMass: number | null;
  /** Custom molar mass panel (independent of preset). */
  custom: ConcentrationPair;
}

export interface PanelConversion {
  panel: 'preset' | 'custom';
  molarMassGPerMol: number;
  mmolL: number;
  mgDl: number;
  factor: number;
  label: string;
  explanation: string;
}

export interface MmollToMgdlResult {
  preset: PanelConversion | null;
  custom: PanelConversion | null;
}

export type MmollToMgdlFieldErrors = {
  presetMmolL?: string;
  presetMgDl?: string;
  customMolarMass?: string;
  customMmolL?: string;
  customMgDl?: string;
};

export interface AnalyteOption {
  value: AnalyteId;
  /** Screenshot-style short label, e.g. Glucose (Glu). */
  label: string;
  /** Molecular weight or clinical reporting mass in g/mol. */
  molarMassGPerMol: number;
  /** Short citation for tip / guide. */
  sourceNote: string;
}

/**
 * Published molar masses / clinical conventions only:
 * - Glucose 180.156 g/mol (prompt fixture; anhydrous C₆H₁₂O₆)
 * - Cholesterol 386.65 (PubChem / NCEP clinical factor ×38.67)
 * - Triglycerides 885.7 (triolein clinical convention)
 * - Creatinine 113.12 (PubChem)
 * - Urea 60.06 (whole molecule); BUN 28.014 (urea nitrogen)
 * - Uric acid 168.11; Calcium 40.078; Magnesium 24.305; Bilirubin 584.66
 */
export const ANALYTE_OPTIONS: readonly AnalyteOption[] = [
  {
    value: 'glucose',
    label: 'Glucose (Glu)',
    molarMassGPerMol: 180.156,
    sourceNote: 'Anhydrous glucose C₆H₁₂O₆ ≈ 180.156 g/mol (IFCC / IUPAC-style factor ×18.0156).',
  },
  {
    value: 'cholesterol',
    label: 'Cholesterol (Total / HDL / LDL)',
    molarMassGPerMol: 386.65,
    sourceNote: 'Cholesterol mass (PubChem / NCEP): 1 mmol/L ≈ 38.67 mg/dL.',
  },
  {
    value: 'triglycerides',
    label: 'Triglycerides',
    molarMassGPerMol: 885.7,
    sourceNote: 'Clinical triolein convention: 1 mmol/L ≈ 88.57 mg/dL (not a single molecular species).',
  },
  {
    value: 'creatinine',
    label: 'Creatinine',
    molarMassGPerMol: 113.12,
    sourceNote: 'Creatinine ≈ 113.12 g/mol (PubChem). Labs often report µmol/L (÷1000 before mmol/L).',
  },
  {
    value: 'urea',
    label: 'Urea (whole molecule)',
    molarMassGPerMol: 60.06,
    sourceNote: 'Urea molecule ≈ 60.06 g/mol. Not the same as BUN (urea nitrogen).',
  },
  {
    value: 'bun',
    label: 'Blood urea nitrogen (BUN)',
    molarMassGPerMol: 28.014,
    sourceNote: 'BUN uses urea-nitrogen mass ≈ 28.014 g/mol (CIAAW N₂); factor ≈ ×2.801.',
  },
  {
    value: 'uricAcid',
    label: 'Uric acid (urate)',
    molarMassGPerMol: 168.11,
    sourceNote: 'Uric acid ≈ 168.11 g/mol (PubChem). µmol/L is also common clinically.',
  },
  {
    value: 'calcium',
    label: 'Calcium',
    molarMassGPerMol: 40.078,
    sourceNote: 'Calcium atomic weight ≈ 40.078 g/mol (CIAAW); factor ≈ ×4.008.',
  },
  {
    value: 'magnesium',
    label: 'Magnesium',
    molarMassGPerMol: 24.305,
    sourceNote: 'Magnesium atomic weight ≈ 24.305 g/mol (CIAAW); factor ≈ ×2.4305.',
  },
  {
    value: 'bilirubin',
    label: 'Bilirubin',
    molarMassGPerMol: 584.66,
    sourceNote: 'Bilirubin ≈ 584.66 g/mol (PubChem). Many labs report µmol/L, not mmol/L.',
  },
] as const;

export const DEFAULT_ANALYTE: AnalyteId = 'glucose';

export const MAX_ABS_VALUE = 1e15;

export function emptyPair(source: ConcentrationSource = 'mmolL'): ConcentrationPair {
  return { source, mmolL: null, mgDl: null };
}

/** Screenshot default: Glucose selected; concentration fields blank; custom section open. */
export const EMPTY_MMOLL_TO_MGDL_INPUT: MmollToMgdlInput = {
  analyte: DEFAULT_ANALYTE,
  preset: emptyPair('mmolL'),
  customOpen: true,
  customMolarMass: null,
  custom: emptyPair('mmolL'),
};

export const DEFAULT_MMOLL_TO_MGDL_INPUT: MmollToMgdlInput = EMPTY_MMOLL_TO_MGDL_INPUT;
