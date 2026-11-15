import assert from 'node:assert/strict';
import {
  convertFromField,
  kibibytesToMebibytes,
  kilobytesToMebibytes,
  kilobytesToMegabytes,
  mebibytesToKibibytes,
  mebibytesToKilobytes,
  megabytesToKilobytes,
} from './calculation';
import { parseKbMbInput } from './validation';

assert.equal(kilobytesToMegabytes(1000), 1);
assert.equal(kilobytesToMegabytes(2048), 2.048);
assert.equal(kilobytesToMegabytes(500), 0.5);
assert.equal(megabytesToKilobytes(2), 2000);

assert.equal(kibibytesToMebibytes(1024), 1);
assert.equal(kibibytesToMebibytes(512), 0.5);
assert.equal(mebibytesToKibibytes(2), 2048);

assert.ok(Math.abs(kilobytesToMebibytes(1024) - 0.9765625) < 1e-12);
assert.equal(mebibytesToKilobytes(1), 1048.576);

{
  const r = convertFromField('1024', 'kilo', 'kB');
  assert.equal(r.MB, '1.024');
  assert.equal(r.MiB, '0.9765625');
}
{
  const r = convertFromField('1024', 'kilo', 'KiB');
  assert.equal(r.MiB, '1');
  assert.equal(r.MB, '1.048576');
}
{
  const r = convertFromField('1', 'MB', 'kB');
  assert.equal(r.kilo, '1000');
}
{
  const r = convertFromField('1', 'MiB', 'kB');
  assert.equal(r.kilo, '1048.576');
}

assert.equal(parseKbMbInput('').blank, true);
assert.ok(parseKbMbInput('-1').error);
assert.ok(parseKbMbInput('abc').error);
assert.equal(parseKbMbInput('0').value?.digits, '0');

console.log('kb-to-mb calculation.test.ts: ok');
