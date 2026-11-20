import assert from 'node:assert/strict';
import {
  calculateAnnualRentalIncome,
  calculateEffectiveGrossIncome,
  calculateNetOperatingIncome,
  calculateNoiMargin,
  calculateOperatingExpenseRatio,
  calculatePotentialGrossIncome,
  calculateTotalOperatingExpenses,
  calculateVacancyLoss,
  calculateVacancyRatePercent,
  convertArea,
  convertRentalRateUnits,
  SQ_FT_PER_M2,
} from './calculation';
import { createDefaultInput } from './types';
import { validateNoiInput } from './validation';

// Test 1: Annual rental income
assert.equal(calculateAnnualRentalIncome(2000, 25, 'annually'), 50_000);

// Test 2: Monthly rental rate → annual
assert.equal(calculateAnnualRentalIncome(2000, 2, 'monthly'), 48_000);

// Test 3: Potential gross income
assert.equal(calculatePotentialGrossIncome(50_000, 5_000), 55_000);

// Test 4: Vacancy rate
assert.equal(calculateVacancyRatePercent(92), 8);

// Test 5: Vacancy loss
assert.ok(Math.abs(calculateVacancyLoss(50_000, 92)! - 4_000) < 1e-9);

// Test 6: Effective gross income
assert.equal(calculateEffectiveGrossIncome(55_000, 4_000), 51_000);

// Test 7: Operating expenses sum
assert.equal(
  calculateTotalOperatingExpenses([8000, 3000, 5000, 4000, 2000]),
  22_000
);

// Test 8: NOI
assert.equal(calculateNetOperatingIncome(51_000, 22_000), 29_000);

// Test 9: Negative NOI
assert.equal(calculateNetOperatingIncome(20_000, 30_000), -10_000);

// Test 10: Full occupancy
assert.equal(calculateVacancyLoss(50_000, 100), 0);

// Test 11: Zero occupancy
assert.equal(calculateVacancyLoss(50_000, 0), 50_000);

// Test 12: Invalid occupancy
{
  assert.equal(calculateVacancyRatePercent(-1), null);
  assert.equal(calculateVacancyRatePercent(101), null);
  const low = validateNoiInput({
    ...createDefaultInput(),
    area: '1000',
    rentalRatePerArea: '20',
    occupancyRate: '-5',
    manualOperatingExpenses: '1000',
  });
  assert.ok(low.errors.occupancyRate);
  const high = validateNoiInput({
    ...createDefaultInput(),
    area: '1000',
    rentalRatePerArea: '20',
    occupancyRate: '120',
    manualOperatingExpenses: '1000',
  });
  assert.ok(high.errors.occupancyRate);
}

// Test 13: Area unit conversion preserves rental income
{
  const areaFt = 1000;
  const rateFt = 20;
  const incomeFt = calculateAnnualRentalIncome(areaFt, rateFt, 'annually')!;
  const areaM = convertArea(areaFt, 'ft2', 'm2');
  const rateM = convertRentalRateUnits(rateFt, 'ft2', 'm2');
  const incomeM = calculateAnnualRentalIncome(areaM, rateM, 'annually')!;
  assert.ok(Math.abs(incomeFt - incomeM) < 1e-6);
  assert.ok(Math.abs(areaM - 1000 / SQ_FT_PER_M2) < 1e-9);
}

// Test 14: Manual expense mode ignores breakdown
{
  const v = validateNoiInput({
    ...createDefaultInput(),
    area: '2000',
    rentalRatePerArea: '25',
    otherIncome: '5000',
    occupancyRate: '92',
    expenseMode: 'manual',
    manualOperatingExpenses: '22000',
    propertyTaxes: '999999',
  });
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.equal(v.result!.operatingExpenses, 22_000);
  assert.equal(v.result!.noi, 29_000);
}

// Test 15: Breakdown expense mode
{
  const v = validateNoiInput({
    ...createDefaultInput(),
    area: '2000',
    rentalRatePerArea: '25',
    otherIncome: '5000',
    occupancyRate: '92',
    expenseMode: 'breakdown',
    propertyTaxes: '8000',
    insurance: '3000',
    maintenance: '5000',
    managementFees: '4000',
    utilities: '2000',
  });
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.equal(v.result!.operatingExpenses, 22_000);
  assert.equal(v.result!.noi, 29_000);
}

// Test 16: Mode switching — no double-count
{
  const manual = validateNoiInput({
    ...createDefaultInput(),
    area: '1500',
    rentalRatePerArea: '20',
    expenseMode: 'manual',
    manualOperatingExpenses: '10000',
    propertyTaxes: '5000',
  });
  assert.equal(manual.result!.operatingExpenses, 10_000);

  const breakdown = validateNoiInput({
    ...createDefaultInput(),
    area: '1500',
    rentalRatePerArea: '20',
    expenseMode: 'breakdown',
    manualOperatingExpenses: '10000',
    propertyTaxes: '5000',
  });
  assert.equal(breakdown.result!.operatingExpenses, 5_000);
}

// Test 17: Clearing required inputs clears NOI
{
  const v = validateNoiInput({
    ...createDefaultInput(),
    area: '',
    rentalRatePerArea: '20',
    manualOperatingExpenses: '1000',
  });
  assert.equal(v.result, null);
}

// Test 18: Reset defaults
{
  const d = createDefaultInput();
  assert.equal(d.area, '');
  assert.equal(d.areaUnit, 'ft2');
  assert.equal(d.rentalPeriod, 'annually');
  assert.equal(d.occupancyRate, '100');
  assert.equal(d.expenseMode, 'manual');
  assert.equal(d.currency, 'USD');
}

// Test 19: Decimal values
{
  const v = validateNoiInput({
    ...createDefaultInput(),
    area: '100.5',
    rentalRatePerArea: '10.25',
    otherIncome: '100.5',
    occupancyRate: '95.5',
    manualOperatingExpenses: '200.75',
  });
  assert.equal(v.isValid, true);
  assert.ok(v.result);
  assert.ok(Number.isFinite(v.result!.noi));
}

// Test 20: Large numbers
{
  const v = validateNoiInput({
    ...createDefaultInput(),
    area: '50000',
    rentalRatePerArea: '40',
    otherIncome: '100000',
    occupancyRate: '90',
    manualOperatingExpenses: '500000',
  });
  assert.ok(v.result);
  assert.ok(v.result!.formattedNoi.includes(','));
  assert.equal(v.result!.annualRentalIncome, 2_000_000);
  assert.ok(Math.abs(v.result!.vacancyLoss - 200_000) < 1e-6);
  assert.equal(v.result!.potentialGrossIncome, 2_100_000);
  assert.ok(Math.abs(v.result!.effectiveGrossIncome - 1_900_000) < 1e-6);
  assert.ok(Math.abs(v.result!.noi - 1_400_000) < 1e-6);
}

// Test 21: Real-time path — vacancy only on rental, not other income
{
  const v = validateNoiInput({
    ...createDefaultInput(),
    area: '1000',
    rentalRatePerArea: '100',
    otherIncome: '10000',
    occupancyRate: '90',
    manualOperatingExpenses: '0',
  });
  assert.ok(v.result);
  assert.equal(v.result!.annualRentalIncome, 100_000);
  assert.equal(v.result!.vacancyLoss, 10_000);
  assert.equal(v.result!.potentialGrossIncome, 110_000);
  assert.equal(v.result!.effectiveGrossIncome, 100_000);
  assert.equal(v.result!.noi, 100_000);
}

// Test 22: NOI margin
{
  assert.equal(calculateNoiMargin(29_000, 51_000), (29_000 / 51_000) * 100);
  assert.equal(calculateNoiMargin(10_000, 0), null);
}

// Test 23: Operating expense ratio
{
  assert.equal(
    calculateOperatingExpenseRatio(22_000, 51_000),
    (22_000 / 51_000) * 100
  );
  assert.equal(calculateOperatingExpenseRatio(1000, 0), null);
}

// Intermediate PGI without expenses
{
  const v = validateNoiInput({
    ...createDefaultInput(),
    area: '2000',
    rentalRatePerArea: '25',
    otherIncome: '5000',
    occupancyRate: '92',
    manualOperatingExpenses: '',
  });
  assert.equal(v.isValid, false);
  assert.ok(v.result);
  assert.equal(v.result!.potentialGrossIncome, 55_000);
  assert.equal(v.result!.formattedNoi, '');
}

console.log('net-operating-income/calculation.test.ts: all assertions passed');
