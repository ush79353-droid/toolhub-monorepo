import {
  calculateGDPGrowthGap,
  calculateGrowthGapFromUnemploymentChange,
  calculateOutputGap,
  calculateRequiredGDPGrowth,
  calculateUnemploymentChange,
  calculateUnemploymentGap,
  formatCoefficient,
  formatPercent,
  formatPercentagePoints,
  generateGrowthChart,
  generateOutputGapChart,
  interpretOutputGap,
  interpretUnemploymentChange,
  modeLabel,
} from './calculation';
import type {
  OkunsLawFieldErrors,
  OkunsLawInput,
  OkunsLawResult,
} from './types';

export interface OkunsLawValidation {
  isValid: boolean;
  errors: OkunsLawFieldErrors;
  result: OkunsLawResult | null;
}

function parseNum(
  raw: string,
  opts?: { min?: number; max?: number; allowNegative?: boolean }
): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
  outOfRange: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '').replace(/%$/, '');
  if (cleaned === '') {
    return { value: null, blank: true, invalid: false, outOfRange: false };
  }
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true, outOfRange: false };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true, outOfRange: false };
  }
  if (opts?.allowNegative === false && value < 0) {
    return { value: null, blank: false, invalid: false, outOfRange: true };
  }
  if (opts?.min != null && value < opts.min) {
    return { value: null, blank: false, invalid: false, outOfRange: true };
  }
  if (opts?.max != null && value > opts.max) {
    return { value: null, blank: false, invalid: false, outOfRange: true };
  }
  return { value, blank: false, invalid: false, outOfRange: false };
}

function rateErr(
  p: ReturnType<typeof parseNum>,
  label: string
): string | undefined {
  if (p.blank) return `Enter ${label}.`;
  if (p.invalid) return `Enter a valid ${label}.`;
  if (p.outOfRange) return `${label} must be between 0% and 100%.`;
  return undefined;
}

function emptyResultBase(input: OkunsLawInput): Omit<
  OkunsLawResult,
  | 'interpretation'
  | 'explanation'
  | 'formulaBreakdown'
  | 'steps'
  | 'chartPoints'
  | 'highlight'
  | 'chartKind'
> {
  return {
    mode: input.mode,
    modeLabel: modeLabel(input.mode),
    unemploymentRate: null,
    naturalUnemploymentRate: null,
    unemploymentGap: null,
    outputGapCoefficient: null,
    outputGap: null,
    actualGDPGrowthRate: null,
    trendGDPGrowthRate: null,
    gdpGrowthGap: null,
    growthCoefficient: null,
    unemploymentChange: null,
    requiredGDPGrowth: null,
    formattedUnemploymentRate: '—',
    formattedNaturalRate: '—',
    formattedUnemploymentGap: '—',
    formattedOutputGapCoeff: '—',
    formattedOutputGap: '—',
    formattedActualGrowth: '—',
    formattedTrendGrowth: '—',
    formattedGrowthGap: '—',
    formattedGrowthCoeff: '—',
    formattedUnemploymentChange: '—',
    formattedRequiredGrowth: '—',
  };
}

export function validateOkunsLawInput(
  input: OkunsLawInput
): OkunsLawValidation {
  const errors: OkunsLawFieldErrors = {};
  const explanation =
    "Okun's Law is an empirical regularity, not a universal constant. Coefficients differ by country, period, and formulation — do not reuse an output-gap β as a growth-rate α without an explicit model.";

  if (input.mode === 'output-gap') {
    const u = parseNum(input.unemploymentRate, { min: 0, max: 100 });
    const uStar = parseNum(input.naturalUnemploymentRate, {
      min: 0,
      max: 100,
    });
    const beta = parseNum(input.outputGapCoefficient, {
      allowNegative: false,
    });

    const eU = rateErr(u, 'unemployment rate');
    const eUs = rateErr(uStar, 'natural unemployment rate');
    if (eU) errors.unemploymentRate = eU;
    if (eUs) errors.naturalUnemploymentRate = eUs;
    if (beta.blank) errors.outputGapCoefficient = 'Enter the Okun coefficient (β).';
    else if (beta.invalid || beta.value === null)
      errors.outputGapCoefficient = 'Enter a valid Okun coefficient.';
    else if (beta.outOfRange || beta.value < 0)
      errors.outputGapCoefficient =
        'Use a nonnegative β; the formula applies the negative sign (OutputGap = −β(u−u*)).';

    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }

    const gapU = calculateUnemploymentGap(u.value!, uStar.value!)!;
    const outGap = calculateOutputGap(u.value!, uStar.value!, beta.value!)!;
    const chart = generateOutputGapChart(beta.value!, gapU);
    const steps = [
      `Unemployment gap = u − u* = ${formatPercent(u.value!)} − ${formatPercent(uStar.value!)} = ${formatPercentagePoints(gapU)}.`,
      `Apply OutputGap = −β × (u − u*) with β = ${formatCoefficient(beta.value!)}.`,
      `Output gap = −${formatCoefficient(beta.value!)} × ${formatPercentagePoints(gapU)} = ${formatPercent(outGap)}.`,
      interpretOutputGap(outGap),
    ];

    const base = emptyResultBase(input);
    const result: OkunsLawResult = {
      ...base,
      unemploymentRate: u.value,
      naturalUnemploymentRate: uStar.value,
      unemploymentGap: gapU,
      outputGapCoefficient: beta.value,
      outputGap: outGap,
      formattedUnemploymentRate: formatPercent(u.value!),
      formattedNaturalRate: formatPercent(uStar.value!),
      formattedUnemploymentGap: formatPercentagePoints(gapU),
      formattedOutputGapCoeff: formatCoefficient(beta.value!),
      formattedOutputGap: formatPercent(outGap),
      interpretation: interpretOutputGap(outGap),
      explanation,
      formulaBreakdown: 'OutputGap = −β × (u − u*)',
      steps,
      chartPoints: chart.points,
      highlight: chart.highlight,
      chartKind: 'output-gap',
    };
    return { isValid: true, errors: {}, result };
  }

  if (input.mode === 'unemployment-change') {
    const g = parseNum(input.actualGDPGrowthRate);
    const gStar = parseNum(input.trendGDPGrowthRate);
    const alpha = parseNum(input.growthCoefficient, { allowNegative: false });

    if (g.blank) errors.actualGDPGrowthRate = 'Enter actual GDP growth.';
    else if (g.invalid || g.value === null)
      errors.actualGDPGrowthRate = 'Enter a valid actual GDP growth rate.';

    if (gStar.blank) errors.trendGDPGrowthRate = 'Enter trend GDP growth.';
    else if (gStar.invalid || gStar.value === null)
      errors.trendGDPGrowthRate = 'Enter a valid trend GDP growth rate.';

    if (alpha.blank)
      errors.growthCoefficient = 'Enter the growth-version Okun coefficient (α).';
    else if (alpha.invalid || alpha.value === null)
      errors.growthCoefficient = 'Enter a valid coefficient.';
    else if (alpha.value <= 0)
      errors.growthCoefficient =
        'α must be greater than zero (Δu = −α(g−g*)).';

    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }

    const growthGap = calculateGDPGrowthGap(g.value!, gStar.value!)!;
    const dU = calculateUnemploymentChange(g.value!, gStar.value!, alpha.value!)!;
    const chart = generateGrowthChart(alpha.value!, growthGap);
    const steps = [
      `GDP growth gap = g − g* = ${formatPercent(g.value!)} − ${formatPercent(gStar.value!)} = ${formatPercent(growthGap)}.`,
      `Apply Δu = −α × (g − g*) with α = ${formatCoefficient(alpha.value!)}.`,
      `Δu = −${formatCoefficient(alpha.value!)} × ${formatPercent(growthGap)} = ${formatPercentagePoints(dU)}.`,
      interpretUnemploymentChange(dU),
    ];

    const base = emptyResultBase(input);
    const result: OkunsLawResult = {
      ...base,
      actualGDPGrowthRate: g.value,
      trendGDPGrowthRate: gStar.value,
      gdpGrowthGap: growthGap,
      growthCoefficient: alpha.value,
      unemploymentChange: dU,
      formattedActualGrowth: formatPercent(g.value!),
      formattedTrendGrowth: formatPercent(gStar.value!),
      formattedGrowthGap: formatPercent(growthGap),
      formattedGrowthCoeff: formatCoefficient(alpha.value!),
      formattedUnemploymentChange: formatPercentagePoints(dU),
      interpretation: interpretUnemploymentChange(dU),
      explanation,
      formulaBreakdown: 'Δu = −α × (g − g*)',
      steps,
      chartPoints: chart.points,
      highlight: chart.highlight,
      chartKind: 'growth',
    };
    return { isValid: true, errors: {}, result };
  }

  if (input.mode === 'required-gdp-growth') {
    const dU = parseNum(input.unemploymentChange);
    const gStar = parseNum(input.trendGDPGrowthRate);
    const alpha = parseNum(input.growthCoefficient, { allowNegative: false });

    if (dU.blank)
      errors.unemploymentChange = 'Enter the expected change in unemployment (pp).';
    else if (dU.invalid || dU.value === null)
      errors.unemploymentChange = 'Enter a valid unemployment change.';

    if (gStar.blank) errors.trendGDPGrowthRate = 'Enter trend GDP growth.';
    else if (gStar.invalid || gStar.value === null)
      errors.trendGDPGrowthRate = 'Enter a valid trend GDP growth rate.';

    if (alpha.blank)
      errors.growthCoefficient = 'Enter the growth-version Okun coefficient (α).';
    else if (alpha.invalid || alpha.value === null)
      errors.growthCoefficient = 'Enter a valid coefficient.';
    else if (alpha.value <= 0)
      errors.growthCoefficient =
        'α must be greater than zero — cannot divide by zero.';

    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }

    const g = calculateRequiredGDPGrowth(dU.value!, gStar.value!, alpha.value!)!;
    const growthGap = g - gStar.value!;
    const chart = generateGrowthChart(alpha.value!, growthGap);
    const steps = [
      `Required g = g* − Δu / α.`,
      `g = ${formatPercent(gStar.value!)} − (${formatPercentagePoints(dU.value!)} / ${formatCoefficient(alpha.value!)}) = ${formatPercent(g)}.`,
      `Growth gap vs trend = ${formatPercent(growthGap)}.`,
    ];

    const base = emptyResultBase(input);
    const result: OkunsLawResult = {
      ...base,
      trendGDPGrowthRate: gStar.value,
      growthCoefficient: alpha.value,
      unemploymentChange: dU.value,
      requiredGDPGrowth: g,
      gdpGrowthGap: growthGap,
      formattedTrendGrowth: formatPercent(gStar.value!),
      formattedGrowthCoeff: formatCoefficient(alpha.value!),
      formattedUnemploymentChange: formatPercentagePoints(dU.value!),
      formattedRequiredGrowth: formatPercent(g),
      formattedGrowthGap: formatPercent(growthGap),
      interpretation: `To achieve an unemployment change of ${formatPercentagePoints(dU.value!)} under α = ${formatCoefficient(alpha.value!)}, estimated actual GDP growth is ${formatPercent(g)} (trend ${formatPercent(gStar.value!)}).`,
      explanation,
      formulaBreakdown: 'g = g* − Δu / α',
      steps,
      chartPoints: chart.points,
      highlight: chart.highlight,
      chartKind: 'growth',
    };
    return { isValid: true, errors: {}, result };
  }

  // gdp-growth-gap
  const dU = parseNum(input.unemploymentChange);
  const alpha = parseNum(input.growthCoefficient, { allowNegative: false });

  if (dU.blank)
    errors.unemploymentChange = 'Enter the change in unemployment (pp).';
  else if (dU.invalid || dU.value === null)
    errors.unemploymentChange = 'Enter a valid unemployment change.';

  if (alpha.blank)
    errors.growthCoefficient = 'Enter the growth-version Okun coefficient (α).';
  else if (alpha.invalid || alpha.value === null)
    errors.growthCoefficient = 'Enter a valid coefficient.';
  else if (alpha.value <= 0)
    errors.growthCoefficient =
      'α must be greater than zero — cannot divide by zero.';

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const growthGap = calculateGrowthGapFromUnemploymentChange(
    dU.value!,
    alpha.value!
  )!;
  const chart = generateGrowthChart(alpha.value!, growthGap);
  const steps = [
    `GDP growth gap = −Δu / α.`,
    `g − g* = −(${formatPercentagePoints(dU.value!)}) / ${formatCoefficient(alpha.value!)} = ${formatPercent(growthGap)}.`,
  ];

  const base = emptyResultBase(input);
  const result: OkunsLawResult = {
    ...base,
    growthCoefficient: alpha.value,
    unemploymentChange: dU.value,
    gdpGrowthGap: growthGap,
    formattedGrowthCoeff: formatCoefficient(alpha.value!),
    formattedUnemploymentChange: formatPercentagePoints(dU.value!),
    formattedGrowthGap: formatPercent(growthGap),
    interpretation: `Under α = ${formatCoefficient(alpha.value!)}, an unemployment change of ${formatPercentagePoints(dU.value!)} corresponds to a GDP growth gap of ${formatPercent(growthGap)}.`,
    explanation,
    formulaBreakdown: 'g − g* = −Δu / α',
    steps,
    chartPoints: chart.points,
    highlight: chart.highlight,
    chartKind: 'growth',
  };
  return { isValid: true, errors: {}, result };
}
