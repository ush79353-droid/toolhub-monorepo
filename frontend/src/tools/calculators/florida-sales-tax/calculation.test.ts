import assert from 'node:assert/strict';
import {
  calculateFloridaSalesTax,
  formatFlUsd,
  isValidFloridaZipFormat,
} from './calculation';
import { getFloridaCountySurtaxPercent } from './florida-county-surtax';
import {
  FLORIDA_ZIP_COUNTIES,
  lookupFloridaZipCounties,
} from './florida-zip-counties';

assert.equal(isValidFloridaZipFormat('33101'), true);
assert.equal(isValidFloridaZipFormat('32003'), true);
assert.equal(isValidFloridaZipFormat('07001'), false);
assert.equal(isValidFloridaZipFormat('3310'), false);

const miami = lookupFloridaZipCounties('33101');
assert.ok(miami);
assert.equal(miami!.length, 1);
assert.equal(miami![0]!.name, 'Miami-Dade');
assert.equal(getFloridaCountySurtaxPercent('Miami-Dade'), 1);

const multi = lookupFloridaZipCounties('32008');
assert.ok(multi);
assert.ok(multi!.length > 1);

const ambiguous = calculateFloridaSalesTax(100, '32008', '');
assert.ok(ambiguous);
assert.equal(ambiguous!.status, 'ambiguous');
assert.equal(ambiguous!.totalTax, null);

// Miami-Dade: state 6% + surtax 1%; $100 → state 6, surtax 1, total tax 7, total 107
const resolved = calculateFloridaSalesTax(100, '33101', '');
assert.ok(resolved);
assert.equal(resolved!.status, 'resolved');
assert.equal(resolved!.countyName, 'Miami-Dade');
assert.equal(resolved!.formattedStateTax, '6.00');
assert.equal(resolved!.formattedCountySurtax, '1.00');
assert.equal(resolved!.formattedTotalTax, '7.00');
assert.equal(resolved!.formattedTotalAmount, '107.00');

// $5,000 surtax cap: $10,000 purchase in Miami-Dade
// state = 600; surtax base 5000 → 50; total tax 650; total 10650
const capped = calculateFloridaSalesTax(10000, '33101', '');
assert.ok(capped);
assert.equal(capped!.surtaxTaxableBase, 5000);
assert.equal(capped!.formattedStateTax, '600.00');
assert.equal(capped!.formattedCountySurtax, '50.00');
assert.equal(capped!.formattedTotalTax, '650.00');
assert.equal(capped!.formattedTotalAmount, '10,650.00');

// Collier 0% surtax still resolves
const collierZip = Object.entries(FLORIDA_ZIP_COUNTIES).find(
  ([, c]) => c.length === 1 && c[0]!.name === 'Collier'
)?.[0];
assert.ok(collierZip);
const collier = calculateFloridaSalesTax(200, collierZip!, '');
assert.ok(collier);
assert.equal(collier!.surtaxRatePercent, 0);
assert.equal(collier!.formattedCountySurtax, '0.00');
assert.equal(collier!.formattedStateTax, '12.00');

assert.equal(formatFlUsd(107), '107.00');

console.log('florida-sales-tax calculation tests passed');
