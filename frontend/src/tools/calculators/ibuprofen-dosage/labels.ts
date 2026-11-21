import type { IbuprofenProductId } from './types';

/** Exact lb↔kg factor; never round weight before band matching. */
export const LB_PER_KG = 2.2046226218;

export const DISCLAIMER =
  'This tool is for information purposes only and ibuprofen dosages should always be calculated separately as well as double-checked by a health care provider. Always check the dosing information and contraindications on the leaflet. Consult your health provider before administering.';

export const SOURCE_NOTE =
  'US OTC Infants’ MOTRIN® Oral Suspension Drops (50 mg/1.25 mL) and Children’s MOTRIN® Oral Suspension (100 mg/5 mL) weight charts (DailyMed / FDA Drug Facts). Prefer weight; every 6–8 hours; max 4 doses/24 h. Educational only.';

export const FREQUENCY_NOTE =
  'If needed, repeat every 6–8 hours. Do not use more than 4 times in 24 hours. Use only the enclosed dosing device.';

export const MAX_DOSES_PER_24H = 4;

export interface WeightBand {
  productId: IbuprofenProductId;
  /** Inclusive lower bound in pounds after precise conversion. */
  minLbInclusive: number;
  /** Exclusive upper bound (half-open), except the final chart band which uses inclusive 95 via max 96 exclusive. */
  maxLbExclusive: number;
  labelLbRange: string;
  doseMl: number;
  doseMg: number;
  productLabel: string;
  concentrationNote: string;
}

/**
 * FDA Motirin pediatric oral suspension weight bands as half-open lb intervals
 * so fractional kg→lb values do not snap into a neighboring product band.
 */
export const WEIGHT_BANDS: readonly WeightBand[] = [
  {
    productId: 'infants_drops',
    minLbInclusive: 12,
    maxLbExclusive: 18,
    labelLbRange: '12–17 lb',
    doseMl: 1.25,
    doseMg: 50,
    productLabel: 'Infants’ MOTRIN® Oral Suspension Drops',
    concentrationNote: 'Ibuprofen 50 mg per 1.25 mL',
  },
  {
    productId: 'infants_drops',
    minLbInclusive: 18,
    maxLbExclusive: 24,
    labelLbRange: '18–23 lb',
    doseMl: 1.875,
    doseMg: 75,
    productLabel: 'Infants’ MOTRIN® Oral Suspension Drops',
    concentrationNote: 'Ibuprofen 50 mg per 1.25 mL',
  },
  {
    productId: 'childrens_suspension',
    minLbInclusive: 24,
    maxLbExclusive: 36,
    labelLbRange: '24–35 lb',
    doseMl: 5,
    doseMg: 100,
    productLabel: 'Children’s MOTRIN® Oral Suspension',
    concentrationNote: 'Ibuprofen 100 mg per 5 mL',
  },
  {
    productId: 'childrens_suspension',
    minLbInclusive: 36,
    maxLbExclusive: 48,
    labelLbRange: '36–47 lb',
    doseMl: 7.5,
    doseMg: 150,
    productLabel: 'Children’s MOTRIN® Oral Suspension',
    concentrationNote: 'Ibuprofen 100 mg per 5 mL',
  },
  {
    productId: 'childrens_suspension',
    minLbInclusive: 48,
    maxLbExclusive: 60,
    labelLbRange: '48–59 lb',
    doseMl: 10,
    doseMg: 200,
    productLabel: 'Children’s MOTRIN® Oral Suspension',
    concentrationNote: 'Ibuprofen 100 mg per 5 mL',
  },
  {
    productId: 'childrens_suspension',
    minLbInclusive: 60,
    maxLbExclusive: 72,
    labelLbRange: '60–71 lb',
    doseMl: 12.5,
    doseMg: 250,
    productLabel: 'Children’s MOTRIN® Oral Suspension',
    concentrationNote: 'Ibuprofen 100 mg per 5 mL',
  },
  {
    productId: 'childrens_suspension',
    minLbInclusive: 72,
    maxLbExclusive: 96,
    labelLbRange: '72–95 lb',
    doseMl: 15,
    doseMg: 300,
    productLabel: 'Children’s MOTRIN® Oral Suspension',
    concentrationNote: 'Ibuprofen 100 mg per 5 mL',
  },
];

export function findWeightBand(weightLb: number): WeightBand | null {
  return (
    WEIGHT_BANDS.find(
      (band) =>
        weightLb >= band.minLbInclusive && weightLb < band.maxLbExclusive,
    ) ?? null
  );
}

export function kgToLb(kg: number): number {
  return kg * LB_PER_KG;
}

export function lbToKg(lb: number): number {
  return lb / LB_PER_KG;
}
