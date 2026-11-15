import assert from 'node:assert/strict';
import {
  calculateAddition,
  calculateEquivalence,
  gramsFromOunces,
  mixedToOunces,
  normalizeOunces,
  ouncesToPounds,
  poundsToOunces,
  stonesFromOunces,
} from './calculation';
import {
  DEFAULT_ADDITION_INPUT,
  DEFAULT_EQUIVALENCE_INPUT,
  GRAMS_PER_OUNCE,
  GRAMS_PER_POUND,
  OUNCES_PER_POUND,
  OUNCES_PER_STONE,
  type EquivalenceInput,
} from './types';
import { validateAddition, validateEquivalence } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(
    Math.abs(actual - expected) <= eps,
    `expected ${expected}, got ${actual}`
  );
}

function base(overrides: Partial<EquivalenceInput> = {}): EquivalenceInput {
  return { ...DEFAULT_EQUIVALENCE_INPUT, ...overrides };
}

{
  assert.equal(OUNCES_PER_POUND, 16);
  assertClose(GRAMS_PER_POUND, 453.59237);
  assertClose(GRAMS_PER_OUNCE, 28.349523125);
  assert.equal(OUNCES_PER_STONE, 224);
}

{
  const cases: readonly [number, number][] = [
    [0, 0],
    [0.25, 4],
    [0.5, 8],
    [0.75, 12],
    [1, 16],
    [1.5, 24],
    [2, 32],
    [2.5, 40],
    [3, 48],
    [5, 80],
    [10, 160],
    [14, 224],
    [20, 320],
    [50, 800],
    [100, 1600],
  ];
  for (const [lb, oz] of cases) {
    assertClose(poundsToOunces(lb), oz);
    assertClose(ouncesToPounds(oz), lb);
  }
}

{
  assertClose(ouncesToPounds(1), 0.0625);
  assertClose(ouncesToPounds(2), 0.125);
  assertClose(ouncesToPounds(4), 0.25);
  assertClose(ouncesToPounds(8), 0.5);
  assertClose(ouncesToPounds(12), 0.75);
}

{
  const m15 = normalizeOunces(mixedToOunces(1, 8));
  assert.equal(m15.pounds, 1);
  assertClose(m15.ounces, 8);
  assertClose(ouncesToPounds(mixedToOunces(1, 8)), 1.5);

  const m225 = normalizeOunces(poundsToOunces(2.25));
  assert.equal(m225.pounds, 2);
  assertClose(m225.ounces, 4);

  const m375 = normalizeOunces(poundsToOunces(3.75));
  assert.equal(m375.pounds, 3);
  assertClose(m375.ounces, 12);

  const carry = normalizeOunces(mixedToOunces(2, 20));
  assert.equal(carry.pounds, 3);
  assertClose(carry.ounces, 4);

  const carry2 = normalizeOunces(mixedToOunces(1, 32));
  assert.equal(carry2.pounds, 3);
  assertClose(carry2.ounces, 0);
}

{
  assertClose(gramsFromOunces(16), GRAMS_PER_POUND);
  assertClose(gramsFromOunces(1), GRAMS_PER_OUNCE);
  const two = calculateEquivalence(base({ source: 'pounds', pounds: 2 }));
  assertClose(two.grams, 907.18474);
  const twoHalf = calculateEquivalence(base({ source: 'pounds', pounds: 2.5 }));
  assertClose(twoHalf.grams, 1133.980925);
  assertClose(stonesFromOunces(224), 1);
  assertClose(twoHalf.mixed.pounds, 2);
  assertClose(twoHalf.mixed.ounces, 8);
}

{
  const fromG = calculateEquivalence(
    base({
      source: 'metric',
      metric: 1133.980925,
      metricUnit: 'g',
      pounds: null,
    })
  );
  assertClose(fromG.totalOunces, 40);
  assertClose(fromG.mixed.pounds, 2);
  assertClose(fromG.mixed.ounces, 8);
}

{
  const add = calculateAddition(DEFAULT_ADDITION_INPUT);
  assert.equal(add.mixed.pounds, 6);
  assertClose(add.mixed.ounces, 3);
  assertClose(add.totalOunces, 99);
  assertClose(add.decimalPounds, 6.1875);
}

{
  const a = calculateAddition({
    rows: [
      { id: 'a', pounds: 1, ounces: 12 },
      { id: 'b', pounds: 2, ounces: 8 },
    ],
  });
  assert.equal(a.mixed.pounds, 4);
  assertClose(a.mixed.ounces, 4);

  const b = calculateAddition({
    rows: [
      { id: 'a', pounds: 1, ounces: 8 },
      { id: 'b', pounds: 1, ounces: 8 },
    ],
  });
  assert.equal(b.mixed.pounds, 3);
  assertClose(b.mixed.ounces, 0);

  const c = calculateAddition({
    rows: [
      { id: 'a', pounds: 0, ounces: 8 },
      { id: 'b', pounds: 0, ounces: 8 },
    ],
  });
  assert.equal(c.mixed.pounds, 1);
  assertClose(c.mixed.ounces, 0);
}

{
  const three = calculateAddition({
    rows: [
      { id: '1', pounds: 1, ounces: 0 },
      { id: '2', pounds: 1, ounces: 0 },
      { id: '3', pounds: 1, ounces: 0 },
    ],
  });
  assert.equal(three.mixed.pounds, 3);
  assertClose(three.totalOunces, 48);
}

{
  const bad = validateEquivalence(base({ pounds: -1 }));
  assert.equal(bad.isValid, false);
  const blank = validateEquivalence(base({ pounds: null }));
  assert.equal(blank.isValid, false);
  const ok = validateEquivalence(base());
  assert.equal(ok.isValid, true);

  const addBad = validateAddition({
    rows: [{ id: 'x', pounds: -1, ounces: 0 }],
  });
  assert.equal(addBad.isValid, false);
  const addOk = validateAddition(DEFAULT_ADDITION_INPUT);
  assert.equal(addOk.isValid, true);
}

{
  const def = calculateEquivalence(DEFAULT_EQUIVALENCE_INPUT);
  assertClose(def.totalOunces, 40);
  assertClose(def.decimalPounds, 2.5);
}

console.log('pounds-and-ounces calculation.test.ts: ok');
