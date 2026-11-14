import {
  DECLINING_BALANCE_FACTOR,
  methodUsesProduction,
  methodUsesYears,
  type AccumulatedDepreciationInput,
  type AccumulatedDepreciationResult,
  type DepreciationMethod,
} from './types';

/** Half-up to two decimal places for money. */
export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function finite(value: number): boolean {
  return Number.isFinite(value);
}

function emptyResult(
  input: AccumulatedDepreciationInput,
  explanation: string
): AccumulatedDepreciationResult {
  return {
    defined: false,
    explanation,
    method: input.method,
    assetCost: input.assetCost,
    salvageValue: input.salvageValue,
    usefulLifeYears: methodUsesYears(input.method) ? input.usefulLifeYears : null,
    yearsElapsed: methodUsesYears(input.method) ? input.yearsElapsed : null,
    estimatedLifetimeUnits: methodUsesProduction(input.method) ? input.estimatedLifetimeUnits : null,
    unitsProduced: methodUsesProduction(input.method) ? input.unitsProduced : null,
    decliningBalanceRate: null,
    depreciableAmount: 0,
    accumulatedDepreciation: 0,
    netBookValue: 0,
    currency: input.currency,
  };
}

function finish(
  input: AccumulatedDepreciationInput,
  values: {
    accumulated: number;
    depreciableAmount: number;
    decliningBalanceRate: number | null;
  }
): AccumulatedDepreciationResult {
  const accumulatedDepreciation = roundMoney(values.accumulated);
  const assetCost = roundMoney(input.assetCost);
  const netBookValue = roundMoney(assetCost - accumulatedDepreciation);
  if (![accumulatedDepreciation, netBookValue, assetCost].every(finite)) {
    return emptyResult(input, 'This combination does not produce a finite money result.');
  }
  return {
    defined: true,
    explanation: null,
    method: input.method,
    assetCost,
    salvageValue: roundMoney(input.salvageValue),
    usefulLifeYears: methodUsesYears(input.method) ? input.usefulLifeYears : null,
    yearsElapsed: methodUsesYears(input.method) ? input.yearsElapsed : null,
    estimatedLifetimeUnits: methodUsesProduction(input.method) ? input.estimatedLifetimeUnits : null,
    unitsProduced: methodUsesProduction(input.method) ? input.unitsProduced : null,
    decliningBalanceRate: values.decliningBalanceRate,
    depreciableAmount: roundMoney(values.depreciableAmount),
    accumulatedDepreciation,
    netBookValue,
    currency: input.currency,
  };
}

/**
 * Cap cumulative depreciation so book value never falls below salvage.
 * Returns the capped accumulated amount (unrounded).
 */
function clampToSalvage(cost: number, salvage: number, accumulated: number): number {
  const max = Math.max(0, cost - salvage);
  if (accumulated <= 0) return 0;
  if (accumulated >= max) return max;
  return accumulated;
}

export function decliningBalanceRate(usefulLifeYears: number, factor = DECLINING_BALANCE_FACTOR): number {
  return factor / usefulLifeYears;
}

/**
 * Year-by-year double-declining balance.
 * Each period: dep = min(opening × rate, opening − salvage).
 * That is a salvage floor true-up inside the same method — not a switch to straight-line.
 */
export function decliningBalanceAccumulated(
  assetCost: number,
  salvageValue: number,
  usefulLifeYears: number,
  yearsElapsed: number,
  factor = DECLINING_BALANCE_FACTOR
): { accumulated: number; rate: number } {
  const rate = decliningBalanceRate(usefulLifeYears, factor);
  let book = assetCost;
  let accumulated = 0;
  const periods = Math.min(yearsElapsed, usefulLifeYears);
  for (let year = 1; year <= periods; year += 1) {
    const room = book - salvageValue;
    if (room <= 0) break;
    const raw = book * rate;
    const dep = Math.min(raw, room);
    accumulated += dep;
    book -= dep;
  }
  return { accumulated, rate };
}

export function sumOfYearsDigitsAccumulated(
  assetCost: number,
  salvageValue: number,
  usefulLifeYears: number,
  yearsElapsed: number
): number {
  const depreciable = assetCost - salvageValue;
  if (depreciable <= 0) return 0;
  const sumOfYears = (usefulLifeYears * (usefulLifeYears + 1)) / 2;
  const periods = Math.min(yearsElapsed, usefulLifeYears);
  let accumulated = 0;
  for (let year = 1; year <= periods; year += 1) {
    const remainingLife = usefulLifeYears - year + 1;
    accumulated += (depreciable * remainingLife) / sumOfYears;
  }
  return accumulated;
}

export function straightLineAccumulated(
  assetCost: number,
  salvageValue: number,
  usefulLifeYears: number,
  yearsElapsed: number
): number {
  const depreciable = assetCost - salvageValue;
  if (depreciable <= 0 || usefulLifeYears <= 0) return 0;
  const periods = Math.min(yearsElapsed, usefulLifeYears);
  return (depreciable / usefulLifeYears) * periods;
}

export function unitsOfProductionAccumulated(
  assetCost: number,
  salvageValue: number,
  estimatedLifetimeUnits: number,
  unitsProduced: number
): number {
  const depreciable = assetCost - salvageValue;
  if (depreciable <= 0 || estimatedLifetimeUnits <= 0) return 0;
  const units = Math.min(unitsProduced, estimatedLifetimeUnits);
  return (depreciable / estimatedLifetimeUnits) * units;
}

export function calculateAccumulatedDepreciation(
  input: AccumulatedDepreciationInput
): AccumulatedDepreciationResult {
  const cost = input.assetCost;
  const salvage = input.salvageValue;
  if (!finite(cost) || !finite(salvage)) {
    return emptyResult(input, 'Enter finite asset cost and salvage value.');
  }
  const depreciableAmount = Math.max(0, cost - salvage);

  if (input.method === 'straight-line') {
    const accumulated = clampToSalvage(
      cost,
      salvage,
      straightLineAccumulated(cost, salvage, input.usefulLifeYears, input.yearsElapsed)
    );
    return finish(input, { accumulated, depreciableAmount, decliningBalanceRate: null });
  }

  if (input.method === 'declining-balance') {
    const { accumulated, rate } = decliningBalanceAccumulated(
      cost,
      salvage,
      input.usefulLifeYears,
      input.yearsElapsed
    );
    return finish(input, {
      accumulated: clampToSalvage(cost, salvage, accumulated),
      depreciableAmount,
      decliningBalanceRate: rate,
    });
  }

  if (input.method === 'sum-of-years-digits') {
    const accumulated = clampToSalvage(
      cost,
      salvage,
      sumOfYearsDigitsAccumulated(cost, salvage, input.usefulLifeYears, input.yearsElapsed)
    );
    return finish(input, { accumulated, depreciableAmount, decliningBalanceRate: null });
  }

  if (input.method === 'units-of-production') {
    const accumulated = clampToSalvage(
      cost,
      salvage,
      unitsOfProductionAccumulated(
        cost,
        salvage,
        input.estimatedLifetimeUnits,
        input.unitsProduced
      )
    );
    return finish(input, { accumulated, depreciableAmount, decliningBalanceRate: null });
  }

  return emptyResult(input, 'Choose a depreciation method.');
}

export function methodLabel(method: DepreciationMethod): string {
  switch (method) {
    case 'straight-line':
      return 'Straight line';
    case 'declining-balance':
      return 'Declining balance (200% / double-declining)';
    case 'sum-of-years-digits':
      return "Sum of the year's digits";
    case 'units-of-production':
      return 'Units of production';
    default:
      return method;
  }
}

export function describeResult(result: AccumulatedDepreciationResult): string {
  if (!result.defined) return result.explanation ?? '';
  return `Accumulated depreciation is ${result.accumulatedDepreciation.toFixed(2)}; net book value is ${result.netBookValue.toFixed(2)}.`;
}
