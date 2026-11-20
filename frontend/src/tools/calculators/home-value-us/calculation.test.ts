import assert from 'node:assert/strict';
import {
  calculateIndexedHomeValue,
  calculateInflationAdjustedPurchasePrice,
  calculateNominalDollarChange,
  calculateNominalPercentageChange,
  calculateRealDollarChange,
  calculateRealPercentageChange,
  findObservation,
} from './calculation';
import { createDefaultInput } from './types';
import { validateHomeValueUsInput } from './validation';

// Test 1: Basic Indexed Home Value
{
  assert.equal(calculateIndexedHomeValue(300_000, 150, 225), 450_000);
}

// Test 2: No Index Change
{
  assert.equal(calculateIndexedHomeValue(300_000, 200, 200), 300_000);
  assert.equal(calculateNominalPercentageChange(300_000, 300_000), 0);
}

// Test 3: Property Depreciation
{
  assert.equal(calculateIndexedHomeValue(400_000, 250, 200), 320_000);
  assert.ok(
    Math.abs(calculateNominalPercentageChange(320_000, 400_000)! - -20) < 1e-9
  );
}

// Test 4: Nominal Dollar Change
{
  assert.equal(calculateNominalDollarChange(450_000, 300_000), 150_000);
}

// Test 5: Nominal Percentage Change
{
  assert.equal(calculateNominalPercentageChange(450_000, 300_000), 50);
}

// Test 6: Inflation-Adjusted Purchase Price
{
  assert.equal(
    calculateInflationAdjustedPurchasePrice(300_000, 200, 300),
    450_000
  );
}

// Test 7: Real Appreciation (ratio method)
{
  assert.equal(calculateRealPercentageChange(1.5, 1.2), 25);
  const adj = calculateInflationAdjustedPurchasePrice(300_000, 200, 300)!;
  assert.equal(calculateRealDollarChange(500_000, adj), 50_000);
}

// Test 8 / 9: Missing observations
{
  assert.equal(findObservation([{ period: '2005-01', value: 150 }], '2005-02'), null);
  const v = validateHomeValueUsInput(
    {
      ...createDefaultInput(),
      metroId: 'miami',
      purchaseYear: '2005',
      purchaseMonth: '01',
      purchasePrice: '300000',
    },
    {
      seriesKey: 'metro:miami',
      fredSeriesId: 'MIXRNSA',
      label: 'test',
      source: 'test',
      frequency: 'monthly',
      firstPeriod: '1987-01',
      latestPeriod: '2026-08',
      fetchedAt: new Date().toISOString(),
      observations: [{ period: '2005-02', value: 150 }],
      stale: false,
    },
    null,
    'FL - Miami'
  );
  assert.ok(v.errors.purchaseMonth || v.errors.data || !v.result);
}

// Test 10: Zero Purchase Index
{
  assert.equal(calculateIndexedHomeValue(300_000, 0, 225), null);
}

// Test 11: Invalid metro / no data
{
  const v = validateHomeValueUsInput(
    { ...createDefaultInput(), purchasePrice: '300000', purchaseYear: '2005', purchaseMonth: '01' },
    null,
    null,
    ''
  );
  assert.equal(v.result, null);
}

// Zero purchase price → value 0, % unavailable
{
  assert.equal(calculateIndexedHomeValue(0, 150, 225), 0);
  assert.equal(calculateNominalPercentageChange(0, 0), null);
}

// Test fixtures via full validation happy path
{
  const homeIndex = {
    seriesKey: 'metro:miami',
    fredSeriesId: 'MIXRNSA',
    label: 'Miami test',
    source: 'FRED / S&P CoreLogic Case-Shiller',
    frequency: 'monthly' as const,
    firstPeriod: '1987-01',
    latestPeriod: '2024-01',
    fetchedAt: new Date().toISOString(),
    observations: [
      { period: '2005-01', value: 150 },
      { period: '2024-01', value: 225 },
    ],
    stale: false,
  };
  const cpi = {
    seriesKey: 'cpi:cpi-u-nsa',
    fredSeriesId: 'CPIAUCNS',
    label: 'CPI test',
    source: 'FRED / BLS',
    frequency: 'monthly' as const,
    firstPeriod: '1987-01',
    latestPeriod: '2024-01',
    fetchedAt: new Date().toISOString(),
    observations: [
      { period: '2005-01', value: 200 },
      { period: '2024-01', value: 300 },
    ],
    stale: false,
  };
  const v = validateHomeValueUsInput(
    {
      ...createDefaultInput(),
      metroId: 'miami',
      purchaseYear: '2005',
      purchaseMonth: '01',
      purchasePrice: '300000',
      valuationMode: 'present',
    },
    homeIndex,
    cpi,
    'FL - Miami'
  );
  assert.equal(v.isValid, true);
  assert.equal(v.result?.estimatedHomeValue, 450_000);
  assert.equal(v.result?.nominalDollarChange, 150_000);
  assert.equal(v.result?.nominalPercentChange, 50);
  assert.equal(v.result?.inflationAdjustedPurchasePrice, 450_000);
  assert.equal(v.result?.realPercentChange, 0);
}

console.log('home-value-us/calculation.test.ts: all assertions passed');
