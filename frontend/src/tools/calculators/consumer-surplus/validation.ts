import {
  calculateActualPrice,
  calculateConsumerSurplus,
  calculateSurplusPercentage,
  calculateWillingnessToPay,
  formatCsMoney,
  formatPercentage,
} from './calculation';
import type {
  ConsumerSurplusFieldErrors,
  ConsumerSurplusInput,
  ConsumerSurplusResult,
  ConsumerSurplusStatus,
} from './types';

export interface ConsumerSurplusValidation {
  isValid: boolean;
  errors: ConsumerSurplusFieldErrors;
  result: ConsumerSurplusResult | null;
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

function buildInterpretation(
  status: ConsumerSurplusStatus,
  signedDiff: number,
  formattedDiff: string
): { warningMessage: string | null; interpretation: string } {
  if (status === 'priceExceedsWillingness') {
    return {
      warningMessage:
        'Actual price exceeds willingness to pay. Under a voluntary-purchase model, the consumer would generally not buy.',
      interpretation: `Price difference: ${signedDiff < 0 ? '-' : ''}${formattedDiff.replace(/^-/, '')}. Realized consumer surplus from a voluntary purchase is not applicable under these assumptions (choosing not to buy yields zero surplus).`,
    };
  }
  if (status === 'zeroSurplus') {
    return {
      warningMessage: null,
      interpretation:
        'Consumer surplus is zero: the actual price equals maximum willingness to pay.',
    };
  }
  return {
    warningMessage: null,
    interpretation:
      'Positive consumer surplus is the monetary benefit from paying less than maximum willingness to pay.',
  };
}

export function validateConsumerSurplusInput(
  input: ConsumerSurplusInput
): ConsumerSurplusValidation {
  const errors: ConsumerSurplusFieldErrors = {};
  const currency = input.currency;

  const actualParsed = parseNumber(input.actualPrice);
  const willingParsed = parseNumber(input.willingPrice);
  const surplusParsed = parseNumber(input.consumerSurplus);

  if (!actualParsed.blank) {
    if (actualParsed.invalid || actualParsed.value === null) {
      errors.actualPrice = 'Enter a valid actual price.';
    } else if (actualParsed.value < 0) {
      errors.actualPrice = 'Actual price cannot be negative.';
    }
  }

  if (!willingParsed.blank) {
    if (willingParsed.invalid || willingParsed.value === null) {
      errors.willingPrice = 'Enter a valid willing price.';
    } else if (willingParsed.value < 0) {
      errors.willingPrice = 'Willing price cannot be negative.';
    }
  }

  if (!surplusParsed.blank) {
    if (surplusParsed.invalid || surplusParsed.value === null) {
      errors.consumerSurplus = 'Enter a valid consumer surplus.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  let actualPrice = 0;
  let willingPrice = 0;
  let signedPriceDifference = 0;
  let ready = false;

  if (input.mode === 'consumerSurplus') {
    if (
      !actualParsed.blank &&
      !willingParsed.blank &&
      actualParsed.value !== null &&
      willingParsed.value !== null
    ) {
      const diff = calculateConsumerSurplus(
        willingParsed.value,
        actualParsed.value
      );
      if (diff === null) {
        return { isValid: false, errors, result: null };
      }
      actualPrice = actualParsed.value;
      willingPrice = willingParsed.value;
      signedPriceDifference = diff;
      ready = true;
    }
  } else if (input.mode === 'willingPrice') {
    if (
      !actualParsed.blank &&
      !surplusParsed.blank &&
      actualParsed.value !== null &&
      surplusParsed.value !== null
    ) {
      const wtp = calculateWillingnessToPay(
        actualParsed.value,
        surplusParsed.value
      );
      if (wtp === null) {
        return { isValid: false, errors, result: null };
      }
      if (wtp < 0) {
        return {
          isValid: false,
          errors: {
            consumerSurplus:
              'This combination produces a negative willing price.',
          },
          result: null,
        };
      }
      actualPrice = actualParsed.value;
      willingPrice = wtp;
      signedPriceDifference = surplusParsed.value;
      ready = true;
    }
  } else {
    // actualPrice mode
    if (
      !willingParsed.blank &&
      !surplusParsed.blank &&
      willingParsed.value !== null &&
      surplusParsed.value !== null
    ) {
      const price = calculateActualPrice(
        willingParsed.value,
        surplusParsed.value
      );
      if (price === null) {
        return { isValid: false, errors, result: null };
      }
      if (price < 0) {
        return {
          isValid: false,
          errors: {
            consumerSurplus:
              'Consumer surplus cannot exceed willing price for a valid actual price.',
          },
          result: null,
        };
      }
      willingPrice = willingParsed.value;
      actualPrice = price;
      signedPriceDifference = surplusParsed.value;
      ready = true;
    }
  }

  if (!ready) {
    return { isValid: false, errors, result: null };
  }

  let status: ConsumerSurplusStatus = 'valid';
  if (signedPriceDifference < 0) {
    status = 'priceExceedsWillingness';
  } else if (signedPriceDifference === 0) {
    status = 'zeroSurplus';
  }

  const realizedSurplus =
    status === 'priceExceedsWillingness' ? null : signedPriceDifference;

  const savingsPercentage =
    status === 'priceExceedsWillingness'
      ? null
      : calculateSurplusPercentage(willingPrice, actualPrice);

  const formattedDiff = formatCsMoney(
    Math.abs(signedPriceDifference),
    currency
  );
  const { warningMessage, interpretation } = buildInterpretation(
    status,
    signedPriceDifference,
    formattedDiff
  );

  const result: ConsumerSurplusResult = {
    actualPrice,
    willingPrice,
    signedPriceDifference,
    consumerSurplus: realizedSurplus,
    savingsPercentage,
    status,
    warningMessage,
    interpretation,
    currency,
    formattedActualPrice: formatCsMoney(actualPrice, currency),
    formattedWillingPrice: formatCsMoney(willingPrice, currency),
    formattedSignedDifference:
      signedPriceDifference < 0 ? `-${formattedDiff}` : formattedDiff,
    formattedConsumerSurplus:
      realizedSurplus === null
        ? null
        : formatCsMoney(realizedSurplus, currency),
    formattedSavingsPercentage:
      savingsPercentage === null
        ? null
        : formatPercentage(savingsPercentage),
  };

  return { isValid: true, errors, result };
}
