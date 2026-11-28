/**
 * Illustrative conventional belt / clothing chart (approximate).
 * Source label: Omega Calculators illustrative consolidation of common
 * inch-based belt charts and general letter-size bands — NOT a universal
 * brand standard. Verify against the manufacturer before purchase.
 */

import type { GeneralSize, SizingCategory, SizingSystem } from './types';

export const CHART_SOURCE =
  'Illustrative conventional sizing guide (approximate). Brand charts vary.';

export interface BeltChartRow {
  sizingCategory: SizingCategory;
  numericBeltInches: number;
  generalSize: GeneralSize;
  /** Approximate belt-wearing waist circumference band (cm). */
  minWaistCm: number;
  maxWaistCm: number;
}

/** Shared numeric ladder used for both categories (letter bands differ slightly). */
export const BELT_CHART: readonly BeltChartRow[] = [
  { sizingCategory: 'women', numericBeltInches: 26, generalSize: 'XXS', minWaistCm: 58, maxWaistCm: 64 },
  { sizingCategory: 'women', numericBeltInches: 28, generalSize: 'XS', minWaistCm: 64, maxWaistCm: 70 },
  { sizingCategory: 'women', numericBeltInches: 30, generalSize: 'S', minWaistCm: 70, maxWaistCm: 76 },
  { sizingCategory: 'women', numericBeltInches: 32, generalSize: 'M', minWaistCm: 76, maxWaistCm: 82 },
  { sizingCategory: 'women', numericBeltInches: 34, generalSize: 'L', minWaistCm: 82, maxWaistCm: 88 },
  { sizingCategory: 'women', numericBeltInches: 36, generalSize: 'XL', minWaistCm: 88, maxWaistCm: 94 },
  { sizingCategory: 'women', numericBeltInches: 38, generalSize: 'XXL', minWaistCm: 94, maxWaistCm: 100 },
  { sizingCategory: 'women', numericBeltInches: 40, generalSize: 'XXXL', minWaistCm: 100, maxWaistCm: 108 },
  { sizingCategory: 'men', numericBeltInches: 28, generalSize: 'XS', minWaistCm: 66, maxWaistCm: 72 },
  { sizingCategory: 'men', numericBeltInches: 30, generalSize: 'S', minWaistCm: 72, maxWaistCm: 78 },
  { sizingCategory: 'men', numericBeltInches: 32, generalSize: 'S', minWaistCm: 78, maxWaistCm: 82 },
  { sizingCategory: 'men', numericBeltInches: 34, generalSize: 'M', minWaistCm: 82, maxWaistCm: 88 },
  { sizingCategory: 'men', numericBeltInches: 36, generalSize: 'L', minWaistCm: 88, maxWaistCm: 94 },
  { sizingCategory: 'men', numericBeltInches: 38, generalSize: 'L', minWaistCm: 94, maxWaistCm: 98 },
  { sizingCategory: 'men', numericBeltInches: 40, generalSize: 'XL', minWaistCm: 98, maxWaistCm: 104 },
  { sizingCategory: 'men', numericBeltInches: 42, generalSize: 'XXL', minWaistCm: 104, maxWaistCm: 110 },
  { sizingCategory: 'men', numericBeltInches: 44, generalSize: 'XXXL', minWaistCm: 110, maxWaistCm: 118 },
];

export interface ClothingMapRow {
  sizingCategory: SizingCategory;
  system: SizingSystem;
  clothingSize: string;
  /** Estimated waist circumference range (cm) at belt position. */
  minWaistCm: number;
  maxWaistCm: number;
  /** For men’s US pants waist labels in inches — use +2 heuristic separately. */
  pantsWaistInches?: number;
}

export const CLOTHING_MAP: readonly ClothingMapRow[] = [
  // Women US dress (approximate waist bands)
  { sizingCategory: 'women', system: 'US', clothingSize: '0', minWaistCm: 58, maxWaistCm: 64 },
  { sizingCategory: 'women', system: 'US', clothingSize: '2', minWaistCm: 62, maxWaistCm: 68 },
  { sizingCategory: 'women', system: 'US', clothingSize: '4', minWaistCm: 66, maxWaistCm: 72 },
  { sizingCategory: 'women', system: 'US', clothingSize: '6', minWaistCm: 70, maxWaistCm: 76 },
  { sizingCategory: 'women', system: 'US', clothingSize: '8', minWaistCm: 74, maxWaistCm: 80 },
  { sizingCategory: 'women', system: 'US', clothingSize: '10', minWaistCm: 78, maxWaistCm: 84 },
  { sizingCategory: 'women', system: 'US', clothingSize: '12', minWaistCm: 82, maxWaistCm: 88 },
  { sizingCategory: 'women', system: 'US', clothingSize: '14', minWaistCm: 86, maxWaistCm: 94 },
  { sizingCategory: 'women', system: 'US', clothingSize: '16', minWaistCm: 92, maxWaistCm: 100 },
  // Women UK
  { sizingCategory: 'women', system: 'UK', clothingSize: '6', minWaistCm: 58, maxWaistCm: 64 },
  { sizingCategory: 'women', system: 'UK', clothingSize: '8', minWaistCm: 62, maxWaistCm: 68 },
  { sizingCategory: 'women', system: 'UK', clothingSize: '10', minWaistCm: 66, maxWaistCm: 72 },
  { sizingCategory: 'women', system: 'UK', clothingSize: '12', minWaistCm: 70, maxWaistCm: 76 },
  { sizingCategory: 'women', system: 'UK', clothingSize: '14', minWaistCm: 74, maxWaistCm: 80 },
  { sizingCategory: 'women', system: 'UK', clothingSize: '16', minWaistCm: 78, maxWaistCm: 86 },
  { sizingCategory: 'women', system: 'UK', clothingSize: '18', minWaistCm: 84, maxWaistCm: 92 },
  // Women EU
  { sizingCategory: 'women', system: 'EU', clothingSize: '32', minWaistCm: 58, maxWaistCm: 64 },
  { sizingCategory: 'women', system: 'EU', clothingSize: '34', minWaistCm: 62, maxWaistCm: 68 },
  { sizingCategory: 'women', system: 'EU', clothingSize: '36', minWaistCm: 66, maxWaistCm: 72 },
  { sizingCategory: 'women', system: 'EU', clothingSize: '38', minWaistCm: 70, maxWaistCm: 76 },
  { sizingCategory: 'women', system: 'EU', clothingSize: '40', minWaistCm: 74, maxWaistCm: 80 },
  { sizingCategory: 'women', system: 'EU', clothingSize: '42', minWaistCm: 78, maxWaistCm: 86 },
  { sizingCategory: 'women', system: 'EU', clothingSize: '44', minWaistCm: 84, maxWaistCm: 92 },
  // Women International letter
  { sizingCategory: 'women', system: 'International', clothingSize: 'XS', minWaistCm: 64, maxWaistCm: 70 },
  { sizingCategory: 'women', system: 'International', clothingSize: 'S', minWaistCm: 70, maxWaistCm: 76 },
  { sizingCategory: 'women', system: 'International', clothingSize: 'M', minWaistCm: 76, maxWaistCm: 82 },
  { sizingCategory: 'women', system: 'International', clothingSize: 'L', minWaistCm: 82, maxWaistCm: 88 },
  { sizingCategory: 'women', system: 'International', clothingSize: 'XL', minWaistCm: 88, maxWaistCm: 96 },
  // Men US pants waist (inches label)
  { sizingCategory: 'men', system: 'US', clothingSize: '28', minWaistCm: 68, maxWaistCm: 74, pantsWaistInches: 28 },
  { sizingCategory: 'men', system: 'US', clothingSize: '30', minWaistCm: 72, maxWaistCm: 78, pantsWaistInches: 30 },
  { sizingCategory: 'men', system: 'US', clothingSize: '32', minWaistCm: 76, maxWaistCm: 82, pantsWaistInches: 32 },
  { sizingCategory: 'men', system: 'US', clothingSize: '34', minWaistCm: 82, maxWaistCm: 88, pantsWaistInches: 34 },
  { sizingCategory: 'men', system: 'US', clothingSize: '36', minWaistCm: 88, maxWaistCm: 94, pantsWaistInches: 36 },
  { sizingCategory: 'men', system: 'US', clothingSize: '38', minWaistCm: 94, maxWaistCm: 100, pantsWaistInches: 38 },
  { sizingCategory: 'men', system: 'US', clothingSize: '40', minWaistCm: 100, maxWaistCm: 106, pantsWaistInches: 40 },
  { sizingCategory: 'men', system: 'US', clothingSize: '42', minWaistCm: 106, maxWaistCm: 112, pantsWaistInches: 42 },
  // Men UK / EU / International (waist-ish numeric)
  { sizingCategory: 'men', system: 'UK', clothingSize: '30', minWaistCm: 72, maxWaistCm: 78, pantsWaistInches: 30 },
  { sizingCategory: 'men', system: 'UK', clothingSize: '32', minWaistCm: 76, maxWaistCm: 82, pantsWaistInches: 32 },
  { sizingCategory: 'men', system: 'UK', clothingSize: '34', minWaistCm: 82, maxWaistCm: 88, pantsWaistInches: 34 },
  { sizingCategory: 'men', system: 'UK', clothingSize: '36', minWaistCm: 88, maxWaistCm: 94, pantsWaistInches: 36 },
  { sizingCategory: 'men', system: 'UK', clothingSize: '38', minWaistCm: 94, maxWaistCm: 100, pantsWaistInches: 38 },
  { sizingCategory: 'men', system: 'EU', clothingSize: '46', minWaistCm: 74, maxWaistCm: 80 },
  { sizingCategory: 'men', system: 'EU', clothingSize: '48', minWaistCm: 78, maxWaistCm: 84 },
  { sizingCategory: 'men', system: 'EU', clothingSize: '50', minWaistCm: 84, maxWaistCm: 90 },
  { sizingCategory: 'men', system: 'EU', clothingSize: '52', minWaistCm: 90, maxWaistCm: 96 },
  { sizingCategory: 'men', system: 'EU', clothingSize: '54', minWaistCm: 96, maxWaistCm: 102 },
  { sizingCategory: 'men', system: 'International', clothingSize: 'S', minWaistCm: 72, maxWaistCm: 80 },
  { sizingCategory: 'men', system: 'International', clothingSize: 'M', minWaistCm: 82, maxWaistCm: 90 },
  { sizingCategory: 'men', system: 'International', clothingSize: 'L', minWaistCm: 90, maxWaistCm: 98 },
  { sizingCategory: 'men', system: 'International', clothingSize: 'XL', minWaistCm: 98, maxWaistCm: 106 },
  { sizingCategory: 'men', system: 'International', clothingSize: 'XXL', minWaistCm: 106, maxWaistCm: 114 },
];

export function getBeltChart(category: SizingCategory): BeltChartRow[] {
  return BELT_CHART.filter((r) => r.sizingCategory === category);
}

export function getClothingOptions(
  category: SizingCategory,
  system: SizingSystem,
): ClothingMapRow[] {
  return CLOTHING_MAP.filter(
    (r) => r.sizingCategory === category && r.system === system,
  );
}
