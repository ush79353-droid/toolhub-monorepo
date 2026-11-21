/**
 * Assert self-check. Run: npx tsx src/tools/calculators/money-counter/calculation.test.ts
 */
import { calculateMoneyTotal, candyExampleTotalUsd } from './calculation';
import { faceToMinorUnits, getDenominationSet } from './denominations';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(candyExampleTotalUsd() === 2640, 'candy example major units');

const usd = getDenominationSet('USD');
assert(usd.notes.length === 7, 'usd notes');
assert(usd.coins.length === 6, 'usd coins');
assert(faceToMinorUnits(0.25, 'USD') === 25, 'quarter cents');
assert(faceToMinorUnits(1000, 'JPY') === 1000, 'jpy no subunit');

const empty = calculateMoneyTotal({
  currency: 'USD',
  includeCoins: false,
  counts: Object.fromEntries(usd.notes.map((n) => [n.id, 0])),
});
assert(empty.total === 0, 'empty zero');
assert(empty.formattedTotal.includes('0'), 'formatted zero');

const candyCounts: Record<string, number> = Object.fromEntries(
  [...usd.notes, ...usd.coins].map((d) => [d.id, 0])
);
candyCounts['USD-note-10'] = 10;
candyCounts['USD-note-50'] = 20;
candyCounts['USD-note-100'] = 15;
candyCounts['USD-coin-1'] = 20;
candyCounts['USD-coin-0.5'] = 40;

const candy = calculateMoneyTotal({
  currency: 'USD',
  includeCoins: true,
  counts: candyCounts,
});
assert(candy.total === 2640, `candy total got ${candy.total}`);
assert(candy.pieceCount === 10 + 20 + 15 + 20 + 40, 'piece count');

const notesOnly = calculateMoneyTotal({
  currency: 'USD',
  includeCoins: false,
  counts: candyCounts,
});
assert(notesOnly.total === 2600, 'coins excluded when toggle off');

console.log('money-counter calculation.test.ts: ok');
