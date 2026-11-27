import { calculateAlcoholUnits } from './calculation';
import type {
  AlcoholUnitFieldErrors,
  AlcoholUnitInput,
  AlcoholUnitResult,
} from './types';

export interface AlcoholUnitValidation {
  isValid: boolean;
  errors: AlcoholUnitFieldErrors;
  result: AlcoholUnitResult | null;
}

function badCount(v: number | null): boolean {
  return v != null && (!Number.isFinite(v) || v < 0);
}

export function validateAlcoholUnitInput(
  input: AlcoholUnitInput,
): AlcoholUnitValidation {
  const errors: AlcoholUnitFieldErrors = {};

  const countFields: (keyof AlcoholUnitFieldErrors)[] = [
    'lowBeerCount',
    'standardBeerCount',
    'strongBeerCount',
    'wineStandardCount',
    'champagneCount',
    'alcopopCount',
    'spiritCount',
    'margaritaCount',
    'mojitoCount',
    'martiniCount',
    'rumCokeCount',
    'vodkaTonicCount',
  ];

  const countValues: Record<string, number | null> = {
    lowBeerCount: input.lowBeerCount,
    standardBeerCount: input.standardBeerCount,
    strongBeerCount: input.strongBeerCount,
    wineStandardCount: input.wineStandardCount,
    champagneCount: input.champagneCount,
    alcopopCount: input.alcopopCount,
    spiritCount: input.spiritCount,
    margaritaCount: input.margaritaCount,
    mojitoCount: input.mojitoCount,
    martiniCount: input.martiniCount,
    rumCokeCount: input.rumCokeCount,
    vodkaTonicCount: input.vodkaTonicCount,
  };

  for (const key of countFields) {
    if (badCount(countValues[key] ?? null)) {
      errors[key] = 'Enter 0 or more.';
    }
  }

  if (input.showMoreSizes) {
    if (badCount(input.wineSmallCount)) {
      errors.wineSmallCount = 'Enter 0 or more.';
    }
    if (badCount(input.wineLargeCount)) {
      errors.wineLargeCount = 'Enter 0 or more.';
    }
  }

  if (input.customOpen) {
    if (badCount(input.customCount)) {
      errors.customCount = 'Enter 0 or more.';
    }
    const usingCustom =
      (input.customCount ?? 0) > 0 ||
      input.customVolumeMl != null ||
      input.customAbvPercent != null;
    if (usingCustom && (input.customCount ?? 0) > 0) {
      if (
        input.customVolumeMl == null ||
        !Number.isFinite(input.customVolumeMl) ||
        input.customVolumeMl <= 0
      ) {
        errors.customVolumeMl = 'Enter volume in ml greater than 0.';
      }
      if (
        input.customAbvPercent == null ||
        !Number.isFinite(input.customAbvPercent) ||
        input.customAbvPercent <= 0 ||
        input.customAbvPercent > 100
      ) {
        errors.customAbvPercent = 'Enter ABV% between 0 and 100.';
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: true,
    errors: {},
    result: calculateAlcoholUnits(input),
  };
}
