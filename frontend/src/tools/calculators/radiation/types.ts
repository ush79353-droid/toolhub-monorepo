/** Absorbed dose — energy deposited per unit mass (gray family). */
export const ABSORBED_UNITS = ['milliGray', 'gray', 'rad'] as const;
export type AbsorbedUnit = (typeof ABSORBED_UNITS)[number];

/** Equivalent dose — sievert family (not universally interchangeable with Gy). */
export const EQUIVALENT_UNITS = ['microSievert', 'milliSievert', 'rem'] as const;
export type EquivalentUnit = (typeof EQUIVALENT_UNITS)[number];

export type RadiationUnit = AbsorbedUnit | EquivalentUnit;

export type RadiationFieldErrors = Partial<Record<RadiationUnit, string>>;

/** Multiply unit value by this factor to obtain grays. */
export const ABSORBED_TO_GRAY: Record<AbsorbedUnit, number> = {
  milliGray: 0.001,
  gray: 1,
  rad: 0.01,
};

/** Multiply unit value by this factor to obtain sieverts. */
export const EQUIVALENT_TO_SIEVERT: Record<EquivalentUnit, number> = {
  microSievert: 1e-6,
  milliSievert: 0.001,
  rem: 0.01,
};

export const RADIATION_UNIT_SYMBOLS: Record<RadiationUnit, string> = {
  milliGray: 'mGy',
  gray: 'Gy',
  rad: 'rad',
  microSievert: 'µSv',
  milliSievert: 'mSv',
  rem: 'rem',
};

export const RADIATION_FIELD_LABELS: Record<RadiationUnit, string> = {
  milliGray: 'Dose in milligrays',
  gray: 'Dose in grays',
  rad: 'Dose in rads',
  microSievert: 'Dose in microsieverts',
  milliSievert: 'Dose in millisieverts',
  rem: 'Dose in rems',
};

export function isAbsorbedUnit(unit: RadiationUnit): unit is AbsorbedUnit {
  return (ABSORBED_UNITS as readonly string[]).includes(unit);
}

export const MAX_ABS_DOSE = 1e30;
