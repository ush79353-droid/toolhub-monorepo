import assert from 'node:assert/strict';
import { decideActivation, type ActivationInput } from './activation';

function input(overrides: Partial<ActivationInput> = {}): ActivationInput {
  return {
    componentKey: 'LoanCalculator',
    registered: true,
    hasCalculatorModule: true,
    isActive: true,
    adminDisabled: false,
    embedEnabled: true,
    ...overrides,
  };
}

{
  const decision = decideActivation(input());
  assert.equal(decision.eligibleToActivate, true);
  assert.equal(decision.publicRoute, true);
  assert.equal(decision.embed, true);
  assert.equal(decision.reason, 'active');
}

{
  const decision = decideActivation(input({ hasCalculatorModule: false, isActive: false }));
  assert.equal(decision.reason, 'missing-component');
  assert.equal(decision.publicRoute, false);
}

{
  const decision = decideActivation(input({ registered: false, isActive: true }));
  assert.equal(decision.reason, 'missing-registry-key');
  assert.equal(decision.publicRoute, false);
}

{
  const decision = decideActivation(input({ componentKey: '', isActive: true }));
  assert.equal(decision.reason, 'missing-component-key');
  assert.equal(decision.publicRoute, false);
}

{
  const decision = decideActivation(input({ adminDisabled: true, isActive: false }));
  assert.equal(decision.reason, 'admin-disabled');
  assert.equal(decision.eligibleToActivate, false);
}

{
  const decision = decideActivation(input({ isActive: false }));
  assert.equal(decision.reason, 'ready-to-activate');
  assert.equal(decision.eligibleToActivate, true);
  assert.equal(decision.publicRoute, false);
}

{
  const decision = decideActivation(input({ embedEnabled: false }));
  assert.equal(decision.publicRoute, true);
  assert.equal(decision.embed, false);
}

{
  const decision = decideActivation(input({ embedEnabled: undefined }));
  assert.equal(decision.embed, true);
}

console.log('activation eligibility tests passed');
