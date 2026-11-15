import assert from 'node:assert/strict';
import {
  convertString,
  decadesToYears,
  formatYearsDecadesGrouped,
  parseDecimalString,
  shareResultText,
  yearsToDecades,
} from './calculation';
import { parseYearsDecadesInput } from './validation';

assert.equal(yearsToDecades(10), 1);
assert.equal(yearsToDecades(20), 2);
assert.equal(yearsToDecades(25), 2.5);
assert.equal(yearsToDecades(50), 5);
assert.equal(yearsToDecades(100), 10);
assert.equal(yearsToDecades(1000), 100);
assert.equal(yearsToDecades(0), 0);
assert.equal(yearsToDecades(-25), -2.5);
assert.equal(yearsToDecades(2.5), 0.25);
assert.equal(yearsToDecades(15), 1.5);
assert.equal(yearsToDecades(10000), 1000);

assert.equal(decadesToYears(1), 10);
assert.equal(decadesToYears(2.5), 25);
assert.equal(decadesToYears(4.5), 45);
assert.equal(decadesToYears(0.25), 2.5);
assert.equal(decadesToYears(0), 0);
assert.equal(decadesToYears(-3), -30);
assert.equal(decadesToYears(100), 1000);

assert.equal(convertString('25', 'years', 'decades'), '2.5');
assert.equal(convertString('4.5', 'decades', 'years'), '45');
assert.equal(convertString('2026', 'years', 'decades'), '202.6');
assert.equal(convertString('0.25', 'decades', 'years'), '2.5');
assert.equal(convertString('4500000000', 'years', 'decades'), '450000000');
assert.equal(convertString('4.5e9', 'years', 'decades'), '450000000');
assert.equal(convertString('100', 'decades', 'years'), '1000');
assert.equal(convertString('0', 'years', 'decades'), '0');
assert.equal(convertString('-25', 'years', 'decades'), '-2.5');
assert.equal(convertString('1,000', 'years', 'decades'), '100');
assert.equal(convertString('1e3', 'years', 'decades'), '100');
assert.equal(convertString('10000', 'years', 'decades'), '1000');

assert.equal(convertString(convertString('25', 'years', 'decades'), 'decades', 'years'), '25');
assert.equal(convertString(convertString('7.5', 'decades', 'years'), 'years', 'decades'), '7.5');
assert.equal(convertString('1e20', 'years', 'decades'), '10000000000000000000');

assert.equal(formatYearsDecadesGrouped(parseDecimalString('1000')!), '1,000');
assert.equal(formatYearsDecadesGrouped(parseDecimalString('10000')!), '10,000');

assert.equal(parseYearsDecadesInput('').blank, true);
assert.equal(parseYearsDecadesInput('   ').blank, true);
assert.ok(parseYearsDecadesInput('abc').error);
assert.ok(parseYearsDecadesInput('Infinity').error);
assert.ok(parseYearsDecadesInput('NaN').error);
assert.ok(parseYearsDecadesInput('-2.5').value);
assert.equal(parseYearsDecadesInput('12.').incomplete, true);
assert.equal(parseYearsDecadesInput('+').incomplete, true);
assert.equal(parseYearsDecadesInput('1e').incomplete, true);
assert.ok(parseYearsDecadesInput('1e3').value);
assert.equal(parseYearsDecadesInput('0').value?.digits, '0');

{
  const share = shareResultText('25', '2.5');
  assert.match(share, /Years to Decades Calculator/);
  assert.match(share, /Years: 25/);
  assert.match(share, /Decades: 2\.5/);
  assert.match(share, /Decades = Years \/ 10/);
  assert.match(share, /25 years = 2\.5 decades/);
}

assert.throws(() => convertString('abc', 'years', 'decades'));

console.log('years-to-decades calculation.test.ts: ok');
