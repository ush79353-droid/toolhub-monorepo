import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculatePsaKinetics,
  daysToDoublingUnit,
  formatNumber,
} from './calculation';
import { createExampleInput } from './types';
import { validatePsaDoublingTimeInput } from './validation';

describe('psa-doubling-time', () => {
  it('2→4 over 90 days → DT 90 days', () => {
    const core = calculatePsaKinetics(2, 4, 90);
    assert.ok(core);
    assert.equal(core!.doublingTimeDays, 90);
    assert.equal(core!.trend, 'rising');
    assert.equal(formatNumber(daysToDoublingUnit(90, 'days')), '90');
  });

  it('falling PSA has no doubling time', () => {
    const core = calculatePsaKinetics(4, 2, 90);
    assert.ok(core);
    assert.equal(core!.doublingTimeDays, null);
    assert.equal(core!.trend, 'falling');
  });

  it('example input validates', () => {
    const { errors, result } = validatePsaDoublingTimeInput(createExampleInput());
    assert.equal(Object.keys(errors).length, 0);
    assert.ok(result);
    assert.equal(result!.formattedDoublingTime, '90');
    assert.equal(result!.elapsedDays, 90);
  });

  it('rejects newer date before older', () => {
    const { errors } = validatePsaDoublingTimeInput({
      ...createExampleInput(),
      olderDate: '2024-06-01',
      newerDate: '2024-01-01',
    });
    assert.match(errors.form ?? '', /after the older/i);
  });
});