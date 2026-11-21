import {
  calculateFfoExcludingInterestIncome,
  calculateStandardFfo,
  formatFfoMoney,
  interpretFfo,
} from './calculation';
import type { FfoFieldErrors, FfoInput, FfoResult } from './types';

export interface FfoValidation {
  isValid: boolean;
  errors: FfoFieldErrors;
  result: FfoResult | null;
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

export function validateFfoInput(input: FfoInput): FfoValidation {
  const errors: FfoFieldErrors = {};
  const currency = input.currency;
  const adjusted = input.convention === 'excludeInterestIncome';

  const ni = parseNumber(input.netIncome);
  const da = parseNumber(input.depreciationAmortization);
  const gains = parseNumber(input.gainsFromPropertySales);
  const losses = parseNumber(input.lossesFromPropertySales);
  const interest = parseNumber(input.interestIncome);

  if (!ni.blank) {
    if (ni.invalid || ni.value === null) {
      errors.netIncome = 'Enter a valid net income.';
    }
  }
  if (!da.blank) {
    if (da.invalid || da.value === null) {
      errors.depreciationAmortization =
        'Enter a valid depreciation and amortization amount.';
    } else if (da.value < 0) {
      errors.depreciationAmortization =
        'Depreciation and amortization cannot be negative.';
    }
  }
  if (!gains.blank) {
    if (gains.invalid || gains.value === null) {
      errors.gainsFromPropertySales =
        'Enter a valid gains from property sales amount.';
    } else if (gains.value < 0) {
      errors.gainsFromPropertySales =
        'Gains from property sales cannot be negative.';
    }
  }
  if (!losses.blank) {
    if (losses.invalid || losses.value === null) {
      errors.lossesFromPropertySales =
        'Enter a valid losses from property sales amount.';
    } else if (losses.value < 0) {
      errors.lossesFromPropertySales =
        'Losses from property sales cannot be negative.';
    }
  }
  if (!interest.blank) {
    if (interest.invalid || interest.value === null) {
      errors.interestIncome = 'Enter a valid interest income amount.';
    } else if (interest.value < 0) {
      errors.interestIncome = 'Interest income cannot be negative.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    ni.blank ||
    da.blank ||
    gains.blank ||
    losses.blank ||
    ni.value === null ||
    da.value === null ||
    gains.value === null ||
    losses.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  if (adjusted && (interest.blank || interest.value === null)) {
    return { isValid: false, errors, result: null };
  }

  const standardFfo = calculateStandardFfo(
    ni.value,
    da.value,
    gains.value,
    losses.value
  );
  if (standardFfo === null) {
    return { isValid: false, errors, result: null };
  }

  let adjustedFfo: number | null = null;
  if (!interest.blank && interest.value !== null) {
    adjustedFfo = calculateFfoExcludingInterestIncome(
      standardFfo,
      interest.value
    );
  }

  if (adjusted && adjustedFfo === null) {
    return { isValid: false, errors, result: null };
  }

  const displayedFfo = adjusted ? adjustedFfo! : standardFfo;
  const resultLabel = adjusted
    ? 'FFO excluding interest income'
    : 'Funds from operations (FFO)';

  const warningMessage = adjusted
    ? 'This result subtracts interest income once as a custom adjustment; it is not the standard Nareit FFO definition. Enter only qualifying real estate D&A already deducted in net income.'
    : 'Standard REIT FFO = NI + qualifying real estate D&A − property sale gains + property sale losses. Interest income remains in net income and is not subtracted again. This is a simplified educational reconciliation, not a full Nareit filing.';

  const result: FfoResult = {
    standardFfo,
    adjustedFfo,
    displayedFfo,
    convention: input.convention,
    status: 'valid',
    interpretation: interpretFfo(displayedFfo, input.convention),
    warningMessage,
    currency,
    formattedStandardFfo: formatFfoMoney(standardFfo, currency),
    formattedAdjustedFfo:
      adjustedFfo === null ? null : formatFfoMoney(adjustedFfo, currency),
    formattedDisplayedFfo: formatFfoMoney(displayedFfo, currency),
    resultLabel,
  };

  return { isValid: true, errors, result };
}
