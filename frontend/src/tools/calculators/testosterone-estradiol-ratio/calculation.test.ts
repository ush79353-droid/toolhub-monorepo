import assert from 'node:assert/strict';
import {
  calculateTe2Ratio,
  estradiolToPgMl,
  formatRatio,
  parseConcentration,
  sameMassNgMlRatio,
  testosteroneToNgDl,
  TESTOSTERONE_NG_DL_PER_NMOL_L,
  ESTRADIOL_PMOL_PER_PG_ML,
} from './calculation';
import { createDefaultInput } from './types';
import { validateTe2Input } from './validation';

assert.equal(parseConcentration(''), null);
assert.equal(parseConcentration('500'), 500);
assert.equal(calculateTe2Ratio(createDefaultInput()), null);

// Prompt fixture: 500 ng/dL · 25 pg/mL → 20 (mixed-unit index)
{
  const r = calculateTe2Ratio({
    testosterone: '500',
    testosteroneUnit: 'ng_dl',
    estradiol: '25',
    estradiolUnit: 'pg_ml',
  });
  assert.ok(r);
  assert.equal(r.formattedRatio, '20');
  assert.equal(formatRatio(20), '20');
}

// Same inputs: same-mass ng/mL ratio would be 200, not 20
{
  const tNgDl = 500;
  const ePg = 25;
  assert.equal(sameMassNgMlRatio(tNgDl, ePg), 200);
  const r = calculateTe2Ratio({
    testosterone: '500',
    testosteroneUnit: 'ng_dl',
    estradiol: '25',
    estradiolUnit: 'pg_ml',
  });
  assert.ok(r);
  assert.notEqual(r!.ratio, 200);
  assert.equal(r!.ratio, 20);
}

// Equal displayed units in canonical form → 1
{
  const r = calculateTe2Ratio({
    testosterone: '100',
    testosteroneUnit: 'ng_dl',
    estradiol: '100',
    estradiolUnit: 'pg_ml',
  });
  assert.ok(r);
  assert.equal(r.formattedRatio, '1');
}

// Zero estradiol denominator
assert.equal(
  calculateTe2Ratio({
    testosterone: '500',
    testosteroneUnit: 'ng_dl',
    estradiol: '0',
    estradiolUnit: 'pg_ml',
  }),
  null
);

// Blank estradiol
assert.equal(
  calculateTe2Ratio({
    testosterone: '500',
    testosteroneUnit: 'ng_dl',
    estradiol: '',
    estradiolUnit: 'pg_ml',
  }),
  null
);

// Molar testosterone: 500 ng/dL = 17.335 nmol/L → same ratio 20
{
  const nmol = 500 / TESTOSTERONE_NG_DL_PER_NMOL_L;
  const r = calculateTe2Ratio({
    testosterone: String(nmol),
    testosteroneUnit: 'nmol_l',
    estradiol: '25',
    estradiolUnit: 'pg_ml',
  });
  assert.ok(r);
  assert.equal(r.formattedRatio, '20');
}

// Molar estradiol: 25 pg/mL in pmol/L
{
  const r = calculateTe2Ratio({
    testosterone: '500',
    testosteroneUnit: 'ng_dl',
    estradiol: String(25 * ESTRADIOL_PMOL_PER_PG_ML),
    estradiolUnit: 'pmol_l',
  });
  assert.ok(r);
  assert.equal(r.formattedRatio, '20');
}

assert.equal(testosteroneToNgDl(5, 'ng_ml'), 500);
assert.equal(estradiolToPgMl(25, 'pg_ml'), 25);

const invalidE = validateTe2Input({
  testosterone: '500',
  testosteroneUnit: 'ng_dl',
  estradiol: '0',
  estradiolUnit: 'pg_ml',
});
assert.ok(invalidE.errors.estradiol);
assert.equal(invalidE.result, null);

console.log('testosterone-estradiol-ratio calculation.test.ts: ok');