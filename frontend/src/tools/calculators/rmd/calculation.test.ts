import assert from 'node:assert/strict';
import { calculateRmd } from './calculation';
import { uniformLifetimeFactor } from './uniform-lifetime-table';

assert.equal(uniformLifetimeFactor(72), 27.4);
assert.equal(uniformLifetimeFactor(75), 24.6);

{
  const result = calculateRmd({
    age: 72,
    accountBalance: 274_000,
    spouseYoungerSoleBeneficiary: false,
  });
  assert.ok(result);
  assert.equal(result.lifeExpectancyFactor, 27.4);
  assert.ok(Math.abs(result.rmd! - 10_000) < 1e-9);
  assert.equal(result.jointLifeUnavailable, false);
}

{
  const result = calculateRmd({
    age: 72,
    accountBalance: 100_000,
    spouseYoungerSoleBeneficiary: true,
  });
  assert.ok(result);
  assert.equal(result.jointLifeUnavailable, true);
  assert.equal(result.rmd, null);
}

{
  assert.equal(
    calculateRmd({
      age: 71,
      accountBalance: 100_000,
      spouseYoungerSoleBeneficiary: false,
    }),
    null
  );
}

console.log('rmd calculation.test.ts: all assertions passed');
