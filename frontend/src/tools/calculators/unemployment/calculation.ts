import {
  POPULATION_UNIT_FACTOR,
  type PopulationUnit,
  type UnemploymentResult,
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

export function formatPopulationInput(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('en-US', {
    useGrouping: false,
    maximumFractionDigits: 12,
  }).format(amount);
}

export function formatRatePercent(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  }).format(rate);
}

export function formatPeopleCount(people: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(people);
}

/**
 * Unemployment rate (%) = unemployed / laborForce × 100.
 * Returns null when labor force is zero (undefined rate) or inputs are invalid.
 */
export function calculateUnemploymentRate(input: {
  unemployedPeople: number;
  laborForcePeople: number;
}): number | null {
  const { unemployedPeople, laborForcePeople } = input;
  if (![unemployedPeople, laborForcePeople].every(Number.isFinite)) return null;
  if (unemployedPeople < 0 || laborForcePeople < 0) return null;
  if (laborForcePeople === 0) return null;
  if (unemployedPeople > laborForcePeople) return null;

  const rate = (unemployedPeople / laborForcePeople) * 100;
  return Number.isFinite(rate) ? rate : null;
}

/**
 * Labor force participation rate (%) = laborForce / workingAge × 100.
 */
export function calculateParticipationRate(input: {
  laborForcePeople: number;
  workingAgePeople: number;
}): number | null {
  const { laborForcePeople, workingAgePeople } = input;
  if (![laborForcePeople, workingAgePeople].every(Number.isFinite)) return null;
  if (laborForcePeople < 0 || workingAgePeople <= 0) return null;
  if (laborForcePeople > workingAgePeople) return null;

  const rate = (laborForcePeople / workingAgePeople) * 100;
  return Number.isFinite(rate) ? rate : null;
}

export function interpretUnemployment(input: {
  unemploymentRatePercent: number | null;
  laborForcePeople: number;
  unemployedPeople: number;
}): string {
  const { unemploymentRatePercent, laborForcePeople, unemployedPeople } = input;
  if (laborForcePeople === 0) {
    return 'Unemployment rate is undefined when the labor force is zero (division by zero).';
  }
  if (unemploymentRatePercent === null) {
    return 'Enter consistent employed, unemployed, and labor-force counts to calculate the rate.';
  }
  if (unemployedPeople === 0) {
    return `Unemployment rate is ${formatRatePercent(unemploymentRatePercent)}%; no unemployed people in a positive labor force. Unemployed means people without a job who are actively seeking and available for work.`;
  }
  return `Unemployment rate is ${formatRatePercent(unemploymentRatePercent)}% of the labor force. Unemployed means people without a job who are actively seeking and available for work under the relevant statistical definition; not everyone without employment.`;
}

export function toUnemploymentResult(input: {
  employedPeople: number;
  unemployedPeople: number;
  laborForcePeople: number;
  workingAgePeople: number | null;
}): UnemploymentResult {
  const unemploymentRatePercent = calculateUnemploymentRate({
    unemployedPeople: input.unemployedPeople,
    laborForcePeople: input.laborForcePeople,
  });

  const participationRatePercent =
    input.workingAgePeople === null
      ? null
      : calculateParticipationRate({
          laborForcePeople: input.laborForcePeople,
          workingAgePeople: input.workingAgePeople,
        });

  return {
    employedPeople: input.employedPeople,
    unemployedPeople: input.unemployedPeople,
    laborForcePeople: input.laborForcePeople,
    unemploymentRatePercent,
    formattedUnemploymentRate:
      unemploymentRatePercent === null ? '' : formatRatePercent(unemploymentRatePercent),
    workingAgePeople: input.workingAgePeople,
    participationRatePercent,
    formattedParticipationRate:
      participationRatePercent === null ? '' : formatRatePercent(participationRatePercent),
    interpretation: interpretUnemployment({
      unemploymentRatePercent,
      laborForcePeople: input.laborForcePeople,
      unemployedPeople: input.unemployedPeople,
    }),
  };
}

export function shareResultText(
  result: UnemploymentResult,
  path = '/tools/unemployment-calculator-unemployment-rate'
): string {
  const lines = [
    'Unemployment Calculator (Unemployment Rate) | Omega Calculators',
    '',
    `Employed: ${formatPeopleCount(result.employedPeople)} people`,
    `Unemployed: ${formatPeopleCount(result.unemployedPeople)} people`,
    `Labor force: ${formatPeopleCount(result.laborForcePeople)} people`,
    result.unemploymentRatePercent === null
      ? 'Unemployment rate: undefined (labor force is zero)'
      : `Unemployment rate: ${result.formattedUnemploymentRate}%`,
  ];

  if (result.workingAgePeople !== null) {
    lines.push(`Working-age population: ${formatPeopleCount(result.workingAgePeople)} people`);
  }
  if (result.participationRatePercent !== null) {
    lines.push(`Labor force participation rate: ${result.formattedParticipationRate}%`);
  }

  lines.push('', result.interpretation, path);
  return lines.join('\n');
}
