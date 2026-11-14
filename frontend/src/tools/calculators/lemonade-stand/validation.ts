import { isSupportedCurrency } from '@/tools/shared/currency';
import {
  buildExplanation,
  calculateCostPerServing,
  calculateCupsCost,
  calculateIngredientsCost,
  calculateTotalCost,
  calculateTotalProfit,
  formatMoney,
} from './calculation';
import { formatCurrencyValue } from '@/tools/shared/currency';
import type {
  LemonadeStandDraft,
  LemonadeStandFieldErrors,
  LemonadeStandResult,
} from './types';

function parseOptional(
  raw: string,
  label: string,
  opts?: { allowBlankAsZero?: boolean; requirePositive?: boolean }
): { value: number | null; blank: boolean; error?: string } {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') {
    if (opts?.allowBlankAsZero) return { value: 0, blank: false };
    return { value: null, blank: true };
  }
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  if (!/^[+-]?\d+(\.\d+)?$/.test(cleaned)) {
    return { value: null, blank: false, error: `${label} must be a number.` };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, error: `Enter a valid ${label}.` };
  }
  if (value < 0) {
    return { value: null, blank: false, error: `${label} cannot be negative.` };
  }
  if (opts?.requirePositive && value <= 0) {
    return { value: null, blank: false, error: `${label} must be greater than zero.` };
  }
  return { value, blank: false };
}

export function validateLemonadeStandDraft(draft: LemonadeStandDraft): {
  isValid: boolean;
  incomplete: boolean;
  errors: LemonadeStandFieldErrors;
  result: LemonadeStandResult | null;
} {
  const errors: LemonadeStandFieldErrors = {};
  if (!isSupportedCurrency(draft.currency)) {
    errors.currency = 'Choose a supported currency';
  }

  const servings = parseOptional(draft.servings, 'Servings', { requirePositive: true });
  if (servings.blank) {
    /* incomplete */
  } else if (servings.error) {
    errors.servings = servings.error;
  } else if (servings.value !== null && !Number.isInteger(servings.value)) {
    errors.servings = 'Servings must be a whole number.';
  }

  const modifyCups = draft.modifyCupCosts === 'yes';
  const costPerCup = parseOptional(draft.costPerCup, 'Cost per cup');
  const cupsOverride = parseOptional(draft.cupsTotalOverride, 'Total cost of cups');

  if (!modifyCups) {
    if (!costPerCup.blank && costPerCup.error) errors.costPerCup = costPerCup.error;
  } else if (!cupsOverride.blank && cupsOverride.error) {
    errors.cupsTotalOverride = cupsOverride.error;
  }

  const permitNeeded = draft.requiresPermit === 'yes';
  const permit = parseOptional(draft.permitCost, 'Permit cost', {
    allowBlankAsZero: !permitNeeded,
  });
  if (permitNeeded) {
    if (permit.blank) {
      /* incomplete */
    } else if (permit.error) errors.permitCost = permit.error;
  } else if (permit.error) {
    errors.permitCost = permit.error;
  }

  const knownIngredients = parseOptional(draft.ingredientsCost, 'Cost of ingredients', {
    allowBlankAsZero: draft.ingredientsMode === 'known',
  });
  const lemons = parseOptional(draft.lemonsCost, 'Lemons cost', {
    allowBlankAsZero: draft.ingredientsMode === 'recipe',
  });
  const sugar = parseOptional(draft.sugarCost, 'Sugar cost', {
    allowBlankAsZero: draft.ingredientsMode === 'recipe',
  });
  const water = parseOptional(draft.waterCost, 'Water cost', {
    allowBlankAsZero: draft.ingredientsMode === 'recipe',
  });

  if (draft.ingredientsMode === 'known') {
    if (!knownIngredients.blank && knownIngredients.error) {
      errors.ingredientsCost = knownIngredients.error;
    }
  } else {
    if (lemons.error) errors.lemonsCost = lemons.error;
    if (sugar.error) errors.sugarCost = sugar.error;
    if (water.error) errors.waterCost = water.error;
  }

  const other = parseOptional(draft.otherCosts, 'Other costs', { allowBlankAsZero: true });
  if (other.error) errors.otherCosts = other.error;

  const selling = parseOptional(draft.sellingPrice, 'Selling price');
  if (!selling.blank && selling.error) errors.sellingPrice = selling.error;

  let targetProfit: number | null = null;
  if (draft.hasTargetGoal === 'yes') {
    const target = parseOptional(draft.targetProfit, 'Target profit');
    if (target.blank) {
      /* incomplete for target only — still allow profit calc */
    } else if (target.error) {
      errors.targetProfit = target.error;
    } else {
      targetProfit = target.value;
    }
  }

  const cupsReady = modifyCups
    ? !cupsOverride.blank && cupsOverride.value !== null && !cupsOverride.error
    : !costPerCup.blank && costPerCup.value !== null && !costPerCup.error;

  const ingredientsReady =
    draft.ingredientsMode === 'known'
      ? !knownIngredients.error && knownIngredients.value !== null
      : !lemons.error &&
        !sugar.error &&
        !water.error &&
        lemons.value !== null &&
        sugar.value !== null &&
        water.value !== null;

  const permitReady =
    !permitNeeded || (!permit.blank && permit.value !== null && !permit.error);

  const coreReady =
    !servings.blank &&
    servings.value !== null &&
    !errors.servings &&
    cupsReady &&
    ingredientsReady &&
    permitReady &&
    other.value !== null &&
    !other.error;

  const sellingReady = !selling.blank && selling.value !== null && !selling.error;

  if (!coreReady || !sellingReady || Object.keys(errors).length > 0) {
    const incomplete =
      (!coreReady || !sellingReady) && Object.keys(errors).length === 0;
    return { isValid: false, incomplete, errors, result: null };
  }

  const cupsCost = calculateCupsCost(
    servings.value!,
    costPerCup.value ?? Number.NaN,
    modifyCups,
    cupsOverride.value ?? Number.NaN
  );
  const ingredientsCost = calculateIngredientsCost(
    draft.ingredientsMode,
    knownIngredients.value ?? Number.NaN,
    lemons.value ?? Number.NaN,
    sugar.value ?? Number.NaN,
    water.value ?? Number.NaN
  );
  const permitCost = permitNeeded ? permit.value! : 0;
  const otherCosts = other.value!;
  const totalCost = calculateTotalCost(cupsCost, ingredientsCost, permitCost, otherCosts);
  const costPerServing = calculateCostPerServing(totalCost, servings.value!);
  const totalProfit = calculateTotalProfit(selling.value!, servings.value!, totalCost);
  const breakEvenPrice = costPerServing;

  if (
    !Number.isFinite(cupsCost) ||
    !Number.isFinite(ingredientsCost) ||
    !Number.isFinite(totalCost) ||
    !Number.isFinite(costPerServing) ||
    !Number.isFinite(totalProfit)
  ) {
    errors.form = 'This combination does not produce a finite result.';
    return { isValid: false, incomplete: false, errors, result: null };
  }

  const totalRevenue = selling.value! * servings.value!;
  const result: LemonadeStandResult = {
    servings: servings.value!,
    cupsCost,
    ingredientsCost,
    permitCost,
    otherCosts,
    totalCost,
    costPerServing,
    sellingPrice: selling.value!,
    totalRevenue,
    totalProfit,
    breakEvenPrice,
    targetProfit,
    currency: draft.currency,
    cupsDisplay: formatMoney(cupsCost, draft.currency),
    ingredientsDisplay: formatMoney(ingredientsCost, draft.currency),
    totalCostDisplay: formatMoney(totalCost, draft.currency),
    costPerServingDisplay: formatMoney(costPerServing, draft.currency),
    profitDisplay: formatMoney(totalProfit, draft.currency),
    breakEvenDisplay: formatMoney(breakEvenPrice, draft.currency),
    shareTotalCost: formatCurrencyValue(totalCost, draft.currency),
    shareProfit: formatCurrencyValue(totalProfit, draft.currency),
    shareBreakEven: formatCurrencyValue(breakEvenPrice, draft.currency),
    explanation: buildExplanation({
      totalProfit,
      totalCost,
      servings: servings.value!,
      sellingPrice: selling.value!,
      breakEvenPrice,
      targetProfit,
      currency: draft.currency,
    }),
  };

  return { isValid: true, incomplete: false, errors: {}, result };
}
