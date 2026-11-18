export type ConcentrationSource = 'ppm' | 'mgL' | 'molar';

export const DENSITY_UNITS = ['kg_m3', 'kg_L', 'g_mL', 'g_cm3', 'g_L', 'lb_ft3'] as const;
export type DensityUnit = (typeof DENSITY_UNITS)[number];

/** Multiply density value by this factor to get kg/m³. */
export const DENSITY_TO_KG_M3: Record<DensityUnit, number> = {
  kg_m3: 1,
  kg_L: 1000,
  g_mL: 1000,
  g_cm3: 1000,
  g_L: 1,
  lb_ft3: 0.45359237 / 0.3048 ** 3,
};

export const DENSITY_UNIT_SYMBOLS: Record<DensityUnit, string> = {
  kg_m3: 'kg/m³',
  kg_L: 'kg/L',
  g_mL: 'g/mL',
  g_cm3: 'g/cm³',
  g_L: 'g/L',
  lb_ft3: 'lb/ft³',
};

export const MOLAR_MASS_UNITS = ['g_mol', 'kg_mol'] as const;
export type MolarMassUnit = (typeof MOLAR_MASS_UNITS)[number];

/** Multiply molar mass by this factor to get g/mol. */
export const MOLAR_MASS_TO_G_MOL: Record<MolarMassUnit, number> = {
  g_mol: 1,
  kg_mol: 1000,
};

export const MOLAR_MASS_SYMBOLS: Record<MolarMassUnit, string> = {
  g_mol: 'g/mol',
  kg_mol: 'kg/mol',
};

export const MOLAR_CONC_UNITS = ['mol_L', 'mmol_L', 'umol_L'] as const;
export type MolarConcUnit = (typeof MOLAR_CONC_UNITS)[number];

/** Multiply molar concentration by this factor to get mol/L. */
export const MOLAR_CONC_TO_MOL_L: Record<MolarConcUnit, number> = {
  mol_L: 1,
  mmol_L: 0.001,
  umol_L: 1e-6,
};

export const MOLAR_CONC_SYMBOLS: Record<MolarConcUnit, string> = {
  mol_L: 'mol/L',
  mmol_L: 'mmol/L',
  umol_L: 'µmol/L',
};

export const DEFAULT_DENSITY_KG_M3 = 1000;
export const MAX_PPM = 1_000_000;

export type FieldErrors = Partial<
  Record<'ppm' | 'density' | 'mgL' | 'molarMass' | 'molar', string>
>;
