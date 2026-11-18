import assert from 'node:assert/strict';
import { translateLeetSpeak, shareResultText } from './calculation';

assert.equal(translateLeetSpeak('HELLO', 'text-to-leet'), 'H3110');
assert.equal(translateLeetSpeak('HACKER', 'text-to-leet'), 'H4CK3R');
assert.equal(translateLeetSpeak('ELITE', 'text-to-leet'), '31173');
assert.equal(translateLeetSpeak('PASSWORD', 'text-to-leet'), 'P455W0RD');
assert.equal(translateLeetSpeak('H3110', 'leet-to-text'), 'HEIIO');

assert.equal(translateLeetSpeak('HELLO', 'text-to-leet', 'basic'), 'H3LL0');
assert.equal(translateLeetSpeak('HACKER', 'text-to-leet', 'basic'), 'H4CK3R');
assert.equal(translateLeetSpeak('GAME', 'text-to-leet', 'basic'), 'G4M3');
assert.equal(translateLeetSpeak('TEST', 'text-to-leet', 'basic'), '7357');
assert.equal(translateLeetSpeak('COOL', 'text-to-leet', 'basic'), 'C00L');
assert.equal(translateLeetSpeak('LEET', 'text-to-leet', 'basic'), 'L337');
assert.equal(translateLeetSpeak('LEET SPEAK', 'text-to-leet', 'basic'), 'L337 5P34K');

assert.equal(translateLeetSpeak('', 'text-to-leet'), '');
assert.equal(translateLeetSpeak('hello', 'text-to-leet', 'classic'), 'h3110');
assert.equal(translateLeetSpeak('Hi 😊!', 'text-to-leet', 'classic'), 'H1 😊!');
assert.equal(
  translateLeetSpeak('HELLO\nWORLD', 'text-to-leet', 'classic'),
  'H3110\nW0R1D',
);
assert.equal(translateLeetSpeak('P455W0RD', 'leet-to-text'), 'PASSWORD');
assert.match(shareResultText('HELLO', 'H3110', 'text-to-leet', 'classic'), /H3110/);

console.log('leet-speak calculation.test.ts: ok');
