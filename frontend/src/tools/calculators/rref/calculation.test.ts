import { calculateRref, computeRref, assertIsRref, replayStepsToFinal } from './calculation';
import { parseRationalInput } from './parse';
import { Rational, matricesEqual, type Matrix } from './rational';
import { validateRrefInput } from './validation';
import { createDefaultRrefInput } from './types';

function M(rows: string[][]): Matrix {
  return rows.map((row) =>
    row.map((cell) => {
      const parsed = parseRationalInput(cell);
      if (!parsed.ok) throw new Error(parsed.error);
      return parsed.value;
    })
  );
}

function assertEqualMatrix(actual: string[][], expected: string[][]): void {
  if (actual.length !== expected.length) {
    throw new Error(`row count ${actual.length} !== ${expected.length}`);
  }
  for (let i = 0; i < expected.length; i += 1) {
    if (actual[i].join(',') !== expected[i].join(',')) {
      throw new Error(
        `row ${i}: got [${actual[i].join(', ')}] expected [${expected[i].join(', ')}]`
      );
    }
  }
}

function suite(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ok - ${name}`);
  } catch (error) {
    console.error(`  FAIL - ${name}`);
    throw error;
  }
}

suite('1. Default example RREF, rank, pivots, nullity', () => {
  const result = calculateRref(createDefaultRrefInput());
  assertEqualMatrix(result.rref, [
    ['1', '0', '-1'],
    ['0', '1', '2'],
    ['0', '0', '0'],
  ]);
  if (result.rank !== 2) throw new Error(`rank ${result.rank}`);
  if (result.pivotColumns.join(',') !== '1,2') throw new Error(String(result.pivotColumns));
  if (result.nullity !== 1) throw new Error(`nullity ${result.nullity}`);
  if (result.freeColumns.join(',') !== '3') throw new Error(String(result.freeColumns));
  if (!assertIsRref(M(result.rref))) throw new Error('not RREF');
});

suite('2. Identity matrix', () => {
  const result = computeRref(
    M([
      ['1', '0'],
      ['0', '1'],
    ])
  );
  assertEqualMatrix(result.rref, [
    ['1', '0'],
    ['0', '1'],
  ]);
  if (result.rank !== 2) throw new Error('rank');
});

suite('3. Zero matrix', () => {
  const result = computeRref(
    M([
      ['0', '0'],
      ['0', '0'],
    ])
  );
  assertEqualMatrix(result.rref, [
    ['0', '0'],
    ['0', '0'],
  ]);
  if (result.rank !== 0 || result.nullity !== 2) throw new Error('zero rank/nullity');
});

suite('4. Single-element matrices', () => {
  const a = computeRref(M([['5']]));
  assertEqualMatrix(a.rref, [['1']]);
  const b = computeRref(M([['0']]));
  assertEqualMatrix(b.rref, [['0']]);
});

suite('5. Rectangular more columns than rows', () => {
  const result = computeRref(
    M([
      ['1', '2', '3', '4'],
      ['2', '4', '6', '8'],
    ])
  );
  if (result.rank !== 1) throw new Error(`rank ${result.rank}`);
  if (!assertIsRref(result.rrefMatrix)) throw new Error('not rref');
});

suite('6. Rectangular more rows than columns', () => {
  const result = computeRref(
    M([
      ['1', '2'],
      ['3', '4'],
      ['5', '6'],
    ])
  );
  if (result.rank !== 2) throw new Error(`rank ${result.rank}`);
  if (!assertIsRref(result.rrefMatrix)) throw new Error('not rref');
});

suite('7. Row swap required + negative values', () => {
  const result = computeRref(
    M([
      ['0', '1'],
      ['-2', '3'],
    ])
  );
  assertEqualMatrix(result.rref, [
    ['1', '0'],
    ['0', '1'],
  ]);
  if (!result.steps.some((s) => s.description.includes('↔'))) throw new Error('expected swap');
});

suite('8. Fractional values stay exact', () => {
  const result = computeRref(
    M([
      ['1/2', '1/3'],
      ['1/4', '1/6'],
    ])
  );
  // Second row is half of first → rank 1
  if (result.rank !== 1) throw new Error(`rank ${result.rank}`);
  assertEqualMatrix(result.rref, [
    ['1', '2/3'],
    ['0', '0'],
  ]);
});

suite('9. Decimal inputs convert exactly', () => {
  const parsed = parseRationalInput('1.5');
  if (!parsed.ok || !parsed.value.equals(new Rational(3, 2))) throw new Error('1.5');
  const result = computeRref(M([['1.5', '3'], ['0.5', '1']]));
  if (result.rank !== 1) throw new Error('rank');
});

suite('10. Full-rank square', () => {
  const result = computeRref(
    M([
      ['2', '1'],
      ['5', '3'],
    ])
  );
  assertEqualMatrix(result.rref, [
    ['1', '0'],
    ['0', '1'],
  ]);
  if (result.rank !== 2) throw new Error('rank');
});

suite('11. Dependent rows / rank-deficient', () => {
  const result = computeRref(
    M([
      ['1', '2', '3'],
      ['2', '4', '6'],
      ['3', '6', '9'],
    ])
  );
  if (result.rank !== 1) throw new Error(`rank ${result.rank}`);
});

suite('12. Zero pivot column skipped', () => {
  const result = computeRref(
    M([
      ['0', '2', '0'],
      ['0', '0', '3'],
    ])
  );
  if (result.pivotColumns.join(',') !== '2,3') throw new Error(String(result.pivotColumns));
  if (!assertIsRref(result.rrefMatrix)) throw new Error('not rref');
});

suite('13. Step snapshots match final RREF', () => {
  const original = M(createDefaultRrefInput().cells);
  const result = computeRref(original);
  if (!replayStepsToFinal(original, result.steps)) throw new Error('replay failed');
});

suite('14. Invalid inputs rejected', () => {
  const bad = validateRrefInput({
    rows: 2,
    cols: 2,
    cells: [
      ['1', '1/0'],
      ['abc', '2'],
    ],
    augmented: false,
  });
  if (bad.isValid) throw new Error('should be invalid');
  if (!bad.errors['cell-0-1'] || !bad.errors['cell-1-0']) throw new Error('missing errors');
});

suite('15. Zero denominator / malformed fraction', () => {
  const a = parseRationalInput('2/0');
  if (a.ok) throw new Error('2/0');
  const b = parseRationalInput('1/2/3');
  if (b.ok) throw new Error('1/2/3');
});

suite('16. Augmented unique solution', () => {
  const result = calculateRref({
    rows: 2,
    cols: 3,
    cells: [
      ['1', '1', '5'],
      ['0', '1', '2'],
    ],
    augmented: true,
  });
  if (result.augmentedAnalysis.kind !== 'unique') {
    throw new Error(result.augmentedAnalysis.kind);
  }
  if (result.augmentedAnalysis.uniqueSolution?.join(',') !== '3,2') {
    throw new Error(String(result.augmentedAnalysis.uniqueSolution));
  }
});

suite('17. Augmented inconsistent', () => {
  const result = calculateRref({
    rows: 2,
    cols: 3,
    cells: [
      ['1', '0', '1'],
      ['0', '0', '1'],
    ],
    augmented: true,
  });
  if (result.augmentedAnalysis.kind !== 'inconsistent') {
    throw new Error(result.augmentedAnalysis.kind);
  }
});

suite('18. Augmented infinite solutions', () => {
  const result = calculateRref({
    rows: 1,
    cols: 3,
    cells: [['1', '2', '3']],
    augmented: true,
  });
  if (result.augmentedAnalysis.kind !== 'infinite') {
    throw new Error(result.augmentedAnalysis.kind);
  }
  if (result.augmentedAnalysis.freeVariables.join(',') !== '2') {
    throw new Error(String(result.augmentedAnalysis.freeVariables));
  }
});

suite('19. Rational arithmetic invariants', () => {
  const a = new Rational(2, 4);
  if (!a.equals(new Rational(1, 2))) throw new Error('reduce');
  if (!a.add(new Rational(1, 3)).equals(new Rational(5, 6))) throw new Error('add');
  if (!a.mul(new Rational(3, 1)).equals(new Rational(3, 2))) throw new Error('mul');
});

suite('20. matricesEqual helper', () => {
  const a = M([['1', '0']]);
  const b = M([['1', '0']]);
  const c = M([['1', '1']]);
  if (!matricesEqual(a, b) || matricesEqual(a, c)) throw new Error('equal');
});

console.log('rref calculation.test ok (20 test suites passed)');
