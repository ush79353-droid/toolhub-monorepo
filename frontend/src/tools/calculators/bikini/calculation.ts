/**
 * Bikini Calculator — pure proportion metrics + rule-based classification.
 * Bust is an imperfect proxy for upper-body width (not shoulder span).
 */

import {
  CM_PER_IN,
  DEFINED_WAIST_CM,
  DEFINED_WHR_MAX,
  HIP_LEAD_CM,
  INVERTED_BUST_LEAD_CM,
  SIMILAR_BUST_HIP_CM,
  SPOON_HIGH_HIP_GAP_CM,
  STRONG_HIP_LEAD_CM,
  TOP_BUST_LEAD_CM,
} from './thresholds';
import type {
  ActivityPref,
  BikiniBodyShape,
  BikiniRecommendation,
  BikiniResult,
  BodyProportionMetrics,
  CoveragePref,
  LengthUnit,
  StylePref,
  SupportPref,
} from './types';
import { BODY_SHAPE_LABELS } from './types';

export { CM_PER_IN };

export function convertLengthToCm(value: number, unit: LengthUnit): number {
  return unit === 'cm' ? value : value * CM_PER_IN;
}

export function convertCmToLength(cm: number, unit: LengthUnit): number {
  return unit === 'cm' ? cm : cm / CM_PER_IN;
}

export function convertLength(
  value: number,
  from: LengthUnit,
  to: LengthUnit,
): number {
  return convertCmToLength(convertLengthToCm(value, from), to);
}

export function convertMeasurement(
  value: number,
  from: LengthUnit,
  to: LengthUnit,
): number {
  return convertLength(value, from, to);
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

export function calculateBustToHipRatio(bustCm: number, hipCm: number): number {
  return bustCm / hipCm;
}

export function calculateWaistToHipRatio(
  waistCm: number,
  hipCm: number,
): number {
  return waistCm / hipCm;
}

export function calculateWaistToBustRatio(
  waistCm: number,
  bustCm: number,
): number {
  return waistCm / bustCm;
}

export function calculateBustHipDifference(
  bustCm: number,
  hipCm: number,
): number {
  return bustCm - hipCm;
}

export function calculateHighHipDifference(
  hipCm: number,
  highHipCm: number,
): number {
  return hipCm - highHipCm;
}

export function calculateWaistDefinition(
  bustCm: number,
  hipCm: number,
  waistCm: number,
): number {
  return Math.min(bustCm, hipCm) - waistCm;
}

export function calculateBodyProportions(
  bustCm: number,
  waistCm: number,
  highHipCm: number,
  hipCm: number,
): BodyProportionMetrics {
  return {
    bustToHipRatio: calculateBustToHipRatio(bustCm, hipCm),
    waistToHipRatio: calculateWaistToHipRatio(waistCm, hipCm),
    waistToBustRatio: calculateWaistToBustRatio(waistCm, bustCm),
    bustHipDifferenceCm: calculateBustHipDifference(bustCm, hipCm),
    highHipDifferenceCm: calculateHighHipDifference(hipCm, highHipCm),
    waistDefinitionCm: calculateWaistDefinition(bustCm, hipCm, waistCm),
  };
}

/**
 * Deterministic classification using documented thresholds (thresholds.ts).
 */
export function classifyBodyShape(
  metrics: BodyProportionMetrics,
): BikiniBodyShape {
  const dBH = metrics.bustHipDifferenceCm;
  const hipLead = -dBH;
  const defined =
    metrics.waistDefinitionCm >= DEFINED_WAIST_CM &&
    metrics.waistToHipRatio <= DEFINED_WHR_MAX;

  // 1. Spoon: strong hip lead + high hip close to full hip
  if (
    hipLead >= STRONG_HIP_LEAD_CM &&
    metrics.highHipDifferenceCm <= SPOON_HIGH_HIP_GAP_CM
  ) {
    return 'spoon';
  }

  // 2. Inverted triangle: clear bust lead (proxy only — not shoulder width)
  if (dBH >= INVERTED_BUST_LEAD_CM && !defined) {
    return 'inverted-triangle';
  }
  if (dBH >= STRONG_HIP_LEAD_CM) {
    return 'inverted-triangle';
  }

  // 3. Hourglass family (defined waist)
  if (defined) {
    if (Math.abs(dBH) <= SIMILAR_BUST_HIP_CM) return 'hourglass';
    if (dBH >= TOP_BUST_LEAD_CM) return 'top-hourglass';
    if (hipLead >= TOP_BUST_LEAD_CM) return 'bottom-hourglass';
    return 'hourglass';
  }

  // 4. Triangle: hip-dominant without spoon high-hip pattern
  if (hipLead >= HIP_LEAD_CM) return 'triangle';

  // 5. Soft inverted when defined waist but strong bust lead already handled;
  // remaining mild bust lead without defined waist
  if (dBH >= HIP_LEAD_CM) return 'inverted-triangle';

  // 6. Rectangle: similar bust/hip, less defined waist
  if (Math.abs(dBH) <= SIMILAR_BUST_HIP_CM) return 'rectangle';

  return 'mixed';
}

const SHAPE_BLURBS: Record<BikiniBodyShape, string> = {
  hourglass:
    'Bust and hip measurements are relatively similar, with a more defined waist under this calculator’s heuristic model.',
  'top-hourglass':
    'Bust reads larger than hips while the waist remains comparatively defined in this model.',
  'bottom-hourglass':
    'Hips read larger than bust with a comparatively defined waist (sometimes called pear proportions in styling guides).',
  spoon:
    'Hips are fuller than bust and the high-hip sits relatively close to the fullest hip — a common spoon-shape cue in styling charts.',
  triangle:
    'Hips are noticeably fuller than bust. Bust circumference is only a rough upper-body proxy.',
  'inverted-triangle':
    'Bust circumference is larger than hip circumference in this model. That is an imperfect stand-in for shoulder width — not a precise inverted-triangle diagnosis.',
  rectangle:
    'Bust and hip measurements are relatively close, with a less distinctly defined waist relative to those measurements.',
  mixed:
    'Your measurements do not map cleanly to a single category under these documented thresholds — mixed or overlapping proportions are common.',
};

function top(
  style: string,
  description: string,
  reason: string,
  coverage: BikiniRecommendation['coverage'],
  support: BikiniRecommendation['support'],
  tags: string[],
): BikiniRecommendation {
  return { style, description, reason, coverage, support, tags };
}

function bottom(
  style: string,
  description: string,
  reason: string,
  coverage: BikiniRecommendation['coverage'],
  support: BikiniRecommendation['support'],
  tags: string[],
): BikiniRecommendation {
  return { style, description, reason, coverage, support, tags };
}

const BASE_BY_SHAPE: Record<
  BikiniBodyShape,
  {
    tops: BikiniRecommendation[];
    bottoms: BikiniRecommendation[];
    alts: BikiniRecommendation[];
  }
> = {
  hourglass: {
    tops: [
      top('Halter bikini top', 'Ties behind the neck for lift.', 'Adjustable support for a defined midriff.', 'moderate', 'medium', ['classic', 'trendy']),
      top('Underwire bikini top', 'Structured cups with underwire.', 'Useful when you want more bust support.', 'moderate', 'high', ['classic', 'swimming']),
      top('Balconette bikini top', 'Horizontal neckline with lift.', 'Shows shoulder line while offering shape.', 'moderate', 'medium', ['trendy', 'retro']),
      top('Adjustable triangle top', 'Sliding cups and ties.', 'Fine-tune coverage and fit day to day.', 'minimal', 'light', ['minimalist', 'beach']),
    ],
    bottoms: [
      bottom('High-waisted bottoms', 'Rise sits at or above the waist.', 'Pairs with a defined waistline.', 'full', 'medium', ['retro', 'classic']),
      bottom('Classic bikini bottoms', 'Moderate cut.', 'Everyday balance of coverage and mobility.', 'moderate', 'light', ['classic', 'swimming']),
      bottom('High-leg bottoms', 'Higher cut at the thigh.', 'Lengthens the leg line visually.', 'moderate', 'light', ['trendy']),
      bottom('Tie-side bottoms', 'Adjustable side ties.', 'Dial coverage and hip fit.', 'minimal', 'light', ['beach', 'minimalist']),
    ],
    alts: [
      top('Sport bikini top', 'Secure straps and band.', 'Good for active swimming.', 'full', 'high', ['sporty', 'water-sports', 'swimming']),
    ],
  },
  'top-hourglass': {
    tops: [
      top('Underwire bikini top', 'Structured support.', 'Helpful when bust measurement leads hips.', 'moderate', 'high', ['classic']),
      top('Wide-strap bikini top', 'Broader straps.', 'Spreads load for comfort.', 'moderate', 'high', ['sporty', 'swimming']),
      top('Structured balconette', 'Lift with a wide neckline.', 'Support with styling flexibility.', 'moderate', 'medium', ['trendy']),
      top('Adjustable halter top', 'Neck tie + back closure.', 'Customize lift and strap tension.', 'moderate', 'medium', ['classic', 'beach']),
    ],
    bottoms: [
      bottom('Patterned bikini bottoms', 'Prints or color.', 'Optional visual balance at the hip.', 'moderate', 'light', ['trendy']),
      bottom('Tie-side bottoms', 'Adjustable sides.', 'Match hip circumference comfortably.', 'minimal', 'light', ['beach']),
      bottom('High-waisted bottoms', 'Higher rise.', 'Smooths the midriff transition.', 'full', 'medium', ['retro']),
      bottom('Ruffled bottoms', 'Soft edge detail.', 'Adds interest without changing coverage much.', 'moderate', 'light', ['trendy', 'retro']),
    ],
    alts: [
      top('Scoop-neck sport top', 'Secure coverage.', 'Water sports and laps.', 'full', 'high', ['sporty', 'water-sports']),
    ],
  },
  'bottom-hourglass': {
    tops: [
      top('Bandeau top', 'Strapless or removable straps.', 'Optional detail at the bust line.', 'moderate', 'light', ['trendy', 'beach']),
      top('Ruffled top', 'Soft volume at the bust.', 'Decorative option if you want more top interest.', 'moderate', 'light', ['trendy', 'retro']),
      top('Patterned top', 'Prints or color blocking.', 'Draws the eye upward if desired.', 'moderate', 'medium', ['classic']),
      top('Halter top', 'Neck support.', 'Secure for swimming with adjustability.', 'moderate', 'medium', ['swimming', 'classic']),
    ],
    bottoms: [
      bottom('High-waisted bottoms', 'Higher rise.', 'Comfortable coverage at the hip.', 'full', 'medium', ['retro', 'classic']),
      bottom('Classic briefs', 'Moderate coverage.', 'Reliable everyday cut.', 'moderate', 'light', ['classic', 'swimming']),
      bottom('Adjustable-side bottoms', 'Ties or sliders.', 'Fine-tune hip fit.', 'moderate', 'light', ['beach']),
      bottom('High-leg bottoms', 'Higher thigh cut.', 'Mobility with a longer leg line.', 'moderate', 'light', ['trendy']),
    ],
    alts: [
      bottom('Boyshort bottoms', 'More rear/thigh coverage.', 'When you prefer fuller coverage.', 'full', 'medium', ['sporty', 'swimming']),
    ],
  },
  spoon: {
    tops: [
      top('Structured bikini top', 'Stable cups/band.', 'Keeps the top secure while you move.', 'moderate', 'medium', ['classic']),
      top('Halter top', 'Neck tie support.', 'Adjustable lift.', 'moderate', 'medium', ['swimming']),
      top('Bandeau top', 'Clean strapless option.', 'Optional styling choice for sun.', 'moderate', 'light', ['beach', 'minimalist']),
      top('Detail-forward top', 'Hardware or texture.', 'Adds interest at the bust if desired.', 'moderate', 'medium', ['trendy']),
    ],
    bottoms: [
      bottom('High-waisted bottoms', 'Higher rise.', 'Often comfortable when high-hip is fuller.', 'full', 'medium', ['retro', 'classic']),
      bottom('Wider-side briefs', 'Broader side panels.', 'Steady hip coverage.', 'full', 'medium', ['classic']),
      bottom('Adjustable bikini bottoms', 'Ties/sliders.', 'Match high-hip and full-hip comfort.', 'moderate', 'light', ['beach']),
      bottom('Moderate-coverage bottoms', 'Balanced cut.', 'Everyday swimming and lounging.', 'moderate', 'light', ['swimming', 'poolside']),
    ],
    alts: [
      bottom('Ruched bottoms', 'Gathered fabric.', 'Flexible fit through the hip.', 'moderate', 'light', ['trendy']),
    ],
  },
  triangle: {
    tops: [
      top('Patterned top', 'Prints or color.', 'Optional visual interest up top.', 'moderate', 'medium', ['trendy']),
      top('Ruffled top', 'Soft volume.', 'Decorative option.', 'moderate', 'light', ['retro', 'trendy']),
      top('Balconette top', 'Lifted neckline.', 'Shape with moderate support.', 'moderate', 'medium', ['classic']),
      top('Halter top', 'Neck support.', 'Secure for active wear.', 'moderate', 'medium', ['swimming']),
    ],
    bottoms: [
      bottom('Classic briefs', 'Moderate coverage.', 'Straightforward hip fit.', 'moderate', 'light', ['classic', 'swimming']),
      bottom('High-waisted bottoms', 'Higher rise.', 'Comfortable coverage preference.', 'full', 'medium', ['retro']),
      bottom('Side-tie bottoms', 'Adjustable.', 'Customize hip circumference fit.', 'minimal', 'light', ['beach']),
      bottom('High-leg bottoms', 'Higher cut.', 'Mobility and leg line.', 'moderate', 'light', ['trendy']),
    ],
    alts: [
      top('Wrap-style top', 'Wrap silhouette.', 'Adjustable coverage.', 'moderate', 'medium', ['trendy', 'retro']),
    ],
  },
  'inverted-triangle': {
    tops: [
      top('Adjustable triangle top', 'Sliding cups.', 'Tune coverage without bulky structure.', 'minimal', 'light', ['minimalist', 'beach']),
      top('Supportive scoop-neck top', 'Higher neckline.', 'Secure coverage for activity.', 'full', 'high', ['sporty', 'swimming']),
      top('Wide-strap top', 'Broader straps.', 'Comfort for longer wear.', 'moderate', 'high', ['sporty']),
      top('Simple structured top', 'Clean lines.', 'Lets construction do the support work.', 'moderate', 'medium', ['minimalist', 'classic']),
    ],
    bottoms: [
      bottom('Patterned bikini bottoms', 'Prints.', 'Optional interest at the hip.', 'moderate', 'light', ['trendy']),
      bottom('Ruffled bottoms', 'Edge detail.', 'Decorative hip option.', 'moderate', 'light', ['retro']),
      bottom('Tie-side bottoms', 'Adjustable.', 'Flexible hip fit.', 'minimal', 'light', ['beach']),
      bottom('High-waisted bottoms', 'Higher rise.', 'Coverage choice independent of shape labels.', 'full', 'medium', ['classic']),
    ],
    alts: [
      bottom('Boyshort bottoms', 'Fuller coverage.', 'Water sports and active swimming.', 'full', 'medium', ['sporty', 'water-sports']),
    ],
  },
  rectangle: {
    tops: [
      top('Padded bikini top', 'Light padding option.', 'Shape and coverage preference.', 'moderate', 'medium', ['classic']),
      top('Ruffled top', 'Soft volume.', 'Adds texture if desired.', 'moderate', 'light', ['trendy', 'retro']),
      top('Wrap-style top', 'Wrap silhouette.', 'Creates adjustable midriff interest.', 'moderate', 'medium', ['trendy']),
      top('Triangle top', 'Minimal structure.', 'Easy layering and tanning.', 'minimal', 'light', ['minimalist', 'beach']),
    ],
    bottoms: [
      bottom('Tie-side bottoms', 'Adjustable.', 'Flexible hip fit.', 'minimal', 'light', ['beach']),
      bottom('High-cut bottoms', 'Higher leg opening.', 'Mobility-focused cut.', 'moderate', 'light', ['trendy']),
      bottom('High-waisted bottoms', 'Higher rise.', 'Defines the midriff with the waistband.', 'full', 'medium', ['retro']),
      bottom('Ruched bottoms', 'Gathered fabric.', 'Flexible through the hip.', 'moderate', 'light', ['trendy']),
    ],
    alts: [
      top('Sport bikini set', 'Secure construction.', 'Swimming and pool workouts.', 'full', 'high', ['sporty', 'swimming', 'water-sports']),
    ],
  },
  mixed: {
    tops: [
      top('Adjustable triangle top', 'Ties and sliders.', 'Prioritize fit over category labels.', 'minimal', 'light', ['minimalist', 'beach']),
      top('Underwire or structured top', 'More support.', 'Choose by support need, not shape name.', 'moderate', 'high', ['classic', 'swimming']),
      top('Halter top', 'Neck tie.', 'Versatile for many proportions.', 'moderate', 'medium', ['classic']),
      top('Sport scoop top', 'Secure coverage.', 'Activity-first pick.', 'full', 'high', ['sporty', 'water-sports']),
    ],
    bottoms: [
      bottom('Adjustable-side bottoms', 'Ties/sliders.', 'Match comfort and coverage.', 'moderate', 'light', ['beach']),
      bottom('High-waisted bottoms', 'Higher rise.', 'Coverage preference.', 'full', 'medium', ['classic', 'retro']),
      bottom('Classic briefs', 'Moderate cut.', 'Reliable baseline.', 'moderate', 'light', ['swimming', 'poolside']),
      bottom('Boyshort bottoms', 'Fuller coverage.', 'When you want more fabric.', 'full', 'medium', ['sporty']),
    ],
    alts: [
      top('Mix-and-match separates', 'Different top/bottom sizes.', 'Brand charts beat shape labels for size.', 'moderate', 'medium', ['classic', 'trendy']),
    ],
  },
};

function preferenceScore(
  item: BikiniRecommendation,
  coverage: CoveragePref,
  support: SupportPref,
  style: StylePref,
  activity: ActivityPref,
): number {
  let score = 0;
  if (coverage && item.coverage === coverage) score += 3;
  if (support && item.support === support) score += 3;
  if (style && item.tags.includes(style)) score += 2;
  if (activity) {
    const map: Record<string, string> = {
      swimming: 'swimming',
      beach: 'beach',
      'water-sports': 'water-sports',
      poolside: 'poolside',
    };
    if (item.tags.includes(map[activity] ?? activity)) score += 2;
  }
  return score;
}

export function filterRecommendationsByPreferences(
  items: BikiniRecommendation[],
  coverage: CoveragePref,
  support: SupportPref,
  style: StylePref,
  activity: ActivityPref,
): BikiniRecommendation[] {
  if (!coverage && !support && !style && !activity) return items;
  return [...items].sort(
    (a, b) =>
      preferenceScore(b, coverage, support, style, activity) -
      preferenceScore(a, coverage, support, style, activity),
  );
}

export function getBikiniTopRecommendations(
  shape: BikiniBodyShape,
): BikiniRecommendation[] {
  return BASE_BY_SHAPE[shape].tops;
}

export function getBikiniBottomRecommendations(
  shape: BikiniBodyShape,
): BikiniRecommendation[] {
  return BASE_BY_SHAPE[shape].bottoms;
}

export function calculateBikiniRecommendations(args: {
  bustCm: number;
  waistCm: number;
  highHipCm: number;
  hipCm: number;
  coverage: CoveragePref;
  support: SupportPref;
  style: StylePref;
  activity: ActivityPref;
}): BikiniResult {
  const metrics = calculateBodyProportions(
    args.bustCm,
    args.waistCm,
    args.highHipCm,
    args.hipCm,
  );
  const bodyShape = classifyBodyShape(metrics);
  const base = BASE_BY_SHAPE[bodyShape];
  const recommendedTops = filterRecommendationsByPreferences(
    base.tops,
    args.coverage,
    args.support,
    args.style,
    args.activity,
  );
  const recommendedBottoms = filterRecommendationsByPreferences(
    base.bottoms,
    args.coverage,
    args.support,
    args.style,
    args.activity,
  );
  const alternativeStyles = filterRecommendationsByPreferences(
    base.alts,
    args.coverage,
    args.support,
    args.style,
    args.activity,
  );

  const warnings: string[] = [];
  const values = [args.bustCm, args.waistCm, args.highHipCm, args.hipCm];
  if (values.some((v) => v < 40 || v > 200)) {
    warnings.push(
      'One or more measurements look unusual — double-check tape placement; unusual values are still allowed.',
    );
  }
  if (args.highHipCm > args.hipCm + 2) {
    warnings.push(
      'High hip is larger than full hip — confirm which landmark you measured.',
    );
  }

  const formulaSteps = [
    `BHR = B/H = ${fmt(args.bustCm, 1)}/${fmt(args.hipCm, 1)} = ${fmt(metrics.bustToHipRatio, 3)}`,
    `WHR = W/H = ${fmt(args.waistCm, 1)}/${fmt(args.hipCm, 1)} = ${fmt(metrics.waistToHipRatio, 3)}`,
    `WBR = W/B = ${fmt(args.waistCm, 1)}/${fmt(args.bustCm, 1)} = ${fmt(metrics.waistToBustRatio, 3)}`,
    `D_BH = B−H = ${fmt(metrics.bustHipDifferenceCm, 1)} cm`,
    `D_HH = H−HH = ${fmt(metrics.highHipDifferenceCm, 1)} cm`,
    `D_W = min(B,H)−W = ${fmt(metrics.waistDefinitionCm, 1)} cm`,
    `Classified as ${BODY_SHAPE_LABELS[bodyShape]} (documented heuristics).`,
  ];

  return {
    bodyShape,
    bodyShapeLabel: BODY_SHAPE_LABELS[bodyShape],
    metrics,
    recommendedTops,
    recommendedBottoms,
    alternativeStyles,
    explanation: SHAPE_BLURBS[bodyShape],
    disclaimer:
      'Body-shape categories are approximate styling references. Bikini comfort and fit also depend on garment construction, brand sizing, support, and personal preference. Recommendations are optional — not rules.',
    warnings,
    formulaSteps,
  };
}

export function formatBikiniResults(result: BikiniResult): string {
  return [
    `Body shape: ${result.bodyShapeLabel}`,
    result.explanation,
    '',
    `BHR ${fmt(result.metrics.bustToHipRatio, 3)} · WHR ${fmt(result.metrics.waistToHipRatio, 3)} · WBR ${fmt(result.metrics.waistToBustRatio, 3)}`,
    '',
    'Suggested tops:',
    ...result.recommendedTops.slice(0, 3).map((t) => `• ${t.style}`),
    '',
    'Suggested bottoms:',
    ...result.recommendedBottoms.slice(0, 3).map((t) => `• ${t.style}`),
    '',
    result.disclaimer,
  ].join('\n');
}
