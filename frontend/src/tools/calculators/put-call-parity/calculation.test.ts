import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculatePresentValueOfStrike,
  detectSolveTarget,
  helperTimeToYears,
  parityIdentityHolds,
  solvePutCallParity,
} from './calculation';
import { createExampleInput } from './types';
import { validatePutCallParityInput } from './validation';

describe('put-call parity core', () => {
  it('solves put from C=10, PV=95, S=100 → P=5', () => {
    const p = solvePutCallParity(
      { call: 10, put: null, pvStrike: 95, spot: 100 },
      'put',
    );
    assert.equal(p, 5);
    assert.equal(
      detectSolveTarget({ call: 10, put: null, pvStrike: 95, spot: 100 }),
      'put',
    );
  });

  it('solves call, pv, and spot rearrangements', () => {
    assert.equal(
      solvePutCallParity(
        { call: null, put: 5, pvStrike: 95, spot: 100 },
        'call',
      ),
      10,
    );
    assert.equal(
      solvePutCallParity(
        { call: 10, put: 5, pvStrike: null, spot: 100 },
        'pvStrike',
      ),
      95,
    );
    assert.equal(
      solvePutCallParity(
        { call: 10, put: 5, pvStrike: 95, spot: null },
        'spot',
      ),
      100,
    );
  });

  it('rejects wrong missing counts', () => {
    assert.equal(
      detectSolveTarget({ call: 1, put: 2, pvStrike: 3, spot: 4 }),
      null,
    );
    assert.equal(
      detectSolveTarget({ call: null, put: null, pvStrike: 3, spot: 4 }),
      null,
    );
  });

  it('PV helper continuous discount', () => {
    assert.equal(helperTimeToYears(12, 'months'), 1);
    const pv = calculatePresentValueOfStrike(100, 0.05, 1);
    assert.ok(pv != null);
    assert.ok(Math.abs(pv - 100 * Math.exp(-0.05)) < 1e-12);
  });

  it('parity identity holds on example', () => {
    assert.ok(parityIdentityHolds(10, 95, 5, 100));
  });
});

describe('put-call parity validation', () => {
  it('validates example without FX when all PKR', () => {
    const v2 = validatePutCallParityInput(createExampleInput(), null);
    assert.equal(v2.isValid, true);
    assert.ok(v2.result);
    assert.equal(v2.result!.solveTarget, 'put');
    assert.ok(Math.abs(v2.result!.solvedAmount - 5) < 1e-9);
  });

  it('requires exactly three fields', () => {
    const tooFew = validatePutCallParityInput(
      { ...createExampleInput(), callPrice: '', pvStrike: '', spotPrice: '100' },
      null,
    );
    assert.equal(tooFew.isValid, false);

    const tooMany = validatePutCallParityInput(
      { ...createExampleInput(), putPrice: '5' },
      null,
    );
    assert.equal(tooMany.isValid, false);
  });
});
