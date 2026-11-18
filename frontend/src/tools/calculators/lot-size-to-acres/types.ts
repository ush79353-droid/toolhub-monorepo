import type { SupportedCurrency } from '@/tools/shared/currency';

/** Which two fields drive the third. */
export type LotSizeSource = 'dimensions' | 'solveLength' | 'solveWidth';

export type LengthUnit = 'mm' | 'cm' | 'm' | 'km' | 'in' | 'ft' | 'yd' | 'mi';

export type AreaUnit =
  | 'mm2'
  | 'cm2'
  | 'm2'
  | 'km2'
  | 'in2'
  | 'ft2'
  | 'yd2'
  | 'mi2'
  | 'ac'
  | 'ha';

export interface LotSizeToAcresInput {
  source: LotSizeSource;
  width: number | null;
  length: number | null;
  area: number | null;
  widthUnit: LengthUnit;
  lengthUnit: LengthUnit;
  areaUnit: AreaUnit;
  pricePerUnit: number | null;
  priceAreaUnit: AreaUnit;
  currency: SupportedCurrency;
}

export interface LotSizeToAcresResult {
  source: LotSizeSource;
  currency: SupportedCurrency;
  width: number;
  length: number;
  area: number;
  widthUnit: LengthUnit;
  lengthUnit: LengthUnit;
  areaUnit: AreaUnit;
  areaSquareMeters: number;
  acres: number;
  pricePerUnit: number | null;
  priceAreaUnit: AreaUnit;
  totalPrice: number | null;
  explanation: string;
}

export type LotSizeToAcresFieldErrors = {
  width?: string;
  length?: string;
  area?: string;
  pricePerUnit?: string;
  currency?: string;
};

export const METERS_PER_LENGTH_UNIT: Record<LengthUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

export const SQUARE_METERS_PER_AREA_UNIT: Record<AreaUnit, number> = {
  mm2: 1e-6,
  cm2: 1e-4,
  m2: 1,
  km2: 1_000_000,
  in2: 0.00064516,
  ft2: 0.09290304,
  yd2: 0.83612736,
  mi2: 2_589_988.110336,
  ac: 4046.8564224,
  ha: 10_000,
};

export const SQ_METERS_PER_ACRE = 4046.8564224;
export const SQ_FEET_PER_ACRE = 43_560;
export const SQ_YARDS_PER_ACRE = 4_840;

export const LENGTH_UNIT_OPTIONS: readonly { value: LengthUnit; label: string }[] = [
  { value: 'mm', label: 'mm' },
  { value: 'cm', label: 'cm' },
  { value: 'm', label: 'm' },
  { value: 'km', label: 'km' },
  { value: 'in', label: 'in' },
  { value: 'ft', label: 'ft' },
  { value: 'yd', label: 'yd' },
  { value: 'mi', label: 'mi' },
] as const;

export const AREA_UNIT_OPTIONS: readonly { value: AreaUnit; label: string }[] = [
  { value: 'mm2', label: 'mm²' },
  { value: 'cm2', label: 'cm²' },
  { value: 'm2', label: 'm²' },
  { value: 'km2', label: 'km²' },
  { value: 'in2', label: 'in²' },
  { value: 'ft2', label: 'ft²' },
  { value: 'yd2', label: 'yd²' },
  { value: 'mi2', label: 'mi²' },
  { value: 'ac', label: 'ac' },
  { value: 'ha', label: 'ha' },
] as const;

export const AREA_UNIT_LABEL: Record<AreaUnit, string> = {
  mm2: 'mm²',
  cm2: 'cm²',
  m2: 'm²',
  km2: 'km²',
  in2: 'in²',
  ft2: 'ft²',
  yd2: 'yd²',
  mi2: 'mi²',
  ac: 'ac',
  ha: 'ha',
};

export const MAX_DIMENSION = 1e12;
export const MAX_AREA = 1e18;
export const MAX_PRICE = 1e15;
export const RESULT_CAP = 1e21;

/** Demo: 150 yd × 175 yd ≈ 5.42355 ac. */
export const DEFAULT_LOT_SIZE_TO_ACRES_INPUT: LotSizeToAcresInput = {
  source: 'dimensions',
  width: 150,
  length: 175,
  area: null,
  widthUnit: 'yd',
  lengthUnit: 'yd',
  areaUnit: 'ac',
  pricePerUnit: null,
  priceAreaUnit: 'ac',
  currency: 'USD',
};
