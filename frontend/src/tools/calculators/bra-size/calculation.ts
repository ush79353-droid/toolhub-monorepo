/**
 * Bra size engine — region-specific band/cup + sister sizes.
 *
 * US/UK modern: band = nearest even underbust (inches); cup from (bust − band) inches.
 * US/UK plus4: band = nearest even (underbust + 4); cup from (bust − band) inches.
 * EU/AU/FR: map from US hub band index; cup from ~2 cm steps of (bust − underbust).
 *
 * Cup volume equivalence across brands is approximate.
 */

import {
  CHART_SOURCE,
  US_UK_BANDS,
  bandLabelAtIndex,
  cupsForRegion,
  findBandIndex,
} from './chart-data';
import type {
  BraResult,
  BraSize,
  BraSizingRegion,
  LengthUnit,
  SisterSizeResults,
  UsUkBandMethod,
} from './types';

export const CM_PER_IN = 2.54;

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

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

export function calculateBustUnderbustDifference(
  bustCm: number,
  underbustCm: number,
): number {
  return bustCm - underbustCm;
}

function nearestEven(n: number): number {
  return Math.round(n / 2) * 2;
}

function clampBandIndex(index: number): number | null {
  if (index < 0 || index >= US_UK_BANDS.length) return null;
  return index;
}

/** Nearest US/UK band index from underbust inches + method. */
export function getUsUkBandIndex(
  underbustInches: number,
  method: UsUkBandMethod,
): { bandInches: number; index: number | null; outOfRange: boolean } {
  const raw =
    method === 'plus4' ? underbustInches + 4 : underbustInches;
  const bandInches = nearestEven(raw);
  const index = US_UK_BANDS.findIndex((b) => b === bandInches);
  if (index >= 0) return { bandInches, index, outOfRange: false };
  // outside ladder
  if (bandInches < US_UK_BANDS[0]!) {
    return { bandInches, index: null, outOfRange: true };
  }
  if (bandInches > US_UK_BANDS[US_UK_BANDS.length - 1]!) {
    return { bandInches, index: null, outOfRange: true };
  }
  // odd gap (shouldn't happen with even ladder)
  return { bandInches, index: null, outOfRange: true };
}

function cupIndexFromInchDiff(diffInches: number): number {
  // 0 → AA, 1 → A, 2 → B …
  const rounded = Math.round(diffInches);
  return Math.max(0, rounded);
}

function cupIndexFromCmDiff(diffCm: number): number {
  // ≈2 cm per cup step
  return Math.max(0, Math.round(diffCm / 2));
}

function makeSize(
  region: BraSizingRegion,
  bandIndex: number,
  cupIndex: number,
): BraSize | null {
  const band = bandLabelAtIndex(region, bandIndex);
  const cups = cupsForRegion(region);
  if (!band) return null;
  if (cupIndex < 0 || cupIndex >= cups.length) return null;
  const cup = cups[cupIndex]!;
  return {
    band,
    cup,
    region,
    fullSize: `${band}${cup}`,
  };
}

export function formatBraSize(size: BraSize): string {
  return `${size.fullSize} (${size.region})`;
}

export function getSisterSizes(
  primary: BraSize,
): SisterSizeResults {
  const bandIndex = findBandIndex(primary.region, primary.band);
  const cups = cupsForRegion(primary.region);
  const cupIndex = cups.indexOf(primary.cup);
  if (bandIndex < 0 || cupIndex < 0) {
    return { smallerBand: null, primary, largerBand: null };
  }

  // Down band → up cup; up band → down cup
  const smaller =
    clampBandIndex(bandIndex - 1) != null && cupIndex + 1 < cups.length
      ? makeSize(primary.region, bandIndex - 1, cupIndex + 1)
      : null;
  const larger =
    clampBandIndex(bandIndex + 1) != null && cupIndex - 1 >= 0
      ? makeSize(primary.region, bandIndex + 1, cupIndex - 1)
      : null;

  return {
    smallerBand: smaller,
    primary,
    largerBand: larger,
  };
}

export function convertBraSizeRegion(
  size: BraSize,
  target: BraSizingRegion,
): BraSize | null {
  const bandIndex = findBandIndex(size.region, size.band);
  const fromCups = cupsForRegion(size.region);
  const cupIndex = fromCups.indexOf(size.cup);
  if (bandIndex < 0 || cupIndex < 0) return null;
  // Cup index is approximate volume step — letter names differ by region
  return makeSize(target, bandIndex, cupIndex);
}

export function getRegionalBraSizes(
  primary: BraSize,
): Partial<Record<BraSizingRegion, BraSize>> {
  const regions: BraSizingRegion[] = ['US', 'UK', 'EU', 'AU', 'FR'];
  const out: Partial<Record<BraSizingRegion, BraSize>> = {};
  for (const r of regions) {
    const converted = convertBraSizeRegion(primary, r);
    if (converted) out[r] = converted;
  }
  return out;
}

export function getBraFitGuidance(): string[] {
  return [
    'Band: should feel snug and stay roughly level; most support comes from the band, not straps.',
    'Cups: tissue should sit in the cups without persistent overflow or large gaping; shape matters as much as letter.',
    'Straps: adjust for comfort — they should not dig in or slip constantly, and should not carry all the weight.',
    'Gore / underwire: designs differ; wires should follow the breast root without painful pressure when the size is close.',
  ];
}

/**
 * Primary estimate for selected region.
 * Returns null when out of supported tables or bust < underbust.
 */
export function getBraSize(args: {
  underbustCm: number;
  bustCm: number;
  region: BraSizingRegion;
  bandMethod: UsUkBandMethod;
}): {
  size: BraSize | null;
  bandIndex: number | null;
  cupIndex: number | null;
  outOfRange: boolean;
  steps: string[];
  warnings: string[];
} {
  const { underbustCm, bustCm, region, bandMethod } = args;
  const steps: string[] = [];
  const warnings: string[] = [];
  const diffCm = bustCm - underbustCm;

  if (diffCm < 0) {
    return {
      size: null,
      bandIndex: null,
      cupIndex: null,
      outOfRange: false,
      steps: ['Bust < underbust — cannot estimate a cup from these values.'],
      warnings: [
        'Bust circumference is smaller than underbust. Recheck tape placement; no cup size is invented.',
      ],
    };
  }

  const underbustIn = underbustCm / CM_PER_IN;
  const bustIn = bustCm / CM_PER_IN;

  // Hub: US/UK inch band index
  const methodForHub =
    region === 'US' || region === 'UK' ? bandMethod : 'modern';
  const { bandInches, index: bandIndex, outOfRange } = getUsUkBandIndex(
    underbustIn,
    methodForHub,
  );

  steps.push(
    `Underbust ${fmt(underbustCm, 1)} cm (${fmt(underbustIn, 2)} in) · Bust ${fmt(bustCm, 1)} cm (${fmt(bustIn, 2)} in)`,
  );
  steps.push(`Raw difference D = B−U = ${fmt(diffCm, 1)} cm`);

  if (bandIndex == null) {
    steps.push(
      `Band ${bandInches} in is outside supported ladder (${US_UK_BANDS[0]}–${US_UK_BANDS[US_UK_BANDS.length - 1]}).`,
    );
    return {
      size: null,
      bandIndex: null,
      cupIndex: null,
      outOfRange: true,
      steps,
      warnings: [
        'Measurements fall outside the supported size tables for this calculator.',
        CHART_SOURCE,
      ],
    };
  }

  let cupIndex: number;
  if (region === 'US' || region === 'UK') {
    const cupDiffIn = bustIn - bandInches;
    cupIndex = cupIndexFromInchDiff(cupDiffIn);
    steps.push(
      `${region} band method: ${methodForHub === 'plus4' ? 'traditional +4' : 'modern nearest-even'} → band ${bandInches}`,
    );
    steps.push(
      `Cup from (bust − band) = ${fmt(cupDiffIn, 2)} in → step ${cupIndex}`,
    );
  } else {
    // EU/AU/FR: band from hub index; cup from underbust–bust cm steps
    cupIndex = cupIndexFromCmDiff(diffCm);
    steps.push(
      `${region} band from US hub index ${bandIndex} (underbust mapped via modern inch ladder)`,
    );
    steps.push(
      `Cup from D/2 cm ≈ ${fmt(diffCm / 2, 2)} → step ${cupIndex}`,
    );
  }

  const size = makeSize(region, bandIndex, cupIndex);
  if (!size) {
    return {
      size: null,
      bandIndex,
      cupIndex,
      outOfRange: true,
      steps: [
        ...steps,
        'Cup or band index exceeds configured table — no invented size.',
      ],
      warnings: [
        'Cup difference is outside the configured letter table for this region.',
      ],
    };
  }

  if (methodForHub === 'plus4' && (region === 'US' || region === 'UK')) {
    warnings.push(
      'Traditional +4 can size differently from modern nearest-even methods — try both if shopping.',
    );
  }

  return {
    size,
    bandIndex,
    cupIndex,
    outOfRange: false,
    steps,
    warnings,
  };
}

export function calculateBraSizeResults(args: {
  underbustCm: number;
  bustCm: number;
  region: BraSizingRegion;
  bandMethod: UsUkBandMethod;
}): BraResult | null {
  const diff = calculateBustUnderbustDifference(args.bustCm, args.underbustCm);
  const computed = getBraSize(args);

  if (!computed.size) {
    return {
      underbustCm: args.underbustCm,
      bustCm: args.bustCm,
      measurementDifferenceCm: diff,
      estimatedSize: {
        band: '—',
        cup: '—',
        region: args.region,
        fullSize: '—',
      },
      sisterSizes: {
        smallerBand: null,
        primary: {
          band: '—',
          cup: '—',
          region: args.region,
          fullSize: '—',
        },
        largerBand: null,
      },
      regionalConversions: {},
      fittingGuidance: getBraFitGuidance(),
      disclaimer:
        'Bra sizes are starting estimates. Fit varies by brand, bra design, cup shape, and individual proportions. Try the suggested size and nearby sizes to find the most comfortable fit.',
      warnings: computed.warnings,
      formulaSteps: computed.steps,
      outOfRange: computed.outOfRange,
    };
  }

  const sisterSizes = getSisterSizes(computed.size);
  const regionalConversions = getRegionalBraSizes(computed.size);

  return {
    underbustCm: args.underbustCm,
    bustCm: args.bustCm,
    measurementDifferenceCm: diff,
    estimatedSize: computed.size,
    sisterSizes,
    regionalConversions,
    fittingGuidance: getBraFitGuidance(),
    disclaimer:
      'Bra sizes are starting estimates. Fit varies by brand, bra design, cup shape, and individual proportions. Try the suggested size and nearby sizes to find the most comfortable fit.',
    warnings: [...computed.warnings, CHART_SOURCE],
    formulaSteps: [
      ...computed.steps,
      `Estimated size: ${formatBraSize(computed.size)}`,
      sisterSizes.smallerBand
        ? `Sister (smaller band): ${formatBraSize(sisterSizes.smallerBand)}`
        : 'Sister (smaller band): unavailable at table edge',
      sisterSizes.largerBand
        ? `Sister (larger band): ${formatBraSize(sisterSizes.largerBand)}`
        : 'Sister (larger band): unavailable at table edge',
    ],
    outOfRange: false,
  };
}
