import {
  calculateApproximateExpectedInflation,
  calculateApproximateNominalRate,
  calculateApproximateRealRate,
  calculateApproximationDifference,
  calculateExactRealRate,
  calculateExpectedInflation,
  calculateNominalRate,
  formatRatePercent,
  interpretRealRate,
} from './calculation';
import type {
  FisherEquationFieldErrors,
  FisherEquationInput,
  FisherEquationResult,
} from './types';

export interface FisherEquationValidation {
  isValid: boolean;
  errors: FisherEquationFieldErrors;
  result: FisherEquationResult | null;
}

function parseRate(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/%/g, '').replace(/,/g, '');
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

function requireRate(
  raw: string,
  blankMsg: string,
  invalidMsg: string,
  domainMsg: string,
  opts?: { rejectAtOrBelowMinus100?: boolean; rejectBelowMinus100?: boolean }
): { value: number | null; error?: string } {
  const p = parseRate(raw);
  if (p.blank) return { value: null, error: blankMsg };
  if (p.invalid || p.value === null) return { value: null, error: invalidMsg };
  if (opts?.rejectAtOrBelowMinus100 && p.value <= -100) {
    return { value: null, error: domainMsg };
  }
  if (opts?.rejectBelowMinus100 && p.value < -100) {
    return { value: null, error: domainMsg };
  }
  return { value: p.value };
}

function diffLabel(exact: number, approx: number): string {
  const d = calculateApproximationDifference(exact, approx);
  const abs = Math.abs(d);
  return `${formatRatePercent(abs).replace('%', '')} percentage points (${
    d >= 0 ? 'exact higher' : 'approx higher'
  })`;
}

export function validateFisherEquationInput(
  input: FisherEquationInput
): FisherEquationValidation {
  const errors: FisherEquationFieldErrors = {};
  const mode = input.mode;

  if (mode === 'real') {
    const i = requireRate(
      input.nominalRate,
      'Enter the nominal interest rate.',
      'Enter a valid nominal interest rate.',
      'Nominal interest rate must be at least −100%.',
      { rejectBelowMinus100: true }
    );
    if (i.error) errors.nominalRate = i.error;

    const pi = requireRate(
      input.expectedInflation,
      'Enter the expected inflation rate.',
      'Enter a valid expected inflation rate.',
      'Expected inflation must be greater than −100% (1+πᵉ cannot be zero or negative for this inverse).',
      { rejectAtOrBelowMinus100: true }
    );
    if (pi.error) errors.expectedInflation = pi.error;

    if (i.value == null || pi.value == null) {
      return { isValid: false, errors, result: null };
    }

    const exact = calculateExactRealRate(i.value, pi.value);
    if (exact == null) {
      errors.form = 'Unable to compute the exact real interest rate.';
      return { isValid: false, errors, result: null };
    }
    const approx = calculateApproximateRealRate(i.value, pi.value);
    const diff = calculateApproximationDifference(exact, approx);

    const result: FisherEquationResult = {
      mode,
      nominalRate: i.value,
      realRate: exact,
      expectedInflation: pi.value,
      exactComputed: exact,
      approximateValue: approx,
      approximationDifference: diff,
      formattedNominal: formatRatePercent(i.value),
      formattedReal: formatRatePercent(exact),
      formattedInflation: formatRatePercent(pi.value),
      formattedApproximate: formatRatePercent(approx),
      formattedDifferencePp: diffLabel(exact, approx),
      activeEquation: '(1+i)=(1+r)(1+πᵉ)  →  r=((1+i)/(1+πᵉ))−1',
      formulaBreakdown: `r = ((1 + ${i.value}/100)/(1 + ${pi.value}/100) − 1)×100 = ${exact}; approx r ≈ ${i.value} − ${pi.value} = ${approx}`,
      stepByStep: [
        `Convert: ${i.value}% → ${i.value / 100}, ${pi.value}% → ${pi.value / 100}`,
        `Exact: (${1 + i.value / 100} / ${1 + pi.value / 100}) − 1`,
        `Exact %: ${exact}`,
        `Approximate: ${i.value}% − ${pi.value}% = ${approx}%`,
        `Difference (exact − approx): ${diff} percentage points`,
      ],
      interpretation: interpretRealRate(exact),
      explanation:
        'Exact Fisher equation is the default. The approximated real rate (i − πᵉ) omits the r·πᵉ cross term and is labeled separately.',
    };
    return { isValid: true, errors, result };
  }

  if (mode === 'nominal') {
    const r = requireRate(
      input.realRate,
      'Enter the real interest rate.',
      'Enter a valid real interest rate.',
      'Real interest rate must be at least −100%.',
      { rejectBelowMinus100: true }
    );
    if (r.error) errors.realRate = r.error;

    const pi = requireRate(
      input.expectedInflation,
      'Enter the expected inflation rate.',
      'Enter a valid expected inflation rate.',
      'Expected inflation must be at least −100%.',
      { rejectBelowMinus100: true }
    );
    if (pi.error) errors.expectedInflation = pi.error;

    if (r.value == null || pi.value == null) {
      return { isValid: false, errors, result: null };
    }

    const exact = calculateNominalRate(r.value, pi.value);
    if (exact == null) {
      errors.form = 'Unable to compute the nominal interest rate.';
      return { isValid: false, errors, result: null };
    }
    const approx = calculateApproximateNominalRate(r.value, pi.value);
    const diff = calculateApproximationDifference(exact, approx);

    const result: FisherEquationResult = {
      mode,
      nominalRate: exact,
      realRate: r.value,
      expectedInflation: pi.value,
      exactComputed: exact,
      approximateValue: approx,
      approximationDifference: diff,
      formattedNominal: formatRatePercent(exact),
      formattedReal: formatRatePercent(r.value),
      formattedInflation: formatRatePercent(pi.value),
      formattedApproximate: formatRatePercent(approx),
      formattedDifferencePp: diffLabel(exact, approx),
      activeEquation: 'i=(1+r)(1+πᵉ)−1  ·  approx i≈r+πᵉ',
      formulaBreakdown: `i = (1+${r.value}/100)(1+${pi.value}/100)−1 → ${exact}%; approx ≈ ${r.value}+${pi.value}=${approx}%`,
      stepByStep: [
        `Decimals: r=${r.value / 100}, πᵉ=${pi.value / 100}`,
        `Exact: (1+r)(1+πᵉ)−1 → ${exact / 100}`,
        `Exact %: ${exact}`,
        `Approximate: ${r.value}+${pi.value}=${approx}`,
      ],
      interpretation: interpretRealRate(r.value),
      explanation:
        'Nominal rate from the exact Fisher product; approximate uses r+πᵉ.',
    };
    return { isValid: true, errors, result };
  }

  const i = requireRate(
    input.nominalRate,
    'Enter the nominal interest rate.',
    'Enter a valid nominal interest rate.',
    'Nominal interest rate must be at least −100%.',
    { rejectBelowMinus100: true }
  );
  if (i.error) errors.nominalRate = i.error;

  const r = requireRate(
    input.realRate,
    'Enter the real interest rate.',
    'Enter a valid real interest rate.',
    'Real interest rate must be greater than −100% for this inverse.',
    { rejectAtOrBelowMinus100: true }
  );
  if (r.error) errors.realRate = r.error;

  if (i.value == null || r.value == null) {
    return { isValid: false, errors, result: null };
  }

  const exact = calculateExpectedInflation(i.value, r.value);
  if (exact == null) {
    errors.form = 'Unable to compute expected inflation.';
    return { isValid: false, errors, result: null };
  }
  const approx = calculateApproximateExpectedInflation(i.value, r.value);
  const diff = calculateApproximationDifference(exact, approx);

  const result: FisherEquationResult = {
    mode,
    nominalRate: i.value,
    realRate: r.value,
    expectedInflation: exact,
    exactComputed: exact,
    approximateValue: approx,
    approximationDifference: diff,
    formattedNominal: formatRatePercent(i.value),
    formattedReal: formatRatePercent(r.value),
    formattedInflation: formatRatePercent(exact),
    formattedApproximate: formatRatePercent(approx),
    formattedDifferencePp: diffLabel(exact, approx),
    activeEquation: 'πᵉ=((1+i)/(1+r))−1  ·  approx πᵉ≈i−r',
    formulaBreakdown: `πᵉ=((1+${i.value}/100)/(1+${r.value}/100)−1)×100=${exact}; approx≈${i.value}−${r.value}=${approx}`,
    stepByStep: [
      `Decimals: i=${i.value / 100}, r=${r.value / 100}`,
      `Exact: (1+i)/(1+r)−1`,
      `Exact %: ${exact}`,
      `Approximate: ${i.value}−${r.value}=${approx}`,
    ],
    interpretation: interpretRealRate(r.value),
    explanation:
      'Expected inflation from the exact Fisher inverse; approximate uses i−r.',
  };
  return { isValid: true, errors, result };
}
