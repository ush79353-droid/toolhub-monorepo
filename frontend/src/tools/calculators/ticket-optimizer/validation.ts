import { computeTicketOptimizer, MAX_TRIPS } from './calculation';
import type {
  TicketOptimizerFieldErrors,
  TicketOptimizerInput,
  TicketOptimizerResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateTicketOptimizerInputs(input: TicketOptimizerInput): {
  errors: TicketOptimizerFieldErrors;
  result: TicketOptimizerResult | null;
} {
  const errors: TicketOptimizerFieldErrors = {};

  const trips = parseNumber(input.trips);
  if (trips == null) {
    errors.trips = 'Enter trips as a whole number.';
  } else if (!Number.isInteger(trips) || trips < 0) {
    errors.trips = 'Trips must be a nonnegative whole number.';
  }

  const travelDuration = parseNumber(input.travelDuration);
  if (travelDuration == null) {
    errors.travelDuration = 'Enter travel duration.';
  } else if (travelDuration <= 0) {
    errors.travelDuration = 'Travel duration must be greater than zero.';
  }

  const singleTicketPrice = parseNumber(input.singleTicketPrice);
  if (singleTicketPrice == null) {
    errors.singleTicketPrice = 'Enter a single-fare ticket price.';
  } else if (singleTicketPrice < 0) {
    errors.singleTicketPrice = 'Price cannot be negative.';
  }

  let shortTermTicketPrice = 0;
  let shortTermValidity = 0;
  if (input.compareShortTerm) {
    shortTermTicketPrice = parseNumber(input.shortTermTicketPrice) ?? NaN;
    if (!Number.isFinite(shortTermTicketPrice)) {
      errors.shortTermTicketPrice = 'Enter a short-term ticket price.';
    } else if (shortTermTicketPrice < 0) {
      errors.shortTermTicketPrice = 'Price cannot be negative.';
    }
    shortTermValidity = parseNumber(input.shortTermValidity) ?? NaN;
    if (!Number.isFinite(shortTermValidity)) {
      errors.shortTermValidity = 'Enter short-term validity.';
    } else if (shortTermValidity <= 0) {
      errors.shortTermValidity = 'Validity must be greater than zero.';
    }
  }

  let longTermTicketPrice = 0;
  let longTermValidity = 0;
  if (input.compareLongTerm) {
    longTermTicketPrice = parseNumber(input.longTermTicketPrice) ?? NaN;
    if (!Number.isFinite(longTermTicketPrice)) {
      errors.longTermTicketPrice = 'Enter a long-term ticket price.';
    } else if (longTermTicketPrice < 0) {
      errors.longTermTicketPrice = 'Price cannot be negative.';
    }
    longTermValidity = parseNumber(input.longTermValidity) ?? NaN;
    if (!Number.isFinite(longTermValidity)) {
      errors.longTermValidity = 'Enter long-term validity.';
    } else if (longTermValidity <= 0) {
      errors.longTermValidity = 'Validity must be greater than zero.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  // Estimate trip count before building schedule
  const days =
    input.travelDurationUnit === 'weeks'
      ? travelDuration! * 7
      : travelDuration!;
  const estimatedTrips =
    input.frequencyUnit === 'day'
      ? trips! * days
      : trips! * Math.ceil(days / 7);

  if (estimatedTrips > MAX_TRIPS) {
    errors.form = `Schedule would exceed ${MAX_TRIPS} trips. Shorten duration or reduce trip frequency.`;
    return { errors, result: null };
  }

  if (estimatedTrips === 0 && trips === 0) {
    // Zero trips is a valid edge: cost 0
  }

  const result = computeTicketOptimizer({
    trips: trips!,
    frequencyUnit: input.frequencyUnit,
    travelDuration: travelDuration!,
    travelDurationUnit: input.travelDurationUnit,
    singleTicketPrice: singleTicketPrice!,
    currency: input.currency,
    compareShortTerm: input.compareShortTerm,
    compareLongTerm: input.compareLongTerm,
    shortTermTicketPrice: input.compareShortTerm ? shortTermTicketPrice : 0,
    shortTermValidity: input.compareShortTerm ? shortTermValidity : 1,
    shortTermValidityUnit: input.shortTermValidityUnit,
    longTermTicketPrice: input.compareLongTerm ? longTermTicketPrice : 0,
    longTermValidity: input.compareLongTerm ? longTermValidity : 1,
    longTermValidityUnit: input.longTermValidityUnit,
  });

  return { errors, result };
}
