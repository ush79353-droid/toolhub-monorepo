export type AlcoholMode = 'grams' | 'volume' | 'none';

export type MacroField = 'carbs' | 'protein' | 'fat' | 'alcoholGrams' | 'volumeMl' | 'abv';

export type GramsToCaloriesFieldErrors = Partial<Record<MacroField, string>>;

export const KCAL_PER_G_CARBS = 4;
export const KCAL_PER_G_PROTEIN = 4;
export const KCAL_PER_G_FAT = 9;
export const KCAL_PER_G_ALCOHOL = 7;

/** Approximate ethanol density at room temperature (g/mL). */
export const ETHANOL_DENSITY_G_PER_ML = 0.789;

export const MAX_ABS_GRAMS = 1e9;
export const MAX_ABS_VOLUME_ML = 1e9;
