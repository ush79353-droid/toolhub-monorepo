import assert from 'node:assert/strict';
import { convertHardness, formatHardness, roundHardness, shareResultText } from './calculation';
import { HARD_STEEL_ROWS, SOFT_STEEL_ROWS } from './reference-data';
import { parseHardnessInput } from './validation';

function approxInt(actual: number | null, expected: number): void {
  assert.ok(actual != null, `expected ${expected}, got null`);
  assert.equal(roundHardness(actual!), expected);
}

// Exact soft-table lookup: 80 HRB
{
  const r = convertHardness({ value: 80, scale: 'HRB', material: 'nonAusteniticSteel' });
  approxInt(r.converted.HRB, 80);
  approxInt(r.converted.HBW, 141);
  approxInt(r.converted.HV, 144);
  assert.equal(r.converted.HRC, null);
}

// Exact hard-table lookup: 40 HRC
{
  const r = convertHardness({ value: 40, scale: 'HRC', material: 'nonAusteniticSteel' });
  approxInt(r.converted.HRC, 40);
  approxInt(r.converted.HBW, 371);
  approxInt(r.converted.HV, 392);
  assert.equal(r.converted.HRB, null);
}

// Exact HBW hard: 286 HBW → 30 HRC, 302 HV
{
  const r = convertHardness({ value: 286, scale: 'HBW', material: 'nonAusteniticSteel' });
  approxInt(r.converted.HBW, 286);
  approxInt(r.converted.HRC, 30);
  approxInt(r.converted.HV, 302);
}

// Interpolation: 300 HBW between 286 and 327
{
  const r = convertHardness({ value: 300, scale: 'HBW', material: 'nonAusteniticSteel' });
  // HRC: 30 + (300-286)/(327-286)*(35-30) = 30 + 14/41*5 ≈ 31.707 → 32
  approxInt(r.converted.HRC, 32);
  // HV: 302 + 14/41*(345-302) ≈ 316.68 → 317
  approxInt(r.converted.HV, 317);
}

// No extrapolation below soft min
{
  const r = convertHardness({ value: 50, scale: 'HRB', material: 'nonAusteniticSteel' });
  assert.ok(r.warnings.some((w) => w.includes('No verified conversion')));
  assert.equal(r.converted.HBW, null);
}

// No extrapolation above hard HRC max
{
  const r = convertHardness({ value: 70, scale: 'HRC', material: 'nonAusteniticSteel' });
  assert.ok(r.warnings.some((w) => w.includes('No verified conversion')));
}

// HV soft lookup
{
  const r = convertHardness({ value: 175, scale: 'HV', material: 'nonAusteniticSteel' });
  approxInt(r.converted.HV, 175);
  approxInt(r.converted.HRB, 90);
  approxInt(r.converted.HBW, 172);
}

// Source preserved; missing scales stay null (not zero)
{
  const r = convertHardness({ value: 50, scale: 'HRC', material: 'nonAusteniticSteel' });
  approxInt(r.converted.HRC, 50);
  assert.equal(r.converted.HRB, null);
  assert.notEqual(formatHardness(r.converted.HRB), '0');
  assert.equal(formatHardness(r.converted.HRB), '—');
}

assert.equal(parseHardnessInput('').blank, true);
assert.ok(parseHardnessInput('-1').error);
assert.ok(parseHardnessInput('0').error);

assert.equal(SOFT_STEEL_ROWS.length, 9);
assert.equal(HARD_STEEL_ROWS.length, 11);

{
  const r = convertHardness({ value: 40, scale: 'HRC', material: 'nonAusteniticSteel' });
  const share = shareResultText(r);
  assert.match(share, /Hardness Conversion Calculator/);
  assert.match(share, /40 HRC/);
  assert.match(share, /Non-austenitic steel/);
}

console.log('hardness calculation.test.ts: ok');
