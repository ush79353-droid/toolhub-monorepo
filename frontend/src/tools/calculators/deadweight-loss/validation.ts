import {
  buildLinearGraph,
  buildTaxGraph,
  buildTriangleGraph,
  calculateLinearDwl,
  calculateTaxDwl,
  calculateTriangleDwl,
  formatMoney,
  formatQuantity,
  modeLabel,
} from './calculation';
import type {
  DeadweightLossFieldErrors,
  DeadweightLossInput,
  DeadweightLossResult,
} from './types';

export interface DeadweightLossValidation {
  isValid: boolean;
  errors: DeadweightLossFieldErrors;
  result: DeadweightLossResult | null;
}

function parseNonNeg(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
  negative: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false, negative: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true, negative: false };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true, negative: false };
  }
  if (value < 0) {
    return { value: null, blank: false, invalid: false, negative: true };
  }
  return { value, blank: false, invalid: false, negative: false };
}

function requireNonNeg(
  raw: string,
  blankMsg: string,
  invalidMsg: string,
  negativeMsg: string
): { value: number | null; error?: string } {
  const p = parseNonNeg(raw);
  if (p.blank) return { value: null, error: blankMsg };
  if (p.invalid) return { value: null, error: invalidMsg };
  if (p.negative) return { value: null, error: negativeMsg };
  return { value: p.value };
}

export function validateDeadweightLossInput(
  input: DeadweightLossInput
): DeadweightLossValidation {
  const errors: DeadweightLossFieldErrors = {};
  let hasError = false;

  const assumptionNote =
    'This estimates a welfare-loss area under stated assumptions. It is not automatically equal to tax revenue, lost revenue, or a change in consumer surplus alone. A single observed transaction price may not equal the full economic wedge.';

  if (input.mode === 'triangle') {
    const p1 = requireNonNeg(
      input.originalPrice,
      'Enter the original price.',
      'Enter a valid original price.',
      'Original price cannot be negative.'
    );
    if (p1.error) {
      errors.originalPrice = p1.error;
      hasError = true;
    }
    const p2 = requireNonNeg(
      input.newPrice,
      'Enter the new (comparison) price.',
      'Enter a valid new price.',
      'New price cannot be negative.'
    );
    if (p2.error) {
      errors.newPrice = p2.error;
      hasError = true;
    }
    const q1 = requireNonNeg(
      input.originalQuantity,
      'Enter the original quantity.',
      'Enter a valid original quantity.',
      'Original quantity cannot be negative.'
    );
    if (q1.error) {
      errors.originalQuantity = q1.error;
      hasError = true;
    }
    const q2 = requireNonNeg(
      input.newQuantity,
      'Enter the new quantity.',
      'Enter a valid new quantity.',
      'New quantity cannot be negative.'
    );
    if (q2.error) {
      errors.newQuantity = q2.error;
      hasError = true;
    }

    if (hasError || p1.value == null || p2.value == null || q1.value == null || q2.value == null) {
      return { isValid: false, errors, result: null };
    }

    const math = calculateTriangleDwl(p1.value, p2.value, q1.value, q2.value);
    if (!math) {
      errors.form = 'Unable to compute deadweight loss from these inputs.';
      return { isValid: false, errors, result: null };
    }

    const graph = buildTriangleGraph(p1.value, p2.value, q1.value, q2.value);
    const result: DeadweightLossResult = {
      mode: 'triangle',
      currency: input.currency,
      quantityUnit: input.quantityUnit,
      priceDifference: math.priceDifference,
      quantityDifference: math.quantityDifference,
      deadweightLoss: math.deadweightLoss,
      taxRevenue: null,
      equilibriumQuantity: null,
      equilibriumPrice: null,
      formattedDeadweightLoss: formatMoney(math.deadweightLoss, input.currency),
      formattedPriceDifference: formatMoney(math.priceDifference, input.currency),
      formattedQuantityDifference: formatQuantity(math.quantityDifference),
      formattedTaxRevenue: null,
      formattedEquilibriumQuantity: null,
      formattedEquilibriumPrice: null,
      formulaBreakdown: `0.5 × ${math.priceDifference} × ${math.quantityDifference} = ${math.deadweightLoss}`,
      explanation: `Estimated triangular DWL is ${formatMoney(math.deadweightLoss, input.currency)} from |ΔP|=${formatMoney(math.priceDifference, input.currency)} and |ΔQ|=${formatQuantity(math.quantityDifference)} ${input.quantityUnit}.`,
      assumptionNote,
      graph,
    };
    return { isValid: true, errors, result };
  }

  if (input.mode === 'tax') {
    const qe = requireNonNeg(
      input.efficientQuantity,
      'Enter the efficient (pre-tax) quantity.',
      'Enter a valid efficient quantity.',
      'Efficient quantity cannot be negative.'
    );
    if (qe.error) {
      errors.efficientQuantity = qe.error;
      hasError = true;
    }
    const qt = requireNonNeg(
      input.afterTaxQuantity,
      'Enter the after-tax quantity.',
      'Enter a valid after-tax quantity.',
      'After-tax quantity cannot be negative.'
    );
    if (qt.error) {
      errors.afterTaxQuantity = qt.error;
      hasError = true;
    }
    const t = requireNonNeg(
      input.taxWedge,
      'Enter the per-unit tax wedge.',
      'Enter a valid tax wedge.',
      'Tax wedge cannot be negative.'
    );
    if (t.error) {
      errors.taxWedge = t.error;
      hasError = true;
    }

    if (hasError || qe.value == null || qt.value == null || t.value == null) {
      return { isValid: false, errors, result: null };
    }

    const math = calculateTaxDwl(qe.value, qt.value, t.value);
    if (!math) {
      errors.form = 'Unable to compute tax deadweight loss.';
      return { isValid: false, errors, result: null };
    }

    const graph = buildTaxGraph(qe.value, qt.value, t.value);
    const result: DeadweightLossResult = {
      mode: 'tax',
      currency: input.currency,
      quantityUnit: input.quantityUnit,
      priceDifference: t.value,
      quantityDifference: math.quantityDifference,
      deadweightLoss: math.deadweightLoss,
      taxRevenue: math.taxRevenue,
      equilibriumQuantity: qe.value,
      equilibriumPrice: null,
      formattedDeadweightLoss: formatMoney(math.deadweightLoss, input.currency),
      formattedPriceDifference: formatMoney(t.value, input.currency),
      formattedQuantityDifference: formatQuantity(math.quantityDifference),
      formattedTaxRevenue: formatMoney(math.taxRevenue, input.currency),
      formattedEquilibriumQuantity: formatQuantity(qe.value),
      formattedEquilibriumPrice: null,
      formulaBreakdown: `DWL = 0.5 × ${t.value} × ${math.quantityDifference} = ${math.deadweightLoss}; Tax revenue = ${t.value} × ${qt.value} = ${math.taxRevenue}`,
      explanation: `Per-unit tax DWL is ${formatMoney(math.deadweightLoss, input.currency)}. Tax revenue ${formatMoney(math.taxRevenue, input.currency)} is a transfer — not deadweight loss.`,
      assumptionNote:
        assumptionNote +
        ' Tax mode assumes a constant per-unit wedge and linear geometry for the loss triangle.',
      graph,
    };
    return { isValid: true, errors, result };
  }

  // linear
  const a = requireNonNeg(
    input.demandIntercept,
    'Enter demand intercept a (PD = a − bQ).',
    'Enter a valid demand intercept.',
    'Demand intercept cannot be negative.'
  );
  if (a.error) {
    errors.demandIntercept = a.error;
    hasError = true;
  }
  const bRaw = parseNonNeg(input.demandSlope);
  if (bRaw.blank) {
    errors.demandSlope = 'Enter demand slope b (> 0).';
    hasError = true;
  } else if (bRaw.invalid || bRaw.negative || bRaw.value == null || bRaw.value <= 0) {
    errors.demandSlope = 'Demand slope b must be a positive number.';
    hasError = true;
  }
  const c = requireNonNeg(
    input.supplyIntercept,
    'Enter supply intercept c (PS = c + dQ).',
    'Enter a valid supply intercept.',
    'Supply intercept cannot be negative.'
  );
  if (c.error) {
    errors.supplyIntercept = c.error;
    hasError = true;
  }
  const dRaw = parseNonNeg(input.supplySlope);
  if (dRaw.blank) {
    errors.supplySlope = 'Enter supply slope d (> 0).';
    hasError = true;
  } else if (dRaw.invalid || dRaw.negative || dRaw.value == null || dRaw.value <= 0) {
    errors.supplySlope = 'Supply slope d must be a positive number.';
    hasError = true;
  }
  const qd = requireNonNeg(
    input.distortedQuantity,
    'Enter the distorted quantity Qd.',
    'Enter a valid distorted quantity.',
    'Distorted quantity cannot be negative.'
  );
  if (qd.error) {
    errors.distortedQuantity = qd.error;
    hasError = true;
  }

  if (
    hasError ||
    a.value == null ||
    bRaw.value == null ||
    c.value == null ||
    dRaw.value == null ||
    qd.value == null
  ) {
    return { isValid: false, errors, result: null };
  }

  if (a.value <= c.value) {
    errors.form =
      'Need a > c so demand and supply intersect at a positive competitive quantity.';
    return { isValid: false, errors, result: null };
  }

  const math = calculateLinearDwl(
    a.value,
    bRaw.value,
    c.value,
    dRaw.value,
    qd.value
  );
  if (!math) {
    errors.form =
      'Unable to find a valid competitive equilibrium or DWL for these curves.';
    return { isValid: false, errors, result: null };
  }

  const graph = buildLinearGraph(
    a.value,
    bRaw.value,
    c.value,
    dRaw.value,
    math.qe,
    qd.value,
    math.pe
  );

  const result: DeadweightLossResult = {
    mode: 'linear',
    currency: input.currency,
    quantityUnit: input.quantityUnit,
    priceDifference: math.priceWedgeAtQd,
    quantityDifference: math.quantityDifference,
    deadweightLoss: math.deadweightLoss,
    taxRevenue: null,
    equilibriumQuantity: math.qe,
    equilibriumPrice: math.pe,
    formattedDeadweightLoss: formatMoney(math.deadweightLoss, input.currency),
    formattedPriceDifference: formatMoney(math.priceWedgeAtQd, input.currency),
    formattedQuantityDifference: formatQuantity(math.quantityDifference),
    formattedTaxRevenue: null,
    formattedEquilibriumQuantity: formatQuantity(math.qe),
    formattedEquilibriumPrice: formatMoney(math.pe, input.currency),
    formulaBreakdown: `Qe=${math.qe.toFixed(6)}, Pe=${math.pe.toFixed(6)}; DWL=0.5×(${bRaw.value}+${dRaw.value})×(${math.quantityDifference})²=${math.deadweightLoss}`,
    explanation: `Linear S&D (${modeLabel('linear')}): competitive Qe=${formatQuantity(math.qe)} at Pe=${formatMoney(math.pe, input.currency)}. Distorted Qd=${formatQuantity(qd.value)} yields DWL ${formatMoney(math.deadweightLoss, input.currency)}.`,
    assumptionNote:
      assumptionNote +
      ' Linear mode uses explicit inverse demand and supply; DWL equals the integral of PD−PS between Qe and Qd.',
    graph,
  };
  return { isValid: true, errors, result };
}
