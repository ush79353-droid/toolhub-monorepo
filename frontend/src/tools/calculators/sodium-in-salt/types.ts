/**
 * Sodium in Salt Calculator — input/result types (ADR-018).
 *
 * Screenshot fields: type of salt, amount of salt, amount of sodium, pure salt (NaCl).
 * Bidirectional: last-edited field drives the other two.
 */

/** Culinary salt presets — Harvard Nutrition Source Na/tsp bands + measured bulk density. */
export type SaltTypeId =
  | 'iodized_table_fine'
  | 'kosher_coarse'
  | 'sea_fine'
  | 'sea_coarse'
  | 'himalayan'
  | 'potassium_substitute';

/** Which quantity the user last edited. */
export type SodiumInSaltSource = 'salt' | 'sodium' | 'pure';

export type SaltAmountUnit = 'tsp' | 'tbsp' | 'g' | 'mg' | 'oz';
export type SodiumUnit = 'mg' | 'g';
export type PureSaltUnit = 'g' | 'mg';

export interface SaltTypeOption {
  id: SaltTypeId;
  label: string;
  /** Level-teaspoon bulk mass (g). */
  gramsPerTeaspoon: number;
  /** Published sodium milligrams per level teaspoon (0 for KCl substitute). */
  sodiumMgPerTeaspoon: number;
}

export interface SodiumInSaltInput {
  saltType: SaltTypeId;
  source: SodiumInSaltSource;
  saltAmountText: string;
  saltUnit: SaltAmountUnit;
  sodiumAmountText: string;
  sodiumUnit: SodiumUnit;
  pureSaltText: string;
  pureUnit: PureSaltUnit;
}

export interface SodiumInSaltResult {
  saltType: SaltTypeId;
  source: SodiumInSaltSource;
  /** Culinary product mass (g). */
  saltGrams: number | null;
  /** Culinary product volume as level teaspoons (null when density unavailable). */
  saltTeaspoons: number | null;
  sodiumMg: number | null;
  /** Stoichiometric pure NaCl mass (g) from Na via 22.99/58.44. */
  pureNaClGrams: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type SodiumInSaltFieldErrors = {
  saltAmountText?: string;
  sodiumAmountText?: string;
  pureSaltText?: string;
  saltType?: string;
};

export const SALT_TYPE_OPTIONS: readonly SaltTypeOption[] = [
  {
    id: 'iodized_table_fine',
    label: 'Iodized table salt, fine',
    gramsPerTeaspoon: 6.0,
    sodiumMgPerTeaspoon: 2300,
  },
  {
    id: 'kosher_coarse',
    label: 'Kosher salt, coarse',
    gramsPerTeaspoon: 4.8,
    sodiumMgPerTeaspoon: 1920,
  },
  {
    id: 'sea_fine',
    label: 'Sea salt, fine',
    gramsPerTeaspoon: 5.5,
    sodiumMgPerTeaspoon: 2120,
  },
  {
    id: 'sea_coarse',
    label: 'Sea salt, coarse',
    gramsPerTeaspoon: 4.0,
    sodiumMgPerTeaspoon: 1560,
  },
  {
    id: 'himalayan',
    label: 'Himalayan salt',
    gramsPerTeaspoon: 5.6,
    sodiumMgPerTeaspoon: 2200,
  },
  {
    id: 'potassium_substitute',
    label: 'Potassium salt (salt substitute)',
    gramsPerTeaspoon: 6.0,
    sodiumMgPerTeaspoon: 0,
  },
] as const;

export const SALT_UNIT_OPTIONS: readonly { value: SaltAmountUnit; label: string }[] = [
  { value: 'tsp', label: 'tsp' },
  { value: 'tbsp', label: 'tbsp' },
  { value: 'g', label: 'g' },
  { value: 'mg', label: 'mg' },
  { value: 'oz', label: 'oz' },
] as const;

export const SODIUM_UNIT_OPTIONS: readonly { value: SodiumUnit; label: string }[] = [
  { value: 'mg', label: 'mg' },
  { value: 'g', label: 'g' },
] as const;

export const PURE_UNIT_OPTIONS: readonly { value: PureSaltUnit; label: string }[] = [
  { value: 'g', label: 'g' },
  { value: 'mg', label: 'mg' },
] as const;

/** Screenshot default: iodized fine selected; amounts blank (no seeded intake). */
export function createDefaultInput(): SodiumInSaltInput {
  return {
    saltType: 'iodized_table_fine',
    source: 'salt',
    saltAmountText: '',
    saltUnit: 'tsp',
    sodiumAmountText: '',
    sodiumUnit: 'mg',
    pureSaltText: '',
    pureUnit: 'g',
  };
}

export function createEmptyInput(): SodiumInSaltInput {
  return createDefaultInput();
}

export function inputsEqual(a: SodiumInSaltInput, b: SodiumInSaltInput): boolean {
  return (
    a.saltType === b.saltType &&
    a.source === b.source &&
    a.saltAmountText === b.saltAmountText &&
    a.saltUnit === b.saltUnit &&
    a.sodiumAmountText === b.sodiumAmountText &&
    a.sodiumUnit === b.sodiumUnit &&
    a.pureSaltText === b.pureSaltText &&
    a.pureUnit === b.pureUnit
  );
}

export function getSaltTypeOption(id: SaltTypeId): SaltTypeOption {
  const row = SALT_TYPE_OPTIONS.find((o) => o.id === id);
  if (!row) throw new Error(`Unknown salt type: ${id}`);
  return row;
}
