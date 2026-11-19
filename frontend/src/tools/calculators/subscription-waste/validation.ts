import {
  calculateSubscriptionWasteResult,
  isEntryComplete,
  parseOptionalNumber,
} from './calculation';
import type {
  SubscriptionWasteFieldErrors,
  SubscriptionWasteInput,
  SubscriptionWasteResult,
} from './types';
import { SUBSCRIPTION_CATEGORIES } from './types';

export function validateSubscriptionWasteInput(input: SubscriptionWasteInput): {
  isValid: boolean;
  incomplete: boolean;
  errors: SubscriptionWasteFieldErrors;
  result: SubscriptionWasteResult | null;
} {
  const entryErrors: Partial<Record<string, string>> = {};
  let hasAnyComplete = false;
  let hasPartialInvalid = false;

  for (const cat of SUBSCRIPTION_CATEGORIES) {
    for (const entry of input.entries[cat.id]) {
      const blank =
        !entry.serviceKey.trim() &&
        !entry.customName.trim() &&
        !entry.amount.trim();
      if (blank) continue;

      const amount = parseOptionalNumber(entry.amount);
      const needsCustom =
        entry.serviceKey === 'Other' || entry.serviceKey === '';

      if (needsCustom && !entry.customName.trim()) {
        entryErrors[entry.id] = 'Enter a service name.';
        hasPartialInvalid = true;
      } else if (!entry.serviceKey.trim() && !entry.customName.trim()) {
        entryErrors[entry.id] = 'Select or enter a service.';
        hasPartialInvalid = true;
      }

      if (amount === null || amount < 0) {
        entryErrors[entry.id] =
          entryErrors[entry.id] ??
          'Enter a subscription amount of zero or more.';
        hasPartialInvalid = true;
      }

      if (isEntryComplete(entry)) hasAnyComplete = true;
    }
  }

  if (!hasAnyComplete && !hasPartialInvalid) {
    return {
      isValid: false,
      incomplete: true,
      errors: {},
      result: null,
    };
  }

  if (hasPartialInvalid) {
    return {
      isValid: false,
      incomplete: false,
      errors: { entries: entryErrors },
      result: null,
    };
  }

  const result = calculateSubscriptionWasteResult(input);
  return {
    isValid: true,
    incomplete: false,
    errors: {},
    result,
  };
}
