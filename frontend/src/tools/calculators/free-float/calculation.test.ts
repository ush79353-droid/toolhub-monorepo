import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateFreeFloat,
  formatFloatPercent,
  formatShareCount,
} from './calculation';
import { createDefaultInput, createEmptyInput } from './types';
import { validateFreeFloatInput } from './validation';

describe('calculateFreeFloat', () => {
  it('10k − 2k − 1k → 7k / 70%', () => {
    const r = calculateFreeFloat({
      outstandingShares: 10_000,
      restrictedShares: 2_000,
      closelyHeldShares: 1_000,
    })!;
    assert.equal(r.freeFloat, 7_000);
    assert.equal(r.freeFloatPercentage, 70);
  });

  it('no restricted → 8k / 80%', () => {
    const r = calculateFreeFloat({
      outstandingShares: 10_000,
      restrictedShares: 0,
      closelyHeldShares: 2_000,
    })!;
    assert.equal(r.freeFloat, 8_000);
    assert.equal(r.freeFloatPercentage, 80);
  });

  it('no closely held → 8k / 80%', () => {
    const r = calculateFreeFloat({
      outstandingShares: 10_000,
      restrictedShares: 2_000,
      closelyHeldShares: 0,
    })!;
    assert.equal(r.freeFloat, 8_000);
    assert.equal(r.freeFloatPercentage, 80);
  });

  it('fully free floating → 100%', () => {
    const r = calculateFreeFloat({
      outstandingShares: 10_000,
      restrictedShares: 0,
      closelyHeldShares: 0,
    })!;
    assert.equal(r.freeFloat, 10_000);
    assert.equal(r.freeFloatPercentage, 100);
  });

  it('zero free float → 0%', () => {
    const r = calculateFreeFloat({
      outstandingShares: 10_000,
      restrictedShares: 5_000,
      closelyHeldShares: 5_000,
    })!;
    assert.equal(r.freeFloat, 0);
    assert.equal(r.freeFloatPercentage, 0);
  });

  it('excluded exceed outstanding → null', () => {
    assert.equal(
      calculateFreeFloat({
        outstandingShares: 5_000,
        restrictedShares: 3_000,
        closelyHeldShares: 3_000,
      }),
      null
    );
  });

  it('zero outstanding → null', () => {
    assert.equal(
      calculateFreeFloat({
        outstandingShares: 0,
        restrictedShares: 0,
        closelyHeldShares: 0,
      }),
      null
    );
  });

  it('negative → null', () => {
    assert.equal(
      calculateFreeFloat({
        outstandingShares: 10_000,
        restrictedShares: -1,
        closelyHeldShares: 0,
      }),
      null
    );
  });

  it('fractional → null', () => {
    assert.equal(
      calculateFreeFloat({
        outstandingShares: 10_000.5,
        restrictedShares: 0,
        closelyHeldShares: 0,
      }),
      null
    );
  });

  it('large safe integer', () => {
    const r = calculateFreeFloat({
      outstandingShares: 9_000_000_000_000,
      restrictedShares: 1_000_000_000_000,
      closelyHeldShares: 500_000_000_000,
    })!;
    assert.equal(r.freeFloat, 7_500_000_000_000);
    assert.ok(Math.abs(r.freeFloatPercentage - (7500 / 90)) < 1e-9);
  });
});

describe('validateFreeFloatInput', () => {
  it('defaults → 7,000 / 70%', () => {
    const v = validateFreeFloatInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result?.freeFloat, 7_000);
    assert.equal(v.result?.freeFloatPercentage, 70);
    assert.equal(v.result?.formattedFreeFloat, '7,000');
    assert.equal(v.result?.formattedPercentage, '70%');
  });

  it('empty → invalid', () => {
    const v = validateFreeFloatInput(createEmptyInput());
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });

  it('excluded exceed → form error', () => {
    const v = validateFreeFloatInput({
      outstandingShares: '5000',
      restrictedShares: '3000',
      closelyHeldShares: '3000',
    });
    assert.equal(v.isValid, false);
    assert.match(
      v.errors.form ?? '',
      /cannot exceed outstanding shares/i
    );
  });

  it('fractional shares → error', () => {
    const v = validateFreeFloatInput({
      outstandingShares: '10000.5',
      restrictedShares: '0',
      closelyHeldShares: '0',
    });
    assert.equal(v.isValid, false);
    assert.match(v.errors.outstandingShares ?? '', /whole number/i);
  });

  it('comma-separated input', () => {
    const v = validateFreeFloatInput({
      outstandingShares: '10,000',
      restrictedShares: '2,000',
      closelyHeldShares: '1,000',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result?.freeFloat, 7_000);
  });

  it('percentage rounding display', () => {
    const v = validateFreeFloatInput({
      outstandingShares: '3',
      restrictedShares: '0',
      closelyHeldShares: '1',
    });
    assert.equal(v.isValid, true);
    assert.ok(v.result != null);
    // 2/3 ≈ 66.666... → 66.67%
    assert.equal(v.result!.formattedPercentage, '66.67%');
  });

  it('formats share counts', () => {
    assert.equal(formatShareCount(1000), '1,000');
    assert.equal(formatShareCount(2_500_000), '2,500,000');
    assert.equal(formatFloatPercent(70), '70');
    assert.equal(formatFloatPercent(70.125), '70.13');
  });

  it('unsafe integer → error', () => {
    const v = validateFreeFloatInput({
      outstandingShares: String(Number.MAX_SAFE_INTEGER + 2),
      restrictedShares: '0',
      closelyHeldShares: '0',
    });
    assert.equal(v.isValid, false);
  });
});
