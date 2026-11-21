import {
  calculateCobbDouglas,
  explainCobbDouglas,
  formatElasticity,
  formatOutput,
  formatReturnsToScaleLabel,
  interpretReturnsToScale,
} from './calculation';
import type {
  CobbDouglasFieldErrors,
  CobbDouglasInput,
  CobbDouglasResult,
} from './types';

export interface CobbDouglasValidation {
  isValid: boolean;
  errors: CobbDouglasFieldErrors;
  result: CobbDouglasResult | null;
}

function parseFinite(raw: string): {
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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateCobbDouglasInput(
  input: CobbDouglasInput
): CobbDouglasValidation {
  const errors: CobbDouglasFieldErrors = {};
  let hasError = false;
  const warnings: string[] = [];

  const a = parseFinite(input.totalFactorProductivity);
  if (a.blank) {
    errors.totalFactorProductivity = 'Enter total factor productivity.';
    hasError = true;
  } else if (a.invalid || a.value === null) {
    errors.totalFactorProductivity = 'Enter a valid productivity value.';
    hasError = true;
  } else if (a.value <= 0) {
    errors.totalFactorProductivity =
      'Total factor productivity must be greater than zero.';
    hasError = true;
  }

  const labor = parseFinite(input.labor);
  if (labor.blank) {
    errors.labor = 'Enter labor input.';
    hasError = true;
  } else if (labor.invalid || labor.value === null) {
    errors.labor = 'Enter a valid labor value.';
    hasError = true;
  } else if (labor.value < 0) {
    errors.labor = 'Labor cannot be negative.';
    hasError = true;
  }

  const alpha = parseFinite(input.laborElasticity);
  if (alpha.blank) {
    errors.laborElasticity = 'Enter output elasticity of labor.';
    hasError = true;
  } else if (alpha.invalid || alpha.value === null) {
    errors.laborElasticity = 'Enter a valid labor elasticity.';
    hasError = true;
  } else if (alpha.value <= 0) {
    errors.laborElasticity =
      'Labor elasticity must be greater than zero for the standard model.';
    hasError = true;
  } else if (alpha.value > 1) {
    warnings.push(
      'Labor elasticity α > 1 is a nonstandard production relationship; interpret carefully.'
    );
  }

  const capital = parseFinite(input.capital);
  if (capital.blank) {
    errors.capital = 'Enter capital input.';
    hasError = true;
  } else if (capital.invalid || capital.value === null) {
    errors.capital = 'Enter a valid capital value.';
    hasError = true;
  } else if (capital.value < 0) {
    errors.capital = 'Capital cannot be negative.';
    hasError = true;
  }

  const beta = parseFinite(input.capitalElasticity);
  if (beta.blank) {
    errors.capitalElasticity = 'Enter output elasticity of capital.';
    hasError = true;
  } else if (beta.invalid || beta.value === null) {
    errors.capitalElasticity = 'Enter a valid capital elasticity.';
    hasError = true;
  } else if (beta.value <= 0) {
    errors.capitalElasticity =
      'Capital elasticity must be greater than zero for the standard model.';
    hasError = true;
  } else if (beta.value > 1) {
    warnings.push(
      'Capital elasticity β > 1 is a nonstandard production relationship; interpret carefully.'
    );
  }

  if (
    hasError ||
    a.value === null ||
    labor.value === null ||
    alpha.value === null ||
    capital.value === null ||
    beta.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateCobbDouglas(
    a.value,
    labor.value,
    alpha.value,
    capital.value,
    beta.value
  );
  if (!math) {
    errors.form =
      'Unable to calculate production for the selected inputs (check for invalid powers or overflow).';
    return { isValid: false, errors, result: null };
  }

  const fmtMetric = (v: number | null) =>
    v == null ? null : formatOutput(v, 4);

  const result: CobbDouglasResult = {
    totalProduction: math.totalProduction,
    returnsToScaleSum: math.returnsToScaleSum,
    returnsToScaleType: math.returnsToScaleType,
    marginalProductOfLabor: math.marginalProductOfLabor,
    marginalProductOfCapital: math.marginalProductOfCapital,
    averageProductOfLabor: math.averageProductOfLabor,
    averageProductOfCapital: math.averageProductOfCapital,
    formattedTotalProduction: formatOutput(math.totalProduction),
    formattedReturnsToScaleSum: formatElasticity(math.returnsToScaleSum),
    formattedReturnsToScaleType: formatReturnsToScaleLabel(
      math.returnsToScaleType
    ),
    formattedMPL: fmtMetric(math.marginalProductOfLabor),
    formattedMPK: fmtMetric(math.marginalProductOfCapital),
    formattedAPL: fmtMetric(math.averageProductOfLabor),
    formattedAPK: fmtMetric(math.averageProductOfCapital),
    interpretation: interpretReturnsToScale(
      math.returnsToScaleType,
      math.returnsToScaleSum
    ),
    explanation: explainCobbDouglas(
      math.totalProduction,
      a.value,
      labor.value,
      capital.value
    ),
    warningMessage: warnings.length ? warnings.join(' ') : null,
    formulaBreakdown: [
      `Y = ${formatElasticity(a.value)} × ${formatElasticity(labor.value)}^${formatElasticity(alpha.value)} × ${formatElasticity(capital.value)}^${formatElasticity(beta.value)}`,
      `Y ≈ ${formatOutput(math.totalProduction)}`,
      `α + β = ${formatElasticity(math.returnsToScaleSum)} → ${formatReturnsToScaleLabel(math.returnsToScaleType)}`,
    ].join(' · '),
  };

  return { isValid: true, errors, result };
}
