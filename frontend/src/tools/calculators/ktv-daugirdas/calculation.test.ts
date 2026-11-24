import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  daugirdasKtv,
  urrPercentFromR,
} from './calculation';
import { createEmptyInput } from './types';
import { validateKtvDaugirdasInput } from './validation';

describe('ktv-daugirdas', () => {
  it('URR 70% for 60→18 mg/dL', () => {
    assert.equal(urrPercentFromR(18 / 60), 70);
  });

  it('Daugirdas Kt/V published-style case 60→18, t=4, UF=2.5, W=70', () => {
    const r = 18 / 60;
    const ktv = daugirdasKtv(r, 4, 2.5, 70);
    assert.ok(ktv != null);
    // −ln(0.3 − 0.032) + (4 − 3.5×0.3)×(2.5/70)
    const expected =
      -Math.log(0.3 - 0.032) + (4 - 3.5 * 0.3) * (2.5 / 70);
    assert.ok(Math.abs(ktv! - expected) < 1e-12);
    assert.ok(ktv! > 1.2 && ktv! < 1.5);
  });

  it('rejects nonpositive pre-BUN', () => {
    const { result, errors } = validateKtvDaugirdasInput({
      ...createEmptyInput(),
      preBun: '0',
      postBun: '18',
      ultrafiltrate: '2',
      postWeight: '70',
    });
    assert.equal(result, null);
    assert.ok(errors.preBun);
  });

  it('rejects ln domain failure', () => {
    const { result, errors } = validateKtvDaugirdasInput({
      ...createEmptyInput(),
      preBun: '10',
      postBun: '1',
      duration: '20',
      ultrafiltrate: '1',
      postWeight: '70',
    });
    // R=0.1; 0.1 − 0.008×20 = −0.06 → undefined
    assert.equal(result, null);
    assert.ok(errors.form);
  });
});
