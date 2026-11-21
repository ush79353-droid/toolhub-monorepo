import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateCobbDouglas,
  classifyReturnsToScale,
  formatOutput,
  formatReturnsToScaleLabel,
} from './calculation';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
} from './types';
import { validateCobbDouglasInput } from './validation';

describe('calculateCobbDouglas', () => {
  it('worked example A=2 L=100 K=50 α=0.6 β=0.4 → Y≈151.57', () => {
    const r = calculateCobbDouglas(2, 100, 0.6, 50, 0.4)!;
    assert.ok(Math.abs(r.totalProduction - 151.5716565) < 1e-4);
    assert.ok(Math.abs(r.returnsToScaleSum - 1) < 1e-12);
    assert.equal(r.returnsToScaleType, 'constant');
    assert.ok(
      Math.abs((r.marginalProductOfLabor ?? 0) - 0.6 * (r.totalProduction / 100)) <
        1e-12
    );
    assert.ok(
      Math.abs((r.marginalProductOfCapital ?? 0) - 0.4 * (r.totalProduction / 50)) <
        1e-12
    );
  });

  it('increasing returns α+β>1', () => {
    const r = calculateCobbDouglas(1, 10, 0.7, 10, 0.5)!;
    assert.equal(r.returnsToScaleType, 'increasing');
  });

  it('decreasing returns α+β<1', () => {
    const r = calculateCobbDouglas(1, 10, 0.3, 10, 0.4)!;
    assert.equal(r.returnsToScaleType, 'decreasing');
  });

  it('fractional inputs', () => {
    const r = calculateCobbDouglas(1.5, 2.5, 0.5, 3.5, 0.5)!;
    assert.ok(Number.isFinite(r.totalProduction));
    assert.ok(r.totalProduction > 0);
  });

  it('zero labor → Y=0 when α>0; MPL/APL null', () => {
    const r = calculateCobbDouglas(2, 0, 0.6, 50, 0.4)!;
    assert.equal(r.totalProduction, 0);
    assert.equal(r.marginalProductOfLabor, null);
    assert.equal(r.averageProductOfLabor, null);
    assert.ok(r.marginalProductOfCapital != null);
  });

  it('zero capital → Y=0 when β>0; MPK/APK null', () => {
    const r = calculateCobbDouglas(2, 100, 0.6, 0, 0.4)!;
    assert.equal(r.totalProduction, 0);
    assert.equal(r.marginalProductOfCapital, null);
    assert.ok(r.marginalProductOfLabor != null);
  });

  it('negative labor → null', () => {
    assert.equal(calculateCobbDouglas(1, -1, 0.5, 10, 0.5), null);
  });

  it('negative capital → null', () => {
    assert.equal(calculateCobbDouglas(1, 10, 0.5, -1, 0.5), null);
  });

  it('non-positive productivity → null', () => {
    assert.equal(calculateCobbDouglas(0, 10, 0.5, 10, 0.5), null);
    assert.equal(calculateCobbDouglas(-1, 10, 0.5, 10, 0.5), null);
  });

  it('non-positive elasticity → null', () => {
    assert.equal(calculateCobbDouglas(1, 10, 0, 10, 0.5), null);
    assert.equal(calculateCobbDouglas(1, 10, 0.5, 10, -0.1), null);
  });

  it('very small positive values remain finite', () => {
    const r = calculateCobbDouglas(1e-6, 1e-3, 0.5, 1e-3, 0.5)!;
    assert.ok(Number.isFinite(r.totalProduction));
  });

  it('elasticity > 1 allowed in math', () => {
    const r = calculateCobbDouglas(1, 2, 1.2, 2, 0.5)!;
    assert.ok(r.totalProduction > 0);
    assert.equal(r.returnsToScaleType, 'increasing');
  });
});

describe('classifyReturnsToScale', () => {
  it('tolerance around 1', () => {
    assert.equal(classifyReturnsToScale(1), 'constant');
    assert.equal(classifyReturnsToScale(1 + 1e-12), 'constant');
    assert.equal(classifyReturnsToScale(1.01), 'increasing');
    assert.equal(classifyReturnsToScale(0.99), 'decreasing');
  });
});

describe('validateCobbDouglasInput', () => {
  it('defaults incomplete → invalid', () => {
    assert.equal(validateCobbDouglasInput(createDefaultInput()).isValid, false);
  });

  it('empty → invalid', () => {
    assert.equal(validateCobbDouglasInput(createEmptyInput()).isValid, false);
  });

  it('example → ≈151.57 constant RTS', () => {
    const v = validateCobbDouglasInput(createExampleInput());
    assert.equal(v.isValid, true);
    assert.equal(v.result!.formattedTotalProduction, formatOutput(v.result!.totalProduction));
    assert.ok(Math.abs(v.result!.totalProduction - 151.57) < 0.01);
    assert.equal(v.result!.returnsToScaleType, 'constant');
    assert.equal(
      v.result!.formattedReturnsToScaleType,
      formatReturnsToScaleLabel('constant')
    );
    assert.match(v.result!.formattedMPL ?? '', /0\.909/);
    assert.match(v.result!.formattedMPK ?? '', /1\.212/);
  });

  it('negative labor → invalid', () => {
    const v = validateCobbDouglasInput({
      ...createExampleInput(),
      labor: '-5',
    });
    assert.equal(v.isValid, false);
  });

  it('missing capital → invalid', () => {
    const v = validateCobbDouglasInput({
      ...createExampleInput(),
      capital: '',
    });
    assert.equal(v.isValid, false);
  });

  it('α > 1 warns but calculates', () => {
    const v = validateCobbDouglasInput({
      ...createExampleInput(),
      laborElasticity: '1.2',
      capitalElasticity: '0.3',
    });
    assert.equal(v.isValid, true);
    assert.match(v.result!.warningMessage ?? '', /nonstandard/i);
  });

  it('zero productivity → invalid', () => {
    const v = validateCobbDouglasInput({
      ...createExampleInput(),
      totalFactorProductivity: '0',
    });
    assert.equal(v.isValid, false);
  });
});
