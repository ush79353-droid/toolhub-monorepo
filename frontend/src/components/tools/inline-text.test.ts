import assert from 'node:assert/strict';
import test from 'node:test';
import { splitHeading, stripInlineMarks } from './inline-text';

test('splits a glued markdown heading from the sentence', () => {
  const heading = splitHeading(
    '### Example Scenario Suppose you have a blood pressure reading of 120 mmHg. Leave the atm field blank.'
  );
  assert.deepEqual(heading, {
    title: 'Example Scenario',
    rest: 'Suppose you have a blood pressure reading of 120 mmHg. Leave the atm field blank.',
  });
});

test('a hash line with no title is not a heading', () => {
  assert.equal(splitHeading('##'), null);
  assert.equal(splitHeading('## '), null);
});

test('keeps a short heading that is only a title', () => {
  assert.deepEqual(splitHeading('### Calculation Using the conversion process:'), {
    title: 'Calculation Using the conversion process:',
    rest: '',
  });
});

test('plain text drops heading marks and bold markers', () => {
  assert.equal(stripInlineMarks('### Example Scenario\n**mmHg**'), 'Example Scenario\nmmHg');
});
