import assert from 'node:assert/strict';
import {
  convertToSentenceCase,
  convertToTitleCase,
  convertToToggleCase,
  convertToUppercase,
  countWords,
  transformCase,
} from './calculation';

assert.equal(convertToUppercase('hello'), 'HELLO');
assert.equal(convertToUppercase('hello world'), 'HELLO WORLD');
assert.equal(convertToUppercase('Hello World'), 'HELLO WORLD');
assert.equal(convertToUppercase('ABC'), 'ABC');
assert.equal(convertToUppercase('abc123'), 'ABC123');
assert.equal(convertToUppercase('hello!'), 'HELLO!');
assert.equal(convertToUppercase('hello\nworld'), 'HELLO\nWORLD');
assert.equal(convertToUppercase(''), '');
assert.equal(convertToUppercase('  hello  world  '), '  HELLO  WORLD  ');
assert.equal(convertToUppercase('café'), 'CAFÉ');
assert.equal(convertToUppercase('straße'), 'STRASSE');
assert.equal(convertToUppercase("it's time for breakfast"), "IT'S TIME FOR BREAKFAST");

assert.equal(transformCase('hello world', 'lowercase'), 'hello world');
assert.equal(convertToTitleCase('hello world'), 'Hello World');
assert.equal(convertToSentenceCase('hello. world'), 'Hello. World');
assert.equal(convertToToggleCase('Hello'), 'hELLO');

assert.equal(countWords(''), 0);
assert.equal(countWords('hello world'), 2);

console.log('lowercase-to-uppercase calculation.test.ts: ok');
