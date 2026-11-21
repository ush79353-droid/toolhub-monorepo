import {
  calculateMarginalCost,
  formatMcMoney,
  formatMcQuantity,
  interpretMarginalCost,
  unitPluralLabel,
  unitShortLabel,
} from './calculation';
import type {
  MarginalCostFieldErrors,
  MarginalCostInput,
  MarginalCostResult,
  MarginalCostStatus,
} from './types';

export interface MarginalCostValidation {
  isValid: boolean;
  errors: MarginalCostFieldErrors;
  result: MarginalCostResult | null;
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

export function validateMarginalCostInput(
  input: MarginalCostInput
): MarginalCostValidation {
  const errors: MarginalCostFieldErrors = {};
  const currency = input.currency;
  const quantityUnit = input.quantityUnit;
  const unitShort = unitShortLabel(quantityUnit);
  const unitPlural = unitPluralLabel(quantityUnit);

  const dtc = parseNumber(input.changeInTotalCost);
  const dq = parseNumber(input.changeInQuantity);

  if (!dtc.blank) {
    if (dtc.invalid || dtc.value === null) {
      errors.changeInTotalCost = 'Enter a valid change in total cost.';
    }
  }

  if (!dq.blank) {
    if (dq.invalid || dq.value === null) {
      errors.changeInQuantity = 'Enter a valid change in quantity.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (dtc.blank || dq.blank || dtc.value === null || dq.value === null) {
    return { isValid: false, errors, result: null };
  }

  let status: MarginalCostStatus = 'valid';
  let warningMessage: string | null =
    'MC = ΔTC ÷ ΔQ (discrete incremental cost over the interval). Currency labels amounts only (no FX). Changing the quantity unit does not convert values.';
  let marginalCost: number | null = null;
  let isValid = true;

  if (dq.value === 0) {
    isValid = false;
    if (dtc.value === 0) {
      status = 'indeterminate';
      warningMessage =
        'Indeterminate; both the change in total cost and the change in quantity are zero.';
    } else {
      status = 'zeroQuantityChange';
      warningMessage =
        'Marginal cost cannot be calculated because the change in quantity is zero.';
    }
    errors.form = warningMessage;
  } else {
    marginalCost = calculateMarginalCost(dtc.value, dq.value);
    if (marginalCost === null) {
      return {
        isValid: false,
        errors: { form: 'Unable to calculate marginal cost for these inputs.' },
        result: null,
      };
    }
  }

  const interpretation = interpretMarginalCost(
    dtc.value,
    dq.value,
    marginalCost,
    unitShort
  );

  const formattedMc =
    marginalCost === null ? null : formatMcMoney(marginalCost, currency);

  const result: MarginalCostResult = {
    changeInTotalCost: dtc.value,
    changeInQuantity: dq.value,
    marginalCost,
    status,
    interpretation,
    warningMessage,
    currency,
    quantityUnit,
    unitShort,
    formattedChangeInTotalCost: formatMcMoney(dtc.value, currency),
    formattedChangeInQuantity: `${formatMcQuantity(dq.value)} ${unitPlural}`,
    formattedMarginalCost: formattedMc,
    formattedMarginalCostPerUnit:
      formattedMc === null ? null : `${formattedMc}/${unitShort}`,
  };

  return { isValid, errors, result };
}
