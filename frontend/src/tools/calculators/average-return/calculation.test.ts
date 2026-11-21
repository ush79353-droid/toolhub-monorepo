import assert from 'node:assert/strict';
import {
  calculateAnnualizedReturn,
  calculateAverageAndCumulative,
  calculateCumulativeReturn,
  calculateOverallAnnualizedReturn,
  calculateXIRR,
  daysBetween,
  parseIsoDate,
} from './calculation';
import {
  createAverageExampleInput,
  createCashFlowExampleInput,
  createDefaultAverageInput,
  createDefaultCashFlowInput,
} from './types';
import { validateAverageSection, validateCashFlowSection } from './validation';

function assertClose(actual: number, expected: number, digits = 6): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

{
  const cum = calculateCumulativeReturn([0.1, -0.02, 0.15]);
  assert.ok(cum !== null);
  assertClose(cum! * 100, 24.07, 2);
}

{
  const ann = calculateAnnualizedReturn(0.1, 12);
  assert.ok(ann !== null);
  assertClose(ann!, 0.1);
}

{
  const ann = calculateAnnualizedReturn(0.21, 24);
  assert.ok(ann !== null);
  assertClose(ann!, 0.1);
}

{
  const ann = calculateAnnualizedReturn(-0.1, 12);
  assert.ok(ann !== null);
  assertClose(ann!, -0.1);
}

assert.equal(calculateAnnualizedReturn(-1.01, 12), null);
assert.equal(calculateAnnualizedReturn(0.1, 0), null);

{
  const start = parseIsoDate('2025-01-01')!;
  const end = parseIsoDate('2027-01-01')!;
  assert.equal(daysBetween(start, end), 730);
  const rate = calculateXIRR([
    { amount: -10_000, date: start },
    { amount: 12_100, date: end },
  ]);
  assert.ok(rate !== null);
  assertClose(rate!, 0.1, 4);
}

{
  const start = parseIsoDate('2024-01-01')!;
  const mid = parseIsoDate('2024-07-01')!;
  const end = parseIsoDate('2025-01-01')!;
  const rate = calculateXIRR([
    { amount: -10_000, date: start },
    { amount: -2_000, date: mid },
    { amount: 500, date: mid },
    { amount: 13_000, date: end },
  ]);
  assert.ok(rate !== null);
  assert.ok(Number.isFinite(rate!));
}

assert.equal(
  calculateXIRR([
    { amount: -100, date: parseIsoDate('2024-01-01')! },
    { amount: -50, date: parseIsoDate('2025-01-01')! },
  ]),
  null,
);

{
  const overall = calculateOverallAnnualizedReturn(0.2407, 14 + 5 + 27);
  assert.ok(overall !== null);
  assert.ok(Number.isFinite(overall!));
}

{
  const r = calculateAverageAndCumulative([
    { periodReturnDecimal: 0.1, holdingMonths: 14 },
    { periodReturnDecimal: -0.02, holdingMonths: 5 },
    { periodReturnDecimal: 0.15, holdingMonths: 27 },
  ]);
  assert.ok(r);
  assertClose(r!.cumulativeReturnPercent, 24.07, 2);
  assert.equal(r!.validEntryCount, 3);
  assert.equal(r!.totalHoldingMonths, 46);
}

{
  const ex = validateCashFlowSection(createCashFlowExampleInput());
  assert.equal(ex.isValid, true);
  assertClose(ex.result!.annualizedReturnPercent, 10, 2);
}

{
  const empty = validateCashFlowSection(createDefaultCashFlowInput());
  assert.equal(empty.isValid, false);
}

{
  const badDates = validateCashFlowSection({
    ...createCashFlowExampleInput(),
    endingDate: '2024-01-01',
  });
  assert.equal(badDates.isValid, false);
}

{
  const ex = validateAverageSection(createAverageExampleInput());
  assert.equal(ex.isValid, true);
  assertClose(ex.result!.cumulativeReturnPercent, 24.07, 2);
}

{
  const empty = validateAverageSection(createDefaultAverageInput());
  assert.equal(empty.isValid, false);
}

{
  const bad = validateAverageSection({
    entries: [
      {
        id: '1',
        returnPercentage: '-101',
        holdingYears: '1',
        holdingMonths: '0',
      },
    ],
  });
  assert.equal(bad.isValid, false);
}

console.log('average-return calculation.test.ts: all assertions passed');
