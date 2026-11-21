import {
  applyPolicyFloor,
  calculateApproximateRealRate,
  calculateInflationGap,
  calculateOutputGap,
  calculateTaylorRuleRate,
  formatGdpAmount,
  formatPercent,
  formatPercentPoints,
  formatRate,
  toBaseUnits,
} from './calculation';
import type {
  TaylorRuleFieldErrors,
  TaylorRuleInput,
  TaylorRuleResult,
} from './types';

export interface TaylorRuleValidation {
  isValid: boolean;
  errors: TaylorRuleFieldErrors;
  result: TaylorRuleResult | null;
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
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateTaylorRuleInput(
  input: TaylorRuleInput
): TaylorRuleValidation {
  const errors: TaylorRuleFieldErrors = {};
  const mag = input.magnitude;

  const pi = parseNumber(input.currentInflation);
  const piStar = parseNumber(input.targetInflation);
  const y = parseNumber(input.actualGdp);
  const yStar = parseNumber(input.potentialGdp);
  const rStar = parseNumber(input.neutralRealRate);
  const aP = parseNumber(input.inflationCoefficient);
  const bP = parseNumber(input.outputCoefficient);
  const pe = parseNumber(input.expectedInflation);
  const floorP = parseNumber(input.policyFloor);

  if (pi.blank) errors.currentInflation = 'Enter the current inflation rate.';
  else if (pi.invalid || pi.value == null)
    errors.currentInflation = 'Enter a valid inflation rate.';

  if (piStar.blank) errors.targetInflation = 'Enter the target inflation rate.';
  else if (piStar.invalid || piStar.value == null)
    errors.targetInflation = 'Enter a valid target inflation rate.';

  if (y.blank) errors.actualGdp = 'Enter current (actual) GDP.';
  else if (y.invalid || y.value == null)
    errors.actualGdp = 'Enter a valid GDP amount.';
  else if (y.value <= 0) errors.actualGdp = 'Actual GDP must be greater than zero.';

  if (yStar.blank) errors.potentialGdp = 'Enter potential GDP.';
  else if (yStar.invalid || yStar.value == null)
    errors.potentialGdp = 'Enter a valid potential GDP.';
  else if (yStar.value <= 0)
    errors.potentialGdp = 'Potential GDP must be greater than zero.';

  if (rStar.blank)
    errors.neutralRealRate = 'Enter the neutral real interest rate.';
  else if (rStar.invalid || rStar.value == null)
    errors.neutralRealRate = 'Enter a valid neutral real interest rate.';

  let inflationCoefficient = 0.5;
  let outputCoefficient = 0.5;

  if (aP.blank) {
    inflationCoefficient = 0.5;
  } else if (aP.invalid || aP.value == null) {
    errors.inflationCoefficient = 'Enter a valid inflation response coefficient.';
  } else if (aP.value < 0) {
    errors.inflationCoefficient =
      'Use a nonnegative inflation coefficient in the standard interface (or clear for 0.5).';
  } else {
    inflationCoefficient = aP.value;
  }

  if (bP.blank) {
    outputCoefficient = 0.5;
  } else if (bP.invalid || bP.value == null) {
    errors.outputCoefficient = 'Enter a valid output-gap response coefficient.';
  } else if (bP.value < 0) {
    errors.outputCoefficient =
      'Use a nonnegative output coefficient in the standard interface (or clear for 0.5).';
  } else {
    outputCoefficient = bP.value;
  }

  let expectedInflation: number | null = null;
  if (!pe.blank) {
    if (pe.invalid || pe.value == null)
      errors.expectedInflation = 'Enter a valid expected inflation rate.';
    else expectedInflation = pe.value;
  }

  let policyFloor: number | null = null;
  if (!floorP.blank) {
    if (floorP.invalid || floorP.value == null)
      errors.policyFloor = 'Enter a valid policy-rate floor.';
    else policyFloor = floorP.value;
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const currentInflation = pi.value!;
  const targetInflation = piStar.value!;
  const neutralRealRate = rStar.value!;
  const actualGdpBase = toBaseUnits(y.value!, mag);
  const potentialGdpBase = toBaseUnits(yStar.value!, mag);

  const inflationGap = calculateInflationGap(currentInflation, targetInflation);
  const outputGap = calculateOutputGap(actualGdpBase, potentialGdpBase);
  if (inflationGap == null || outputGap == null) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate inflation or output gaps.' },
      result: null,
    };
  }

  const standardRate = calculateTaylorRuleRate(
    neutralRealRate,
    currentInflation,
    inflationGap,
    outputGap,
    0.5,
    0.5
  );
  const customRate = calculateTaylorRuleRate(
    neutralRealRate,
    currentInflation,
    inflationGap,
    outputGap,
    inflationCoefficient,
    outputCoefficient
  );
  if (standardRate == null || customRate == null) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate the Taylor rule rate.' },
      result: null,
    };
  }

  const approximateExAnteReal =
    expectedInflation != null
      ? calculateApproximateRealRate(customRate, expectedInflation)
      : null;
  const flooredCustomRate =
    policyFloor != null ? applyPolicyFloor(customRate, policyFloor) : null;

  const outputGapStatus: TaylorRuleResult['outputGapStatus'] =
    Math.abs(outputGap) < 1e-12
      ? 'zero'
      : outputGap > 0
        ? 'positive'
        : 'negative';

  const steps = [
    `Inflation gap = π − π* = ${formatPercent(currentInflation)} − ${formatPercent(targetInflation)} = ${formatPercentPoints(inflationGap)}.`,
    `Output gap = ((Y − Y*) / Y*) × 100 = ${formatPercent(outputGap)}.`,
    `Standard Taylor rule: i = r* + π + 0.5(π − π*) + 0.5y = ${formatRate(standardRate)}.`,
    inflationCoefficient === 0.5 && outputCoefficient === 0.5
      ? 'Custom coefficients match the standard 0.5 / 0.5 settings.'
      : `Custom Taylor rule: i = r* + π + ${inflationCoefficient}(π − π*) + ${outputCoefficient}y = ${formatRate(customRate)}.`,
  ];

  const interpretation = `Using the selected assumptions, the Taylor rule suggests a nominal policy interest rate of ${formatRate(customRate)}. ${
    inflationGap > 0
      ? 'Inflation above target'
      : inflationGap < 0
        ? 'Inflation below target'
        : 'Inflation at target'
  } and ${
    outputGapStatus === 'positive'
      ? 'output above potential'
      : outputGapStatus === 'negative'
        ? 'output below potential'
        : 'output at potential'
  } shape the recommended stance. The actual central bank policy rate can differ because authorities consider additional economic and financial conditions.`;

  const result: TaylorRuleResult = {
    currency: input.currency,
    magnitude: mag,
    currentInflation,
    targetInflation,
    inflationGap,
    actualGdpBase,
    potentialGdpBase,
    outputGap,
    neutralRealRate,
    inflationCoefficient,
    outputCoefficient,
    standardRate,
    customRate,
    rateDifference: customRate - standardRate,
    expectedInflation,
    approximateExAnteReal,
    policyFloor,
    flooredCustomRate,
    formattedInflationGap: formatPercentPoints(inflationGap),
    formattedOutputGap: formatPercent(outputGap),
    formattedActualGdp: formatGdpAmount(actualGdpBase, input.currency, mag),
    formattedPotentialGdp: formatGdpAmount(
      potentialGdpBase,
      input.currency,
      mag
    ),
    formattedNeutral: formatRate(neutralRealRate),
    formattedStandardRate: formatRate(standardRate),
    formattedCustomRate: formatRate(customRate),
    formattedDifference: formatPercentPoints(customRate - standardRate),
    formattedExAnte:
      approximateExAnteReal != null ? formatRate(approximateExAnteReal) : '—',
    formattedFloored:
      flooredCustomRate != null ? formatRate(flooredCustomRate) : '—',
    formulaBreakdown: `i = r* + π + a(π − π*) + b·y  (a=${inflationCoefficient}, b=${outputCoefficient})`,
    steps,
    interpretation,
    explanation:
      'The Taylor rule is an economic policy guideline, not an official Federal Reserve decision or a real-time prediction of interest rates. GDP currency selection is denomination only (no FX). Prefer real GDP for economically meaningful output gaps.',
    outputGapStatus,
  };

  return { isValid: true, errors: {}, result };
}
