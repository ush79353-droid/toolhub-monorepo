/**
 * Documented heuristic thresholds for bikini body-proportion categories.
 * Configurable constants — not universal anatomical standards.
 *
 * Priority (first match wins after spoon/inverted specials):
 * 1. Spoon (hip-dominant + high-hip close to full hip)
 * 2. Inverted triangle (bust clearly larger than hip)
 * 3. Hourglass family (defined waist) → hourglass / top / bottom
 * 4. Triangle (hip-dominant without spoon high-hip pattern)
 * 5. Rectangle (bust≈hip, less defined waist)
 * 6. Mixed
 */

export const CM_PER_IN = 2.54;

/** |bust − hip| ≤ this (cm) counts as “similar” for hourglass / rectangle. */
export const SIMILAR_BUST_HIP_CM = 5;

/** Bust − hip ≥ this (cm) → inverted-triangle candidate. */
export const INVERTED_BUST_LEAD_CM = 5;

/** Hip − bust ≥ this (cm) → triangle / spoon / bottom-hourglass family. */
export const HIP_LEAD_CM = 5;

/** Strong hip lead for triangle (cm). */
export const STRONG_HIP_LEAD_CM = 9;

/** Bust lead for top-hourglass vs balanced hourglass (cm). */
export const TOP_BUST_LEAD_CM = 2.5;

/** min(B,H) − W ≥ this (cm) → “defined” waist. */
export const DEFINED_WAIST_CM = 9;

/** High-hip nearly as full as hip: H − HH ≤ this (cm) → spoon cue. */
export const SPOON_HIGH_HIP_GAP_CM = 7;

/** Soft WHR ceiling often seen with defined-waist shapes. */
export const DEFINED_WHR_MAX = 0.82;
