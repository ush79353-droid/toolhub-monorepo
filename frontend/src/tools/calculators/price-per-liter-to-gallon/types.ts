import type { SupportedCurrency } from '@/tools/shared/currency';
import {
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_LIQUID_GALLON,
} from '../volume-conversion/types';

export type GallonSystem = 'us' | 'imperial';

export type PricePerVolumeSource = 'perLiter' | 'perGallon';

export interface PricePerLiterToGallonInput {
  source: PricePerVolumeSource;
  /** null while the active source field is blank or incomplete. */
  pricePerLiter: number | null;
  pricePerGallon: number | null;
  gallonSystem: GallonSystem;
  currency: SupportedCurrency;
}

export interface PricePerLiterToGallonResult {
  source: PricePerVolumeSource;
  pricePerLiter: number;
  pricePerGallon: number;
  gallonSystem: GallonSystem;
  currency: SupportedCurrency;
  litersPerGallon: number;
  explanation: string;
}

export type PricePerLiterToGallonFieldErrors = {
  pricePerLiter?: string;
  pricePerGallon?: string;
};

export const LITERS_PER_GALLON = {
  us: LITERS_PER_US_LIQUID_GALLON,
  imperial: LITERS_PER_IMPERIAL_GALLON,
} as const;

export const GALLON_SYSTEM_LABELS: Record<GallonSystem, string> = {
  us: 'US liquid gallon',
  imperial: 'Imperial gallon',
};

export const MAX_ABS_VALUE = 1e15;

export const DEFAULT_CURRENCY: SupportedCurrency = 'USD';
