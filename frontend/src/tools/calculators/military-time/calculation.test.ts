import assert from 'node:assert/strict';
import {
  convertFromMilitary,
  convertFromStandard,
  militaryToStandard,
  standardToMilitary,
} from './calculation';
import { parseMilitaryInput } from './validation';

assert.equal(militaryToStandard('0000'), '12:00 AM');
assert.equal(militaryToStandard('0001'), '12:01 AM');
assert.equal(militaryToStandard('0030'), '12:30 AM');
assert.equal(militaryToStandard('0100'), '1:00 AM');
assert.equal(militaryToStandard('0630'), '6:30 AM');
assert.equal(militaryToStandard('0900'), '9:00 AM');
assert.equal(militaryToStandard('1200'), '12:00 PM');
assert.equal(militaryToStandard('1230'), '12:30 PM');
assert.equal(militaryToStandard('1300'), '1:00 PM');
assert.equal(militaryToStandard('1530'), '3:30 PM');
assert.equal(militaryToStandard('1800'), '6:00 PM');
assert.equal(militaryToStandard('1830'), '6:30 PM');
assert.equal(militaryToStandard('18:30'), '6:30 PM');
assert.equal(militaryToStandard('2100'), '9:00 PM');
assert.equal(militaryToStandard('2359'), '11:59 PM');

assert.equal(standardToMilitary(12, 0, 'AM'), '0000');
assert.equal(standardToMilitary(12, 0, 'PM'), '1200');
assert.equal(standardToMilitary(1, 0, 'AM'), '0100');
assert.equal(standardToMilitary(1, 0, 'PM'), '1300');
assert.equal(standardToMilitary(7, 15, 'AM'), '0715');
assert.equal(standardToMilitary(6, 30, 'PM'), '1830');
assert.equal(standardToMilitary(11, 59, 'AM'), '1159');
assert.equal(standardToMilitary(11, 59, 'PM'), '2359');
assert.equal(standardToMilitary(3, 45, 'PM'), '1545');
assert.equal(standardToMilitary(9, 15, 'PM'), '2115');

{
  const r = convertFromMilitary('1435');
  assert.equal(r.standard, '2:35 PM');
  assert.equal(r.military, '1435');
  assert.equal(r.twentyFour, '14:35');
}
{
  const r = convertFromStandard(7, 45, 'PM');
  assert.equal(r.military, '1945');
  assert.equal(r.twentyFour, '19:45');
}

assert.throws(() => militaryToStandard('2400'));
assert.throws(() => militaryToStandard('2460'));
assert.throws(() => militaryToStandard('2360'));
assert.throws(() => militaryToStandard('9999'));
assert.throws(() => militaryToStandard('abcd'));
assert.throws(() => militaryToStandard('12:99'));
assert.throws(() => standardToMilitary(0, 0, 'AM'));
assert.throws(() => standardToMilitary(13, 0, 'PM'));
assert.throws(() => standardToMilitary(6, 60, 'PM'));

assert.equal(parseMilitaryInput('').blank, true);
assert.equal(parseMilitaryInput('18').incomplete, true);
assert.equal(parseMilitaryInput('183').incomplete, true);
assert.ok(parseMilitaryInput('1830').value);
assert.ok(parseMilitaryInput('2400').error);
assert.ok(parseMilitaryInput('2360').error);

console.log('military-time calculation.test.ts: ok');
