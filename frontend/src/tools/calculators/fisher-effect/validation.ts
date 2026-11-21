import {
  approximateExpectedInflation,
  approximateNominalRate,
  approximateRealRate,
  calculateExpectedInflation,
  calculateNominalRate,
  calculateRealRate,
  formatRatePercent,
  interpretRealRate,
} from './calculation';
import type {
  FisherEffectFieldErrors,
  FisherEffectInput,
  FisherEffectResult,
} from './types';

export interface FisherEffectValidation {
  isValid: boolean;
  errors: FisherEffectFieldErrors;
  result: FisherEffectResult | null;
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
  belowMinus100Msg: string,
  opts?: { rejectAtOrBelowMinus100?: boolean; rejectBelowMinus100?: boolean }
): { value: number | null; error?: string } {
  const p = parseRate(raw);
  if (p.blank) return { value: null, error: blankMsg };
  if (p.invalid || p.value === null) return { value: null, error: invalidMsg };
  if (opts?.rejectAtOrBelowMinus100 && p.value <= -100) {
    return { value: null, error: belowMinus100Msg };
  }
  if (opts?.rejectBelowMinus100 && p.value < -100) {
    return { value: null, error: belowMinus100Msg };
  }
  return { value: p.value };
}

export function validateFisherEffectInput(
  input: FisherEffectInput
): FisherEffectValidation {
  const errors: FisherEffectFieldErrors = {};
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
      'Enter expected inflation.',
      'Enter a valid expected inflation rate.',
      'Expected inflation must be greater than −100% for the real-rate calculation (division by 1+πᵉ).',
      { rejectAtOrBelowMinus100: true }
    );
    if (pi.error) errors.expectedInflation = pi.error;

    if (i.value == null || pi.value == null) {
      return { isValid: false, errors, result: null };
    }

    const exact = calculateRealRate(i.value, pi.value);
    if (exact == null) {
      errors.form = 'Unable to compute the real interest rate for these inputs.';
      return { isValid: false, errors, result: null };
    }
    const approx = approximateRealRate(i.value, pi.value);
    const diff = exact - approx;

    const result: FisherEffectResult = {
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
      formattedDifference: `${formatRatePercent(Math.abs(diff))} (${diff >= 0 ? 'exact higher' : 'approx higher'})`,
      formulaBreakdown: `r = ((1 + ${i.value}/100) / (1 + ${pi.value}/100) − 1) × 100 = ${exact}; approx r ≈ ${i.value} − ${pi.value} = ${approx}`,
      interpretation: interpretRealRate(exact),
      explanation:
        'Exact Fisher equation is the default. The approximate result (i − πᵉ) is shown for comparison and is not labeled exact.',
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
      'Enter expected inflation.',
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
      errors.form = 'Unable to compute the nominal interest rate for these inputs.';
      return { isValid: false, errors, result: null };
    }
    const approx = approximateNominalRate(r.value, pi.value);
    const diff = exact - approx;

    const result: FisherEffectResult = {
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
      formattedDifference: `${formatRatePercent(Math.abs(diff))} (${diff >= 0 ? 'exact higher' : 'approx higher'})`,
      formulaBreakdown: `i = (1 + ${r.value}/100)(1 + ${pi.value}/100) − 1 → ${exact}%; approx i ≈ ${r.value} + ${pi.value} = ${approx}%`,
      interpretation: interpretRealRate(r.value),
      explanation:
        'Nominal rate from the exact Fisher product. Approximate uses r + πᵉ.',
    };
    return { isValid: true, errors, result };
  }

  // inflation mode
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
    'Real interest rate must be greater than −100% for the inflation calculation (division by 1+r).',
    { rejectAtOrBelowMinus100: true }
  );
  if (r.error) errors.realRate = r.error;

  if (i.value == null || r.value == null) {
    return { isValid: false, errors, result: null };
  }

  const exact = calculateExpectedInflation(i.value, r.value);
  if (exact == null) {
    errors.form = 'Unable to compute expected inflation for these inputs.';
    return { isValid: false, errors, result: null };
  }
  const approx = approximateExpectedInflation(i.value, r.value);
  const diff = exact - approx;

  const result: FisherEffectResult = {
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
    formattedDifference: `${formatRatePercent(Math.abs(diff))} (${diff >= 0 ? 'exact higher' : 'approx higher'})`,
    formulaBreakdown: `πᵉ = ((1 + ${i.value}/100) / (1 + ${r.value}/100) − 1) × 100 = ${exact}; approx πᵉ ≈ ${i.value} − ${r.value} = ${approx}`,
    interpretation: interpretRealRate(r.value),
    explanation:
      'Expected inflation from the exact Fisher inverse. Approximate uses i − r.',
  };
  return { isValid: true, errors, result };
}
