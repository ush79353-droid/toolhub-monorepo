/**
 * Labor Force = Employed + Unemployed
 * Unemployment Rate = Unemployed / Labor Force × 100 (null if LF = 0)
 * LFPR = Labor Force / Working-Age Population × 100
 * Not in LF = Working-Age − Labor Force
 * EPR = Employed / Working-Age × 100
 */

export function calculateLaborForce(
  employedPopulation: number,
  unemployedPopulation: number
): number {
  assertNonNegativeFinite(employedPopulation, 'Employed population');
  assertNonNegativeFinite(unemployedPopulation, 'Unemployed population');
  return employedPopulation + unemployedPopulation;
}

export function calculateUnemploymentRate(
  unemployedPopulation: number,
  laborForce: number
): number | null {
  assertNonNegativeFinite(unemployedPopulation, 'Unemployed population');
  assertNonNegativeFinite(laborForce, 'Labor force');
  if (laborForce === 0) return null;
  return (unemployedPopulation / laborForce) * 100;
}

export function calculateLaborForceParticipationRate(
  laborForce: number,
  workingAgePopulation: number
): number {
  assertNonNegativeFinite(laborForce, 'Labor force');
  if (!Number.isFinite(workingAgePopulation) || !(workingAgePopulation > 0)) {
    throw new Error('Working-age population must be greater than zero.');
  }
  if (laborForce > workingAgePopulation) {
    throw new Error(
      'Labor force cannot exceed the working-age population for the same coverage and period.'
    );
  }
  return (laborForce / workingAgePopulation) * 100;
}

export function calculateNotInLaborForce(
  workingAgePopulation: number,
  laborForce: number
): number {
  assertNonNegativeFinite(workingAgePopulation, 'Working-age population');
  assertNonNegativeFinite(laborForce, 'Labor force');
  if (laborForce > workingAgePopulation) {
    throw new Error(
      'Labor force cannot exceed the working-age population for the same coverage and period.'
    );
  }
  return workingAgePopulation - laborForce;
}

export function calculateEmploymentPopulationRatio(
  employedPopulation: number,
  workingAgePopulation: number
): number {
  assertNonNegativeFinite(employedPopulation, 'Employed population');
  if (!Number.isFinite(workingAgePopulation) || !(workingAgePopulation > 0)) {
    throw new Error('Working-age population must be greater than zero.');
  }
  if (employedPopulation > workingAgePopulation) {
    throw new Error(
      'Employed population cannot exceed the working-age population.'
    );
  }
  return (employedPopulation / workingAgePopulation) * 100;
}

function assertNonNegativeFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a finite number ≥ 0.`);
  }
}

export function formatPeople(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, digits = 2): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function interpretLfpr(lfpr: number, outsideShare: number): string {
  return `A labor force participation rate of ${formatPercent(lfpr)} means that approximately ${Math.round(lfpr)} out of every 100 people in the specified population are either employed or unemployed under the applicable statistical definition. The remaining ${formatPercent(outsideShare)} are classified as outside the labor force (for example students, retirees, caregivers, or others who are not employed and do not meet unemployment criteria) — not as unemployed.`;
}
