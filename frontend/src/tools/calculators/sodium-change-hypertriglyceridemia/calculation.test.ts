import assert from 'node:assert/strict';
import {
  calculateSodiumChange,
  sodiumChangeFromTriglyceridesMgPerDl,
  triglyceridesToMgPerDl,
} from './calculation';
import { createDefaultInput } from './types';

assert.equal(sodiumChangeFromTriglyceridesMgPerDl(5000), 10);
assert.equal(triglyceridesToMgPerDl(1, 'mmol/L'), 88.57);

{
  const input = {
    ...createDefaultInput(),
    measuredSodiumText: '130',
    triglyceridesText: '5000',
    triglycerideUnit: 'mg/dL' as const,
  };
  const result = calculateSodiumChange(input);
  assert.equal(result.sodiumChange, 10);
  assert.equal(result.correctedSodium, 140);
}

{
  const input = {
    ...createDefaultInput(),
    measuredSodiumText: '130',
    triglyceridesText: String(5000 / 88.57),
    triglycerideUnit: 'mmol/L' as const,
  };
  const result = calculateSodiumChange(input);
  assert.ok(result.sodiumChange != null);
  assert.ok(Math.abs(result.sodiumChange - 10) < 1e-9);
  assert.ok(result.correctedSodium != null);
  assert.ok(Math.abs(result.correctedSodium - 140) < 1e-9);
}

{
  const result = calculateSodiumChange(createDefaultInput());
  assert.equal(result.sodiumChange, null);
}

{
  const input = {
    ...createDefaultInput(),
    measuredSodiumText: '130',
    triglyceridesText: '0',
  };
  const result = calculateSodiumChange(input);
  assert.equal(result.sodiumChange, null);
}

console.log('sodium-change-hypertriglyceridemia calculation.test.ts: ok');
