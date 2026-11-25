import {
  calculateDirectQpQs,
  calculateEchoQpQs,
  calculateFickQpQs,
} from './calculation';
import {
  createDirectExampleInput,
  createEchoExampleInput,
  createEmptyInput,
  createFickExampleInput,
} from './types';
import { validateQpQsInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const echoEqual = calculateEchoQpQs(createEchoExampleInput());
assert(Math.abs(echoEqual - 1) < 1e-9, `echo equal flows ${echoEqual}`);

const fickEqual = calculateFickQpQs(createFickExampleInput());
assert(Math.abs(fickEqual - 1) < 1e-9, `fick equal step-up ${fickEqual}`);

const directEqual = calculateDirectQpQs(createDirectExampleInput());
assert(Math.abs(directEqual - 1) < 1e-9, `direct equal ${directEqual}`);

assert(validateQpQsInput(createEmptyInput()).result === null, 'blank echo');

const zeroLvot = {
  ...createEchoExampleInput(),
  lvotDiameter: 0,
};
assert(validateQpQsInput(zeroLvot).result === null, 'zero LVOT diameter');

const zeroPulmonaryStep = {
  ...createFickExampleInput(),
  pulmonaryVenousContent: 15,
  pulmonaryArterialContent: 15,
};
assert(
  validateQpQsInput(zeroPulmonaryStep).result === null,
  'zero fick pulmonary step',
);

const zeroQs = { ...createDirectExampleInput(), qsFlow: 0 };
assert(validateQpQsInput(zeroQs).result === null, 'zero Qs');

console.log('qpqs calculation.test.ts: ok');