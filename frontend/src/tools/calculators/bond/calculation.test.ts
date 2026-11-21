import assert from 'node:assert/strict';
import {
  calculateBond,
  formatBondUsd,
  solveBondPrice,
  solveBondYield,
  solveBondFaceValue,
  solveBondAnnualCoupon,
  solveBondTimeToMaturity,
} from './calculation';
import { validateBondInput } from './validation';
import { createDefaultInput } from './types';

const screenshot = {
  faceValue: 100,
  yieldPercent: 6,
  timeToMaturityYears: 3,
  annualCoupon: 5,
  couponMode: 'percent' as const,
  couponFrequency: 'annually' as const,
};

const priceSolved = solveBondPrice(screenshot);
assert.equal(priceSolved.ok, true);
assert.ok(priceSolved.ok);
const screenshotPrice = priceSolved.value;
assert.ok(Math.abs(screenshotPrice - 97.327) < 0.0005);
assert.equal(formatBondUsd(screenshotPrice), '97.3270');

{
  const result = calculateBond({
    solveFor: 'price',
    ...screenshot,
  });
  assert.ok(result);
  assert.equal(result!.formattedPrice, '97.3270');
  assert.match(result!.summaryText, /the price is: \$97\.3270/);
}

// Zero yield: P = coupons + face
{
  const solved = solveBondPrice({
    faceValue: 100,
    yieldPercent: 0,
    timeToMaturityYears: 2,
    annualCoupon: 5,
    couponMode: 'percent',
    couponFrequency: 'annually',
  });
  assert.equal(solved.ok, true);
  if (solved.ok) assert.equal(solved.value, 110);
}

// Zero-coupon yield closed form
{
  const solved = solveBondYield({
    price: 90,
    faceValue: 100,
    timeToMaturityYears: 2,
    annualCoupon: 0,
    couponMode: 'percent',
    couponFrequency: 'annually',
  });
  assert.equal(solved.ok, true);
  if (solved.ok) {
    const expected = (Math.pow(100 / 90, 1 / 2) - 1) * 100;
    assert.ok(Math.abs(solved.value - expected) < 1e-8);
  }
}

// Round-trip yield from computed price
{
  const solved = solveBondYield({
    price: screenshotPrice,
    faceValue: 100,
    timeToMaturityYears: 3,
    annualCoupon: 5,
    couponMode: 'percent',
    couponFrequency: 'annually',
  });
  assert.equal(solved.ok, true);
  if (solved.ok) assert.ok(Math.abs(solved.value - 6) < 1e-4);
}

// Face value percent mode round-trip
{
  const solved = solveBondFaceValue({
    price: screenshotPrice,
    yieldPercent: 6,
    timeToMaturityYears: 3,
    annualCoupon: 5,
    couponMode: 'percent',
    couponFrequency: 'annually',
  });
  assert.equal(solved.ok, true);
  if (solved.ok) assert.ok(Math.abs(solved.value - 100) < 1e-6);
}

// Annual coupon percent round-trip
{
  const solved = solveBondAnnualCoupon({
    price: screenshotPrice,
    faceValue: 100,
    yieldPercent: 6,
    timeToMaturityYears: 3,
    couponMode: 'percent',
    couponFrequency: 'annually',
  });
  assert.equal(solved.ok, true);
  if (solved.ok) assert.ok(Math.abs(solved.value - 5) < 1e-6);
}

// Maturity integer periods
{
  const solved = solveBondTimeToMaturity({
    price: screenshotPrice,
    faceValue: 100,
    yieldPercent: 6,
    annualCoupon: 5,
    couponMode: 'percent',
    couponFrequency: 'annually',
  });
  assert.equal(solved.ok, true);
  if (solved.ok) assert.equal(solved.value, 3);
}

// Semiannual frequency compatibility
{
  const solved = solveBondPrice({
    faceValue: 1000,
    yieldPercent: 6,
    timeToMaturityYears: 2,
    annualCoupon: 5,
    couponMode: 'percent',
    couponFrequency: 'semiannually',
  });
  assert.equal(solved.ok, true);
  if (solved.ok) {
    const r = 0.03;
    const C = 25;
    let expect = 0;
    for (let t = 1; t <= 4; t += 1) expect += C / Math.pow(1 + r, t);
    expect += 1000 / Math.pow(1 + r, 4);
    assert.ok(Math.abs(solved.value - expect) < 1e-8);
  }
}

// Fixed coupon amount mode
{
  const solved = solveBondPrice({
    faceValue: 100,
    yieldPercent: 6,
    timeToMaturityYears: 3,
    annualCoupon: 5,
    couponMode: 'amount',
    couponFrequency: 'annually',
  });
  assert.equal(solved.ok, true);
  if (solved.ok) assert.ok(Math.abs(solved.value - 97.327) < 0.0005);
}

// Validation: default input solves price
{
  const v = validateBondInput(createDefaultInput());
  assert.equal(v.isValid, true);
  assert.equal(v.solveFor, 'price');
  assert.ok(v.result);
  assert.equal(v.result!.formattedPrice, '97.3270');
}

// Validation: two blanks rejected
{
  const v = validateBondInput({
    ...createDefaultInput(),
    price: '',
    yieldPercent: '',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.form);
}

// Non-integer periods rejected
{
  const v = validateBondInput({
    ...createDefaultInput(),
    price: '',
    timeToMaturityYears: '1.5',
    couponFrequency: 'annually',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.errors.timeToMaturityYears);
}

console.log('bond calculation.test ok');
