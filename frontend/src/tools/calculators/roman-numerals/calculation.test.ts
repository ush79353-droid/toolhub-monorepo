import assert from 'node:assert/strict';
import {
  arabicToRoman,
  calculateRoman,
  isValidArabicNumber,
  isValidRomanNumeral,
  normalizeRomanNumeral,
  romanToArabic,
} from './calculation';
import { parseRomanInput } from './validation';

assert.equal(arabicToRoman(1), 'I');
assert.equal(arabicToRoman(4), 'IV');
assert.equal(arabicToRoman(9), 'IX');
assert.equal(arabicToRoman(14), 'XIV');
assert.equal(arabicToRoman(39), 'XXXIX');
assert.equal(arabicToRoman(49), 'XLIX');
assert.equal(arabicToRoman(99), 'XCIX');
assert.equal(arabicToRoman(100), 'C');
assert.equal(arabicToRoman(400), 'CD');
assert.equal(arabicToRoman(900), 'CM');
assert.equal(arabicToRoman(1000), 'M');
assert.equal(arabicToRoman(1984), 'MCMLXXXIV');
assert.equal(arabicToRoman(1987), 'MCMLXXXVII');
assert.equal(arabicToRoman(1994), 'MCMXCIV');
assert.equal(arabicToRoman(2024), 'MMXXIV');
assert.equal(arabicToRoman(2026), 'MMXXVI');
assert.equal(arabicToRoman(3999), 'MMMCMXCIX');

assert.equal(romanToArabic('I'), 1);
assert.equal(romanToArabic('IV'), 4);
assert.equal(romanToArabic('IX'), 9);
assert.equal(romanToArabic('XLIX'), 49);
assert.equal(romanToArabic('XCIX'), 99);
assert.equal(romanToArabic('MCMXCIV'), 1994);
assert.equal(romanToArabic('MMXXIV'), 2024);
assert.equal(romanToArabic('MMXXVI'), 2026);
assert.equal(romanToArabic('MMMCMXCIX'), 3999);
assert.equal(romanToArabic('mmxxvi'), 2026);

assert.equal(normalizeRomanNumeral('  mmxxvi '), 'MMXXVI');
assert.equal(isValidArabicNumber('2026'), true);
assert.equal(isValidArabicNumber('0'), false);
assert.equal(isValidArabicNumber('-1'), false);
assert.equal(isValidArabicNumber('4000'), false);
assert.equal(isValidArabicNumber('12.5'), false);
assert.equal(isValidRomanNumeral('MMXXVI'), true);
assert.equal(isValidRomanNumeral('IIII'), false);
assert.equal(isValidRomanNumeral('VV'), false);
assert.equal(isValidRomanNumeral('IC'), false);
assert.equal(isValidRomanNumeral('IL'), false);
assert.equal(isValidRomanNumeral('XM'), false);
assert.equal(isValidRomanNumeral('VX'), false);
assert.equal(isValidRomanNumeral('IIV'), false);
assert.equal(isValidRomanNumeral('ABC'), false);
assert.equal(isValidRomanNumeral('MMMM'), false);

assert.throws(() => arabicToRoman(0));
assert.throws(() => arabicToRoman(4000));
assert.throws(() => romanToArabic('IIII'));
assert.throws(() => romanToArabic('MMMM'));

assert.equal(parseRomanInput('', 'arabic-to-roman').blank, true);
assert.ok(parseRomanInput('0', 'arabic-to-roman').error);
assert.ok(parseRomanInput('-1', 'arabic-to-roman').error);
assert.ok(parseRomanInput('4000', 'arabic-to-roman').error);
assert.ok(parseRomanInput('12.5', 'arabic-to-roman').error);
assert.ok(parseRomanInput('IIII', 'roman-to-arabic').error);
assert.ok(parseRomanInput('VV', 'roman-to-arabic').error);
assert.ok(parseRomanInput('IC', 'roman-to-arabic').error);
assert.ok(parseRomanInput('ABC', 'roman-to-arabic').error);
assert.equal(parseRomanInput('2026', 'arabic-to-roman').value, '2026');
assert.equal(parseRomanInput('mmxxvi', 'roman-to-arabic').value, 'MMXXVI');

const forward = calculateRoman('2026', 'arabic-to-roman');
assert.equal(forward.roman, 'MMXXVI');
assert.equal(forward.output, 'MMXXVI');
assert.ok(forward.steps.length >= 2);

const reverse = calculateRoman('MCMXCIV', 'roman-to-arabic');
assert.equal(reverse.arabic, 1994);
assert.equal(reverse.output, '1994');

for (let n = 1; n <= 3999; n++) {
  const roman = arabicToRoman(n);
  assert.equal(romanToArabic(roman), n, `round-trip failed for ${n} → ${roman}`);
  assert.ok(isValidRomanNumeral(roman), `invalid roman for ${n}: ${roman}`);
}

console.log('roman-numerals calculation.test.ts: ok');
