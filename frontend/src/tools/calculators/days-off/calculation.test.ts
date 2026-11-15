import assert from 'node:assert/strict';
import { formatDaysOffPlainText, getDaysOffInfo } from './calculation';

{
  const res = getDaysOffInfo('us', 'full-time');
  const plain = formatDaysOffPlainText(res);
  assert.match(plain, /not legally entitled/i);
  assert.match(plain, /10 to 15 paid-off days/);
}

{
  const res = getDaysOffInfo('uk', 'full-time');
  assert.match(formatDaysOffPlainText(res), /5\.6 weeks/);
}

{
  const res = getDaysOffInfo('poland', 'part-time');
  assert.match(formatDaysOffPlainText(res), /pro-rated/i);
}

{
  const res = getDaysOffInfo('us', 'freelance');
  assert.match(formatDaysOffPlainText(res), /no federal entitlement/i);
}

console.log('days-off calculation.test ok');
