import assert from 'node:assert/strict';
import { calculateRentSplit, formatRentSplitMoney } from './calculation';
import { validateRentSplitInput } from './validation';
import { createDefaultInput } from './types';

// Equal split: 30,000 / 3 people → 10,000 each; two bedrooms 1+2 people.
{
  const calc = calculateRentSplit({
    totalRent: 30_000,
    peoplePerBedroom: [1, 2],
  });
  assert.ok(calc);
  assert.equal(calc.totalPeople, 3);
  assert.equal(calc.perPersonRent, 10_000);
  assert.equal(calc.bedroomShares[0], 10_000);
  assert.equal(calc.bedroomShares[1], 20_000);
}

// Zero people → no calculation.
{
  const calc = calculateRentSplit({
    totalRent: 10_000,
    peoplePerBedroom: [0],
  });
  assert.equal(calc, null);
}

// Full-precision internal; display rounds.
{
  const calc = calculateRentSplit({
    totalRent: 100,
    peoplePerBedroom: [3],
  });
  assert.ok(calc);
  assert.ok(Math.abs(calc.perPersonRent - 100 / 3) < 1e-12);
  assert.equal(formatRentSplitMoney(calc.perPersonRent, 'PKR'), '33.33');
}

// Validation wires defaults → incomplete until rent entered.
{
  const empty = validateRentSplitInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);

  const ok = validateRentSplitInput({
    ...createDefaultInput(),
    totalRent: '9000',
    bedroomCount: 3,
    people: ['1', '1', '1'],
  });
  assert.equal(ok.isValid, true);
  assert.ok(ok.result);
  assert.equal(ok.result.perPersonRent, 3000);
  assert.equal(ok.result.bedrooms[2]?.formattedShare, '3,000.00');
}

console.log('rent-split calculation.test.ts: ok');
