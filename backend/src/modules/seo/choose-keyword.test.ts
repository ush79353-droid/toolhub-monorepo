import assert from 'node:assert/strict';
import test from 'node:test';
import { choosePrimaryKeyword, keywordContainsSeed, keywordSeed, type KeywordFact } from './choose-keyword';

function fact(keyword: string, searchVolume: number): KeywordFact {
  return { keyword, searchVolume, difficulty: null, cpc: null };
}

test('keeps a short name and ignores a higher-volume idea that only shares a substring', () => {
  const picked = choosePrimaryKeyword(
    [fact('bmi calculator', 500000), fact('apr calculator', 1000)],
    'APR Calculator'
  );
  assert.equal(picked?.keyword, 'apr calculator');
});

test('does not treat hour as hourly or bank as bank of america', () => {
  const shift = choosePrimaryKeyword(
    [fact('salary convert to hourly', 90000), fact('12 hour shift pay', 400)],
    '12-Hour Shift Pay Calculator'
  );
  assert.equal(shift?.keyword, '12 hour shift pay');
  const bank = choosePrimaryKeyword(
    [fact('bank of america heloc calculator', 80000)],
    'Bank Reconciliation Calculator'
  );
  assert.equal(bank, null);
});

test('does not fall back to the highest-volume idea when nothing names the tool', () => {
  const picked = choosePrimaryKeyword(
    [fact('bmi calculator', 500000), fact('payments calculator', 400000)],
    'AMT Calculator'
  );
  assert.equal(picked, null);
});

test('does not pick another rule just because both keywords contain rule', () => {
  const picked = choosePrimaryKeyword([fact('50 30 20 rule', 200000)], '28/36 Rule Calculator');
  assert.equal(picked, null);
});

test('drops calculator and converter from the DataForSEO seed', () => {
  assert.equal(keywordSeed('3x Rent Calculator'), '3x Rent');
  assert.equal(keywordSeed('Yards to Meters Converter'), 'Yards to Meters');
  assert.equal(keywordSeed('Meter Converter'), 'Meter Converter');
  assert.equal(keywordSeed('BMI Calculator'), 'BMI Calculator');
  assert.equal(keywordSeed('Calculator'), 'Calculator');
  assert.equal(keywordContainsSeed('3x the rent calculator', '3x Rent'), true);
  assert.equal(keywordContainsSeed('compound interest calculator', '3x Rent'), false);
});

test('skips a matching keyword another draft in the campaign already took', () => {
  const picked = choosePrimaryKeyword(
    [fact('apr calculator', 5000), fact('apr formula', 800)],
    'APR Calculator',
    new Set(['apr calculator'])
  );
  assert.equal(picked?.keyword, 'apr formula');
});
