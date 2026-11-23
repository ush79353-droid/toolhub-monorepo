import {
  eroaCm2,
  pisaFlowMlPerS,
  regurgitantVolumeMl,
} from './calculation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}
function approx(a: number, b: number, eps = 0.02): boolean {
  return Math.abs(a - b) <= eps;
}

const flow = pisaFlowMlPerS(1, 40)!;
assert(approx(flow, 251.33, 0.01), `flow ${flow}`);
const eroa = eroaCm2(flow, 500)!;
assert(approx(eroa, 0.503, 0.001), `eroa ${eroa}`);
const rvol = regurgitantVolumeMl(eroa, 100)!;
assert(approx(rvol, 50.27, 0.02), `rvol ${rvol}`);

assert(pisaFlowMlPerS(0, 40) == null, 'r=0');
assert(eroaCm2(251, 0) == null, 'vmax=0');

console.log('eroa-mitral-regurgitation calculation.test.ts: ok');
