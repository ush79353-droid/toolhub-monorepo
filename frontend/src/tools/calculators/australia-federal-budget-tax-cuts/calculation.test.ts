import assert from 'node:assert/strict';
import {
  buildAustraliaTaxCutsNoticeSummary,
  getGstCalculatorHref,
} from './calculation';
import { createDefaultInput, GST_CALCULATOR_HREF } from './types';
import { validateAustraliaTaxCutsInput } from './validation';

{
  const href = getGstCalculatorHref();
  assert.equal(href, '/tools/gst-calculator');
  assert.equal(href, GST_CALCULATOR_HREF);
}

{
  const summary = buildAustraliaTaxCutsNoticeSummary(
    'Income Tax Cuts Calculator - Australia Federal Budget 2020/21'
  );
  assert.match(summary, /unavailable at this time/i);
  assert.match(summary, /does not calculate current Australian income tax/i);
  assert.match(summary, /Budget proposals are distinct from enacted/i);
  assert.match(summary, /gst-calculator/);
  assert.doesNotMatch(summary, /\$\d/);
  assert.doesNotMatch(summary, /refund estimate|taxable income of|your tax cut is/i);
}

{
  const validation = validateAustraliaTaxCutsInput(createDefaultInput());
  assert.equal(validation.isValid, true);
  assert.ok(validation.result);
  assert.equal(validation.result.gstCalculatorHref, '/tools/gst-calculator');
}

console.log('australia-federal-budget-tax-cuts calculation.test.ts: all assertions passed');
