import {
  calculateMidpointPES,
  calculateMidpointPriceChangePercent,
  calculateMidpointQuantityChangePercent,
  calculateStandardPES,
  calculateStandardPriceChangePercent,
  calculateStandardQuantityChangePercent,
  classificationLabel,
  classifySupplyElasticity,
  formatElasticity,
  formatMoney,
  formatPercent,
  formatQuantity,
  interpretPes,
  methodLabel,
} from './calculation';
import type {
  PriceElasticityOfSupplyFieldErrors,
  PriceElasticityOfSupplyInput,
  PriceElasticityOfSupplyResult,
  PesClassification,
  PesStatus,
} from './types';

export interface PesValidation {
  isValid: boolean;
  errors: PriceElasticityOfSupplyFieldErrors;
  result: PriceElasticityOfSupplyResult | null;
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

function emptyResult(
  input: PriceElasticityOfSupplyInput,
  status: PesStatus,
  classification: PesClassification,
  warningMessage: string | null,
  interpretation: string,
  partial: Partial<PriceElasticityOfSupplyResult> = {}
): PriceElasticityOfSupplyResult {
  return {
    method: input.method,
    methodLabel: methodLabel(input.method),
    pes: null,
    classification,
    classificationLabel: classificationLabel(classification),
    percentPriceChange: null,
    percentQuantityChange: null,
    priceChange: null,
    quantityChange: null,
    status,
    interpretation,
    warningMessage,
    formulaBreakdown:
      input.method === 'midpoint'
        ? 'PES = [(Q₂−Q₁)/((Q₁+Q₂)/2)] / [(P₂−P₁)/((P₁+P₂)/2)]'
        : 'PES = [(Q₂−Q₁)/Q₁] / [(P₂−P₁)/P₁]',
    steps: [],
    currency: input.currency,
    formattedPes: '—',
    formattedPercentPrice: '—',
    formattedPercentQuantity: '—',
    p1: null,
    p2: null,
    q1: null,
    q2: null,
    ...partial,
  };
}

export function validatePriceElasticityOfSupplyInput(
  input: PriceElasticityOfSupplyInput
): PesValidation {
  const errors: PriceElasticityOfSupplyFieldErrors = {};
  const p1 = parseNumber(input.price1);
  const p2 = parseNumber(input.price2);
  const q1 = parseNumber(input.quantity1);
  const q2 = parseNumber(input.quantity2);

  if (!p1.blank) {
    if (p1.invalid || p1.value === null)
      errors.price1 = 'Enter a valid Period 1 price.';
    else if (p1.value <= 0) errors.price1 = 'Price in Period 1 must be positive.';
  }
  if (!p2.blank) {
    if (p2.invalid || p2.value === null)
      errors.price2 = 'Enter a valid Period 2 price.';
    else if (p2.value <= 0) errors.price2 = 'Price in Period 2 must be positive.';
  }
  if (!q1.blank) {
    if (q1.invalid || q1.value === null)
      errors.quantity1 = 'Enter a valid Period 1 quantity supplied.';
    else if (q1.value < 0)
      errors.quantity1 = 'Quantity supplied cannot be negative.';
    else if (input.method === 'standard' && q1.value === 0)
      errors.quantity1 =
        'Standard method requires Q₁ > 0 (Period 1 is the base).';
  }
  if (!q2.blank) {
    if (q2.invalid || q2.value === null)
      errors.quantity2 = 'Enter a valid Period 2 quantity supplied.';
    else if (q2.value < 0)
      errors.quantity2 = 'Quantity supplied cannot be negative.';
  }

  const anyBlank = p1.blank || p2.blank || q1.blank || q2.blank;
  if (Object.keys(errors).length > 0) {
    return {
      isValid: false,
      errors,
      result: emptyResult(
        input,
        'invalid',
        'unavailable',
        null,
        'Fix the highlighted fields to calculate PES.'
      ),
    };
  }

  if (anyBlank) {
    return {
      isValid: false,
      errors: {},
      result: emptyResult(
        input,
        'incomplete',
        'unavailable',
        null,
        'Enter P₁, P₂, Q₁, and Q₂ to calculate price elasticity of supply.'
      ),
    };
  }

  const P1 = p1.value!;
  const P2 = p2.value!;
  const Q1 = q1.value!;
  const Q2 = q2.value!;

  const percentPrice =
    input.method === 'midpoint'
      ? calculateMidpointPriceChangePercent(P1, P2)
      : calculateStandardPriceChangePercent(P1, P2);
  const percentQuantity =
    input.method === 'midpoint'
      ? calculateMidpointQuantityChangePercent(Q1, Q2)
      : calculateStandardQuantityChangePercent(Q1, Q2);

  if (Math.abs(P2 - P1) < 1e-12) {
    let undefinedReason: string;
    if (Math.abs(Q2 - Q1) < 1e-12) {
      undefinedReason =
        'Neither price nor quantity supplied changed, so these observations provide no measurable elasticity estimate.';
    } else {
      undefinedReason =
        'Price did not change, so a finite elasticity coefficient cannot be calculated from these observations. Quantity supplied changed despite an unchanged price: the finite-difference ratio is undefined (not Infinity).';
    }
    return {
      isValid: false,
      errors: {},
      result: emptyResult(
        input,
        'undefinedElasticity',
        'undefined',
        undefinedReason,
        undefinedReason,
        {
          percentPriceChange: percentPrice,
          percentQuantityChange: percentQuantity,
          priceChange: P2 - P1,
          quantityChange: Q2 - Q1,
          formattedPercentPrice:
            percentPrice != null ? `${formatPercent(percentPrice)}%` : '—',
          formattedPercentQuantity:
            percentQuantity != null
              ? `${formatPercent(percentQuantity)}%`
              : '—',
          p1: P1,
          p2: P2,
          q1: Q1,
          q2: Q2,
          steps: [
            `P₁ = ${formatMoney(P1, input.currency)}, P₂ = ${formatMoney(P2, input.currency)}.`,
            'ΔP = 0 → PES denominator is zero.',
            undefinedReason,
          ],
        }
      ),
    };
  }

  if (input.method === 'midpoint' && Q1 + Q2 <= 0) {
    return {
      isValid: false,
      errors: { quantity1: 'Midpoint method needs a positive average quantity.' },
      result: emptyResult(
        input,
        'invalid',
        'unavailable',
        null,
        'Average quantity supplied must be positive for the midpoint method.'
      ),
    };
  }

  const pes =
    input.method === 'midpoint'
      ? calculateMidpointPES(P1, P2, Q1, Q2)
      : calculateStandardPES(P1, P2, Q1, Q2);

  if (pes === null) {
    return {
      isValid: false,
      errors: {},
      result: emptyResult(
        input,
        'undefinedElasticity',
        'undefined',
        'Could not compute a finite PES from these inputs.',
        'Could not compute a finite PES from these inputs.',
        {
          percentPriceChange: percentPrice,
          percentQuantityChange: percentQuantity,
          p1: P1,
          p2: P2,
          q1: Q1,
          q2: Q2,
        }
      ),
    };
  }

  const classification = classifySupplyElasticity(pes);
  const steps =
    input.method === 'midpoint'
      ? [
          `%ΔP = (P₂−P₁)/((P₁+P₂)/2)×100 = ${formatPercent(percentPrice!)}%.`,
          `%ΔQs = (Q₂−Q₁)/((Q₁+Q₂)/2)×100 = ${formatPercent(percentQuantity!)}%.`,
          `PES = %ΔQs / %ΔP = ${formatElasticity(pes)}.`,
          classificationLabel(classification),
        ]
      : [
          `%ΔP = (P₂−P₁)/P₁×100 = ${formatPercent(percentPrice!)}%.`,
          `%ΔQs = (Q₂−Q₁)/Q₁×100 = ${formatPercent(percentQuantity!)}%.`,
          `PES = %ΔQs / %ΔP = ${formatElasticity(pes)}.`,
          classificationLabel(classification),
        ];

  const result: PriceElasticityOfSupplyResult = {
    method: input.method,
    methodLabel: methodLabel(input.method),
    pes,
    classification,
    classificationLabel: classificationLabel(classification),
    percentPriceChange: percentPrice,
    percentQuantityChange: percentQuantity,
    priceChange: P2 - P1,
    quantityChange: Q2 - Q1,
    status: 'valid',
    interpretation: interpretPes({
      pes,
      classification,
      percentPrice,
      percentQuantity,
      method: input.method,
    }),
    warningMessage: null,
    formulaBreakdown:
      input.method === 'midpoint'
        ? 'PES = [(Q₂−Q₁)/((Q₁+Q₂)/2)] / [(P₂−P₁)/((P₁+P₂)/2)]'
        : 'PES = [(Q₂−Q₁)/Q₁] / [(P₂−P₁)/P₁]',
    steps,
    currency: input.currency,
    formattedPes: formatElasticity(pes),
    formattedPercentPrice: `${formatPercent(percentPrice!)}%`,
    formattedPercentQuantity: `${formatPercent(percentQuantity!)}%`,
    p1: P1,
    p2: P2,
    q1: Q1,
    q2: Q2,
  };

  return { isValid: true, errors: {}, result };
}

export function formatObservationSummary(
  result: PriceElasticityOfSupplyResult
): string {
  if (result.p1 == null || result.q1 == null) return '';
  return `P₁ ${formatMoney(result.p1, result.currency)} · Q₁ ${formatQuantity(result.q1!)} → P₂ ${formatMoney(result.p2!, result.currency)} · Q₂ ${formatQuantity(result.q2!)}`;
}
