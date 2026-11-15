import assert from 'node:assert/strict';
import {
  convertUnicodeText,
  reverseGraphemes,
  toCircled,
  toInverted,
  toInvertedReversed,
  toMonospaced,
  toNegativeCircled,
  toNegativeSquared,
  toSquared,
} from './calculation';

assert.equal(toCircled('abc'), 'ⓐⓑⓒ');
assert.equal(toCircled('hello'), 'ⓗⓔⓛⓛⓞ');
assert.equal(toCircled('ABC'), 'ⒶⒷⒸ');
assert.equal(toCircled('unicode'), 'ⓤⓝⓘⓒⓞⓓⓔ');
assert.equal(toCircled('a b'), 'ⓐ ⓑ');
assert.equal(toCircled('123'), '①②③');
assert.equal(toCircled('0'), '⓪');
assert.equal(toCircled('hi!'), 'ⓗⓘ!');

assert.equal(toNegativeCircled('ABC'), '🅐🅑🅒');
assert.equal(toNegativeCircled('unicode'), '🅤🅝🅘🅒🅞🅓🅔');
assert.equal(toNegativeCircled('abc'), '🅐🅑🅒');

assert.equal(toSquared('ABC'), '🄰🄱🄲');
assert.equal(toSquared('ab'), '🄰🄱');
assert.equal(toSquared('A1'), '🄰1');

assert.equal(toNegativeSquared('ABC'), '🅰🅱🅲');
assert.equal(toNegativeSquared('ab'), '🅰🅱');

assert.equal(toMonospaced('abc'), '𝚊𝚋𝚌');
assert.equal(toMonospaced('ABC'), '𝙰𝙱𝙲');
assert.equal(toMonospaced('123'), '𝟷𝟸𝟹');
assert.equal(toMonospaced('unicode'), '𝚞𝚗𝚒𝚌𝚘𝚍𝚎');

assert.equal(toInverted('abc'), 'ɐqɔ');
assert.equal(toInvertedReversed('abc'), 'ɔqɐ');
assert.equal(toInverted('hello'), 'ɥǝllo');
assert.equal(toInvertedReversed('hello'), 'ollǝɥ');

assert.equal(reverseGraphemes('abc'), 'cba');
assert.equal(reverseGraphemes(''), '');

{
  const empty = convertUnicodeText('');
  assert.equal(empty.circled, '');
  assert.equal(empty.monospaced, '');
}
{
  const all = convertUnicodeText('unicode');
  assert.equal(all.circled, 'ⓤⓝⓘⓒⓞⓓⓔ');
  assert.equal(all.negativeCircled, '🅤🅝🅘🅒🅞🅓🅔');
  assert.equal(all.monospaced, '𝚞𝚗𝚒𝚌𝚘𝚍𝚎');
}

// Unsupported preserved
assert.equal(toCircled('@'), '@');
assert.equal(toMonospaced('!'), '!');
assert.equal(toSquared('!'), '!');

console.log('unicode-text calculation.test.ts: ok');
