import assert from 'node:assert/strict';
import {
  amortizingPaymentCents,
  applyRateCaps,
  assumedFullyIndexedRate,
  calculateArmMortgage,
  financingCents,
} from './calculation';
import { createDefaultArmInput, type ArmMortgageInput } from './types';
import { validateArmInput } from './validation';

function independentPayment(principal: number, annualPct: number, months: number): number {
  const cents = Math.round(principal * 100);
  if (annualPct === 0) return Math.round(cents / months);
  const r = annualPct / 100 / 12;
  const g = (1 + r) ** months;
  return Math.round((cents * r * g) / (g - 1));
}

const start = '2026-01-01';

function base(patch: Partial<ArmMortgageInput> = {}): ArmMortgageInput {
  return { ...createDefaultArmInput(start), ...patch };
}

assert.equal(independentPayment(250000, 5.5, 360), 141947);
assert.equal(amortizingPaymentCents(25_000_000, 0.055 / 12, 360), 141947);
assert.equal(amortizingPaymentCents(25_000_000, 0, 360), Math.round(25_000_000 / 360));

{
  const loan = base({ homePrice: 250000, downPaymentMode: 'amount', downPayment: 0 });
  assert.equal(financingCents(loan).principalCents, 25_000_000);
  const result = calculateArmMortgage(loan);
  assert.equal(result.initialPaymentCents, 141947);
  assert.equal(result.schedule[0].paymentCents, 141947);
  assert.equal(result.schedule[0].annualRate, 5.5);
  assert.equal(result.fixedMonths, 60);
  assert.equal(result.adjustEveryMonths, 12);
  assert.equal(result.firstAdjustmentPaymentNumber, 61);
  assert.equal(result.schedule[59].rateAdjusted, false);
  assert.equal(result.schedule[60].rateAdjusted, true);
  assert.equal(result.schedule[60].annualRate, 6.5);
  assert.equal(result.projectedRateAfterFirstReset, 6.5);
  assert.equal(result.fullyIndexedRate, 6.5);
  assert.equal(result.maximumPermittedRate, 10.5);
  assert.equal(result.minimumPermittedRate, 0.5);
  assert.equal(result.paymentDifferenceCents, (result.firstAdjustedPaymentCents ?? 0) - result.initialPaymentCents);
  assert.ok((result.paymentDifferenceCents ?? 0) > 0);
  assert.equal(result.schedule.at(-1)?.balanceCents, 0);
  assert.equal(result.paymentCount, 360);
  const interest = result.schedule.reduce((s, r) => s + r.interestCents, 0);
  const principal = result.schedule.reduce((s, r) => s + r.principalCents, 0);
  assert.equal(interest, result.totalInterestCents);
  assert.equal(principal, result.totalPrincipalCents);
  assert.equal(principal, 25_000_000);
  assert.equal(result.totalPaymentsCents, interest + principal);
  const yearInterest = result.yearlySchedule.reduce((s, r) => s + r.interestCents, 0);
  const yearPrincipal = result.yearlySchedule.reduce((s, r) => s + r.principalCents, 0);
  assert.equal(result.yearlySchedule.length, 30);
  assert.equal(yearInterest, interest);
  assert.equal(yearPrincipal, principal);
  let previous = result.principalCents;
  for (const row of result.schedule) {
    assert.ok(row.principalCents >= 0);
    assert.ok(row.interestCents >= 0);
    assert.ok(row.balanceCents >= 0);
    assert.ok(row.balanceCents <= previous);
    previous = row.balanceCents;
  }
}

{
  const priced = calculateArmMortgage(base());
  assert.equal(priced.principalCents, 32_000_000);
  assert.equal(priced.downPaymentCents, 8_000_000);
  assert.equal(priced.initialPaymentCents, independentPayment(320000, 5.5, 360));
}

for (const structure of ['3/1', '5/1', '7/1', '10/1', '5/6', '7/6', '10/6'] as const) {
  const result = calculateArmMortgage(base({ structure }));
  const years = Number(structure.split('/')[0]);
  const every = structure.endsWith('/1') ? 12 : 6;
  assert.equal(result.fixedMonths, years * 12, structure);
  assert.equal(result.adjustEveryMonths, every, structure);
  assert.equal(result.firstAdjustmentPaymentNumber, years * 12 + 1, structure);
  assert.equal(result.schedule[years * 12].rateAdjusted, true, structure);
}

{
  const fiveSix = calculateArmMortgage(base({ structure: '5/6' }));
  assert.equal(fiveSix.schedule[60].rateAdjusted, true);
  assert.equal(fiveSix.schedule[66].rateAdjusted, true);
  assert.equal(fiveSix.schedule[65].rateAdjusted, false);
  const fiveOne = calculateArmMortgage(base({ structure: '5/1' }));
  assert.equal(fiveOne.schedule[72].rateAdjusted, true);
  assert.equal(fiveOne.schedule[66].rateAdjusted, false);
}

{
  const custom = calculateArmMortgage(
    base({ structure: 'custom', customFixedYears: 4, customAdjustMonths: 6, termYears: 10 })
  );
  assert.equal(custom.fixedMonths, 48);
  assert.equal(custom.adjustEveryMonths, 6);
  assert.equal(custom.firstAdjustmentPaymentNumber, 49);
  assert.equal(custom.schedule[48 + 6].rateAdjusted, true);
}

{
  const zero = calculateArmMortgage(
    base({
      homePrice: 250000,
      downPayment: 0,
      downPaymentMode: 'amount',
      initialAnnualRate: 0,
      indexRate: 0,
      margin: 0,
      scenario: 'constant',
    })
  );
  assert.equal(zero.initialPaymentCents, Math.round(25_000_000 / 360));
  assert.equal(zero.totalInterestCents, 0);
  assert.equal(zero.schedule[60].annualRate, 0);
}

{
  assert.equal(
    applyRateCaps({
      currentRate: 5.5,
      initialRate: 5.5,
      uncappedRate: 9,
      isFirstAdjustment: true,
      initialCap: 2,
      subsequentCap: 1,
      lifetimeIncreaseCap: 5,
      lifetimeDecreaseCap: 5,
    }),
    7.5
  );
  assert.equal(
    applyRateCaps({
      currentRate: 7.5,
      initialRate: 5.5,
      uncappedRate: 12,
      isFirstAdjustment: false,
      initialCap: 2,
      subsequentCap: 1,
      lifetimeIncreaseCap: 5,
      lifetimeDecreaseCap: 5,
    }),
    8.5
  );
  assert.equal(
    applyRateCaps({
      currentRate: 10,
      initialRate: 5.5,
      uncappedRate: 12,
      isFirstAdjustment: false,
      initialCap: 2,
      subsequentCap: 2,
      lifetimeIncreaseCap: 5,
      lifetimeDecreaseCap: 5,
    }),
    10.5
  );
  assert.equal(
    applyRateCaps({
      currentRate: 5.5,
      initialRate: 5.5,
      uncappedRate: 1,
      isFirstAdjustment: true,
      initialCap: 2,
      subsequentCap: 2,
      lifetimeIncreaseCap: 5,
      lifetimeDecreaseCap: 5,
    }),
    3.5
  );
  assert.equal(
    applyRateCaps({
      currentRate: 5.5,
      initialRate: 5.5,
      uncappedRate: 0,
      isFirstAdjustment: true,
      initialCap: 5,
      subsequentCap: 5,
      lifetimeIncreaseCap: 5,
      lifetimeDecreaseCap: 1,
    }),
    4.5
  );
}

{
  const rising = calculateArmMortgage(
    base({
      scenario: 'rising',
      scenarioStepPercent: 1,
      initialCap: 5,
      subsequentCap: 5,
      lifetimeIncreaseCap: 10,
    })
  );
  assert.equal(assumedFullyIndexedRate(base({ scenario: 'rising', scenarioStepPercent: 1 }), 1), 7.5);
  assert.equal(rising.schedule[60].annualRate, 6.5);
  assert.equal(rising.schedule[72].annualRate, 7.5);
  assert.ok((rising.firstAdjustedPaymentCents ?? 0) > rising.initialPaymentCents);
  assert.ok(rising.maxProjectedRate <= rising.maximumPermittedRate);

  const falling = calculateArmMortgage(
    base({
      scenario: 'falling',
      indexRate: 3,
      margin: 1.5,
      scenarioStepPercent: 1,
      initialCap: 2,
      subsequentCap: 2,
      lifetimeDecreaseCap: 5,
    })
  );
  assert.equal(falling.schedule[60].annualRate, 4.5);
  assert.equal(falling.schedule[72].annualRate, 3.5);
  assert.ok((falling.firstAdjustedPaymentCents ?? 0) < falling.initialPaymentCents);
  assert.ok(falling.schedule[72].annualRate >= falling.minimumPermittedRate);
}

{
  const capped = calculateArmMortgage(
    base({
      homePrice: 250000,
      downPayment: 0,
      downPaymentMode: 'amount',
      initialAnnualRate: 5,
      indexRate: 20,
      margin: 10,
      scenario: 'constant',
      initialCap: 2,
      subsequentCap: 2,
      lifetimeIncreaseCap: 5,
      lifetimeDecreaseCap: 5,
    })
  );
  assert.equal(capped.maximumPermittedRate, 10);
  assert.equal(capped.schedule[60].annualRate, 7);
  assert.ok(capped.maxProjectedRate <= 10);
  assert.equal(capped.maxProjectedPaymentCents, capped.contractualMaxPaymentCents);
  const mild = calculateArmMortgage(
    base({
      homePrice: 250000,
      downPayment: 0,
      downPaymentMode: 'amount',
      initialAnnualRate: 5,
      indexRate: 4,
      margin: 1.5,
      initialCap: 2,
      subsequentCap: 2,
      lifetimeIncreaseCap: 5,
    })
  );
  assert.ok(mild.maxProjectedPaymentCents <= mild.contractualMaxPaymentCents);
  assert.ok(mild.maximumPermittedRate > mild.maxProjectedRate);
}

{
  const input = base({
    homePrice: 250000,
    downPayment: 0,
    downPaymentMode: 'amount',
    termYears: 6,
    structure: '5/1',
    indexRate: 5,
    margin: 2,
    initialCap: 5,
    subsequentCap: 5,
    lifetimeIncreaseCap: 10,
  });
  const result = calculateArmMortgage(input);
  assert.equal(result.paymentCount, 72);
  assert.equal(result.schedule.at(-1)?.balanceCents, 0);
  const before = result.schedule[59].balanceCents;
  const expected = amortizingPaymentCents(before, result.schedule[60].annualRate / 100 / 12, 12);
  assert.equal(result.firstAdjustedPaymentCents, expected);
  assert.equal(result.schedule[60].paymentCents, expected);
}

{
  const badPrice = validateArmInput(base({ homePrice: -1 }));
  assert.equal(badPrice.isValid, false);
  assert.ok(badPrice.errors.homePrice);
  const wiped = validateArmInput(base({ downPaymentMode: 'percent', downPayment: 100 }));
  assert.ok(wiped.errors.downPayment);
  const nan = validateArmInput(base({ initialAnnualRate: Number.NaN }));
  assert.ok(nan.errors.initialAnnualRate);
  const longFixed = validateArmInput(base({ termYears: 4, structure: '5/1' }));
  assert.ok(longFixed.errors.structure);
  const custom = validateArmInput(base({ structure: 'custom', customAdjustMonths: 0, customFixedYears: 2 }));
  assert.ok(custom.errors.customAdjustMonths);
  const overTerm = validateArmInput(base({ structure: 'custom', customFixedYears: 8, termYears: 5 }));
  assert.ok(overTerm.errors.structure);
}

{
  const withCosts = calculateArmMortgage(
    base({
      propertyTaxMonthly: 200,
      insuranceMonthly: 100,
      hoaMonthly: 50,
      mortgageInsuranceMonthly: 75,
    })
  );
  assert.equal(withCosts.housingExtrasCents, 42500);
  assert.equal(withCosts.initialHousingPaymentCents, withCosts.initialPaymentCents + 42500);
  assert.equal(withCosts.schedule[0].interestCents + withCosts.schedule[0].principalCents, withCosts.schedule[0].paymentCents);
}

{
  const a = calculateArmMortgage(base());
  const b = calculateArmMortgage(base());
  assert.equal(a.totalPaymentsCents, b.totalPaymentsCents);
  assert.equal(a.schedule.length, b.schedule.length);
  assert.equal(a.payoffDate, '2056-01-01');
}

{
  // Reference Scenario Parity Audit Test:
  // Mortgage balance: 250,000, 20 years, 5% initial, 10/1 ARM, 0.5% expected adjustment, 8% rate cap, currency PKR.
  const ref = calculateArmMortgage(
    base({
      balanceMode: 'balance',
      mortgageBalance: 250000,
      termYears: 20,
      initialAnnualRate: 5.0,
      structure: '10/1',
      adjustmentMethod: 'expected-rate',
      expectedAdjustment: 0.5,
      rateCap: 8.0,
      rateFloor: 0.0,
      periodicCap: 2.0,
      compounding: 'monthly',
      upfrontFees: 0,
      currency: 'PKR',
    })
  );

  assert.equal(ref.initialPaymentCents, 164989); // PKR 1,649.89
  assert.equal(ref.minPaymentCents, 164989); // PKR 1,649.89
  assert.equal(ref.maxPaymentCents, 183107); // PKR 1,831.07
  assert.equal(ref.averageRate, 6.125); // 6.125% average annual note rate (matching reference APR screenshot)
  assert.equal(ref.actuarialApr, 5.3574); // 5.357% true actuarial cash-flow APR
  assert.ok(Math.abs(ref.totalInterestCents - 16298332) <= 10); // ~PKR 162,983.32
  assert.equal(ref.additionalCostsCents, 0); // PKR 0.00
  assert.ok(Math.abs(ref.totalPaymentsCents - 41298332) <= 10); // ~PKR 412,983.32
  assert.equal(ref.paymentCount, 240);
  assert.equal(ref.fixedMonths, 120);
  assert.equal(ref.adjustEveryMonths, 12);
  assert.equal(ref.adjustmentMilestones.length, 20);

  // Verify milestone progression
  assert.equal(ref.adjustmentMilestones[9].rate, 5.0); // Year 10
  assert.equal(ref.adjustmentMilestones[10].rate, 5.5); // Year 11
  assert.equal(ref.adjustmentMilestones[11].rate, 6.0); // Year 12
  assert.equal(ref.adjustmentMilestones[12].rate, 6.5); // Year 13
  assert.equal(ref.adjustmentMilestones[13].rate, 7.0); // Year 14
  assert.equal(ref.adjustmentMilestones[14].rate, 7.5); // Year 15
  assert.equal(ref.adjustmentMilestones[15].rate, 8.0); // Year 16 (capped)
  assert.equal(ref.adjustmentMilestones[19].rate, 8.0); // Year 20 (capped)
}

{
  // 5/1 ARM with expected adjustment
  const fiveOne = calculateArmMortgage(
    base({
      balanceMode: 'balance',
      mortgageBalance: 300000,
      termYears: 30,
      initialAnnualRate: 6.0,
      structure: '5/1',
      adjustmentMethod: 'expected-rate',
      expectedAdjustment: 1.0,
      rateCap: 9.0,
      rateFloor: 2.0,
      compounding: 'monthly',
      upfrontFees: 0,
    })
  );
  assert.equal(fiveOne.fixedMonths, 60);
  assert.equal(fiveOne.adjustEveryMonths, 12);
  assert.equal(fiveOne.schedule[60].annualRate, 7.0);
  assert.equal(fiveOne.schedule[72].annualRate, 8.0);
  assert.equal(fiveOne.schedule[84].annualRate, 9.0);
  assert.equal(fiveOne.schedule[96].annualRate, 9.0); // capped at 9.0
}

{
  // 5/6 ARM: semiannual adjustments every 6 months
  const semi = calculateArmMortgage(
    base({
      balanceMode: 'balance',
      mortgageBalance: 200000,
      termYears: 15,
      initialAnnualRate: 4.5,
      structure: '5/6',
      adjustmentMethod: 'expected-rate',
      expectedAdjustment: 0.25,
      rateCap: 7.0,
      compounding: 'monthly',
    })
  );
  assert.equal(semi.fixedMonths, 60);
  assert.equal(semi.adjustEveryMonths, 6);
  assert.equal(semi.schedule[60].annualRate, 4.75);
  assert.equal(semi.schedule[66].annualRate, 5.0);
}

{
  // Canadian semi-annual compounding setting
  const canadian = calculateArmMortgage(
    base({
      balanceMode: 'balance',
      mortgageBalance: 250000,
      termYears: 20,
      initialAnnualRate: 5.0,
      structure: '10/1',
      compounding: 'semi-annual',
    })
  );
  const us = calculateArmMortgage(
    base({
      balanceMode: 'balance',
      mortgageBalance: 250000,
      termYears: 20,
      initialAnnualRate: 5.0,
      structure: '10/1',
      compounding: 'monthly',
    })
  );
  // Semi-annual compounding has slightly lower effective monthly rate than nominal monthly
  assert.ok(canadian.initialPaymentCents < us.initialPaymentCents);
}

{
  // Nonzero upfront fees and finance charges
  const withFees = calculateArmMortgage(
    base({
      balanceMode: 'balance',
      mortgageBalance: 250000,
      termYears: 20,
      initialAnnualRate: 5.0,
      structure: '10/1',
      adjustmentMethod: 'expected-rate',
      expectedAdjustment: 0.5,
      rateCap: 8.0,
      upfrontFees: 3000,
    })
  );
  assert.equal(withFees.upfrontFeesCents, 300000);
  assert.equal(withFees.additionalCostsCents, 300000);
  assert.equal(withFees.totalPaymentsCents, withFees.totalInterestCents + withFees.totalPrincipalCents + 300000);
  assert.ok(withFees.actuarialApr > 5.357); // APR increases due to upfront finance charges
}

{
  // Validation checks for new inputs
  const invalidBal = validateArmInput(
    base({
      balanceMode: 'balance',
      mortgageBalance: -500,
    })
  );
  assert.ok(invalidBal.errors.mortgageBalance);

  const invalidCap = validateArmInput(
    base({
      adjustmentMethod: 'expected-rate',
      rateCap: 3.0,
      rateFloor: 5.0,
    })
  );
  assert.ok(invalidCap.errors.rateCap);

  const invalidAdj = validateArmInput(
    base({
      adjustmentMethod: 'expected-rate',
      expectedAdjustment: -1,
    })
  );
  assert.ok(invalidAdj.errors.expectedAdjustment);
}

console.log('arm mortgage calculation.test ok');
