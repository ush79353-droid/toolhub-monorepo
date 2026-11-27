/**
 * Pure alcohol-unit math (ADR-018). No React / Mongo / HTTP.
 *
 * UK units (NHS): volume_ml × ABV% / 1000
 * Ethanol grams from NHS unit definition: UK_units × 8 g
 * Country display units: ethanol_grams / country_grams_per_standard
 */

import { DISCLAIMER, SOURCE_LABEL } from './content';
import type {
  AlcoholUnitInput,
  AlcoholUnitResult,
  BeerSizeId,
  CountryId,
} from './types';
import {
  ALCOPOP_ML,
  BEER_SIZE_OPTIONS,
  CHAMPAGNE_ML,
  COCKTAIL_SERVINGS,
  COUNTRY_OPTIONS,
  PRESET_ABV,
  SPIRIT_ML,
  WINE_VOLUMES,
} from './types';

/** NHS / Omni UK alcohol unit. */
export function ukUnitsFromDrink(
  volumeMl: number,
  abvPercent: number,
  count: number,
): number {
  return (volumeMl * abvPercent * count) / 1000;
}

export function beerVolumeMl(size: BeerSizeId): number {
  const row = BEER_SIZE_OPTIONS.find((s) => s.id === size);
  return row?.volumeMl ?? 0;
}

export function countryMeta(id: CountryId) {
  return COUNTRY_OPTIONS.find((c) => c.id === id) ?? COUNTRY_OPTIONS[0];
}

export function roundUnits(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateAlcoholUnits(
  input: AlcoholUnitInput,
): AlcoholUnitResult {
  let uk = 0;

  const low = input.lowBeerCount ?? 0;
  const std = input.standardBeerCount ?? 0;
  const strong = input.strongBeerCount ?? 0;
  uk += ukUnitsFromDrink(
    beerVolumeMl(input.lowBeerSize),
    PRESET_ABV.lowBeer,
    low,
  );
  uk += ukUnitsFromDrink(
    beerVolumeMl(input.standardBeerSize),
    PRESET_ABV.standardBeer,
    std,
  );
  uk += ukUnitsFromDrink(
    beerVolumeMl(input.strongBeerSize),
    PRESET_ABV.strongBeer,
    strong,
  );

  uk += ukUnitsFromDrink(
    WINE_VOLUMES.standard,
    PRESET_ABV.wine,
    input.wineStandardCount ?? 0,
  );
  if (input.showMoreSizes) {
    uk += ukUnitsFromDrink(
      WINE_VOLUMES.small,
      PRESET_ABV.wine,
      input.wineSmallCount ?? 0,
    );
    uk += ukUnitsFromDrink(
      WINE_VOLUMES.large,
      PRESET_ABV.wine,
      input.wineLargeCount ?? 0,
    );
  }

  uk += ukUnitsFromDrink(
    CHAMPAGNE_ML,
    PRESET_ABV.champagne,
    input.champagneCount ?? 0,
  );
  uk += ukUnitsFromDrink(
    ALCOPOP_ML,
    PRESET_ABV.alcopop,
    input.alcopopCount ?? 0,
  );
  uk += ukUnitsFromDrink(
    SPIRIT_ML,
    PRESET_ABV.spirit,
    input.spiritCount ?? 0,
  );

  if (input.customOpen) {
    const vol = input.customVolumeMl ?? 0;
    const abv = input.customAbvPercent ?? 0;
    const n = input.customCount ?? 0;
    if (vol > 0 && abv > 0 && n > 0) {
      uk += ukUnitsFromDrink(vol, abv, n);
    }
  }

  for (const c of COCKTAIL_SERVINGS) {
    const n = input[c.id] ?? 0;
    uk += ukUnitsFromDrink(c.volumeMl, c.abvPercent, n);
  }

  const ukRounded = roundUnits(uk);
  const ethanolGrams = roundUnits(ukRounded * 8);
  const meta = countryMeta(input.country);
  const displayUnits =
    input.country === 'uk'
      ? ukRounded
      : roundUnits(ethanolGrams / meta.grams);

  const unitLabel =
    input.country === 'uk' ? 'UK alcohol units' : 'standard drinks';

  return {
    ukUnits: ukRounded,
    ethanolGrams,
    displayUnits,
    formattedDisplay: String(displayUnits),
    unitLabel,
    countryLabel: meta.label,
    gramsPerStandard: meta.grams,
    explanation:
      input.country === 'uk'
        ? `Sum of servings using NHS UK units = volume (ml) × ABV% ÷ 1000. One UK unit ≈ 10 ml / 8 g pure ethanol.`
        : `UK units (${ukRounded}) × 8 g ÷ ${meta.grams} g = ${displayUnits} ${meta.label} standard drink(s). Educational conversion only — not BAC or fitness-to-drive advice.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
