import assert from 'node:assert/strict';
import {
  buildCaresActUnemploymentNoticeSummary,
  getUnemploymentCalculatorHref,
} from './calculation';
import { createDefaultInput, UNEMPLOYMENT_CALCULATOR_HREF } from './types';
import { validateCaresActUnemploymentBenefitInput } from './validation';

{
  const href = getUnemploymentCalculatorHref();
  assert.equal(href, '/tools/unemployment-calculator-unemployment-rate');
  assert.equal(href, UNEMPLOYMENT_CALCULATOR_HREF);
}

{
  const summary = buildCaresActUnemploymentNoticeSummary(
    'Unemployment Benefit Calculator - CARES Act'
  );
  assert.match(summary, /Relief, and Economic Security/);
  assert.match(summary, /not available for current claims/);
  assert.match(summary, /unemployment-calculator-unemployment-rate/);
  assert.doesNotMatch(summary, /\$\d/);
  assert.doesNotMatch(summary, /eligible|weekly benefit/i);
}

{
  const validation = validateCaresActUnemploymentBenefitInput(createDefaultInput());
  assert.equal(validation.isValid, true);
  assert.ok(validation.result);
  assert.equal(
    validation.result.unemploymentCalculatorHref,
    '/tools/unemployment-calculator-unemployment-rate'
  );
}

console.log('cares-act-unemployment-benefit calculation.test.ts: all assertions passed');
