import { formatCurrencyValue, getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import {
  GALLON_SYSTEM_LABELS,
  LITERS_PER_GALLON,
  type GallonSystem,
  type PricePerLiterToGallonInput,
  type PricePerLiterToGallonResult,
} from './types';

/** Readable price display without ugly trailing zeros (input sync). */
export function formatPrice(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';

  const abs = Math.abs(value);
  if (abs >= 1e15 || (abs > 0 && abs < 1e-8)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e')
      .replace(/e\+?/i, 'e');
  }

  let digits = 12;
  if (abs >= 1_000_000) digits = 6;
  else if (abs >= 1) digits = 10;
  else digits = 12;

  return String(Number(value.toFixed(digits)));
}

export function pricePerLiterToGallon(
  pricePerLiter: number,
  system: GallonSystem = 'us',
): number {
  return pricePerLiter * LITERS_PER_GALLON[system];
}

export function pricePerGallonToLiter(
  pricePerGallon: number,
  system: GallonSystem = 'us',
): number {
  return pricePerGallon / LITERS_PER_GALLON[system];
}

export function calculatePricePerLiterToGallon(
  input: PricePerLiterToGallonInput,
): PricePerLiterToGallonResult {
  const litersPerGallon = LITERS_PER_GALLON[input.gallonSystem];
  let pricePerLiter: number;
  let pricePerGallon: number;

  if (input.source === 'perLiter') {
    pricePerLiter = input.pricePerLiter!;
    pricePerGallon = pricePerLiterToGallon(pricePerLiter, input.gallonSystem);
  } else {
    pricePerGallon = input.pricePerGallon!;
    pricePerLiter = pricePerGallonToLiter(pricePerGallon, input.gallonSystem);
  }

  const explanation =
    input.source === 'perLiter'
      ? `${formatPrice(pricePerLiter)}/L × ${litersPerGallon} = ${formatPrice(pricePerGallon)}/${input.gallonSystem === 'us' ? 'US gal' : 'imp gal'}`
      : `${formatPrice(pricePerGallon)}/${input.gallonSystem === 'us' ? 'US gal' : 'imp gal'} ÷ ${litersPerGallon} = ${formatPrice(pricePerLiter)}/L`;

  return {
    source: input.source,
    pricePerLiter,
    pricePerGallon,
    gallonSystem: input.gallonSystem,
    currency: input.currency,
    litersPerGallon,
    explanation,
  };
}

export function formatMoneyDisplay(amount: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(amount, currency);
}

export function shareResultText(result: PricePerLiterToGallonResult): string {
  const symbol = getCurrencySymbol(result.currency);
  const gallonLabel = GALLON_SYSTEM_LABELS[result.gallonSystem];
  return [
    'Price Per Liter to Price Per Gallon Converter',
    'Omega Calculators',
    '',
    `${formatMoneyDisplay(result.pricePerLiter, result.currency)} per liter = ${formatMoneyDisplay(result.pricePerGallon, result.currency)} per ${gallonLabel}`,
    '',
    'Conversion factor:',
    `1 ${gallonLabel} = ${result.litersPerGallon} liters`,
    '',
    'Formula:',
    `Price per gallon = Price per liter × ${result.litersPerGallon}`,
    result.explanation,
    '',
    `Currency: ${result.currency} (${symbol}); denomination only, no FX`,
    '',
    '/tools/price-per-liter-to-price-per-gallon-converter',
  ].join('\n');
}
