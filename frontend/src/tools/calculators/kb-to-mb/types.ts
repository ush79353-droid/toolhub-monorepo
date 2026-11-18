export type KiloUnit = 'kB' | 'KiB';

export type FieldUnit = 'kilo' | 'MiB' | 'MB';

export type KbToMbFieldErrors = Partial<Record<FieldUnit, string>>;

export const MAX_INPUT_LENGTH = 64;
export const DISPLAY_FRAC_DIGITS = 18;

export const BYTES_PER_KB = 1000n;
export const BYTES_PER_KIB = 1024n;
export const BYTES_PER_MB = 1_000_000n;
export const BYTES_PER_MIB = 1_048_576n;

export const KILO_UNIT_LABELS: Record<KiloUnit, string> = {
  kB: 'Kilobytes (kB, SI)',
  KiB: 'Kibibytes (KiB, IEC)',
};

export const DEFAULT_KILO_UNIT: KiloUnit = 'kB';
export const DEFAULT_KILO = '1024';
