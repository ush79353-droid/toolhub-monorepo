import assert from 'node:assert/strict';
import {
  convertCapacitance,
  fromFarads,
  parseDecimalString,
  toFarads,
  formatPlain,
} from './calculation';
import { parseCapacitanceInput } from './validation';

assert.equal(convertCapacitance('1', 'F', 'mF'), '1000');
assert.equal(convertCapacitance('1', 'F', 'uF'), '1000000');
assert.equal(convertCapacitance('1', 'F', 'nF'), '1000000000');
assert.equal(convertCapacitance('1', 'F', 'pF'), '1000000000000');
assert.equal(convertCapacitance('1', 'uF', 'nF'), '1000');
assert.equal(convertCapacitance('1', 'nF', 'pF'), '1000');
assert.equal(convertCapacitance('100', 'nF', 'uF'), '0.1');
assert.equal(convertCapacitance('470', 'pF', 'nF'), '0.47');
assert.equal(convertCapacitance('2200', 'uF', 'mF'), '2.2');
assert.equal(convertCapacitance('0.047', 'uF', 'nF'), '47');

// Example sets
assert.equal(convertCapacitance('1', 'uF', 'F'), '0.000001');
assert.equal(convertCapacitance('1', 'uF', 'mF'), '0.001');
assert.equal(convertCapacitance('1', 'uF', 'pF'), '1000000');
assert.equal(convertCapacitance('100', 'nF', 'F'), '0.0000001');
assert.equal(convertCapacitance('100', 'nF', 'pF'), '100000');
assert.equal(convertCapacitance('470', 'pF', 'uF'), '0.00047');
assert.equal(convertCapacitance('2200', 'uF', 'F'), '0.0022');
assert.equal(convertCapacitance('2200', 'uF', 'pF'), '2200000000');
assert.equal(convertCapacitance('0.047', 'uF', 'pF'), '47000');

assert.equal(convertCapacitance('0', 'F', 'pF'), '0');
assert.equal(convertCapacitance('0001', 'F', 'mF'), '1000');

// Round-trips
assert.equal(convertCapacitance(convertCapacitance('1', 'F', 'uF'), 'uF', 'F'), '1');
assert.equal(convertCapacitance(convertCapacitance('2.5', 'uF', 'nF'), 'nF', 'uF'), '2.5');
assert.equal(convertCapacitance(convertCapacitance('47', 'nF', 'pF'), 'pF', 'nF'), '47');
assert.equal(convertCapacitance(convertCapacitance('470', 'pF', 'mF'), 'mF', 'pF'), '470');

const oneF = toFarads(parseDecimalString('1')!, 'F');
assert.equal(formatPlain(fromFarads(oneF, 'mF')), '1000');
assert.equal(formatPlain(fromFarads(oneF, 'uF')), '1000000');

assert.equal(parseCapacitanceInput('').blank, true);
assert.ok(parseCapacitanceInput('-1').error);
assert.ok(parseCapacitanceInput('abc').error);
assert.equal(parseCapacitanceInput('5').value?.digits, '5');

console.log('capacitance calculation.test.ts: ok');
