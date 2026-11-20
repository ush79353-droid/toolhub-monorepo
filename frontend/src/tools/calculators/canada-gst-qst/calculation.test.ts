import assert from 'node:assert/strict';
import { calculateCanadaGstQst } from './calculation';

// Alberta GST-only: $100 → GST $5 → $105
{
  const result = calculateCanadaGstQst({
    province: 'AB',
    amountBeforeTax: 100,
  });
  assert.ok(result);
  assert.equal(result.lines.length, 1);
  assert.equal(result.lines[0]!.key, 'GST');
  assert.equal(result.lines[0]!.amount, 5);
  assert.equal(result.amountAfterTax, 105);
}

// Ontario HST 13%: $100 → $13 → $113 (no separate GST)
{
  const result = calculateCanadaGstQst({
    province: 'ON',
    amountBeforeTax: 100,
  });
  assert.ok(result);
  assert.equal(result.lines.length, 1);
  assert.equal(result.lines[0]!.key, 'HST');
  assert.equal(result.lines[0]!.amount, 13);
  assert.equal(result.amountAfterTax, 113);
}

// Nova Scotia HST 14% (on/after 2025-04-01)
{
  const result = calculateCanadaGstQst({
    province: 'NS',
    amountBeforeTax: 100,
  });
  assert.ok(result);
  assert.equal(result.lines[0]!.amount, 14);
  assert.equal(result.amountAfterTax, 114);
}

// Quebec GST + QST on pre-tax amount
{
  const result = calculateCanadaGstQst({
    province: 'QC',
    amountBeforeTax: 100,
  });
  assert.ok(result);
  assert.equal(result.lines.length, 2);
  assert.equal(result.lines[0]!.amount, 5);
  assert.equal(result.lines[1]!.amount, 9.975);
  assert.equal(result.amountAfterTax, 114.975);
}

// Zero amount allowed
{
  const result = calculateCanadaGstQst({
    province: 'BC',
    amountBeforeTax: 0,
  });
  assert.ok(result);
  assert.equal(result.totalTax, 0);
  assert.equal(result.amountAfterTax, 0);
}

// Negative rejected
{
  assert.equal(
    calculateCanadaGstQst({ province: 'AB', amountBeforeTax: -1 }),
    null
  );
}

console.log('canada-gst-qst calculation.test.ts: all assertions passed');
