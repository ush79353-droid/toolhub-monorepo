import assert from 'node:assert/strict';
import {
  calculateAccumulatedDepreciation,
  decliningBalanceAccumulated,
  decliningBalanceRate,
  roundMoney,
  straightLineAccumulated,
  sumOfYearsDigitsAccumulated,
  unitsOfProductionAccumulated,
} from './calculation';
import {
  createDefaultAccumulatedDepreciationInput,
  type AccumulatedDepreciationInput,
} from './types';
import { validateAccumulatedDepreciation } from './validation';

function base(patch: Partial<AccumulatedDepreciationInput> = {}): AccumulatedDepreciationInput {
  return { ...createDefaultAccumulatedDepreciationInput(), ...patch };
}

{
  // Default straight-line screenshot example.
  const result = calculateAccumulatedDepreciation(base());
  assert.equal(result.defined, true);
  assert.equal(result.method, 'straight-line');
  assert.equal(result.accumulatedDepreciation, 2933.33);
  assert.equal(result.netBookValue, 22066.67);
  assert.equal(result.assetCost, 25000);
  assert.equal(result.salvageValue, 3000);
  assert.equal(
    roundMoney(result.assetCost - result.accumulatedDepreciation),
    result.netBookValue
  );
}

{
  assert.equal(straightLineAccumulated(25000, 3000, 15, 2), (22000 / 15) * 2);
  assert.equal(straightLineAccumulated(25000, 3000, 15, 0), 0);
  assert.equal(straightLineAccumulated(25000, 3000, 15, 15), 22000);
  assert.equal(straightLineAccumulated(10000, 10000, 10, 5), 0);
}

{
  // Double-declining: rate = 2/15.
  assert.ok(Math.abs(decliningBalanceRate(15) - 2 / 15) < 1e-12);
  const y1 = decliningBalanceAccumulated(25000, 3000, 15, 1);
  assert.ok(Math.abs(y1.accumulated - 25000 * (2 / 15)) < 1e-9);
  const y2 = decliningBalanceAccumulated(25000, 3000, 15, 2);
  const expectedY2 = 25000 * (2 / 15) + (25000 - 25000 * (2 / 15)) * (2 / 15);
  assert.ok(Math.abs(y2.accumulated - expectedY2) < 1e-9);
  const result = calculateAccumulatedDepreciation(base({ method: 'declining-balance' }));
  assert.equal(result.defined, true);
  assert.equal(result.accumulatedDepreciation, roundMoney(expectedY2));
  assert.equal(result.netBookValue, roundMoney(25000 - roundMoney(expectedY2)));
  assert.ok(result.decliningBalanceRate !== null);
}

{
  // Salvage floor on declining balance: never below salvage.
  const floored = calculateAccumulatedDepreciation(
    base({
      method: 'declining-balance',
      assetCost: 10000,
      salvageValue: 2000,
      usefulLifeYears: 5,
      yearsElapsed: 5,
    })
  );
  assert.equal(floored.defined, true);
  assert.ok(floored.accumulatedDepreciation <= 8000 + 1e-9);
  assert.ok(floored.netBookValue >= 2000 - 1e-9);
  assert.equal(floored.netBookValue, roundMoney(10000 - floored.accumulatedDepreciation));
}

{
  // Sum of years' digits.
  const sum = (15 * 16) / 2;
  const expected = (22000 * 15) / sum + (22000 * 14) / sum;
  assert.ok(Math.abs(sumOfYearsDigitsAccumulated(25000, 3000, 15, 2) - expected) < 1e-9);
  const result = calculateAccumulatedDepreciation(base({ method: 'sum-of-years-digits' }));
  assert.equal(result.accumulatedDepreciation, roundMoney(expected));
  assert.equal(result.netBookValue, roundMoney(25000 - roundMoney(expected)));
}

{
  // Units of production.
  assert.equal(unitsOfProductionAccumulated(25000, 3000, 100000, 10000), 2200);
  const result = calculateAccumulatedDepreciation(
    base({
      method: 'units-of-production',
      estimatedLifetimeUnits: 100000,
      unitsProduced: 10000,
    })
  );
  assert.equal(result.accumulatedDepreciation, 2200);
  assert.equal(result.netBookValue, 22800);
  assert.equal(result.usefulLifeYears, null);
  assert.equal(result.yearsElapsed, null);
}

{
  // Zero depreciation (no years / no units).
  const zeroYears = calculateAccumulatedDepreciation(base({ yearsElapsed: 0 }));
  assert.equal(zeroYears.accumulatedDepreciation, 0);
  assert.equal(zeroYears.netBookValue, 25000);
  const zeroUnits = calculateAccumulatedDepreciation(
    base({ method: 'units-of-production', unitsProduced: 0 })
  );
  assert.equal(zeroUnits.accumulatedDepreciation, 0);
  assert.equal(zeroUnits.netBookValue, 25000);
}

{
  // Full useful life / full production.
  const fullSl = calculateAccumulatedDepreciation(base({ yearsElapsed: 15 }));
  assert.equal(fullSl.accumulatedDepreciation, 22000);
  assert.equal(fullSl.netBookValue, 3000);
  const fullUnits = calculateAccumulatedDepreciation(
    base({
      method: 'units-of-production',
      estimatedLifetimeUnits: 50000,
      unitsProduced: 50000,
    })
  );
  assert.equal(fullUnits.accumulatedDepreciation, 22000);
  assert.equal(fullUnits.netBookValue, 3000);
}

{
  // Method switching preserves shared money inputs.
  const shared = base({ assetCost: 25000, salvageValue: 3000, usefulLifeYears: 15, yearsElapsed: 2 });
  const sl = calculateAccumulatedDepreciation({ ...shared, method: 'straight-line' });
  const db = calculateAccumulatedDepreciation({ ...shared, method: 'declining-balance' });
  const syd = calculateAccumulatedDepreciation({ ...shared, method: 'sum-of-years-digits' });
  assert.equal(sl.assetCost, db.assetCost);
  assert.equal(db.assetCost, syd.assetCost);
  assert.notEqual(sl.accumulatedDepreciation, db.accumulatedDepreciation);
  assert.notEqual(db.accumulatedDepreciation, syd.accumulatedDepreciation);
}

{
  // Currency is denomination-only: same numeric results when the code changes.
  const usd = calculateAccumulatedDepreciation(base({ currency: 'USD' }));
  const pkr = calculateAccumulatedDepreciation(base({ currency: 'PKR' }));
  assert.equal(usd.accumulatedDepreciation, pkr.accumulatedDepreciation);
  assert.equal(usd.netBookValue, pkr.netBookValue);
  assert.equal(usd.currency, 'USD');
  assert.equal(pkr.currency, 'PKR');
}

{
  assert.equal(validateAccumulatedDepreciation(base({ assetCost: 0 })).isValid, false);
  assert.equal(validateAccumulatedDepreciation(base({ assetCost: -1 })).isValid, false);
  assert.equal(validateAccumulatedDepreciation(base({ usefulLifeYears: 0 })).isValid, false);
  assert.equal(validateAccumulatedDepreciation(base({ salvageValue: -1 })).isValid, false);
  assert.equal(
    validateAccumulatedDepreciation(base({ salvageValue: 30000 })).isValid,
    false
  );
  assert.equal(validateAccumulatedDepreciation(base({ yearsElapsed: 16 })).isValid, false);
  assert.equal(validateAccumulatedDepreciation(base({ yearsElapsed: 1.5 })).isValid, false);
  assert.equal(
    validateAccumulatedDepreciation(
      base({ method: 'units-of-production', estimatedLifetimeUnits: 0 })
    ).isValid,
    false
  );
  assert.equal(
    validateAccumulatedDepreciation(
      base({ method: 'units-of-production', unitsProduced: -1 })
    ).isValid,
    false
  );
  assert.equal(
    validateAccumulatedDepreciation(
      base({
        method: 'units-of-production',
        estimatedLifetimeUnits: 1000,
        unitsProduced: 1001,
      })
    ).isValid,
    false
  );
  assert.equal(validateAccumulatedDepreciation(base({ assetCost: Number.NaN })).isValid, false);
  assert.equal(validateAccumulatedDepreciation(base()).isValid, true);
}

{
  // Reset defaults.
  const fresh = createDefaultAccumulatedDepreciationInput();
  assert.equal(fresh.method, 'straight-line');
  assert.equal(fresh.assetCost, 25000);
  assert.equal(fresh.usefulLifeYears, 15);
  assert.equal(fresh.yearsElapsed, 2);
  assert.equal(fresh.salvageValue, 3000);
  const result = calculateAccumulatedDepreciation(fresh);
  assert.equal(result.accumulatedDepreciation, 2933.33);
  assert.equal(result.netBookValue, 22066.67);
}

console.log('accumulated-depreciation calculation.test.ts: ok');
