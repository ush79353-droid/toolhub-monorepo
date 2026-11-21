import {
  calculateEmploymentPopulationRatio,
  calculateLaborForce,
  calculateLaborForceParticipationRate,
  calculateNotInLaborForce,
  calculateUnemploymentRate,
  formatPeople,
  formatPercent,
  interpretLfpr,
} from './calculation';
import {
  WORKING_AGE_DEFINITIONS,
  type LfprFieldErrors,
  type LfprInput,
  type LfprResult,
} from './types';

export interface LfprValidation {
  isValid: boolean;
  errors: LfprFieldErrors;
  result: LfprResult | null;
}

function parsePopulation(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
  negative: boolean;
  fractional: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') {
    return {
      value: null,
      blank: true,
      invalid: false,
      negative: false,
      fractional: false,
    };
  }
  if (/infinity|nan/i.test(cleaned)) {
    return {
      value: null,
      blank: false,
      invalid: true,
      negative: false,
      fractional: false,
    };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return {
      value: null,
      blank: false,
      invalid: true,
      negative: false,
      fractional: false,
    };
  }
  if (value < 0) {
    return {
      value: null,
      blank: false,
      invalid: false,
      negative: true,
      fractional: false,
    };
  }
  if (!Number.isInteger(value)) {
    return {
      value: null,
      blank: false,
      invalid: false,
      negative: false,
      fractional: true,
    };
  }
  return {
    value,
    blank: false,
    invalid: false,
    negative: false,
    fractional: false,
  };
}

function populationError(
  parsed: ReturnType<typeof parsePopulation>,
  label: string,
  requirePositive = false
): string | undefined {
  if (parsed.blank) return `Enter ${label}.`;
  if (parsed.invalid) return `Enter a valid ${label}.`;
  if (parsed.negative) return `${label} cannot be negative.`;
  if (parsed.fractional)
    return `${label} should be a whole number of people.`;
  if (requirePositive && parsed.value === 0)
    return `${label} must be greater than zero.`;
  return undefined;
}

export function validateLfprInput(input: LfprInput): LfprValidation {
  const errors: LfprFieldErrors = {};

  const employed = parsePopulation(input.employedPopulation);
  const unemployed = parsePopulation(input.unemployedPopulation);
  const workingAge = parsePopulation(input.workingAgePopulation);

  const eErr = populationError(employed, 'employed population');
  const uErr = populationError(unemployed, 'unemployed population');
  const wErr = populationError(workingAge, 'working-age population', true);

  if (eErr) errors.employedPopulation = eErr;
  if (uErr) errors.unemployedPopulation = uErr;
  if (wErr) errors.workingAgePopulation = wErr;

  if (errors.employedPopulation || errors.unemployedPopulation || errors.workingAgePopulation) {
    return { isValid: false, errors, result: null };
  }

  let laborForce: number;
  let unemploymentRate: number | null;
  let lfpr: number;
  let notInLaborForce: number;
  let epr: number;

  try {
    laborForce = calculateLaborForce(employed.value!, unemployed.value!);
    unemploymentRate = calculateUnemploymentRate(
      unemployed.value!,
      laborForce
    );
    lfpr = calculateLaborForceParticipationRate(
      laborForce,
      workingAge.value!
    );
    notInLaborForce = calculateNotInLaborForce(workingAge.value!, laborForce);
    epr = calculateEmploymentPopulationRatio(
      employed.value!,
      workingAge.value!
    );
  } catch (e) {
    errors.form =
      e instanceof Error ? e.message : 'Unable to calculate LFPR.';
    if (
      e instanceof Error &&
      e.message.includes('Labor force cannot exceed')
    ) {
      errors.workingAgePopulation = e.message;
    }
    return { isValid: false, errors, result: null };
  }

  const outsideShare = 100 - lfpr;
  const defLabel =
    WORKING_AGE_DEFINITIONS.find((d) => d.id === input.workingAgeDefinition)
      ?.label ?? 'Selected population coverage';

  const steps = [
    `Identify employed population = ${formatPeople(employed.value!)}.`,
    `Identify unemployed population = ${formatPeople(unemployed.value!)}.`,
    `Calculate labor force = ${formatPeople(employed.value!)} + ${formatPeople(unemployed.value!)} = ${formatPeople(laborForce)}.`,
    `Identify working-age population = ${formatPeople(workingAge.value!)} (${defLabel}).`,
    `Apply LFPR = Labor Force / Working-Age Population × 100.`,
    `Substitute: ${formatPeople(laborForce)} / ${formatPeople(workingAge.value!)} × 100 = ${formatPercent(lfpr)}.`,
    unemploymentRate == null
      ? 'Unemployment rate is unavailable because the labor force is zero.'
      : `Unemployment rate = ${formatPeople(unemployed.value!)} / ${formatPeople(laborForce)} × 100 = ${formatPercent(unemploymentRate)}.`,
  ];

  const result: LfprResult = {
    employedPopulation: employed.value!,
    unemployedPopulation: unemployed.value!,
    workingAgePopulation: workingAge.value!,
    laborForce,
    unemploymentRate,
    laborForceParticipationRate: lfpr,
    notInLaborForce,
    employmentPopulationRatio: epr,
    outsideLaborForceShare: outsideShare,
    workingAgeDefinitionLabel: defLabel,
    formattedEmployed: formatPeople(employed.value!),
    formattedUnemployed: formatPeople(unemployed.value!),
    formattedWorkingAge: formatPeople(workingAge.value!),
    formattedLaborForce: formatPeople(laborForce),
    formattedUnemploymentRate:
      unemploymentRate == null ? 'Unavailable' : formatPercent(unemploymentRate),
    formattedLfpr: formatPercent(lfpr),
    formattedNotInLaborForce: formatPeople(notInLaborForce),
    formattedEpr: formatPercent(epr),
    formattedOutsideShare: formatPercent(outsideShare),
    interpretation: interpretLfpr(lfpr, outsideShare),
    explanation:
      'Unemployment rate uses the labor force as denominator. LFPR and employment-to-population ratio use the selected working-age / coverage population. Outside the labor force ≠ unemployed.',
    formulaBreakdown: `LFPR = ${formatPeople(laborForce)} / ${formatPeople(workingAge.value!)} × 100 = ${formatPercent(lfpr)}`,
    steps,
  };

  return { isValid: true, errors, result };
}
