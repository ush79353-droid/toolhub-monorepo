import assert from 'node:assert/strict';
import {
  calculateMcgToIu,
  formatMeasure,
  fromMcg,
  getSubstanceOption,
  iuToMcg,
  mcgToIu,
  toMcg,
} from './calculation';
import { SUBSTANCE_OPTIONS } from './types';
import { validateMcgToIu } from './validation';

function assertClose(actual: number, expected: number, eps = 1e-10): void {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);
}

{
  const vitaminD = getSubstanceOption('vitaminD');
  assert.equal(vitaminD.mcgPerIu, 0.025);
  assert.equal(mcgToIu(1, vitaminD.mcgPerIu), 40);
  assert.equal(iuToMcg(40, vitaminD.mcgPerIu), 1);

  // Prompt fixture: 25 mcg vitamin D → 1,000 IU
  const result = calculateMcgToIu({
    substance: 'vitaminD',
    source: 'mass',
    massMcg: 25,
    iu: null,
    massUnit: 'mcg',
  });
  assert.equal(result.iu, 1000);
  assert.equal(result.massMcg, 25);

  const inverse = calculateMcgToIu({
    substance: 'vitaminD',
    source: 'iu',
    massMcg: null,
    iu: 1000,
    massUnit: 'mcg',
  });
  assert.equal(inverse.massMcg, 25);
}

{
  // NIH ODS: 1 IU retinol = 0.3 mcg RAE → 900 mcg RAE = 3000 IU
  const retinol = getSubstanceOption('vitaminARetinol');
  assert.equal(retinol.mcgPerIu, 0.3);
  assertClose(mcgToIu(900, retinol.mcgPerIu), 3000);
  assertClose(iuToMcg(3000, retinol.mcgPerIu), 900);

  const dietaryBeta = getSubstanceOption('vitaminADietaryBetaCarotene');
  assert.equal(dietaryBeta.mcgPerIu, 0.05);
  assertClose(iuToMcg(1, dietaryBeta.mcgPerIu), 0.05);

  const other = getSubstanceOption('vitaminADietaryOtherCarotenoids');
  assert.equal(other.mcgPerIu, 0.025);
}

{
  // NIH ODS: natural 1 IU = 0.67 mg = 670 mcg; synthetic 1 IU = 0.45 mg = 450 mcg
  const natural = getSubstanceOption('vitaminENatural');
  assert.equal(natural.mcgPerIu, 670);
  assertClose(iuToMcg(1, natural.mcgPerIu), 670);
  assertClose(mcgToIu(670, natural.mcgPerIu), 1);

  const synthetic = getSubstanceOption('vitaminESynthetic');
  assert.equal(synthetic.mcgPerIu, 450);
  assertClose(iuToMcg(20, synthetic.mcgPerIu), 9000);
  assertClose(mcgToIu(9000, synthetic.mcgPerIu), 20);
}

{
  // Changing substance must not keep a prior IU↔mcg pairing under a new factor.
  const asD = calculateMcgToIu({
    substance: 'vitaminD',
    source: 'mass',
    massMcg: 25,
    iu: null,
    massUnit: 'mcg',
  });
  assert.equal(asD.iu, 1000);

  const asRetinol = calculateMcgToIu({
    substance: 'vitaminARetinol',
    source: 'mass',
    massMcg: 25,
    iu: null,
    massUnit: 'mcg',
  });
  assertClose(asRetinol.iu, 25 / 0.3);
  assert.notEqual(asRetinol.iu, asD.iu);
}

{
  assert.equal(toMcg(1, 'mg'), 1000);
  assert.equal(fromMcg(1000, 'mg'), 1);
  assert.equal(toMcg(1, 'g'), 1_000_000);
  assert.equal(formatMeasure(0), '0');
  assert.equal(formatMeasure(0.025), '0.025');
}

{
  const ok = validateMcgToIu({
    substance: 'vitaminD',
    source: 'mass',
    massMcg: 25,
    iu: null,
    massUnit: 'mcg',
  });
  assert.equal(ok.isValid, true);
  assert.equal(ok.result?.iu, 1000);

  const blank = validateMcgToIu({
    substance: 'vitaminD',
    source: 'mass',
    massMcg: null,
    iu: null,
    massUnit: 'mcg',
  });
  assert.equal(blank.isValid, false);
  assert.equal(blank.result, null);

  const neg = validateMcgToIu({
    substance: 'vitaminD',
    source: 'iu',
    massMcg: null,
    iu: -1,
    massUnit: 'mcg',
  });
  assert.equal(neg.isValid, false);
  assert.ok(neg.errors.iu);
}

{
  // Allowlist integrity: every option has a positive published factor.
  assert.ok(SUBSTANCE_OPTIONS.length >= 7);
  for (const option of SUBSTANCE_OPTIONS) {
    assert.ok(option.mcgPerIu > 0, option.value);
    assert.equal(getSubstanceOption(option.value).mcgPerIu, option.mcgPerIu);
  }
}

console.log('mcg-to-iu calculation.test.ts: ok');
