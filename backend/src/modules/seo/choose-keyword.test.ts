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

test('matches a short unit conversion without requiring the word converter', () => {
  const picked = choosePrimaryKeyword(
    [fact('mmhg to atm', 5000), fact('mm to atm', 800), fact('length converter', 90000)],
    'mm to ATM Converter'
  );
  assert.equal(picked?.keyword, 'mm to atm');
  assert.equal(keywordContainsSeed('mm to atm', keywordSeed('mm to ATM Converter')), true);
  assert.equal(keywordContainsSeed('mmhg to atm', keywordSeed('mm to ATM Converter')), false);
});

test('uses the name after the dash and still rejects a generic unemployment keyword', () => {
  const ideas = [
    fact('unemployment benefits', 500000),
    fact('cares act unemployment', 4000),
    fact('heals vs heroes act', 2000),
    fact('lwa unemployment', 1500),
    fact('lost wages assistance', 800),
  ];
  assert.equal(
    choosePrimaryKeyword(ideas, 'Unemployment Benefit Calculator - CARES Act')?.keyword,
    'cares act unemployment'
  );
  assert.equal(
    choosePrimaryKeyword(ideas, 'Unemployment Benefit Calculator - HEALS Act vs. HEROES Act')?.keyword,
    'heals vs heroes act'
  );
  assert.equal(
    choosePrimaryKeyword(ideas, 'Unemployment Benefit Calculator - Lost Wages Assistance (LWA)')?.keyword,
    'lwa unemployment'
  );
  assert.equal(keywordSeed('Unemployment Benefit Calculator - CARES Act'), 'CARES Act');
  assert.equal(
    keywordSeed('Unemployment Benefit Calculator - Lost Wages Assistance (LWA)'),
    'Lost Wages Assistance'
  );
  assert.equal(
    keywordContainsSeed('lost wages assistance program', keywordSeed('Unemployment Benefit Calculator - Lost Wages Assistance (LWA)')),
    true
  );
  assert.equal(
    keywordContainsSeed('lwa anime', keywordSeed('Unemployment Benefit Calculator - Lost Wages Assistance (LWA)')),
    false
  );
  assert.equal(keywordContainsSeed('heals act', keywordSeed('Unemployment Benefit Calculator - HEALS Act vs. HEROES Act')), false);
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
