import type { HardnessRow } from './types';

/**
 * Sparse educational hardness conversion points for non-austenitic steels,
 * aligned with ASTM E140-style relationships republished for educational use.
 *
 * Soft (Rockwell B) and hard (Rockwell C) regimes are separate tables —
 * do not extrapolate across a regime boundary or invent missing cells.
 *
 * Source character: public educational hardness charts citing ASTM E140-12b
 * for non-austenitic carbon/alloy steels. Not a wholesale reproduction of
 * proprietary ASTM table pages.
 */

/** Soft / annealed regime — Rockwell B family (no HRC). */
export const SOFT_STEEL_ROWS: readonly HardnessRow[] = [
  { HRB: 60, HBW: 106, HRC: null, HV: 105 },
  { HRB: 65, HBW: 114, HRC: null, HV: 114 },
  { HRB: 70, HBW: 121, HRC: null, HV: 124 },
  { HRB: 75, HBW: 130, HRC: null, HV: 134 },
  { HRB: 80, HBW: 141, HRC: null, HV: 144 },
  { HRB: 85, HBW: 154, HRC: null, HV: 156 },
  { HRB: 90, HBW: 172, HRC: null, HV: 175 },
  { HRB: 95, HBW: 196, HRC: null, HV: 199 },
  { HRB: 100, HBW: 240, HRC: null, HV: 240 },
];

/** Hardened / tempered regime — Rockwell C family. */
export const HARD_STEEL_ROWS: readonly HardnessRow[] = [
  { HRC: 20, HRB: 98, HBW: 226, HV: 240 },
  { HRC: 25, HRB: null, HBW: 253, HV: 266 },
  { HRC: 30, HRB: null, HBW: 286, HV: 302 },
  { HRC: 35, HRB: null, HBW: 327, HV: 345 },
  { HRC: 40, HRB: null, HBW: 371, HV: 392 },
  { HRC: 45, HRB: null, HBW: 428, HV: 451 },
  { HRC: 50, HRB: null, HBW: 481, HV: 513 },
  { HRC: 55, HRB: null, HBW: 560, HV: 595 },
  { HRC: 60, HRB: null, HBW: 654, HV: 697 },
  { HRC: 65, HRB: null, HBW: null, HV: 832 },
  { HRC: 68, HRB: null, HBW: null, HV: 940 },
];

export const CHART_SOFT_ROWS = SOFT_STEEL_ROWS;
export const CHART_HARD_ROWS = HARD_STEEL_ROWS;
