import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateAbsolutePriceDifference,
  calculateAreaFromPrice,
  calculatePercentagePriceDifference,
  calculatePricePerArea,
  calculateTotalPrice,
  convertPricePerArea,
  formatArea,
  formatMoney,
  formatRate,
  pricePerAreaUnitLabel,
} from './calculation';
import type {
  PricePerSqftFieldErrors,
  PricePerSqftInput,
  PricePerSqftResult,
} from './types';

export interface PricePerSqftValidation {
  isValid: boolean;
  errors: PricePerSqftFieldErrors;
  result: PricePerSqftResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

function parseOptionalNonNeg(
  raw: string,
  label: string,
  errors: PricePerSqftFieldErrors,
  key: keyof PricePerSqftFieldErrors,
  requirePositive: boolean
): number | null {
  const parsed = parseNumber(raw);
  if (parsed.blank) return null;
  if (parsed.invalid || parsed.value === null) {
    errors[key] = `Enter a valid ${label}.`;
    return null;
  }
  if (parsed.value < 0) {
    errors[key] = `${label} cannot be negative.`;
    return null;
  }
  if (requirePositive && parsed.value <= 0) {
    errors[key] = `${label} must be greater than zero.`;
    return null;
  }
  return parsed.value;
}

export function validatePricePerSqftInput(
  input: PricePerSqftInput
): PricePerSqftValidation {
  const errors: PricePerSqftFieldErrors = {};
  const mode = input.calculationMode;

  let price: number | null = null;
  let area: number | null = null;
  let pricePerArea: number | null = null;

  if (mode === 'pricePerArea') {
    price = parseOptionalNonNeg(input.price, 'price or rent', errors, 'price', false);
    area = parseOptionalNonNeg(input.area, 'square footage', errors, 'area', true);
  } else if (mode === 'totalPrice') {
    area = parseOptionalNonNeg(input.area, 'square footage', errors, 'area', true);
    pricePerArea = parseOptionalNonNeg(
      input.pricePerArea,
      'price per area',
      errors,
      'pricePerArea',
      false
    );
  } else {
    price = parseOptionalNonNeg(input.price, 'price or rent', errors, 'price', false);
    pricePerArea = parseOptionalNonNeg(
      input.pricePerArea,
      'price per area',
      errors,
      'pricePerArea',
      true
    );
  }

  let secondPrice: number | null = null;
  let secondArea: number | null = null;
  let secondPricePerArea: number | null = null;

  if (input.compareSecondProperty) {
    secondPrice = parseOptionalNonNeg(
      input.secondPrice,
      'second-property price',
      errors,
      'secondPrice',
      false
    );
    secondArea = parseOptionalNonNeg(
      input.secondArea,
      'second-property area',
      errors,
      'secondArea',
      true
    );
    if (secondPrice !== null && secondArea !== null) {
      secondPricePerArea = calculatePricePerArea(secondPrice, secondArea);
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (mode === 'pricePerArea') {
    if (price === null || area === null) {
      return { isValid: false, errors, result: null };
    }
    pricePerArea = calculatePricePerArea(price, area);
  } else if (mode === 'totalPrice') {
    if (area === null || pricePerArea === null) {
      return { isValid: false, errors, result: null };
    }
    price = calculateTotalPrice(pricePerArea, area);
  } else {
    if (price === null || pricePerArea === null) {
      return { isValid: false, errors, result: null };
    }
    area = calculateAreaFromPrice(price, pricePerArea);
  }

  if (price === null || area === null || pricePerArea === null) {
    errors.form = 'Unable to complete the calculation.';
    return { isValid: false, errors, result: null };
  }

  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  const rentalPeriod =
    input.pricingContext === 'rent' ? input.rentalPeriod : null;

  let absoluteDifference: number | null = null;
  let percentageDifference: number | null = null;
  let cheaperLabel: string | null = null;

  if (
    input.compareSecondProperty &&
    secondPrice !== null &&
    secondArea !== null &&
    secondPricePerArea !== null
  ) {
    const secondInPrimaryUnit = convertPricePerArea(
      secondPricePerArea,
      input.secondAreaUnit,
      input.areaUnit
    );
    absoluteDifference = calculateAbsolutePriceDifference(
      secondInPrimaryUnit,
      pricePerArea
    );
    percentageDifference = calculatePercentagePriceDifference(
      secondInPrimaryUnit,
      pricePerArea
    );
    if (absoluteDifference !== null) {
      if (Math.abs(absoluteDifference) < 1e-9) {
        cheaperLabel = 'Both properties have the same price per area.';
      } else if (absoluteDifference > 0) {
        cheaperLabel = 'Property A has a lower price per area.';
      } else {
        cheaperLabel = 'Property B has a lower price per area.';
      }
    }
  }

  const result: PricePerSqftResult = {
    price,
    area,
    pricePerArea,
    areaUnit: input.areaUnit,
    pricingContext: input.pricingContext,
    rentalPeriod,
    currency,
    secondEnabled: input.compareSecondProperty,
    secondPrice: input.compareSecondProperty ? secondPrice : null,
    secondArea: input.compareSecondProperty ? secondArea : null,
    secondPricePerArea: input.compareSecondProperty ? secondPricePerArea : null,
    secondAreaUnit: input.compareSecondProperty ? input.secondAreaUnit : null,
    absoluteDifference,
    percentageDifference,
    cheaperLabel,
    formattedPrice: formatMoney(price, currency),
    formattedArea: formatArea(area),
    formattedPricePerArea: formatRate(pricePerArea),
    pricePerAreaUnitLabel: pricePerAreaUnitLabel(
      symbol,
      input.areaUnit,
      input.pricingContext,
      rentalPeriod
    ),
    formattedSecondPrice:
      secondPrice !== null ? formatMoney(secondPrice, currency) : null,
    formattedSecondArea: secondArea !== null ? formatArea(secondArea) : null,
    formattedSecondPricePerArea:
      secondPricePerArea !== null ? formatRate(secondPricePerArea) : null,
    secondPricePerAreaUnitLabel: input.compareSecondProperty
      ? pricePerAreaUnitLabel(
          symbol,
          input.secondAreaUnit,
          input.pricingContext,
          rentalPeriod
        )
      : null,
    formattedAbsoluteDifference:
      absoluteDifference !== null ? formatRate(absoluteDifference) : null,
    formattedPercentageDifference:
      percentageDifference !== null ? formatRate(percentageDifference) : null,
  };

  return { isValid: true, errors, result };
}
