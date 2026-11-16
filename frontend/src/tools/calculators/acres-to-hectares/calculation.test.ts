import assert from 'node:assert/strict';
import {
  acresToHectares,
  calculateAcresToHectares,
  hectaresToAcres,
  shareResultText,
} from './calculation';
import { HECTARES_PER_ACRE } from './types';
import { parseOptionalNumber, validateAcresToHectares } from './validation';

function close(actual: number, expected: number, digits = 10): void {
  const eps = 10 ** -digits;
  assert.ok(
    Math.abs(actual - expected) <= eps * Math.max(1, Math.abs(expected)),
    `expected ${expected}, got ${actual}`,
  );
}

close(acresToHectares(1), 0.40468564224);
close(acresToHectares(10), 4.0468564224);
close(acresToHectares(100), 40.468564224, 9);
close(hectaresToAcres(1), 2.471053814671653);
assert.equal(acresToHectares(0), 0);

close(acresToHectares(15), 6.0702846336);
close(hectaresToAcres(10), 24.7105381467, 9);

{
  const result = calculateAcresToHectares({
    source: 'acres',
    acres: 10,
    hectares: null,
  });
  close(result.hectares, 4.0468564224);
  assert.match(shareResultText(result), /4\.0468564224/);
}

assert.equal(parseOptionalNumber(''), null);
assert.equal(parseOptionalNumber('10.'), null);
assert.ok(Number.isNaN(parseOptionalNumber('abc')!));
assert.ok(
  !validateAcresToHectares({ source: 'acres', acres: -1, hectares: null }).isValid,
);
assert.equal(HECTARES_PER_ACRE, 0.40468564224);

console.log('acres-to-hectares calculation.test.ts: ok');
