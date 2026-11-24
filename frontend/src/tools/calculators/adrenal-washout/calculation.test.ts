/**
 * Run: npx tsx calculation.test.ts
 */
import {
  absoluteWashoutPercent,
  calculateAdrenalWashout,
  relativeWashoutPercent,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAdrenalWashoutInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const r = calculateAdrenalWashout(createDefaultInput());
  assert(r.absoluteWashoutPercent === null, 'blank absolute empty');
  assert(r.relativeWashoutPercent === null, 'blank relative empty');
}

{
  // Applied / Radiopaedia-style triad check
  const apw = absoluteWashoutPercent(30, 70, 29);
  const rpw = relativeWashoutPercent(70, 29);
  assert(Math.abs(apw - 102.5) < 1e-9, `APW expected 102.5 got ${apw}`);
  assert(Math.abs(rpw - (41 / 70) * 100) < 1e-9, `RPW mismatch ${rpw}`);
}

{
  const r = calculateAdrenalWashout({
    preContrastHuText: '30',
    enhancedHuText: '70',
    delayedHuText: '29',
  });
  assert(r.absoluteWashoutPercent !== null, 'APW present');
  assert(r.relativeWashoutPercent !== null, 'RPW present');
  assert(r.absoluteSuggestsAdenoma === true, 'APW > 60');
  assert(r.relativeSuggestsAdenoma === true, 'RPW > 40');
  assert(r.formattedAbsolute === '102.5', `fmt APW ${r.formattedAbsolute}`);
}

{
  let threw = false;
  try {
    absoluteWashoutPercent(50, 50, 20);
  } catch {
    threw = true;
  }
  assert(threw, 'zero APW denom guarded');
}

{
  const r = calculateAdrenalWashout({
    preContrastHuText: '50',
    enhancedHuText: '50',
    delayedHuText: '20',
  });
  assert(r.absoluteWashoutPercent === null, 'APW null on zero denom');
  assert(r.relativeWashoutPercent !== null, 'RPW still available');
}

{
  const v = validateAdrenalWashoutInput({
    preContrastHuText: 'abc',
    enhancedHuText: '70',
    delayedHuText: '29',
  });
  assert(v.errors.preContrastHuText, 'invalid pre HU');
  assert(v.result === null, 'no result on field error');
}

console.log('adrenal-washout calculation.test.ts: ok');
