import assert from 'node:assert/strict';
import {
  convertToLowercase,
  countCharacters,
  countLines,
  countWords,
  shareResultText,
  textStats,
} from './calculation';

assert.equal(convertToLowercase('HELLO WORLD'), 'hello world');
assert.equal(convertToLowercase('ThIs Is A TeSt'), 'this is a test');
assert.equal(convertToLowercase('ABC123'), 'abc123');
assert.equal(convertToLowercase('HELLO 😊'), 'hello 😊');
assert.equal(convertToLowercase('CAFÉ ÜBER'), 'café über');
assert.equal(convertToLowercase(''), '');
assert.equal(convertToLowercase('hello world'), 'hello world');

assert.equal(
  convertToLowercase('ORDER #123: TOTAL $500!'),
  'order #123: total $500!',
);

assert.equal(
  convertToLowercase('HELLO WORLD\nWELCOME TO OMEGA CALCULATORS\nTHANK YOU'),
  'hello world\nwelcome to omega calculators\nthank you',
);

assert.equal(convertToLowercase('CAFÉ ÜBER ÄPFEL'), 'café über äpfel');
assert.equal(convertToLowercase('HELLO 😊 WORLD 🚀'), 'hello 😊 world 🚀');

assert.equal(countWords(''), 0);
assert.equal(countWords('   '), 0);
assert.equal(countWords('HELLO WORLD'), 2);
assert.equal(countWords('a  b\nc'), 3);

assert.equal(countCharacters('HELLO WORLD'), 11);
assert.equal(countCharacters('😊'), 1);

assert.equal(countLines(''), 0);
assert.equal(countLines('one'), 1);
assert.equal(countLines('a\nb\nc'), 3);

assert.deepEqual(textStats('Hi there'), { characters: 8, words: 2, lines: 1 });

assert.match(shareResultText('HELLO', 'hello'), /hello/);
assert.ok(shareResultText('x'.repeat(2000), 'y'.repeat(2000)).includes('truncated'));

console.log('uppercase-to-lowercase calculation.test.ts: ok');
