import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateEAD,
  calculateExpectedLoss,
  calculateLGD,
  calculateLgdFromInput,
  calculateLossSeverity,
  calculateRecoveryRate,
} from './calculation';
import { createExampleInput, type LgdInput } from './types';
import { validateLgdInput } from './validation';

function base(patch: Partial<LgdInput> = {}): LgdInput {
  return { ...createExampleInput(), ...patch };
}

describe('LGD rates', () => {
  it('Test 1: RR 80% → LS 20%', () => {
    assert.equal(calculateLossSeverity(0.8), 0.2);
    const r = calculateLgdFromInput(createExampleInput());
    assert.ok(r);
    assert.ok(Math.abs(r.lossSeverity - 0.2) < 1e-12);
  });

  it('Test 2: LS 35% → RR 65%', () => {
    assert.equal(calculateRecoveryRate(0.35), 0.65);
    const r = calculateLgdFromInput(
      base({
        rateSource: 'lossSeverity',
        lossSeverityPercent: '35',
        recoveryRatePercent: '',
      }),
    );
    assert.ok(r);
    assert.equal(r.recoveryRate, 0.65);
  });
});

describe('LGD amounts', () => {
  it('Test 3: LGD amount 20,000', () => {
    const calc = calculateLGD(100_000, 0.8);
    assert.ok(calc);
    assert.ok(Math.abs(calc.lossGivenDefault - 20_000) < 1e-9);
  });

  it('Test 4: recovery amount 80,000', () => {
    const calc = calculateLGD(100_000, 0.8);
    assert.ok(calc);
    assert.equal(calc.recoveryAmount, 80_000);
  });

  it('Test 5: full recovery', () => {
    const calc = calculateLGD(100_000, 1);
    assert.ok(calc);
    assert.equal(calc.lossSeverity, 0);
    assert.equal(calc.lossGivenDefault, 0);
    assert.equal(calc.recoveryAmount, 100_000);
  });

  it('Test 6: no recovery', () => {
    const calc = calculateLGD(100_000, 0);
    assert.ok(calc);
    assert.equal(calc.lossSeverity, 1);
    assert.equal(calc.lossGivenDefault, 100_000);
    assert.equal(calc.recoveryAmount, 0);
  });

  it('Test 7: reverse EAD', () => {
    assert.equal(calculateEAD(25_000, 0.25), 100_000);
    const r = calculateLgdFromInput(
      base({
        mode: 'advanced',
        advancedSolve: 'eadFromLgd',
        rateSource: 'lossSeverity',
        lossSeverityPercent: '25',
        lossGivenDefaultAmount: '25000',
        expectedExposure: '',
      }),
    );
    assert.ok(r);
    assert.equal(r.exposureAtDefault, 100_000);
  });

  it('Test 8: expected loss 1,000', () => {
    assert.ok(
      Math.abs((calculateExpectedLoss(0.05, 0.2, 100_000) ?? NaN) - 1_000) <
        1e-9,
    );
    const r = calculateLgdFromInput(
      base({
        mode: 'advanced',
        probabilityOfDefaultPercent: '5',
      }),
    );
    assert.ok(r);
    assert.ok(Math.abs((r.expectedLoss ?? NaN) - 1_000) < 1e-9);
    assert.ok(Math.abs(r.lossGivenDefault - 20_000) < 1e-9);
  });
});

describe('LGD validation', () => {
  it('Test 9: RR 120% rejected', () => {
    const v = validateLgdInput(base({ recoveryRatePercent: '120' }));
    assert.equal(v.isValid, false);
  });

  it('Test 10: negative exposure rejected', () => {
    const v = validateLgdInput(base({ expectedExposure: '-10000' }));
    assert.equal(v.isValid, false);
  });

  it('Test 11: zero exposure → zero amounts', () => {
    const r = calculateLgdFromInput(base({ expectedExposure: '0' }));
    assert.ok(r);
    assert.equal(r.recoveryAmount, 0);
    assert.equal(r.lossGivenDefault, 0);
  });

  it('Test 12: bidirectional rate source', () => {
    const a = calculateLgdFromInput(
      base({ rateSource: 'recoveryRate', recoveryRatePercent: '80' }),
    );
    assert.ok(a);
    assert.ok(Math.abs(a.lossSeverity - 0.2) < 1e-12);
    const b = calculateLgdFromInput(
      base({
        rateSource: 'lossSeverity',
        lossSeverityPercent: '40',
        recoveryRatePercent: '80',
      }),
    );
    assert.ok(b);
    assert.equal(b.recoveryRate, 0.6);
  });
});
