/**
 * GDP per Capita = GDP / Population
 * GDP = GDPpc × Population
 * Population = GDP / GDPpc
 */
import {
  GDP_MAGNITUDE_OPTIONS,
  POPULATION_MAGNITUDE_OPTIONS,
  type GdpMagnitude,
  type GdpMeasureType,
  type PopulationMagnitude,
} from './types';

export function gdpMagnitudeFactor(magnitude: GdpMagnitude): number {
  return GDP_MAGNITUDE_OPTIONS.find((o) => o.id === magnitude)?.factor ?? 1;
}

export function populationMagnitudeFactor(
  magnitude: PopulationMagnitude
): number {
  return (
    POPULATION_MAGNITUDE_OPTIONS.find((o) => o.id === magnitude)?.factor ?? 1
  );
}

export function toGdpBase(amount: number, magnitude: GdpMagnitude): number {
  return amount * gdpMagnitudeFactor(magnitude);
}

export function toPopulationBase(
  amount: number,
  magnitude: PopulationMagnitude
): number {
  return amount * populationMagnitudeFactor(magnitude);
}

export function calculateGDPPerCapita(
  gdp: number,
  population: number
): number {
  if (!Number.isFinite(gdp) || !Number.isFinite(population)) {
    throw new Error('Please enter valid numerical values.');
  }
  if (gdp <= 0) {
    throw new Error('GDP must be greater than zero.');
  }
  if (population <= 0) {
    throw new Error('Population must be greater than zero.');
  }
  return gdp / population;
}

export function calculateGDP(
  gdpPerCapita: number,
  population: number
): number {
  if (!Number.isFinite(gdpPerCapita) || !Number.isFinite(population)) {
    throw new Error('Please enter valid numerical values.');
  }
  if (gdpPerCapita <= 0) {
    throw new Error('GDP per capita must be greater than zero.');
  }
  if (population <= 0) {
    throw new Error('Population must be greater than zero.');
  }
  return gdpPerCapita * population;
}

export function calculatePopulation(
  gdp: number,
  gdpPerCapita: number
): number {
  if (!Number.isFinite(gdp) || !Number.isFinite(gdpPerCapita)) {
    throw new Error('Please enter valid numerical values.');
  }
  if (gdp <= 0) {
    throw new Error('GDP must be greater than zero.');
  }
  if (gdpPerCapita <= 0) {
    throw new Error('GDP per capita must be greater than zero.');
  }
  return gdp / gdpPerCapita;
}

export function formatMoneyPerPerson(
  value: number,
  currencyCode: string
): string {
  const n = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value);
  return `${currencyCode} ${n} per person`;
}

export function formatGdpAmount(
  baseUnits: number,
  currencyCode: string,
  preferredMagnitude: GdpMagnitude
): string {
  const n = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(baseUnits / gdpMagnitudeFactor(preferredMagnitude));
  const mag =
    GDP_MAGNITUDE_OPTIONS.find((o) => o.id === preferredMagnitude)?.label ??
    'Units';
  return `${currencyCode} ${n} ${mag.toLowerCase()}`;
}

export function formatPopulation(
  basePeople: number,
  preferredMagnitude: PopulationMagnitude
): string {
  const n = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(basePeople / populationMagnitudeFactor(preferredMagnitude));
  const mag =
    POPULATION_MAGNITUDE_OPTIONS.find((o) => o.id === preferredMagnitude)
      ?.label ?? 'People';
  return `${n} ${mag.toLowerCase()}`;
}

export function displayFromGdpBase(
  base: number,
  mag: GdpMagnitude
): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(base / gdpMagnitudeFactor(mag));
}

export function displayFromPopulationBase(
  base: number,
  mag: PopulationMagnitude
): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(base / populationMagnitudeFactor(mag));
}

export function measureLabel(measure: GdpMeasureType): string {
  if (measure === 'real') return 'Real GDP per Capita';
  if (measure === 'nominal') return 'Nominal GDP per Capita';
  return 'PPP GDP per Capita';
}

export function measureNote(measure: GdpMeasureType): string {
  if (measure === 'real') {
    return 'Figures should already be inflation-adjusted (real) GDP for this label.';
  }
  if (measure === 'nominal') {
    return 'Figures should already be current-price (nominal) GDP for this label.';
  }
  return 'Figures should already be PPP-adjusted GDP (often international dollars) for this label. Switching the selector does not convert data.';
}
