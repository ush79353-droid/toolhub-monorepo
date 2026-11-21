import assert from 'node:assert/strict';
import {
  buildHealsHeroesUnemploymentNoticeSummary,
  getAnnualSalaryCalculatorHref,
} from './calculation';
import { createDefaultInput, ANNUAL_SALARY_CALCULATOR_HREF } from './types';
import { validateHealsHeroesUnemploymentBenefitInput } from './validation';

{
  const href = getAnnualSalaryCalculatorHref();
  assert.equal(href, '/tools/annual-salary-calculator');
  assert.equal(href, ANNUAL_SALARY_CALCULATOR_HREF);
}

{
  const summary = buildHealsHeroesUnemploymentNoticeSummary(
    'Unemployment Benefit Calculator - HEALS Act vs. HEROES Act'
  );
  assert.match(summary, /HEALS/);
  assert.match(summary, /HEROES/);
  assert.match(summary, /legislative proposals/);
  assert.match(summary, /not active claim programs/);
  assert.match(summary, /no longer applicable/);
  assert.match(summary, /annual-salary-calculator/);
  assert.doesNotMatch(summary, /\$\d/);
  assert.doesNotMatch(summary, /you can claim today|apply for HEALS|apply for HEROES/i);
}

{
  const validation = validateHealsHeroesUnemploymentBenefitInput(createDefaultInput());
  assert.equal(validation.isValid, true);
  assert.ok(validation.result);
  assert.equal(
    validation.result.annualSalaryCalculatorHref,
    '/tools/annual-salary-calculator'
  );
}

console.log('heals-heroes-unemployment-benefit calculation.test.ts: all assertions passed');
