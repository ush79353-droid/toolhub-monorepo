/** Which field the user last edited. */
export type KpaMmhgSource = 'kPa' | 'mmHg';

export interface KpaToMmhgInput {
  source: KpaMmhgSource;
  kPa: number | null;
  mmHg: number | null;
}

export type KpaToMmhgFieldErrors = {
  kPa?: string;
  mmHg?: string;
};

/**
 * Conventional standard mmHg for this tool: 1 mmHg = 101325/760 Pa (Torr-equivalent).
 * Exact: 101.325 kPa = 760 mmHg. Distinct from CIPM conventional mmHg in pressure-conversion.
 */
export const MMHG_PER_KPA = 760_000 / 101_325;
export const KPA_PER_MMHG = 101_325 / 760_000;

export const MAX_ABS_VALUE = 1e18;
