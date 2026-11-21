import assert from 'node:assert/strict';
import {
  calculateBirthControlCost,
  durationToDays,
  usageToPerDay,
} from './calculation';
import { CYCLE_DAYS, DAYS_PER_YEAR } from './types';

// Screenshot fixture: Pill · 20 PKR / 28-day cycle · 1 year · no condoms → 260.89
{
  const horizonDays = durationToDays(1, 'years');
  assert.equal(horizonDays, DAYS_PER_YEAR);
  const result = calculateBirthControlCost({
    sex: 'female',
    femaleMethod: 'pill',
    maleMethod: 'condoms',
    costPerCycle: 20,
    longActingPrice: 0,
    longevityDays: 1,
    procedureCost: 0,
    buyCondoms: false,
    amountInPackage: 1,
    usagePerDay: 0,
    pricePerPackage: 0,
    horizonDays,
    currency: 'PKR',
  });
  assert.equal(result.total, 260.89);
  assert.ok(
    Math.abs(20 * (DAYS_PER_YEAR / CYCLE_DAYS) - 260.892857142857) < 1e-9
  );
}

// Zero horizon → zero spend
{
  const result = calculateBirthControlCost({
    sex: 'female',
    femaleMethod: 'pill',
    maleMethod: 'condoms',
    costPerCycle: 20,
    longActingPrice: 0,
    longevityDays: 1,
    procedureCost: 0,
    buyCondoms: false,
    amountInPackage: 1,
    usagePerDay: 0,
    pricePerPackage: 0,
    horizonDays: 0,
    currency: 'PKR',
  });
  assert.equal(result.total, 0);
}

// Long-acting: 1000 over 4 years, horizon 1 year → 250
{
  const result = calculateBirthControlCost({
    sex: 'female',
    femaleMethod: 'iud',
    maleMethod: 'condoms',
    costPerCycle: 0,
    longActingPrice: 1000,
    longevityDays: durationToDays(4, 'years'),
    procedureCost: 0,
    buyCondoms: false,
    amountInPackage: 1,
    usagePerDay: 0,
    pricePerPackage: 0,
    horizonDays: durationToDays(1, 'years'),
    currency: 'PKR',
  });
  assert.equal(result.total, 250);
}

// Condoms only: 10/yr · pack 10 · 8/pack · 1 yr → 8
{
  const result = calculateBirthControlCost({
    sex: 'male',
    femaleMethod: 'pill',
    maleMethod: 'condoms',
    costPerCycle: 0,
    longActingPrice: 0,
    longevityDays: 1,
    procedureCost: 0,
    buyCondoms: false,
    amountInPackage: 10,
    usagePerDay: usageToPerDay(10, 'years'),
    pricePerPackage: 8,
    horizonDays: durationToDays(1, 'years'),
    currency: 'PKR',
  });
  assert.equal(result.total, 8);
}

// Sterilization one-time 600 + no condoms
{
  const result = calculateBirthControlCost({
    sex: 'female',
    femaleMethod: 'sterilization',
    maleMethod: 'condoms',
    costPerCycle: 0,
    longActingPrice: 0,
    longevityDays: 1,
    procedureCost: 600,
    buyCondoms: false,
    amountInPackage: 1,
    usagePerDay: 0,
    pricePerPackage: 0,
    horizonDays: durationToDays(10, 'years'),
    currency: 'USD',
  });
  assert.equal(result.total, 600);
}

console.log('birth-control calculation.test.ts: ok');
