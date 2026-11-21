import { calculateForwardPremiumFromInput } from './calculation';
import type {
  ForwardPremiumFieldErrors,
  ForwardPremiumInput,
  ForwardPremiumResult,
} from './types';

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

export interface ForwardPremiumValidation {
  isValid: boolean;
  errors: ForwardPremiumFieldErrors;
  result: ForwardPremiumResult | null;
}

function positiveRateError(
  parsed: ReturnType<typeof parseNumber>,
  blankMsg: string,
  label: string,
): string | undefined {
  if (parsed.blank) return blankMsg;
  if (parsed.invalid || parsed.value == null) return `Enter a valid ${label}.`;
  if (parsed.value <= 0) return `${label} must be greater than zero.`;
  return undefined;
}

function durationError(
  parsed: ReturnType<typeof parseNumber>,
): string | undefined {
  if (parsed.blank) return 'Enter the forward contract duration in days.';
  if (parsed.invalid || parsed.value == null) {
    return 'Enter a valid duration in days.';
  }
  if (parsed.value <= 0) return 'Duration must be greater than zero days.';
  return undefined;
}

export function collectFieldErrors(
  input: ForwardPremiumInput,
): ForwardPremiumFieldErrors {
  const errors: ForwardPremiumFieldErrors = {};
  const edited = input.lastEdited;

  const spot = parseNumber(input.spotRate);
  const forward = parseNumber(input.forwardRate);
  const premium = parseNumber(input.forwardPremiumPercent);
  const duration = parseNumber(input.durationDays);
  const annualized = parseNumber(input.annualizedForwardPremiumPercent);

  const eDur = durationError(duration);
  if (eDur) errors.durationDays = eDur;

  if (edited === 'annualizedForwardPremiumPercent') {
    if (annualized.blank) {
      errors.annualizedForwardPremiumPercent =
        'Enter the annualized forward premium (%).';
    } else if (annualized.invalid || annualized.value == null) {
      errors.annualizedForwardPremiumPercent =
        'Enter a valid annualized forward premium.';
    }
    if (spot.blank && forward.blank) {
      errors.spotRate = 'Enter a spot rate (or a forward rate) to reverse-solve.';
    } else {
      if (!spot.blank) {
        const e = positiveRateError(spot, '', 'Spot rate');
        if (e && e !== '') errors.spotRate = e;
      }
      if (!forward.blank) {
        const e = positiveRateError(forward, '', 'Forward rate');
        if (e && e !== '') errors.forwardRate = e;
      }
    }
  } else if (edited === 'forwardPremiumPercent') {
    if (premium.blank) {
      errors.forwardPremiumPercent = 'Enter the forward premium (%).';
    } else if (premium.invalid || premium.value == null) {
      errors.forwardPremiumPercent = 'Enter a valid forward premium.';
    }
    if (spot.blank && forward.blank) {
      errors.spotRate = 'Enter a spot rate (or a forward rate) to reverse-solve.';
    } else {
      if (!spot.blank) {
        const e = positiveRateError(spot, '', 'Spot rate');
        if (e && e !== '') errors.spotRate = e;
      }
      if (!forward.blank) {
        const e = positiveRateError(forward, '', 'Forward rate');
        if (e && e !== '') errors.forwardRate = e;
      }
    }
  } else if (edited === 'durationDays') {
    if (!spot.blank || !forward.blank) {
      if (!spot.blank) {
        const e = positiveRateError(spot, '', 'Spot rate');
        if (e && e !== '') errors.spotRate = e;
      }
      if (!forward.blank) {
        const e = positiveRateError(forward, '', 'Forward rate');
        if (e && e !== '') errors.forwardRate = e;
      }
    }
    if (spot.blank && forward.blank && premium.blank) {
      errors.spotRate =
        'Enter spot and forward rates, or a forward premium, before changing duration.';
    } else if (spot.blank && forward.blank) {
      if (premium.invalid || (premium.value == null && !premium.blank)) {
        errors.forwardPremiumPercent = 'Enter a valid forward premium.';
      }
    } else if (!spot.blank && forward.blank && premium.blank) {
      errors.forwardRate = 'Enter the forward rate (or a forward premium).';
    } else if (spot.blank && !forward.blank && premium.blank) {
      errors.spotRate = 'Enter the spot rate (or a forward premium).';
    } else {
      const eS = positiveRateError(
        spot,
        'Enter the spot rate.',
        'Spot rate',
      );
      const eF = positiveRateError(
        forward,
        'Enter the forward rate.',
        'Forward rate',
      );
      if (!spot.blank && eS) errors.spotRate = eS;
      if (!forward.blank && eF) errors.forwardRate = eF;
      if (spot.blank && eS) errors.spotRate = eS;
      if (forward.blank && eF) errors.forwardRate = eF;
    }
  } else {
    const eS = positiveRateError(spot, 'Enter the spot rate.', 'Spot rate');
    if (eS) errors.spotRate = eS;
    const eF = positiveRateError(
      forward,
      'Enter the forward rate.',
      'Forward rate',
    );
    if (eF) errors.forwardRate = eF;
  }

  return errors;
}

export function hasFieldErrors(errors: ForwardPremiumFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateForwardPremiumInput(
  input: ForwardPremiumInput,
): ForwardPremiumValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateForwardPremiumFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
