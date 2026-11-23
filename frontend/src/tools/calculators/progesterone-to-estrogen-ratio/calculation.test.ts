import assert from 'node:assert/strict';
import {
  calculatePgE2Ratio,
  estradiolToPgMl,
  formatRatio,
  parseConcentration,
  progesteroneToPgMl,
  PROGESTERONE_NMOL_PER_NG_ML,
  ESTRADIOL_PMOL_PER_PG_ML,
} from './calculation';
import { createDefaultInput } from './types';
import { validatePgE2Input } from './validation';

assert.equal(parseConcentration(''), null);
assert.equal(parseConcentration('10'), 10);
assert.equal(calculatePgE2Ratio(createDefaultInput()), null);

// Prompt fixture: 10 ng/mL · 100 pg/mL → 100
{
  const r = calculatePgE2Ratio({
    progesterone: '10',
    progesteroneUnit: 'ng_ml',
    estradiol: '100',
    estradiolUnit: 'pg_ml',
  });
  assert.ok(r);
  assert.equal(r.formattedRatio, '100');
  assert.equal(formatRatio(100), '100');
}

// Equal mass concentrations in pg/mL → 1
{
  const r = calculatePgE2Ratio({
    progesterone: '200',
    progesteroneUnit: 'pg_ml',
    estradiol: '200',
    estradiolUnit: 'pg_ml',
  });
  assert.ok(r);
  assert.equal(r.formattedRatio, '1');
}

// Zero estradiol denominator
assert.equal(
  calculatePgE2Ratio({
    progesterone: '10',
    progesteroneUnit: 'ng_ml',
    estradiol: '0',
    estradiolUnit: 'pg_ml',
  }),
  null
);

// Blank estradiol
assert.equal(
  calculatePgE2Ratio({
    progesterone: '10',
    progesteroneUnit: 'ng_ml',
    estradiol: '',
    estradiolUnit: 'pg_ml',
  }),
  null
);

// Molar progesterone: 31.8 nmol/L = 10 ng/mL → same ratio 100
{
  const r = calculatePgE2Ratio({
    progesterone: String(10 * PROGESTERONE_NMOL_PER_NG_ML),
    progesteroneUnit: 'nmol_l',
    estradiol: '100',
    estradiolUnit: 'pg_ml',
  });
  assert.ok(r);
  assert.equal(r.formattedRatio, '100');
}

// Molar estradiol: 100 pg/mL = 100 * 3.6713 pmol/L
{
  const r = calculatePgE2Ratio({
    progesterone: '10',
    progesteroneUnit: 'ng_ml',
    estradiol: String(100 * ESTRADIOL_PMOL_PER_PG_ML),
    estradiolUnit: 'pmol_l',
  });
  assert.ok(r);
  assert.equal(r.formattedRatio, '100');
}

assert.equal(progesteroneToPgMl(10, 'ng_ml'), 10000);
assert.equal(estradiolToPgMl(100, 'pg_ml'), 100);

const invalidE = validatePgE2Input({
  progesterone: '10',
  progesteroneUnit: 'ng_ml',
  estradiol: '0',
  estradiolUnit: 'pg_ml',
});
assert.ok(invalidE.errors.estradiol);
assert.equal(invalidE.result, null);

console.log('progesterone-to-estrogen-ratio calculation.test.ts: ok');
