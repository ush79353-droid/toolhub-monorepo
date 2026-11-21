import {
  POPULATION_UNIT_FACTOR,
  type PopulationUnit,
} from './types';

export function populationToPeople(amount: number, unit: PopulationUnit): number {
  return amount * POPULATION_UNIT_FACTOR[unit];
}

export function peopleToPopulationUnit(people: number, unit: PopulationUnit): number {
  return people / POPULATION_UNIT_FACTOR[unit];
}

/** Preserve underlying people count when switching display units. */
export function convertPopulationDisplay(
  amount: number,
  from: PopulationUnit,
  to: PopulationUnit
): number {
  if (from === to) return amount;
  return peopleToPopulationUnit(populationToPeople(amount, from), to);
}

export function formatNaturalRatePercent(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(rate);
}

export function formatPopulationInput(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  // Avoid scientific notation for typical labor-force scales.
  return new Intl.NumberFormat('en-US', {
    useGrouping: false,
    maximumFractionDigits: 12,
  }).format(amount);
}

/**
 * Natural rate (%) = (frictional + structural) / laborForce × 100.
 * All counts must already be in people.
 */
export function calculateNaturalUnemploymentRate(input: {
  frictionalPeople: number;
  structuralPeople: number;
  laborForcePeople: number;
}): number | null {
  const { frictionalPeople, structuralPeople, laborForcePeople } = input;
  if (![frictionalPeople, structuralPeople, laborForcePeople].every(Number.isFinite)) {
    return null;
  }
  if (frictionalPeople < 0 || structuralPeople < 0) return null;
  if (laborForcePeople <= 0) return null;
  if (frictionalPeople + structuralPeople > laborForcePeople) return null;

  const rate = ((frictionalPeople + structuralPeople) / laborForcePeople) * 100;
  if (!Number.isFinite(rate)) return null;
  return rate;
}
