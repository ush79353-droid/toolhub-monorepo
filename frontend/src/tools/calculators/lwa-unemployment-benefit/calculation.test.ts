import assert from 'node:assert/strict';
import {
  buildLwaUnemploymentNoticeSummary,
  getLoanCalculatorHref,
} from './calculation';
import { createDefaultInput, LOAN_CALCULATOR_HREF } from './types';
import { validateLwaUnemploymentBenefitInput } from './validation';

{
  const href = getLoanCalculatorHref();
  assert.equal(href, '/tools/loan-calculator');
  assert.equal(href, LOAN_CALCULATOR_HREF);
}

{
  const summary = buildLwaUnemploymentNoticeSummary(
    'Unemployment Benefit Calculator - Lost Wages Assistance (LWA)'
  );
  assert.match(summary, /FEMA/);
  assert.match(summary, /presidential memorandum/i);
  assert.match(summary, /not an enacted/);
  assert.match(summary, /CARES Act/);
  assert.match(summary, /December 27, 2020/);
  assert.match(summary, /not available for current claims/);
  assert.match(summary, /loan-calculator/);
  assert.doesNotMatch(summary, /\$\d/);
  assert.doesNotMatch(summary, /eligible for \$|weekly benefit of/i);
  assert.doesNotMatch(summary, /LWA Act was introduced/i);
}

{
  const validation = validateLwaUnemploymentBenefitInput(createDefaultInput());
  assert.equal(validation.isValid, true);
  assert.ok(validation.result);
  assert.equal(validation.result.loanCalculatorHref, '/tools/loan-calculator');
}

console.log('lwa-unemployment-benefit calculation.test.ts: all assertions passed');
