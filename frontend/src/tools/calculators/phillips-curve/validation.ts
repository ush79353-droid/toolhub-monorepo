import {
  calculateNewClassicalExpectedInflation,
  calculateNewClassicalInflation,
  calculateNewClassicalNaturalUnemployment,
  calculateNewClassicalSupplyShock,
  calculateNewClassicalUnemployment,
  calculateNewKeynesianCostPush,
  calculateNewKeynesianExpectedInflation,
  calculateNewKeynesianInflation,
  calculateNewKeynesianOutputGap,
  calculateTraditionalPhillipsCurve,
  calculateTraditionalTrendWageGrowth,
  calculateTraditionalUnemploymentChange,
  formatCoefficient,
  formatPercent,
  formatPercentagePoints,
  generateNewClassicalChart,
  generateNewKeynesianChart,
  generateTraditionalChart,
  versionLabel,
} from './calculation';
import type {
  PhillipsCurveInput,
  PhillipsCurveResult,
  PhillipsFieldErrors,
} from './types';
import {
  NEW_CLASSICAL_TARGET_OPTIONS,
  NEW_KEYNESIAN_TARGET_OPTIONS,
  TRADITIONAL_TARGET_OPTIONS,
} from './types';

export interface PhillipsValidation {
  isValid: boolean;
  errors: PhillipsFieldErrors;
  result: PhillipsCurveResult | null;
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

function requireFinite(
  p: ReturnType<typeof parseNum>,
  label: string,
  errors: PhillipsFieldErrors,
  key: keyof PhillipsFieldErrors,
  rangeMsg?: string
) {
  if (p.blank) errors[key] = `Enter ${label}.`;
  else if (p.invalid || p.value === null) errors[key] = `Enter a valid ${label}.`;
  else if (p.outOfRange) errors[key] = rangeMsg ?? `${label} is out of range.`;
}

const explanation =
  'Phillips Curve relationships are model-dependent and empirical. Coefficients, expectations, and shocks are assumptions; not guaranteed forecasts.';

export function validatePhillipsCurveInput(
  input: PhillipsCurveInput
): PhillipsValidation {
  const errors: PhillipsFieldErrors = {};

  if (input.version === 'traditional') {
    return validateTraditional(input, errors);
  }
  if (input.version === 'new-classical') {
    return validateNewClassical(input, errors);
  }
  return validateNewKeynesian(input, errors);
}

function validateTraditional(
  input: PhillipsCurveInput,
  errors: PhillipsFieldErrors
): PhillipsValidation {
  const beta = parseNum(input.traditionalSensitivity, { allowNegative: false });
  if (beta.blank)
    errors.traditionalSensitivity = 'Enter the sensitivity coefficient (β).';
  else if (beta.invalid || beta.value === null)
    errors.traditionalSensitivity = 'Enter a valid sensitivity coefficient.';
  else if (beta.value <= 0)
    errors.traditionalSensitivity =
      'β must be greater than zero (cannot divide by zero).';

  const target = input.traditionalTarget;
  const targetLabel =
    TRADITIONAL_TARGET_OPTIONS.find((o) => o.id === target)?.label ?? target;

  if (target === 'wage-growth') {
    const wt = parseNum(input.trendWageGrowth);
    const du = parseNum(input.unemploymentChange);
    requireFinite(wt, 'trend wage growth', errors, 'trendWageGrowth');
    requireFinite(du, 'unemployment change', errors, 'unemploymentChange');
    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }
    const w = calculateTraditionalPhillipsCurve(
      wt.value!,
      du.value!,
      beta.value!
    )!;
    const chart = generateTraditionalChart(wt.value!, beta.value!, du.value!);
    const steps = [
      `Model: Traditional (simplified wage-change).`,
      `w = w_T − β Δu with β = ${formatCoefficient(beta.value!)}.`,
      `w = ${formatPercent(wt.value!)} − ${formatCoefficient(beta.value!)} × ${formatPercentagePoints(du.value!)} = ${formatPercent(w)}.`,
    ];
    return {
      isValid: true,
      errors: {},
      result: baseTraditionalResult({
        targetLabel,
        primary: w,
        primaryLabel: 'Predicted money-wage growth',
        wt: wt.value!,
        du: du.value!,
        beta: beta.value!,
        chart,
        steps,
        interpretation: `Under the simplified model, unemployment change of ${formatPercentagePoints(du.value!)} maps trend wage growth ${formatPercent(wt.value!)} to predicted wage growth ${formatPercent(w)}.`,
      }),
    };
  }

  if (target === 'unemployment-change') {
    const wt = parseNum(input.trendWageGrowth);
    const w = parseNum(input.wageGrowth);
    requireFinite(wt, 'trend wage growth', errors, 'trendWageGrowth');
    requireFinite(w, 'wage growth', errors, 'wageGrowth');
    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }
    const du = calculateTraditionalUnemploymentChange(
      wt.value!,
      w.value!,
      beta.value!
    )!;
    const chart = generateTraditionalChart(wt.value!, beta.value!, du);
    const steps = [
      `Solve Δu = (w_T − w) / β.`,
      `Δu = (${formatPercent(wt.value!)} − ${formatPercent(w.value!)}) / ${formatCoefficient(beta.value!)} = ${formatPercentagePoints(du)}.`,
    ];
    return {
      isValid: true,
      errors: {},
      result: baseTraditionalResult({
        targetLabel,
        primary: du,
        primaryLabel: 'Unemployment change',
        primaryUnit: 'pp',
        wt: wt.value!,
        du,
        beta: beta.value!,
        chart,
        steps,
        interpretation: `Implied unemployment change is ${formatPercentagePoints(du)} given wage growth ${formatPercent(w.value!)} and trend ${formatPercent(wt.value!)}.`,
      }),
    };
  }

  // trend-wage-growth
  const w = parseNum(input.wageGrowth);
  const du = parseNum(input.unemploymentChange);
  requireFinite(w, 'wage growth', errors, 'wageGrowth');
  requireFinite(du, 'unemployment change', errors, 'unemploymentChange');
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }
  const wt = calculateTraditionalTrendWageGrowth(
    w.value!,
    du.value!,
    beta.value!
  )!;
  const chart = generateTraditionalChart(wt, beta.value!, du.value!);
  const steps = [
    `Solve w_T = w + β Δu.`,
    `w_T = ${formatPercent(w.value!)} + ${formatCoefficient(beta.value!)} × ${formatPercentagePoints(du.value!)} = ${formatPercent(wt)}.`,
  ];
  return {
    isValid: true,
    errors: {},
    result: baseTraditionalResult({
      targetLabel,
      primary: wt,
      primaryLabel: 'Trend money-wage growth',
      wt,
      du: du.value!,
      beta: beta.value!,
      chart,
      steps,
      interpretation: `Implied trend wage growth is ${formatPercent(wt)}.`,
    }),
  };
}

function baseTraditionalResult(args: {
  targetLabel: string;
  primary: number;
  primaryLabel: string;
  primaryUnit?: 'pct' | 'pp';
  wt: number;
  du: number;
  beta: number;
  chart: ReturnType<typeof generateTraditionalChart>;
  steps: string[];
  interpretation: string;
}): PhillipsCurveResult {
  const wageVsTrend = args.primaryUnit === 'pp' ? null : args.primary - args.wt;
  return {
    version: 'traditional',
    versionLabel: versionLabel('traditional'),
    targetLabel: args.targetLabel,
    primaryValue: args.primary,
    primaryLabel: args.primaryLabel,
    formattedPrimary:
      args.primaryUnit === 'pp'
        ? formatPercentagePoints(args.primary)
        : formatPercent(args.primary),
    unemploymentGap: null,
    inflationSurprise: null,
    expectedContribution: null,
    gapContribution: null,
    shockContribution: null,
    wageVsTrend,
    formattedUnemploymentGap: '—',
    formattedInflationSurprise: '—',
    formattedExpectedContribution: '—',
    formattedGapContribution: '—',
    formattedShockContribution: '—',
    formattedWageVsTrend:
      wageVsTrend != null ? formatPercentagePoints(wageVsTrend) : '—',
    interpretation: args.interpretation,
    explanation,
    formulaBreakdown: 'w = w_T − β Δu',
    steps: args.steps,
    chartTitle: 'Traditional Phillips Curve',
    chartXLabel: 'Unemployment change (pp)',
    chartYLabel: 'Money-wage growth (%)',
    chartPoints: args.chart.points,
    highlight: args.chart.highlight,
    referenceLines: [],
  };
}

function validateNewClassical(
  input: PhillipsCurveInput,
  errors: PhillipsFieldErrors
): PhillipsValidation {
  const slope = parseNum(input.classicalSlope, { allowNegative: false });
  if (slope.blank) errors.classicalSlope = 'Enter the Phillips slope (α).';
  else if (slope.invalid || slope.value === null)
    errors.classicalSlope = 'Enter a valid slope coefficient.';
  else if (slope.value <= 0)
    errors.classicalSlope = 'α must be greater than zero.';

  const target = input.newClassicalTarget;
  const targetLabel =
    NEW_CLASSICAL_TARGET_OPTIONS.find((o) => o.id === target)?.label ?? target;

  if (target === 'inflation') {
    const pe = parseNum(input.expectedInflation);
    const u = parseNum(input.unemploymentRate, { min: 0, max: 100 });
    const un = parseNum(input.naturalUnemploymentRate, { min: 0, max: 100 });
    const s = parseNum(input.supplyShock);
    requireFinite(pe, 'expected inflation', errors, 'expectedInflation');
    requireFinite(
      u,
      'unemployment rate',
      errors,
      'unemploymentRate',
      'Unemployment rate must be between 0% and 100%.'
    );
    requireFinite(
      un,
      'natural unemployment rate',
      errors,
      'naturalUnemploymentRate',
      'Natural unemployment rate must be between 0% and 100%.'
    );
    if (s.blank) errors.supplyShock = 'Enter supply shock (use 0 if none).';
    else if (s.invalid || s.value === null)
      errors.supplyShock = 'Enter a valid supply shock.';
    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }
    const pi = calculateNewClassicalInflation({
      expectedInflation: pe.value!,
      unemploymentRate: u.value!,
      naturalUnemploymentRate: un.value!,
      slope: slope.value!,
      supplyShock: s.value!,
    })!;
    const gap = u.value! - un.value!;
    const surprise = pi - pe.value!;
    const chart = generateNewClassicalChart(
      pe.value!,
      un.value!,
      slope.value!,
      s.value!,
      u.value!
    );
    return {
      isValid: true,
      errors: {},
      result: ncResult({
        targetLabel,
        primary: pi,
        primaryLabel: 'Predicted inflation',
        pe: pe.value!,
        u: u.value!,
        un: un.value!,
        slope: slope.value!,
        s: s.value!,
        gap,
        surprise,
        chart,
        steps: [
          `Unemployment gap = u − uₙ = ${formatPercentagePoints(gap)}.`,
          `π = πᵉ − α(u − uₙ) + s.`,
          `π = ${formatPercent(pe.value!)} − ${formatCoefficient(slope.value!)} × ${formatPercentagePoints(gap)} + ${formatPercentagePoints(s.value!)} = ${formatPercent(pi)}.`,
        ],
        interpretation:
          gap > 0
            ? `Unemployment is ${formatPercentagePoints(gap)} above the natural rate. The model estimates inflation ${formatPercentagePoints(Math.abs(surprise))} ${surprise < 0 ? 'below' : 'above'} expected inflation.`
            : gap < 0
              ? `Unemployment is ${formatPercentagePoints(Math.abs(gap))} below the natural rate. The model estimates inflation ${formatPercentagePoints(Math.abs(surprise))} ${surprise > 0 ? 'above' : 'below'} expected inflation.`
              : `Unemployment equals the natural rate; inflation differs from expectations only by the supply shock (${formatPercentagePoints(s.value!)}).`,
      }),
    };
  }

  if (target === 'unemployment') {
    const pi = parseNum(input.inflation);
    const pe = parseNum(input.expectedInflation);
    const un = parseNum(input.naturalUnemploymentRate, { min: 0, max: 100 });
    const s = parseNum(input.supplyShock);
    requireFinite(pi, 'inflation', errors, 'inflation');
    requireFinite(pe, 'expected inflation', errors, 'expectedInflation');
    requireFinite(
      un,
      'natural unemployment rate',
      errors,
      'naturalUnemploymentRate',
      'Natural unemployment rate must be between 0% and 100%.'
    );
    if (s.blank) errors.supplyShock = 'Enter supply shock (use 0 if none).';
    else if (s.invalid || s.value === null)
      errors.supplyShock = 'Enter a valid supply shock.';
    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }
    const u = calculateNewClassicalUnemployment({
      inflation: pi.value!,
      expectedInflation: pe.value!,
      naturalUnemploymentRate: un.value!,
      slope: slope.value!,
      supplyShock: s.value!,
    })!;
    const gap = u - un.value!;
    const surprise = pi.value! - pe.value!;
    const chart = generateNewClassicalChart(
      pe.value!,
      un.value!,
      slope.value!,
      s.value!,
      u
    );
    return {
      isValid: true,
      errors: {},
      result: ncResult({
        targetLabel,
        primary: u,
        primaryLabel: 'Implied unemployment',
        pe: pe.value!,
        u,
        un: un.value!,
        slope: slope.value!,
        s: s.value!,
        gap,
        surprise,
        chart,
        steps: [
          `u = uₙ + (πᵉ + s − π) / α.`,
          `u = ${formatPercent(un.value!)} + (${formatPercent(pe.value!)} + ${formatPercentagePoints(s.value!)} − ${formatPercent(pi.value!)}) / ${formatCoefficient(slope.value!)} = ${formatPercent(u)}.`,
        ],
        interpretation: `Implied unemployment is ${formatPercent(u)} (gap ${formatPercentagePoints(gap)} vs natural rate).`,
      }),
    };
  }

  if (target === 'expected-inflation') {
    const pi = parseNum(input.inflation);
    const u = parseNum(input.unemploymentRate, { min: 0, max: 100 });
    const un = parseNum(input.naturalUnemploymentRate, { min: 0, max: 100 });
    const s = parseNum(input.supplyShock);
    requireFinite(pi, 'inflation', errors, 'inflation');
    requireFinite(
      u,
      'unemployment rate',
      errors,
      'unemploymentRate',
      'Unemployment rate must be between 0% and 100%.'
    );
    requireFinite(
      un,
      'natural unemployment rate',
      errors,
      'naturalUnemploymentRate',
      'Natural unemployment rate must be between 0% and 100%.'
    );
    if (s.blank) errors.supplyShock = 'Enter supply shock (use 0 if none).';
    else if (s.invalid || s.value === null)
      errors.supplyShock = 'Enter a valid supply shock.';
    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }
    const pe = calculateNewClassicalExpectedInflation({
      inflation: pi.value!,
      unemploymentRate: u.value!,
      naturalUnemploymentRate: un.value!,
      slope: slope.value!,
      supplyShock: s.value!,
    })!;
    const gap = u.value! - un.value!;
    const surprise = pi.value! - pe;
    const chart = generateNewClassicalChart(
      pe,
      un.value!,
      slope.value!,
      s.value!,
      u.value!
    );
    return {
      isValid: true,
      errors: {},
      result: ncResult({
        targetLabel,
        primary: pe,
        primaryLabel: 'Implied expected inflation',
        pe,
        u: u.value!,
        un: un.value!,
        slope: slope.value!,
        s: s.value!,
        gap,
        surprise,
        chart,
        steps: [
          `πᵉ = π + α(u − uₙ) − s.`,
          `πᵉ = ${formatPercent(pi.value!)} + ${formatCoefficient(slope.value!)} × ${formatPercentagePoints(gap)} − ${formatPercentagePoints(s.value!)} = ${formatPercent(pe)}.`,
        ],
        interpretation: `Implied expected inflation is ${formatPercent(pe)}.`,
      }),
    };
  }

  if (target === 'natural-unemployment') {
    const pi = parseNum(input.inflation);
    const pe = parseNum(input.expectedInflation);
    const u = parseNum(input.unemploymentRate, { min: 0, max: 100 });
    const s = parseNum(input.supplyShock);
    requireFinite(pi, 'inflation', errors, 'inflation');
    requireFinite(pe, 'expected inflation', errors, 'expectedInflation');
    requireFinite(
      u,
      'unemployment rate',
      errors,
      'unemploymentRate',
      'Unemployment rate must be between 0% and 100%.'
    );
    if (s.blank) errors.supplyShock = 'Enter supply shock (use 0 if none).';
    else if (s.invalid || s.value === null)
      errors.supplyShock = 'Enter a valid supply shock.';
    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }
    const un = calculateNewClassicalNaturalUnemployment({
      inflation: pi.value!,
      expectedInflation: pe.value!,
      unemploymentRate: u.value!,
      slope: slope.value!,
      supplyShock: s.value!,
    })!;
    const gap = u.value! - un;
    const surprise = pi.value! - pe.value!;
    const chart = generateNewClassicalChart(
      pe.value!,
      un,
      slope.value!,
      s.value!,
      u.value!
    );
    return {
      isValid: true,
      errors: {},
      result: ncResult({
        targetLabel,
        primary: un,
        primaryLabel: 'Implied natural unemployment',
        pe: pe.value!,
        u: u.value!,
        un,
        slope: slope.value!,
        s: s.value!,
        gap,
        surprise,
        chart,
        steps: [
          `uₙ = u − (πᵉ + s − π) / α.`,
          `uₙ = ${formatPercent(u.value!)} − (${formatPercent(pe.value!)} + ${formatPercentagePoints(s.value!)} − ${formatPercent(pi.value!)}) / ${formatCoefficient(slope.value!)} = ${formatPercent(un)}.`,
        ],
        interpretation: `Implied natural unemployment is ${formatPercent(un)}.`,
      }),
    };
  }

  // supply-shock
  const pi = parseNum(input.inflation);
  const pe = parseNum(input.expectedInflation);
  const u = parseNum(input.unemploymentRate, { min: 0, max: 100 });
  const un = parseNum(input.naturalUnemploymentRate, { min: 0, max: 100 });
  requireFinite(pi, 'inflation', errors, 'inflation');
  requireFinite(pe, 'expected inflation', errors, 'expectedInflation');
  requireFinite(
    u,
    'unemployment rate',
    errors,
    'unemploymentRate',
    'Unemployment rate must be between 0% and 100%.'
  );
  requireFinite(
    un,
    'natural unemployment rate',
    errors,
    'naturalUnemploymentRate',
    'Natural unemployment rate must be between 0% and 100%.'
  );
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }
  const s = calculateNewClassicalSupplyShock({
    inflation: pi.value!,
    expectedInflation: pe.value!,
    unemploymentRate: u.value!,
    naturalUnemploymentRate: un.value!,
    slope: slope.value!,
  })!;
  const gap = u.value! - un.value!;
  const surprise = pi.value! - pe.value!;
  const chart = generateNewClassicalChart(
    pe.value!,
    un.value!,
    slope.value!,
    s,
    u.value!
  );
  return {
    isValid: true,
    errors: {},
    result: ncResult({
      targetLabel,
      primary: s,
      primaryLabel: 'Implied supply shock',
      primaryUnit: 'pp',
      pe: pe.value!,
      u: u.value!,
      un: un.value!,
      slope: slope.value!,
      s,
      gap,
      surprise,
      chart,
      steps: [
        `s = π − πᵉ + α(u − uₙ).`,
        `s = ${formatPercent(pi.value!)} − ${formatPercent(pe.value!)} + ${formatCoefficient(slope.value!)} × ${formatPercentagePoints(gap)} = ${formatPercentagePoints(s)}.`,
      ],
      interpretation: `Implied supply shock is ${formatPercentagePoints(s)}.`,
    }),
  };
}

function ncResult(args: {
  targetLabel: string;
  primary: number;
  primaryLabel: string;
  primaryUnit?: 'pct' | 'pp';
  pe: number;
  u: number;
  un: number;
  slope: number;
  s: number;
  gap: number;
  surprise: number;
  chart: ReturnType<typeof generateNewClassicalChart>;
  steps: string[];
  interpretation: string;
}): PhillipsCurveResult {
  return {
    version: 'new-classical',
    versionLabel: versionLabel('new-classical'),
    targetLabel: args.targetLabel,
    primaryValue: args.primary,
    primaryLabel: args.primaryLabel,
    formattedPrimary:
      args.primaryUnit === 'pp'
        ? formatPercentagePoints(args.primary)
        : formatPercent(args.primary),
    unemploymentGap: args.gap,
    inflationSurprise: args.surprise,
    expectedContribution: null,
    gapContribution: null,
    shockContribution: args.s,
    wageVsTrend: null,
    formattedUnemploymentGap: formatPercentagePoints(args.gap),
    formattedInflationSurprise: formatPercentagePoints(args.surprise),
    formattedExpectedContribution: '—',
    formattedGapContribution: '—',
    formattedShockContribution: formatPercentagePoints(args.s),
    formattedWageVsTrend: '—',
    interpretation: args.interpretation,
    explanation,
    formulaBreakdown: 'π = πᵉ − α(u − uₙ) + s',
    steps: args.steps,
    chartTitle: 'Expectations-Augmented Phillips Curve',
    chartXLabel: 'Unemployment rate (%)',
    chartYLabel: 'Inflation rate (%)',
    chartPoints: args.chart.points,
    highlight: args.chart.highlight,
    referenceLines: args.chart.references,
  };
}

function validateNewKeynesian(
  input: PhillipsCurveInput,
  errors: PhillipsFieldErrors
): PhillipsValidation {
  const beta = parseNum(input.discountFactor, { allowNegative: false });
  if (beta.blank) errors.discountFactor = 'Enter the discount factor (β).';
  else if (beta.invalid || beta.value === null)
    errors.discountFactor = 'Enter a valid discount factor.';
  else if (beta.value <= 0 || beta.value > 1)
    errors.discountFactor = 'Discount factor must be greater than 0 and ≤ 1.';

  const kappa = parseNum(input.nkSlope, { allowNegative: false });
  if (kappa.blank) errors.nkSlope = 'Enter the NKPC slope (κ).';
  else if (kappa.invalid || kappa.value === null)
    errors.nkSlope = 'Enter a valid slope coefficient.';
  else if (kappa.value <= 0) errors.nkSlope = 'κ must be greater than zero.';

  const target = input.newKeynesianTarget;
  const targetLabel =
    NEW_KEYNESIAN_TARGET_OPTIONS.find((o) => o.id === target)?.label ?? target;

  if (target === 'inflation') {
    const pe = parseNum(input.nkExpectedInflation);
    const x = parseNum(input.outputGap);
    const s = parseNum(input.costPushShock);
    requireFinite(pe, 'expected next-period inflation', errors, 'nkExpectedInflation');
    requireFinite(x, 'output gap', errors, 'outputGap');
    if (s.blank) errors.costPushShock = 'Enter cost-push shock (use 0 if none).';
    else if (s.invalid || s.value === null)
      errors.costPushShock = 'Enter a valid cost-push shock.';
    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }
    const pi = calculateNewKeynesianInflation({
      expectedInflation: pe.value!,
      discountFactor: beta.value!,
      outputGap: x.value!,
      slope: kappa.value!,
      supplyShock: s.value!,
    })!;
    const expC = beta.value! * pe.value!;
    const gapC = kappa.value! * x.value!;
    const chart = generateNewKeynesianChart(
      pe.value!,
      beta.value!,
      kappa.value!,
      s.value!,
      x.value!
    );
    return {
      isValid: true,
      errors: {},
      result: nkResult({
        targetLabel,
        primary: pi,
        primaryLabel: 'Predicted current inflation',
        pe: pe.value!,
        beta: beta.value!,
        x: x.value!,
        kappa: kappa.value!,
        s: s.value!,
        expC,
        gapC,
        chart,
        steps: [
          `πₜ = β E[πₜ₊₁] + κ xₜ + sₜ (simplified % form).`,
          `Expected contribution = ${formatCoefficient(beta.value!)} × ${formatPercent(pe.value!)} = ${formatPercent(expC)}.`,
          `Output-gap contribution = ${formatCoefficient(kappa.value!)} × ${formatPercent(x.value!)} = ${formatPercent(gapC)}.`,
          `πₜ = ${formatPercent(expC)} + ${formatPercent(gapC)} + ${formatPercentagePoints(s.value!)} = ${formatPercent(pi)}.`,
        ],
        interpretation: interpretNkGap(x.value!, pi),
      }),
    };
  }

  if (target === 'expected-inflation') {
    const pi = parseNum(input.nkInflation);
    const x = parseNum(input.outputGap);
    const s = parseNum(input.costPushShock);
    requireFinite(pi, 'current inflation', errors, 'nkInflation');
    requireFinite(x, 'output gap', errors, 'outputGap');
    if (s.blank) errors.costPushShock = 'Enter cost-push shock (use 0 if none).';
    else if (s.invalid || s.value === null)
      errors.costPushShock = 'Enter a valid cost-push shock.';
    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }
    const pe = calculateNewKeynesianExpectedInflation({
      inflation: pi.value!,
      discountFactor: beta.value!,
      outputGap: x.value!,
      slope: kappa.value!,
      supplyShock: s.value!,
    })!;
    const expC = beta.value! * pe;
    const gapC = kappa.value! * x.value!;
    const chart = generateNewKeynesianChart(
      pe,
      beta.value!,
      kappa.value!,
      s.value!,
      x.value!
    );
    return {
      isValid: true,
      errors: {},
      result: nkResult({
        targetLabel,
        primary: pe,
        primaryLabel: 'Implied expected inflation',
        pe,
        beta: beta.value!,
        x: x.value!,
        kappa: kappa.value!,
        s: s.value!,
        expC,
        gapC,
        chart,
        steps: [
          `E[πₜ₊₁] = (πₜ − κ xₜ − sₜ) / β.`,
          `E[πₜ₊₁] = (${formatPercent(pi.value!)} − ${formatPercent(gapC)} − ${formatPercentagePoints(s.value!)}) / ${formatCoefficient(beta.value!)} = ${formatPercent(pe)}.`,
        ],
        interpretation: `Implied next-period expected inflation is ${formatPercent(pe)}.`,
      }),
    };
  }

  if (target === 'output-gap') {
    const pi = parseNum(input.nkInflation);
    const pe = parseNum(input.nkExpectedInflation);
    const s = parseNum(input.costPushShock);
    requireFinite(pi, 'current inflation', errors, 'nkInflation');
    requireFinite(pe, 'expected next-period inflation', errors, 'nkExpectedInflation');
    if (s.blank) errors.costPushShock = 'Enter cost-push shock (use 0 if none).';
    else if (s.invalid || s.value === null)
      errors.costPushShock = 'Enter a valid cost-push shock.';
    if (Object.keys(errors).length > 0) {
      return { isValid: false, errors, result: null };
    }
    const x = calculateNewKeynesianOutputGap({
      inflation: pi.value!,
      expectedInflation: pe.value!,
      discountFactor: beta.value!,
      slope: kappa.value!,
      supplyShock: s.value!,
    })!;
    const expC = beta.value! * pe.value!;
    const gapC = kappa.value! * x;
    const chart = generateNewKeynesianChart(
      pe.value!,
      beta.value!,
      kappa.value!,
      s.value!,
      x
    );
    return {
      isValid: true,
      errors: {},
      result: nkResult({
        targetLabel,
        primary: x,
        primaryLabel: 'Implied output gap',
        pe: pe.value!,
        beta: beta.value!,
        x,
        kappa: kappa.value!,
        s: s.value!,
        expC,
        gapC,
        chart,
        steps: [
          `xₜ = (πₜ − β E[πₜ₊₁] − sₜ) / κ.`,
          `xₜ = (${formatPercent(pi.value!)} − ${formatPercent(expC)} − ${formatPercentagePoints(s.value!)}) / ${formatCoefficient(kappa.value!)} = ${formatPercent(x)}.`,
        ],
        interpretation: interpretNkGap(x, pi.value!),
      }),
    };
  }

  // cost-push
  const pi = parseNum(input.nkInflation);
  const pe = parseNum(input.nkExpectedInflation);
  const x = parseNum(input.outputGap);
  requireFinite(pi, 'current inflation', errors, 'nkInflation');
  requireFinite(pe, 'expected next-period inflation', errors, 'nkExpectedInflation');
  requireFinite(x, 'output gap', errors, 'outputGap');
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }
  const s = calculateNewKeynesianCostPush({
    inflation: pi.value!,
    expectedInflation: pe.value!,
    discountFactor: beta.value!,
    outputGap: x.value!,
    slope: kappa.value!,
  })!;
  const expC = beta.value! * pe.value!;
  const gapC = kappa.value! * x.value!;
  const chart = generateNewKeynesianChart(
    pe.value!,
    beta.value!,
    kappa.value!,
    s,
    x.value!
  );
  return {
    isValid: true,
    errors: {},
    result: nkResult({
      targetLabel,
      primary: s,
      primaryLabel: 'Implied cost-push shock',
      primaryUnit: 'pp',
      pe: pe.value!,
      beta: beta.value!,
      x: x.value!,
      kappa: kappa.value!,
      s,
      expC,
      gapC,
      chart,
      steps: [
        `sₜ = πₜ − β E[πₜ₊₁] − κ xₜ.`,
        `sₜ = ${formatPercent(pi.value!)} − ${formatPercent(expC)} − ${formatPercent(gapC)} = ${formatPercentagePoints(s)}.`,
      ],
      interpretation: `Implied cost-push shock is ${formatPercentagePoints(s)}.`,
    }),
  };
}

function interpretNkGap(x: number, pi: number): string {
  if (Math.abs(x) < 1e-9) {
    return `Output gap is zero; demand-gap contribution is zero. Predicted/current inflation is ${formatPercent(pi)} under the selected parameters.`;
  }
  if (x > 0) {
    return `Positive output gap of ${formatPercent(x)} adds demand-related inflation pressure when κ > 0. Model inflation ${formatPercent(pi)}.`;
  }
  return `Negative output gap of ${formatPercent(x)} reduces demand-related inflation pressure. Model inflation ${formatPercent(pi)}.`;
}

function nkResult(args: {
  targetLabel: string;
  primary: number;
  primaryLabel: string;
  primaryUnit?: 'pct' | 'pp';
  pe: number;
  beta: number;
  x: number;
  kappa: number;
  s: number;
  expC: number;
  gapC: number;
  chart: ReturnType<typeof generateNewKeynesianChart>;
  steps: string[];
  interpretation: string;
}): PhillipsCurveResult {
  return {
    version: 'new-keynesian',
    versionLabel: versionLabel('new-keynesian'),
    targetLabel: args.targetLabel,
    primaryValue: args.primary,
    primaryLabel: args.primaryLabel,
    formattedPrimary:
      args.primaryUnit === 'pp'
        ? formatPercentagePoints(args.primary)
        : formatPercent(args.primary),
    unemploymentGap: null,
    inflationSurprise: null,
    expectedContribution: args.expC,
    gapContribution: args.gapC,
    shockContribution: args.s,
    wageVsTrend: null,
    formattedUnemploymentGap: '—',
    formattedInflationSurprise: '—',
    formattedExpectedContribution: formatPercent(args.expC),
    formattedGapContribution: formatPercent(args.gapC),
    formattedShockContribution: formatPercentagePoints(args.s),
    formattedWageVsTrend: '—',
    interpretation: args.interpretation,
    explanation,
    formulaBreakdown: 'πₜ = β E[πₜ₊₁] + κ xₜ + sₜ',
    steps: args.steps,
    chartTitle: 'New Keynesian Phillips Curve',
    chartXLabel: 'Output gap (%)',
    chartYLabel: 'Current inflation (%)',
    chartPoints: args.chart.points,
    highlight: args.chart.highlight,
    referenceLines: [],
  };
}
