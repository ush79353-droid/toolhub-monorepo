/**
 * Ticket Optimizer — cheapest combination of single / short / long transport tickets.
 * Currency: denomination + formatting only (no live FX).
 * Schedule: transparent assumed timestamps from frequency × duration (estimate).
 */

import type { SupportedCurrency } from '@/tools/shared/currency';
import { DEFAULT_CURRENCY } from '@/tools/shared/currency';

export type FrequencyUnit = 'day' | 'week';
export type DurationUnit = 'days' | 'weeks';
export type ShortValidityUnit = 'hours' | 'days' | 'weeks';
/** Fixed 30-day months only — not calendar months. */
export type LongValidityUnit = 'days' | 'weeks' | 'months30';

export type TicketType = 'single' | 'shortTerm' | 'longTerm';

export const FREQUENCY_LABELS: Record<FrequencyUnit, string> = {
  day: 'Per day',
  week: 'Per week',
};

export const DURATION_LABELS: Record<DurationUnit, string> = {
  days: 'Days',
  weeks: 'Weeks',
};

export const SHORT_VALIDITY_LABELS: Record<ShortValidityUnit, string> = {
  hours: 'Hours',
  days: 'Days',
  weeks: 'Weeks',
};

export const LONG_VALIDITY_LABELS: Record<LongValidityUnit, string> = {
  days: 'Days',
  weeks: 'Weeks',
  months30: 'Months (30-day)',
};

export interface TicketOptimizerInput {
  trips: string;
  frequencyUnit: FrequencyUnit;
  travelDuration: string;
  travelDurationUnit: DurationUnit;
  singleTicketPrice: string;
  currency: SupportedCurrency;
  compareShortTerm: boolean;
  compareLongTerm: boolean;
  shortTermTicketPrice: string;
  shortTermValidity: string;
  shortTermValidityUnit: ShortValidityUnit;
  longTermTicketPrice: string;
  longTermValidity: string;
  longTermValidityUnit: LongValidityUnit;
}

export interface TicketRecommendation {
  ticketType: TicketType;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface StrategyRow {
  id: string;
  label: string;
  totalCost: number;
  savings: number;
  isOptimal: boolean;
}

export interface TicketOptimizerResult {
  currency: SupportedCurrency;
  totalTrips: number;
  scheduleAssumption: string;
  individualTicketCost: number;
  minimumCost: number;
  savings: number;
  savingsPercentage: number | null;
  averageCostPerTrip: number | null;
  ticketsPurchased: number;
  recommendations: TicketRecommendation[];
  strategies: StrategyRow[];
  tieBreakNote: string | null;
  formulaSteps: string[];
  interpretation: string;
  minimumCostDisplay: string;
  savingsDisplay: string;
  individualCostDisplay: string;
  averageCostDisplay: string | null;
}

export type TicketOptimizerFieldErrors = {
  trips?: string;
  travelDuration?: string;
  singleTicketPrice?: string;
  shortTermTicketPrice?: string;
  shortTermValidity?: string;
  longTermTicketPrice?: string;
  longTermValidity?: string;
  form?: string;
};

/** Spec fixture: 2/day · 10 days · 2.80 · short 7 / 5 days */
export function createEmptyInput(): TicketOptimizerInput {
  return {
    trips: '2',
    frequencyUnit: 'day',
    travelDuration: '10',
    travelDurationUnit: 'days',
    singleTicketPrice: '2.80',
    currency: DEFAULT_CURRENCY,
    compareShortTerm: true,
    compareLongTerm: false,
    shortTermTicketPrice: '7.00',
    shortTermValidity: '5',
    shortTermValidityUnit: 'days',
    longTermTicketPrice: '30.00',
    longTermValidity: '30',
    longTermValidityUnit: 'days',
  };
}

export function createBlankInput(): TicketOptimizerInput {
  return {
    trips: '',
    frequencyUnit: 'day',
    travelDuration: '',
    travelDurationUnit: 'days',
    singleTicketPrice: '',
    currency: DEFAULT_CURRENCY,
    compareShortTerm: true,
    compareLongTerm: false,
    shortTermTicketPrice: '',
    shortTermValidity: '',
    shortTermValidityUnit: 'days',
    longTermTicketPrice: '',
    longTermValidity: '',
    longTermValidityUnit: 'days',
  };
}
