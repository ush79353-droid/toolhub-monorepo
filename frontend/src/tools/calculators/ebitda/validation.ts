import {
  calculateAmortizationFromEbitda,
  calculateDepreciationFromEbitda,
  calculateEbitda,
  calculateEbitdaMargin,
  calculateOperatingProfitFromEbitda,
  formatEbitdaMargin,
  formatEbitdaMoney,
  interpretEbitda,
} from './calculation';
import type { EbitdaFieldErrors, EbitdaInput, EbitdaResult } from './types';

export interface EbitdaValidation {
  isValid: boolean;
  errors: EbitdaFieldErrors;
  result: EbitdaResult | null;
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

export function validateEbitdaInput(input: EbitdaInput): EbitdaValidation {
  const errors: EbitdaFieldErrors = {};
  const currency = input.currency;

  const opParsed = parseNumber(input.operatingProfit);
  const aParsed = parseNumber(input.amortizationExpense);
  const dParsed = parseNumber(input.depreciationExpense);
  const ebitdaParsed = parseNumber(input.ebitda);
  const revParsed = parseNumber(input.revenue);

  if (!opParsed.blank && input.mode !== 'operatingProfit') {
    if (opParsed.invalid || opParsed.value === null) {
      errors.operatingProfit = 'Enter a valid operating profit.';
    }
  }

  if (!aParsed.blank && input.mode !== 'amortization') {
    if (aParsed.invalid || aParsed.value === null) {
      errors.amortizationExpense = 'Enter a valid amortization expense.';
    } else if (aParsed.value < 0) {
      errors.amortizationExpense = 'Amortization expense cannot be negative.';
    }
  }

  if (!dParsed.blank && input.mode !== 'depreciation') {
    if (dParsed.invalid || dParsed.value === null) {
      errors.depreciationExpense = 'Enter a valid depreciation expense.';
    } else if (dParsed.value < 0) {
      errors.depreciationExpense = 'Depreciation expense cannot be negative.';
    }
  }

  if (!ebitdaParsed.blank && input.mode !== 'ebitda') {
    if (ebitdaParsed.invalid || ebitdaParsed.value === null) {
      errors.ebitda = 'Enter a valid EBITDA amount.';
    }
  }

  if (!revParsed.blank) {
    if (revParsed.invalid || revParsed.value === null) {
      errors.revenue = 'Enter a valid revenue amount.';
    } else if (revParsed.value < 0) {
      errors.revenue = 'Revenue cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  let operatingProfit = 0;
  let amortization = 0;
  let depreciation = 0;
  let ebitda = 0;
  let ready = false;

  if (input.mode === 'ebitda') {
    if (
      !opParsed.blank &&
      !aParsed.blank &&
      !dParsed.blank &&
      opParsed.value !== null &&
      aParsed.value !== null &&
      dParsed.value !== null
    ) {
      const calculated = calculateEbitda(
        opParsed.value,
        aParsed.value,
        dParsed.value
      );
      if (calculated === null) {
        return { isValid: false, errors, result: null };
      }
      operatingProfit = opParsed.value;
      amortization = aParsed.value;
      depreciation = dParsed.value;
      ebitda = calculated;
      ready = true;
    }
  } else if (input.mode === 'operatingProfit') {
    if (
      !ebitdaParsed.blank &&
      !aParsed.blank &&
      !dParsed.blank &&
      ebitdaParsed.value !== null &&
      aParsed.value !== null &&
      dParsed.value !== null
    ) {
      const calculated = calculateOperatingProfitFromEbitda(
        ebitdaParsed.value,
        aParsed.value,
        dParsed.value
      );
      if (calculated === null) {
        return { isValid: false, errors, result: null };
      }
      operatingProfit = calculated;
      amortization = aParsed.value;
      depreciation = dParsed.value;
      ebitda = ebitdaParsed.value;
      ready = true;
    }
  } else if (input.mode === 'amortization') {
    if (
      !ebitdaParsed.blank &&
      !opParsed.blank &&
      !dParsed.blank &&
      ebitdaParsed.value !== null &&
      opParsed.value !== null &&
      dParsed.value !== null
    ) {
      const calculated = calculateAmortizationFromEbitda(
        ebitdaParsed.value,
        opParsed.value,
        dParsed.value
      );
      if (calculated === null) {
        return {
          isValid: false,
          errors: {
            form: 'Amortization would be negative under the standard expense model. Adjust EBITDA, operating profit, or depreciation.',
          },
          result: null,
        };
      }
      operatingProfit = opParsed.value;
      amortization = calculated;
      depreciation = dParsed.value;
      ebitda = ebitdaParsed.value;
      ready = true;
    }
  } else {
    if (
      !ebitdaParsed.blank &&
      !opParsed.blank &&
      !aParsed.blank &&
      ebitdaParsed.value !== null &&
      opParsed.value !== null &&
      aParsed.value !== null
    ) {
      const calculated = calculateDepreciationFromEbitda(
        ebitdaParsed.value,
        opParsed.value,
        aParsed.value
      );
      if (calculated === null) {
        return {
          isValid: false,
          errors: {
            form: 'Depreciation would be negative under the standard expense model. Adjust EBITDA, operating profit, or amortization.',
          },
          result: null,
        };
      }
      operatingProfit = opParsed.value;
      amortization = aParsed.value;
      depreciation = calculated;
      ebitda = ebitdaParsed.value;
      ready = true;
    }
  }

  if (!ready) {
    return { isValid: false, errors, result: null };
  }

  let margin: number | null = null;
  let warningMessage =
    'Add back only depreciation and amortization already deducted in the operating profit (EBIT) measure. Do not double-count. EBITDA is not cash flow.';

  if (!revParsed.blank && revParsed.value !== null) {
    if (revParsed.value === 0) {
      warningMessage =
        'EBITDA margin is unavailable when revenue is zero (division by zero).';
    } else {
      margin = calculateEbitdaMargin(ebitda, revParsed.value);
    }
  }

  const result: EbitdaResult = {
    operatingProfit,
    amortizationExpense: amortization,
    depreciationExpense: depreciation,
    ebitda,
    ebitdaMargin: margin,
    status: 'valid',
    interpretation: interpretEbitda(ebitda),
    warningMessage,
    currency,
    formattedOperatingProfit: formatEbitdaMoney(operatingProfit, currency),
    formattedAmortizationExpense: formatEbitdaMoney(amortization, currency),
    formattedDepreciationExpense: formatEbitdaMoney(depreciation, currency),
    formattedEbitda: formatEbitdaMoney(ebitda, currency),
    formattedEbitdaMargin: margin === null ? null : formatEbitdaMargin(margin),
  };

  return { isValid: true, errors, result };
}
