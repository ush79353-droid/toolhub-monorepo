import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateBlendedRate } from './calculation';
import { createDefaultInput, createEntryId } from './types';
import { validateBlendedRateInput } from './validation';

function nearly(actual: number | null | undefined, expected: number, eps = 1e-6) {
  assert.ok(actual != null, `expected ~${expected}, got ${actual}`);
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateBlendedRate', () => {
  it('screenshot example ≈ 9.90196078%', () => {
    const r = calculateBlendedRate([
      { id: 'a', balance: 10000, rate: 10 },
      { id: 'b', balance: 200, rate: 5 },
    ])!;
    nearly(r.totalBalance, 10200);
    nearly(r.blendedRate, 101000 / 10200, 1e-9);
    nearly(r.totalAnnualInterest, 1010, 1e-9);
  });

  it('equal balances → 7.50%', () => {
    nearly(
      calculateBlendedRate([
        { id: 'a', balance: 10000, rate: 5 },
        { id: 'b', balance: 10000, rate: 10 },
      ])!.blendedRate,
      7.5
    );
  });

  it('unequal balances → 5%', () => {
    nearly(
      calculateBlendedRate([
        { id: 'a', balance: 100000, rate: 4 },
        { id: 'b', balance: 10000, rate: 15 },
      ])!.blendedRate,
      5
    );
  });

  it('three loans → 9.50%', () => {
    const r = calculateBlendedRate([
      { id: 'a', balance: 10000, rate: 5 },
      { id: 'b', balance: 20000, rate: 8 },
      { id: 'c', balance: 30000, rate: 12 },
    ])!;
    nearly(r.totalBalance, 60000);
    nearly(r.blendedRate, 9.5);
    nearly(r.totalAnnualInterest, 5700);
  });

  it('one loan → rate itself', () => {
    nearly(
      calculateBlendedRate([{ id: 'a', balance: 10000, rate: 8 }])!.blendedRate,
      8
    );
  });

  it('all zero rates → 0%', () => {
    nearly(
      calculateBlendedRate([
        { id: 'a', balance: 10000, rate: 0 },
        { id: 'b', balance: 20000, rate: 0 },
      ])!.blendedRate,
      0
    );
  });

  it('decimal rates → 8.25%', () => {
    nearly(
      calculateBlendedRate([
        { id: 'a', balance: 10000, rate: 7.25 },
        { id: 'b', balance: 20000, rate: 8.75 },
      ])!.blendedRate,
      8.25
    );
  });

  it('empty → null', () => {
    assert.equal(calculateBlendedRate([]), null);
  });
});

describe('validateBlendedRateInput', () => {
  it('defaults match screenshot', () => {
    const { isValid, result } = validateBlendedRateInput(createDefaultInput());
    assert.equal(isValid, true);
    nearly(result!.blendedRate, 101000 / 10200);
    nearly(result!.totalBalance, 10200);
    nearly(result!.totalAnnualInterest, 1010);
  });

  it('missing rate errors', () => {
    const { result, errors } = validateBlendedRateInput({
      currency: 'PKR',
      entries: [
        { id: createEntryId(), balance: '5000', rate: '' },
      ],
    });
    assert.equal(result, null);
    assert.ok(Object.values(errors.entries ?? {}).some((e) => e.rate));
  });

  it('missing balance errors', () => {
    const { result, errors } = validateBlendedRateInput({
      currency: 'PKR',
      entries: [
        { id: createEntryId(), balance: '', rate: '10' },
      ],
    });
    assert.equal(result, null);
    assert.ok(Object.values(errors.entries ?? {}).some((e) => e.balance));
  });

  it('negative balance errors', () => {
    const { result, errors } = validateBlendedRateInput({
      currency: 'PKR',
      entries: [
        { id: createEntryId(), balance: '-10000', rate: '5' },
      ],
    });
    assert.equal(result, null);
    assert.ok(Object.values(errors.entries ?? {}).some((e) => e.balance));
  });

  it('empty → no result', () => {
    assert.equal(
      validateBlendedRateInput({
        currency: 'PKR',
        entries: [
          { id: createEntryId(), balance: '', rate: '' },
          { id: createEntryId(), balance: '', rate: '' },
        ],
      }).result,
      null
    );
  });
});
