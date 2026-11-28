import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateSingleTicketCost,
  calculateTicketSavings,
  calculateSavingsPercentage,
  computeTicketOptimizer,
  generateTravelSchedule,
  optimizeTicketCombination,
  toCents,
} from './calculation';
import { createEmptyInput } from './types';
import { validateTicketOptimizerInputs } from './validation';

describe('Ticket Optimizer engine', () => {
  it('10 singles × 2.50 → 25.00', () => {
    const r = computeTicketOptimizer({
      trips: 10,
      frequencyUnit: 'day',
      travelDuration: 1,
      travelDurationUnit: 'days',
      singleTicketPrice: 2.5,
      currency: 'USD',
      compareShortTerm: false,
      compareLongTerm: false,
      shortTermTicketPrice: 0,
      shortTermValidity: 1,
      shortTermValidityUnit: 'days',
      longTermTicketPrice: 0,
      longTermValidity: 1,
      longTermValidityUnit: 'days',
    });
    // 10 trips in 1 day
    assert.equal(r.totalTrips, 10);
    assert.equal(r.minimumCost, 25);
    assert.equal(r.recommendations.find((x) => x.ticketType === 'single')?.quantity, 10);
  });

  it('2/day · 10 days · short 7/5d → 2 passes · 14 · save 42 (75%)', () => {
    const r = computeTicketOptimizer({
      trips: 2,
      frequencyUnit: 'day',
      travelDuration: 10,
      travelDurationUnit: 'days',
      singleTicketPrice: 2.8,
      currency: 'USD',
      compareShortTerm: true,
      compareLongTerm: false,
      shortTermTicketPrice: 7,
      shortTermValidity: 5,
      shortTermValidityUnit: 'days',
      longTermTicketPrice: 30,
      longTermValidity: 30,
      longTermValidityUnit: 'days',
    });
    assert.equal(r.totalTrips, 20);
    assert.equal(r.individualTicketCost, 56);
    assert.equal(r.recommendations.find((x) => x.ticketType === 'shortTerm')?.quantity, 2);
    assert.equal(r.recommendations.find((x) => x.ticketType === 'single')?.quantity, 0);
    assert.equal(r.minimumCost, 14);
    assert.equal(r.savings, 42);
    assert.ok(r.savingsPercentage != null && Math.abs(r.savingsPercentage - 75) < 1e-9);
  });

  it('2 days · 1/day · singles cheaper than 5-day pass', () => {
    const r = computeTicketOptimizer({
      trips: 1,
      frequencyUnit: 'day',
      travelDuration: 2,
      travelDurationUnit: 'days',
      singleTicketPrice: 2,
      currency: 'USD',
      compareShortTerm: true,
      compareLongTerm: false,
      shortTermTicketPrice: 10,
      shortTermValidity: 5,
      shortTermValidityUnit: 'days',
      longTermTicketPrice: 0,
      longTermValidity: 1,
      longTermValidityUnit: 'days',
    });
    assert.equal(r.totalTrips, 2);
    assert.equal(r.minimumCost, 4);
    assert.equal(r.recommendations.find((x) => x.ticketType === 'single')?.quantity, 2);
    assert.equal(r.recommendations.find((x) => x.ticketType === 'shortTerm')?.quantity, 0);
  });

  it('6 days · 2/day · mixed 1 short + 2 singles = 11', () => {
    const r = computeTicketOptimizer({
      trips: 2,
      frequencyUnit: 'day',
      travelDuration: 6,
      travelDurationUnit: 'days',
      singleTicketPrice: 2,
      currency: 'USD',
      compareShortTerm: true,
      compareLongTerm: false,
      shortTermTicketPrice: 7,
      shortTermValidity: 5,
      shortTermValidityUnit: 'days',
      longTermTicketPrice: 0,
      longTermValidity: 1,
      longTermValidityUnit: 'days',
    });
    assert.equal(r.totalTrips, 12);
    assert.equal(r.recommendations.find((x) => x.ticketType === 'shortTerm')?.quantity, 1);
    assert.equal(r.recommendations.find((x) => x.ticketType === 'single')?.quantity, 2);
    assert.equal(r.minimumCost, 11);
  });

  it('30 days · long pass 40 beats 150 singles', () => {
    const r = computeTicketOptimizer({
      trips: 2,
      frequencyUnit: 'day',
      travelDuration: 30,
      travelDurationUnit: 'days',
      singleTicketPrice: 2.5,
      currency: 'USD',
      compareShortTerm: false,
      compareLongTerm: true,
      shortTermTicketPrice: 0,
      shortTermValidity: 1,
      shortTermValidityUnit: 'days',
      longTermTicketPrice: 40,
      longTermValidity: 30,
      longTermValidityUnit: 'days',
    });
    assert.equal(r.totalTrips, 60);
    assert.equal(r.individualTicketCost, 150);
    assert.equal(r.recommendations.find((x) => x.ticketType === 'longTerm')?.quantity, 1);
    assert.equal(r.minimumCost, 40);
    assert.equal(r.savings, 110);
  });

  it('schedule daily produces N = trips × days', () => {
    const s = generateTravelSchedule(2, 'day', 10, 'days');
    assert.equal(s.timestampsHours.length, 20);
  });

  it('savings helpers', () => {
    assert.equal(calculateSingleTicketCost(20, 2.8), 56);
    assert.equal(calculateTicketSavings(56, 14), 42);
    assert.equal(calculateSavingsPercentage(42, 56), 75);
    assert.equal(calculateSavingsPercentage(0, 0), null);
  });

  it('DP matches brute singles for tiny schedule', () => {
    const stamps = [0, 1, 2];
    const { costCents, purchases } = optimizeTicketCombination({
      timestampsHours: stamps,
      singleCents: toCents(1),
      shortEnabled: false,
      shortCents: 0,
      shortValidityHours: 0,
      longEnabled: false,
      longCents: 0,
      longValidityHours: 0,
    });
    assert.equal(costCents, 300);
    assert.equal(purchases.length, 3);
  });

  it('default fixture validates', () => {
    const v = validateTicketOptimizerInputs(createEmptyInput());
    assert.equal(Object.keys(v.errors).length, 0);
    assert.ok(v.result);
    assert.equal(v.result!.totalTrips, 20);
    assert.equal(v.result!.minimumCost, 14);
  });

  it('negative price invalid', () => {
    const v = validateTicketOptimizerInputs({
      ...createEmptyInput(),
      singleTicketPrice: '-1',
    });
    assert.ok(v.errors.singleTicketPrice);
    assert.equal(v.result, null);
  });

  it('fractional trips invalid', () => {
    const v = validateTicketOptimizerInputs({
      ...createEmptyInput(),
      trips: '1.5',
    });
    assert.ok(v.errors.trips);
  });

  it('blank → no result', () => {
    const v = validateTicketOptimizerInputs({
      ...createEmptyInput(),
      trips: '',
      travelDuration: '',
      singleTicketPrice: '',
    });
    assert.equal(v.result, null);
  });

  it('disable short → all singles for fixture prices', () => {
    const r = computeTicketOptimizer({
      trips: 2,
      frequencyUnit: 'day',
      travelDuration: 10,
      travelDurationUnit: 'days',
      singleTicketPrice: 2.8,
      currency: 'USD',
      compareShortTerm: false,
      compareLongTerm: false,
      shortTermTicketPrice: 7,
      shortTermValidity: 5,
      shortTermValidityUnit: 'days',
      longTermTicketPrice: 30,
      longTermValidity: 30,
      longTermValidityUnit: 'days',
    });
    assert.equal(r.minimumCost, 56);
  });
});
