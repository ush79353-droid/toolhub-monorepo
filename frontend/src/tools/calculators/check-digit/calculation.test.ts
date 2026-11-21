import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateCheckDigitFromInput,
  calculateGS1CheckDigit,
  generateCompleteGTIN,
  validateGTIN,
} from './calculation';
import { createExampleInput, type CheckDigitInput } from './types';
import { validateCheckDigitInput } from './validation';

function base(patch: Partial<CheckDigitInput> = {}): CheckDigitInput {
  return { ...createExampleInput(), ...patch };
}

describe('check digit calculator', () => {
  it('Test 1: EAN-13 400638133393 → 1', () => {
    const calc = calculateGS1CheckDigit('400638133393');
    assert.ok(calc);
    assert.equal(calc.checkDigit, '1');
    assert.equal(calc.weightedSum, 89);
    const r = generateCompleteGTIN('400638133393', 'GTIN-13');
    assert.ok(r);
    assert.equal(r.completeGTIN, '4006381333931');
  });

  it('Test 2: UPC-A 03600029145 → 2', () => {
    const calc = calculateGS1CheckDigit('03600029145');
    assert.ok(calc);
    assert.equal(calc.checkDigit, '2');
    const r = generateCompleteGTIN('03600029145', 'GTIN-12');
    assert.ok(r);
    assert.equal(r.completeGTIN, '036000291452');
  });

  it('Test 3: EAN-8 9638507 → 4', () => {
    const calc = calculateGS1CheckDigit('9638507');
    assert.ok(calc);
    assert.equal(calc.checkDigit, '4');
    const r = generateCompleteGTIN('9638507', 'GTIN-8');
    assert.ok(r);
    assert.equal(r.completeGTIN, '96385074');
  });

  it('Test 4: GTIN-14 1001234567890 → 2', () => {
    const calc = calculateGS1CheckDigit('1001234567890');
    assert.ok(calc);
    assert.equal(calc.checkDigit, '2');
    const r = generateCompleteGTIN('1001234567890', 'GTIN-14');
    assert.ok(r);
    assert.equal(r.completeGTIN, '10012345678902');
  });

  it('Test 5: all-zero payload → check digit 0', () => {
    const calc = calculateGS1CheckDigit('000000000000');
    assert.ok(calc);
    assert.equal(calc.checkDigit, '0');
  });

  it('Test 6: invalid characters rejected', () => {
    const v = validateCheckDigitInput(base({ code: '123ABC456' }));
    assert.equal(v.isValid, false);
    assert.ok(v.errors.code);
  });

  it('Test 7: invalid length for GTIN-13', () => {
    const v = validateCheckDigitInput(
      base({ code: '12345', format: 'GTIN-13', leadingZeros: '0' }),
    );
    assert.equal(v.isValid, false);
  });

  it('Test 8: leading zeros pad UPC-A payload', () => {
    const r = calculateCheckDigitFromInput(
      base({
        code: '3600029145',
        leadingZeros: '1',
        format: 'GTIN-12',
      }),
    );
    assert.ok(r);
    assert.equal(r.paddedPayload, '03600029145');
    assert.equal(r.checkDigit, '2');
    assert.equal(r.completeGTIN, '036000291452');
  });

  it('Test 9: valid existing barcode', () => {
    assert.equal(validateGTIN('4006381333931'), true);
    const v = validateCheckDigitInput({
      mode: 'validate',
      leadingZeros: '0',
      code: '',
      format: 'auto',
      completeCode: '4006381333931',
    });
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result.isValid, true);
  });

  it('Test 10: invalid existing barcode expects 1', () => {
    assert.equal(validateGTIN('4006381333932'), false);
    const v = validateCheckDigitInput({
      mode: 'validate',
      leadingZeros: '0',
      code: '',
      format: 'GTIN-13',
      completeCode: '4006381333932',
    });
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result.isValid, false);
    assert.equal(v.result.expectedCheckDigit, '1');
    assert.equal(v.result.suppliedCheckDigit, '2');
  });

  it('example input produces EAN-13 check digit 1', () => {
    const v = validateCheckDigitInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result.checkDigit, '1');
    assert.equal(v.result.completeGTIN, '4006381333931');
  });

  it('rejects scientific notation and decimals', () => {
    assert.equal(validateCheckDigitInput(base({ code: '1e10' })).isValid, false);
    assert.equal(
      validateCheckDigitInput(base({ code: '12.34' })).isValid,
      false,
    );
  });
});
