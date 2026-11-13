import assert from 'node:assert/strict';
import { calculateAdr, roundMoney } from './calculation';
import { DEFAULT_ADR_CURRENCY, type AdrInput } from './types';
import { validateAdr } from './validation';

function test(description: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ok - ${description}`);
  } catch (err) {
    console.error(`  FAIL - ${description}`);
    throw err;
  }
}

function base(patch: Partial<AdrInput>): AdrInput {
  return {
    solveFor: 'adr',
    roomRevenue: null,
    roomsSold: null,
    adr: null,
    availableRoomNights: null,
    daysInPeriod: null,
    physicalRooms: null,
    currency: DEFAULT_ADR_CURRENCY,
    ...patch,
  };
}

console.log('Running ADR Calculator unit tests...');

test('standard ADR is revenue divided by sold room-nights', () => {
  const input = base({ roomRevenue: 150_000, roomsSold: 100 });
  const result = calculateAdr(input);
  assert.ok(result);
  assert.equal(result.adr, 1500);
  assert.equal(result.roomRevenue, 150000);
  assert.equal(result.roomsSold, 100);
  assert.equal(result.occupancyPercent, null);
  assert.equal(result.revpar, null);
  assert.equal(validateAdr(input).isValid, true);
});

test('zero room revenue with rooms sold yields a zero ADR', () => {
  const result = calculateAdr(base({ roomRevenue: 0, roomsSold: 4 }));
  assert.ok(result);
  assert.equal(result.adr, 0);
});

test('zero sold room-nights is rejected', () => {
  const input = base({ roomRevenue: 1500, roomsSold: 0 });
  assert.equal(validateAdr(input).isValid, false);
  assert.match(validateAdr(input).errors.roomsSold ?? '', /at least 1/);
  assert.equal(calculateAdr(input), null);
});

test('negative revenue, fractional room-nights, and empty inputs are rejected', () => {
  const negative = base({ roomRevenue: -10, roomsSold: 2 });
  assert.equal(validateAdr(negative).errors.roomRevenue !== undefined, true);
  assert.equal(calculateAdr(negative), null);

  const fractional = base({ roomRevenue: 100, roomsSold: 1.5 });
  assert.match(validateAdr(fractional).errors.roomsSold ?? '', /whole number/);
  assert.equal(calculateAdr(fractional), null);

  const empty = base({});
  const emptyCheck = validateAdr(empty);
  assert.equal(emptyCheck.isValid, false);
  assert.equal(emptyCheck.incomplete, true);
  assert.equal(calculateAdr(empty), null);
  assert.equal(calculateAdr(base({ roomRevenue: Number.POSITIVE_INFINITY, roomsSold: 1 })), null);
});

test('reverse revenue is ADR times whole room-nights', () => {
  const result = calculateAdr(base({ solveFor: 'revenue', adr: 1500, roomsSold: 100 }));
  assert.ok(result);
  assert.equal(result.roomRevenue, 150000);
  assert.equal(result.adr, 1500);
});

test('reverse room-nights keep a fractional result', () => {
  const result = calculateAdr(base({ solveFor: 'roomsSold', roomRevenue: 1000, adr: 300 }));
  assert.ok(result);
  assert.equal(result.roomsSold, 3.3333);
  assert.equal(result.roomsSoldIsFractional, true);
  assert.equal(calculateAdr(base({ solveFor: 'roomsSold', roomRevenue: 1000, adr: 0 })), null);
});

test('occupancy and RevPAR use available room-nights', () => {
  const result = calculateAdr(
    base({
      roomRevenue: 150_000,
      roomsSold: 100,
      physicalRooms: 80,
      daysInPeriod: 2,
    })
  );
  assert.ok(result);
  assert.equal(result.availableRoomNights, 160);
  assert.equal(result.occupancyPercent, 62.5);
  assert.equal(result.revpar, 937.5);
  assert.equal(roundMoney(result.adr * (result.occupancyPercent / 100)), result.revpar);
});

test('sold room-nights cannot exceed available inventory', () => {
  const input = base({ roomRevenue: 500, roomsSold: 10, availableRoomNights: 4 });
  assert.match(validateAdr(input).errors.roomsSold ?? '', /cannot exceed/);
  assert.equal(calculateAdr(input), null);
});

test('decimal revenue rounds ADR to cents', () => {
  const result = calculateAdr(base({ roomRevenue: 100, roomsSold: 3 }));
  assert.ok(result);
  assert.equal(result.adr, 33.33);
});

test('currency labels the same amounts and does not change the ADR', () => {
  const pkr = calculateAdr(base({ roomRevenue: 150_000, roomsSold: 100, currency: 'PKR' }));
  const usd = calculateAdr(base({ roomRevenue: 150_000, roomsSold: 100, currency: 'USD' }));
  assert.ok(pkr && usd);
  assert.equal(pkr.adr, usd.adr);
  assert.equal(pkr.currency, 'PKR');
  assert.equal(usd.currency, 'USD');
});

test('missing advanced inputs still return ADR only', () => {
  const result = calculateAdr(base({ roomRevenue: 80, roomsSold: 2, daysInPeriod: null, physicalRooms: null }));
  assert.ok(result);
  assert.equal(result.adr, 40);
  assert.equal(result.occupancyPercent, null);
  assert.equal(result.revpar, null);
});

console.log('ADR Calculator unit tests passed.');
