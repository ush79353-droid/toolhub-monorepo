import assert from 'node:assert/strict';
import { amortizingPaymentCents, applyRateCaps, calculateArmMortgage } from './calculation';
import { createDefaultArmInput } from './types';
import { validateArmInput } from './validation';

function independentPayment(principal: number, annualPct: number, months: number): number {
  const cents = Math.round(principal * 100);
  if (annualPct === 0) return Math.round(cents / months);
  const r = annualPct / 100 / 12;
  const g = (1 + r) ** months;
  return Math.round((cents * r * g) / (g - 1));
}

const start = '2026-01-01';

function base() {
  return createDefaultArmInput(start);
}

assert.equal(independentPayment(250000, 5.5, 360), 141947);
assert.equal(amortizingPaymentCents(25_000_000, 0.055 / 12, 360), 141947);

{
  const result = calculateArmMortgage(base());
  assert.equal(result.initialPaymentCents, 141947);
  assert.equal(result.fixedMonths, 60);
  assert.equal(result.adjustEveryMonths, 12);
  assert.equal(result.firstAdjustmentPaymentNumber, 61);
  assert.equal(result.schedule[59].rateAdjusted, false);
  assert.equal(result.schedule[60].rateAdjusted, true);
  assert.equal(result.schedule[result.schedule.length - 1].balanceCents, 0);
  const interest = result.schedule.reduce((s, r) => s + r.interestCents, 0);
  const principal = result.schedule.reduce((s, r) => s + r.principalCents, 0);
  assert.equal(interest, result.totalInterestCents);
  assert.equal(principal, result.totalPrincipalCents);
  assert.equal(principal, 25_000_000);
}

for (const structure of ['3/1', '5/1', '7/1', '10/1', '5/6', '7/6', '10/6'] as const) {
  const result = calculateArmMortgage({ ...base(), structure });
  const years = Number(structure.split('/')[0]);
  const every = structure.endsWith('/1') ? 12 : 6;
  assert.equal(result.fixedMonths, years * 12, structure);
  assert.equal(result.adjustEveryMonths, every, structure);
  assert.equal(result.firstAdjustmentPaymentNumber, years * 12 + 1);
}

{
  const zero = calculateArmMortgage({ ...base(), initialAnnualRate: 0, projectedAnnualRate: 0, scenario: 'constant' });
  assert.equal(zero.initialPaymentCents, Math.round(25_000_000 / 360));
  assert.equal(zero.totalInterestCents, 0);
}

{
  const capped = applyRateCaps({
    currentRate: 5.5,
    initialRate: 5.5,
    uncappedRate: 9,
    isFirstAdjustment: true,
    initialCap: 2,
    subsequentCap: 1,
    lifetimeCap: 5,
    rateFloor: null,
  });
  assert.equal(capped, 7.5);
  const later = applyRateCaps({
    currentRate: 7.5,
    initialRate: 5.5,
    uncappedRate: 12,
    isFirstAdjustment: false,
    initialCap: 2,
    subsequentCap: 1,
    lifetimeCap: 5,
    rateFloor: null,
  });
  assert.equal(later, 8.5);
  const life = applyRateCaps({
    currentRate: 10,
    initialRate: 5.5,
    uncappedRate: 12,
    isFirstAdjustment: false,
    initialCap: 2,
    subsequentCap: 2,
    lifetimeCap: 5,
    rateFloor: null,
  });
  assert.equal(life, 10.5);
  const floor = applyRateCaps({
    currentRate: 5.5,
    initialRate: 5.5,
    uncappedRate: 1,
    isFirstAdjustment: true,
    initialCap: 2,
    subsequentCap: 2,
    lifetimeCap: 5,
    rateFloor: 3,
  });
  assert.equal(floor, 3);
}

{
  const rising = calculateArmMortgage({
    ...base(),
    scenario: 'rising',
    scenarioStepPercent: 1,
    projectedAnnualRate: 5.5,
    initialCap: 5,
    subsequentCap: 5,
    lifetimeCap: 10,
  });
  assert.ok((rising.firstAdjustedPaymentCents ?? 0) > rising.initialPaymentCents);
  const falling = calculateArmMortgage({
    ...base(),
    scenario: 'falling',
    scenarioStepPercent: 1,
    initialCap: 2,
    subsequentCap: 2,
    lifetimeCap: 5,
  });
  assert.ok((falling.firstAdjustedPaymentCents ?? 0) < falling.initialPaymentCents);
}

{
  const indexed = calculateArmMortgage({
    ...base(),
    useIndexMargin: true,
    indexRate: 5,
    margin: 2.5,
    initialCap: 5,
    subsequentCap: 5,
    lifetimeCap: 10,
    scenario: 'constant',
  });
  assert.equal(indexed.schedule[60].annualRate, 7.5);
}

{
  const input = { ...base(), termYears: 6, structure: '5/1' as const, projectedAnnualRate: 6.5 };
  const result = calculateArmMortgage(input);
  assert.equal(result.paymentCount, 72);
  assert.equal(result.schedule.at(-1)?.balanceCents, 0);
  const before = result.schedule[59].balanceCents;
  const remaining = 12;
  const r = result.schedule[60].annualRate / 100 / 12;
  const expected = amortizingPaymentCents(before, r, remaining);
  assert.equal(result.firstAdjustedPaymentCents, expected);
}

{
  const bad = validateArmInput({ ...base(), principal: -1, initialAnnualRate: Number.NaN, structure: '5/1' });
  assert.equal(bad.isValid, false);
  assert.ok(bad.errors.principal);
  const longFixed = validateArmInput({ ...base(), termYears: 4, structure: '5/1' });
  assert.ok(longFixed.errors.structure);
  const floor = validateArmInput({ ...base(), rateFloor: 20, lifetimeCap: 1 });
  assert.ok(floor.errors.rateFloor);
}

{
  const withCosts = calculateArmMortgage({
    ...base(),
    propertyTaxMonthly: 200,
    insuranceMonthly: 100,
    hoaMonthly: 50,
    mortgageInsuranceMonthly: 75,
  });
  assert.equal(withCosts.housingExtrasCents, 42500);
  assert.equal(withCosts.initialHousingPaymentCents, withCosts.initialPaymentCents + 42500);
  assert.equal(withCosts.schedule[0].paymentCents, withCosts.initialPaymentCents);
}

{
  const a = calculateArmMortgage(base());
  const b = calculateArmMortgage(base());
  assert.equal(a.totalPaymentsCents, b.totalPaymentsCents);
  assert.equal(a.schedule.length, b.schedule.length);
}

console.log('arm mortgage calculation.test ok');
