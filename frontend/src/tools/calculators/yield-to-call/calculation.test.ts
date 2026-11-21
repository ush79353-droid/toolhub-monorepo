import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateYTC,
  calculateYieldToCallFromInput,
  callPriceFromYield,
  formatPercent,
} from './calculation';
import { createExampleInput, type YieldToCallInput } from './types';
import { validateYieldToCallInput } from './validation';

function base(patch: Partial<YieldToCallInput> = {}): YieldToCallInput {
  return { ...createExampleInput(), ...patch };
}

describe('yield to call', () => {
  it('Test 1: discount to call ≈ 9.30%', () => {
    const calc = calculateYTC({
      annualInterest: 80,
      callPrice: 1000,
      marketPrice: 950,
      yearsUntilCall: 5,
    });
    assert.ok(calc);
    assert.ok(Math.abs(calc.yieldToCallPercent - 9.295328) < 0.01);
    assert.equal(formatPercent(calc.yieldToCallPercent), '9.30%');
    const r = calculateYieldToCallFromInput(createExampleInput());
    assert.ok(r);
    assert.equal(r.relation, 'discount');
  });

  it('Test 2: par to call → YTC = C/Call', () => {
    const calc = calculateYTC({
      annualInterest: 100,
      callPrice: 1000,
      marketPrice: 1000,
      yearsUntilCall: 10,
    });
    assert.ok(calc);
    assert.ok(Math.abs(calc.yieldToCallPercent - 10) < 1e-8);
  });

  it('Test 3: premium to call → YTC below current yield', () => {
    const calc = calculateYTC({
      annualInterest: 80,
      callPrice: 1000,
      marketPrice: 1050,
      yearsUntilCall: 5,
    });
    assert.ok(calc);
    assert.ok(calc.yieldToCallPercent < (80 / 1050) * 100);
    const r = calculateYieldToCallFromInput(
      base({ marketPrice: '1050' }),
    );
    assert.ok(r);
    assert.equal(r.relation, 'premium');
  });

  it('Test 4: zero coupon closed form', () => {
    const calc = calculateYTC({
      annualInterest: 0,
      callPrice: 1000,
      marketPrice: 900,
      yearsUntilCall: 5,
    });
    assert.ok(calc);
    const expected = (Math.pow(1000 / 900, 1 / 5) - 1) * 100;
    assert.ok(Math.abs(calc.yieldToCallPercent - expected) < 1e-10);
  });

  it('Test 5: price round-trip at solved yield', () => {
    const calc = calculateYTC({
      annualInterest: 80,
      callPrice: 1000,
      marketPrice: 950,
      yearsUntilCall: 5,
    });
    assert.ok(calc);
    const px = callPriceFromYield({
      callPrice: 1000,
      yieldAnnual: calc.yieldToCallPercent / 100,
      yearsUntilCall: 5,
      annualInterest: 80,
    });
    assert.ok(px !== null);
    assert.ok(Math.abs(px! - 950) < 1e-6);
  });

  it('Test 6: fractional years rejected', () => {
    assert.equal(
      calculateYTC({
        annualInterest: 80,
        callPrice: 1000,
        marketPrice: 950,
        yearsUntilCall: 2.5,
      }),
      null,
    );
    const v = validateYieldToCallInput(base({ yearsUntilCall: '2.5' }));
    assert.equal(v.isValid, false);
    assert.ok(v.errors.yearsUntilCall);
  });

  it('Test 7: non-positive market price invalid', () => {
    const v = validateYieldToCallInput(base({ marketPrice: '0' }));
    assert.equal(v.isValid, false);
    assert.ok(v.errors.marketPrice);
  });

  it('Test 8: empty inputs invalid', () => {
    const v = validateYieldToCallInput({
      currency: 'PKR',
      annualInterest: '',
      callPrice: '',
      marketPrice: '',
      yearsUntilCall: '',
    });
    assert.equal(v.isValid, false);
    assert.equal(v.result, null);
  });
});
