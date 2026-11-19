import assert from 'node:assert/strict';
import {
  calculateParticipationRate,
  calculateUnemploymentRate,
  convertPopulationDisplay,
  formatRatePercent,
  populationToPeople,
  toUnemploymentResult,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateUnemploymentInput } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`
  );
}

assert.equal(populationToPeople(150, 'thousand'), 150_000);
assert.equal(populationToPeople(1.5, 'million'), 1_500_000);
assertClose(convertPopulationDisplay(150, 'thousand', 'people'), 150_000);
assertClose(convertPopulationDisplay(150_000, 'people', 'thousand'), 150);

{
  const rate = calculateUnemploymentRate({
    unemployedPeople: 10_000,
    laborForcePeople: 160_000,
  });
  assert.ok(rate !== null);
  assertClose(rate!, 6.25);
  assert.equal(formatRatePercent(rate!), '6.25');
}

assert.equal(
  calculateUnemploymentRate({ unemployedPeople: 0, laborForcePeople: 0 }),
  null
);
assert.equal(
  calculateUnemploymentRate({ unemployedPeople: 1, laborForcePeople: 0 }),
  null
);
assertClose(
  calculateUnemploymentRate({ unemployedPeople: 0, laborForcePeople: 100 })!,
  0
);
assert.equal(
  calculateUnemploymentRate({ unemployedPeople: 10, laborForcePeople: 5 }),
  null
);

{
  const pr = calculateParticipationRate({
    laborForcePeople: 160_000,
    workingAgePeople: 250_000,
  });
  assert.ok(pr !== null);
  assertClose(pr!, 64);
}

assert.equal(
  calculateParticipationRate({ laborForcePeople: 100, workingAgePeople: 0 }),
  null
);
assert.equal(
  calculateParticipationRate({ laborForcePeople: 200, workingAgePeople: 100 }),
  null
);

{
  const ex = validateUnemploymentInput(createExampleInput());
  assert.equal(ex.isValid, true);
  assert.ok(ex.result);
  assertClose(ex.result!.employedPeople, 150_000);
  assertClose(ex.result!.unemployedPeople, 10_000);
  assertClose(ex.result!.laborForcePeople, 160_000);
  assertClose(ex.result!.unemploymentRatePercent!, 6.25);
  assertClose(ex.result!.participationRatePercent!, 64);
}

{
  const derived = validateUnemploymentInput({
    ...createDefaultInput(),
    employed: '150',
    unemployed: '10',
    laborForce: '',
    driver: 'employed',
  });
  assert.equal(derived.isValid, true);
  assert.equal(derived.syncedInput.laborForce, '160');
  assertClose(derived.result!.unemploymentRatePercent!, 6.25);
}

{
  const fromLf = validateUnemploymentInput({
    ...createDefaultInput(),
    employed: '150',
    unemployed: '',
    laborForce: '160',
    driver: 'laborForce',
  });
  assert.equal(fromLf.isValid, true);
  assert.equal(fromLf.syncedInput.unemployed, '10');
  assertClose(fromLf.result!.unemployedPeople, 10_000);
}

{
  const zeroLf = validateUnemploymentInput({
    ...createDefaultInput(),
    employed: '0',
    unemployed: '0',
    laborForce: '0',
    driver: 'employed',
  });
  assert.equal(zeroLf.isValid, true);
  assert.equal(zeroLf.result!.unemploymentRatePercent, null);
  assert.equal(zeroLf.result!.formattedUnemploymentRate, '');
  assert.match(zeroLf.result!.interpretation, /undefined/i);
}

{
  const inconsistent = validateUnemploymentInput({
    ...createDefaultInput(),
    employed: '100',
    unemployed: '20',
    laborForce: '50',
    driver: 'laborForce',
  });
  assert.equal(inconsistent.isValid, false);
  assert.match(inconsistent.errors.form ?? '', /equal/i);
}

{
  const neg = validateUnemploymentInput({
    ...createExampleInput(),
    unemployed: '-1',
  });
  assert.equal(neg.isValid, false);
  assert.match(neg.errors.unemployed ?? '', /negative/i);
}

{
  const empty = validateUnemploymentInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

{
  const result = toUnemploymentResult({
    employedPeople: 90,
    unemployedPeople: 10,
    laborForcePeople: 100,
    workingAgePeople: null,
  });
  assertClose(result.unemploymentRatePercent!, 10);
  assert.equal(result.participationRatePercent, null);
  assert.match(result.interpretation, /actively seeking/i);
}

{
  const mixed = validateUnemploymentInput({
    ...createDefaultInput(),
    employed: '1.5',
    employedUnit: 'million',
    unemployed: '500',
    unemployedUnit: 'thousand',
    laborForce: '',
    laborForceUnit: 'million',
    driver: 'employed',
  });
  assert.equal(mixed.isValid, true);
  assertClose(mixed.result!.laborForcePeople, 2_000_000);
  assertClose(mixed.result!.unemploymentRatePercent!, 25);
}

console.log('unemployment calculation.test.ts: all assertions passed');
