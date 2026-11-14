import assert from 'node:assert/strict';
import {
  buildGematriaBundle,
  calculateGematria,
  ENGLISH_GEMATRIA,
  HEBREW_STANDARD_GEMATRIA,
  JEWISH_ENGLISH_GEMATRIA,
  SIMPLE_GEMATRIA,
} from './calculation';

// Simple
{
  assert.equal(SIMPLE_GEMATRIA.A, 1);
  assert.equal(SIMPLE_GEMATRIA.Z, 26);
  assert.equal(calculateGematria('CAT', 'simple').total, 24);
  assert.equal(calculateGematria('HELLO', 'simple').total, 52);
  assert.equal(calculateGematria('ABC', 'simple').total, 6);
  assert.equal(calculateGematria('hello', 'simple').total, 52);
  assert.equal(calculateGematria('H E L L O!', 'simple').total, 52);
}

// English ×6
{
  assert.equal(ENGLISH_GEMATRIA.A, 6);
  assert.equal(ENGLISH_GEMATRIA.Z, 156);
  assert.equal(calculateGematria('CAT', 'english').total, 144);
  assert.equal(calculateGematria('HELLO', 'english').total, 312);
  assert.equal(calculateGematria('ABC', 'english').total, 36);
}

// English Jewish
{
  assert.equal(JEWISH_ENGLISH_GEMATRIA.A, 1);
  assert.equal(JEWISH_ENGLISH_GEMATRIA.J, 600);
  assert.equal(JEWISH_ENGLISH_GEMATRIA.V, 700);
  assert.equal(JEWISH_ENGLISH_GEMATRIA.W, 900);
  assert.equal(calculateGematria('CAT', 'jewish-english').total, 104);
  assert.equal(calculateGematria('HELLO', 'jewish-english').total, 103);
}

// Hebrew standard
{
  assert.equal(HEBREW_STANDARD_GEMATRIA['א'], 1);
  assert.equal(HEBREW_STANDARD_GEMATRIA['י'], 10);
  assert.equal(HEBREW_STANDARD_GEMATRIA['ת'], 400);
  assert.equal(HEBREW_STANDARD_GEMATRIA['ם'], 40);
  assert.equal(calculateGematria('שלום', 'hebrew-standard').total, 376);
}

// Hebrew marks ignored
{
  // שלום with a combining mark on ל (qamats ָ)
  const withMark = 'של\u05B8ום';
  assert.equal(calculateGematria(withMark, 'hebrew-standard').total, 376);
}

// Empty / no letters
{
  assert.equal(buildGematriaBundle('', 'auto'), null);
  assert.equal(buildGematriaBundle('   ', 'auto'), null);
  const digits = buildGematriaBundle('123!', 'auto');
  assert.ok(digits);
  assert.equal(digits.simple, null);
  assert.equal(digits.hebrewStandard, null);
  assert.ok(digits.notices.length > 0);
}

// Bundle for CAT
{
  const bundle = buildGematriaBundle('CAT', 'auto');
  assert.ok(bundle);
  assert.equal(bundle.simple?.total, 24);
  assert.equal(bundle.english?.total, 144);
  assert.equal(bundle.activeJewish?.total, 104);
  assert.equal(bundle.activeJewish?.system, 'jewish-english');
}

// Bundle for שלום
{
  const bundle = buildGematriaBundle('שלום', 'auto');
  assert.ok(bundle);
  assert.equal(bundle.hebrewStandard?.total, 376);
  assert.equal(bundle.activeJewish?.total, 376);
  assert.equal(bundle.simple, null);
}

// Breakdown matches total
{
  const result = calculateGematria('HELLO', 'simple');
  const sum = result.letterValues
    .filter((row) => row.counted)
    .reduce((acc, row) => acc + row.value, 0);
  assert.equal(sum, result.total);
}

// No Latin mapping on Hebrew
{
  const result = calculateGematria('שלום', 'simple');
  assert.equal(result.countedCount, 0);
  assert.equal(result.total, 0);
  assert.ok(result.ignored.length > 0);
}

console.log('gematria calculation.test.ts: ok');
