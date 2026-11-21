import assert from 'node:assert/strict';
import {
  annualFromPeriod,
  calculatePayRaise,
  periodsFromAnnual,
} from './calculation';

// Period conversion: 1000/hr · 40h → annual 2,080,000
{
  const annual = annualFromPeriod('hourly', 1000, 40);
  assert.equal(annual, 2_080_000);
  const periods = periodsFromAnnual(annual!, 40)!;
  assert.equal(periods.weekly, 40_000);
  assert.equal(periods.monthly, 2_080_000 / 12);
  assert.equal(periods.hourly, 1000);
}

// Percentage raise 10%
{
  const result = calculatePayRaise({
    hoursPerWeek: 40,
    beforeAnnual: 2_080_000,
    mode: 'percentage',
    raisePercent: 10,
  })!;
  assert.equal(result.raise.annual, 208_000);
  assert.equal(result.after.annual, 2_288_000);
  assert.equal(result.after.hourly, 1100);
  assert.equal(result.raisePercentage, 10);
  assert.equal(result.percentageUndefined, false);
}

// Monetary annual raise → percentage
{
  const result = calculatePayRaise({
    hoursPerWeek: 40,
    beforeAnnual: 2_080_000,
    mode: 'monetary',
    raiseAnnual: 208_000,
  })!;
  assert.equal(result.raisePercentage, 10);
  assert.equal(result.after.hourly, 1100);
}

// Zero before + positive raise → undefined %
{
  const result = calculatePayRaise({
    hoursPerWeek: 40,
    beforeAnnual: 0,
    mode: 'monetary',
    raiseAnnual: 1000,
  })!;
  assert.equal(result.raisePercentage, null);
  assert.equal(result.percentageUndefined, true);
  assert.equal(result.after.annual, 1000);
}

// Zero before + zero raise → 0%
{
  const result = calculatePayRaise({
    hoursPerWeek: 40,
    beforeAnnual: 0,
    mode: 'monetary',
    raiseAnnual: 0,
  })!;
  assert.equal(result.raisePercentage, 0);
  assert.equal(result.percentageUndefined, false);
}

// Reject negative raise
{
  assert.equal(
    calculatePayRaise({
      hoursPerWeek: 40,
      beforeAnnual: 1000,
      mode: 'percentage',
      raisePercent: -5,
    }),
    null
  );
}

// Monthly = annual/12 (not 4× weekly)
{
  const periods = periodsFromAnnual(120_000, 40)!;
  assert.equal(periods.monthly, 10_000);
  assert.notEqual(periods.monthly, periods.weekly * 4);
}

console.log('pay-raise calculation.test.ts: all assertions passed');
