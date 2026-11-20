import {
  calculateMidpointElasticity,
  calculateRevenue,
  calculateRevenueIncreasePercent,
  classificationLabel,
  classifyPed,
  formatElasticity,
  formatPedMoney,
  formatPercent,
  formatPlainQuantity,
  interpretPed,
  midpointBreakdown,
} from './calculation';
import type {
  PedClassification,
  PedStatus,
  PriceElasticityOfDemandFieldErrors,
  PriceElasticityOfDemandInput,
  PriceElasticityOfDemandResult,
} from './types';

export interface PriceElasticityOfDemandValidation {
  isValid: boolean;
  errors: PriceElasticityOfDemandFieldErrors;
  result: PriceElasticityOfDemandResult | null;
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
  currency: PriceElasticityOfDemandInput['currency'],
  status: PedStatus,
  warningMessage: string | null,
  interpretation: string,
  partial: Partial<PriceElasticityOfDemandResult> = {}
): PriceElasticityOfDemandResult {
  return {
    priceElasticity: null,
    classification: 'unavailable',
    classificationLabel: '—',
    initialRevenue: null,
    finalRevenue: null,
    revenueIncreasePercent: null,
    revenueIncreaseUndefinedReason: null,
    priceChange: null,
    averagePrice: null,
    percentPriceChange: null,
    quantityChange: null,
    averageQuantity: null,
    percentQuantityChange: null,
    revenueChangeAmount: null,
    status,
    interpretation,
    warningMessage,
    currency,
    formattedPriceElasticity: null,
    formattedInitialRevenue: null,
    formattedFinalRevenue: null,
    formattedRevenueIncrease: null,
    formattedPriceChange: null,
    formattedAveragePrice: null,
    formattedPercentPriceChange: null,
    formattedQuantityChange: null,
    formattedAverageQuantity: null,
    formattedPercentQuantityChange: null,
    formattedRevenueChangeAmount: null,
    ...partial,
  };
}

export function validatePriceElasticityOfDemandInput(
  input: PriceElasticityOfDemandInput
): PriceElasticityOfDemandValidation {
  const errors: PriceElasticityOfDemandFieldErrors = {};
  const currency = input.currency;

  const p1 = parseNumber(input.initialPrice);
  const q1 = parseNumber(input.initialQuantity);
  const p2 = parseNumber(input.finalPrice);
  const q2 = parseNumber(input.finalQuantity);

  if (!p1.blank) {
    if (p1.invalid || p1.value === null) {
      errors.initialPrice = 'Enter a valid initial price.';
    } else if (p1.value <= 0) {
      errors.initialPrice = 'Initial price must be greater than zero.';
    }
  }

  if (!p2.blank) {
    if (p2.invalid || p2.value === null) {
      errors.finalPrice = 'Enter a valid final price.';
    } else if (p2.value <= 0) {
      errors.finalPrice = 'Final price must be greater than zero.';
    }
  }

  if (!q1.blank) {
    if (q1.invalid || q1.value === null) {
      errors.initialQuantity = 'Enter a valid initial quantity.';
    } else if (q1.value < 0) {
      errors.initialQuantity = 'Initial quantity cannot be negative.';
    }
  }

  if (!q2.blank) {
    if (q2.invalid || q2.value === null) {
      errors.finalQuantity = 'Enter a valid final quantity.';
    } else if (q2.value < 0) {
      errors.finalQuantity = 'Final quantity cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const anyFilled = !p1.blank || !q1.blank || !p2.blank || !q2.blank;
  if (!anyFilled) {
    return { isValid: false, errors, result: null };
  }

  const initialRevenue =
    !p1.blank && !q1.blank && p1.value !== null && q1.value !== null
      ? calculateRevenue(p1.value, q1.value)
      : null;
  const finalRevenue =
    !p2.blank && !q2.blank && p2.value !== null && q2.value !== null
      ? calculateRevenue(p2.value, q2.value)
      : null;

  let revenueIncreasePercent: number | null = null;
  let revenueIncreaseUndefinedReason: string | null = null;
  let revenueChangeAmount: number | null = null;

  if (initialRevenue !== null && finalRevenue !== null) {
    revenueChangeAmount = finalRevenue - initialRevenue;
    if (initialRevenue <= 0 && finalRevenue <= 0) {
      revenueIncreaseUndefinedReason =
        'Not defined – both initial and final revenue are zero.';
    } else if (initialRevenue <= 0) {
      revenueIncreaseUndefinedReason =
        'Not defined – initial revenue is zero.';
    } else {
      revenueIncreasePercent = calculateRevenueIncreasePercent(
        initialRevenue,
        finalRevenue
      );
    }
  }

  const allFour =
    !p1.blank &&
    !q1.blank &&
    !p2.blank &&
    !q2.blank &&
    p1.value !== null &&
    q1.value !== null &&
    p2.value !== null &&
    q2.value !== null;

  let priceElasticity: number | null = null;
  let classification: PedClassification = 'unavailable';
  let status: PedStatus = 'incomplete';
  let warningMessage: string | null =
    'PED uses the midpoint (arc) formula and is dimensionless. Currency labels amounts only (no FX conversion).';
  let breakdown: ReturnType<typeof midpointBreakdown> = null;

  if (allFour) {
    if (p1.value === p2.value) {
      status = 'undefinedElasticity';
      warningMessage =
        'PED undefined – initial and final prices are equal (no price change).';
      errors.form = warningMessage;
    } else if (q1.value === 0 && q2.value === 0) {
      status = 'undefinedElasticity';
      warningMessage =
        'PED undefined – average quantity is zero when both quantities are zero.';
      errors.form = warningMessage;
    } else {
      priceElasticity = calculateMidpointElasticity(
        p1.value,
        q1.value,
        p2.value,
        q2.value
      );
      breakdown = midpointBreakdown(
        p1.value,
        q1.value,
        p2.value,
        q2.value
      );

      if (priceElasticity === null) {
        status = 'undefinedElasticity';
        warningMessage =
          'PED could not be calculated for these observations under the midpoint method.';
        errors.form = warningMessage;
      } else {
        status = 'valid';
        classification = classifyPed(priceElasticity);
        if (
          classification === 'positiveRelationship' ||
          classification === 'positiveUnit'
        ) {
          warningMessage =
            'Positive PED: price and quantity moved together. The observed relationship may reflect changes in other market conditions, not a standard downward-sloping demand response.';
        }
      }
    }
  }

  const label = classificationLabel(classification);
  const interpretation = interpretPed(
    priceElasticity,
    classification,
    revenueIncreasePercent
  );

  const result: PriceElasticityOfDemandResult = emptyResult(
    currency,
    status,
    warningMessage,
    interpretation,
    {
      priceElasticity,
      classification,
      classificationLabel: label,
      initialRevenue,
      finalRevenue,
      revenueIncreasePercent,
      revenueIncreaseUndefinedReason,
      revenueChangeAmount,
      priceChange: breakdown?.priceChange ?? null,
      averagePrice: breakdown?.averagePrice ?? null,
      percentPriceChange: breakdown?.percentPriceChange ?? null,
      quantityChange: breakdown?.quantityChange ?? null,
      averageQuantity: breakdown?.averageQuantity ?? null,
      percentQuantityChange: breakdown?.percentQuantityChange ?? null,
      formattedPriceElasticity:
        priceElasticity === null ? null : formatElasticity(priceElasticity),
      formattedInitialRevenue:
        initialRevenue === null
          ? null
          : formatPedMoney(initialRevenue, currency),
      formattedFinalRevenue:
        finalRevenue === null ? null : formatPedMoney(finalRevenue, currency),
      formattedRevenueIncrease:
        revenueIncreasePercent === null
          ? null
          : `${formatPercent(revenueIncreasePercent)}%`,
      formattedPriceChange:
        breakdown == null
          ? null
          : formatPedMoney(breakdown.priceChange, currency),
      formattedAveragePrice:
        breakdown == null
          ? null
          : formatPedMoney(breakdown.averagePrice, currency),
      formattedPercentPriceChange:
        breakdown == null
          ? null
          : `${formatPercent(breakdown.percentPriceChange)}%`,
      formattedQuantityChange:
        breakdown == null
          ? null
          : formatPlainQuantity(breakdown.quantityChange),
      formattedAverageQuantity:
        breakdown == null
          ? null
          : formatPlainQuantity(breakdown.averageQuantity),
      formattedPercentQuantityChange:
        breakdown == null
          ? null
          : `${formatPercent(breakdown.percentQuantityChange)}%`,
      formattedRevenueChangeAmount:
        revenueChangeAmount === null
          ? null
          : formatPedMoney(revenueChangeAmount, currency),
    }
  );

  const isValid = status === 'valid';
  return { isValid, errors, result };
}
