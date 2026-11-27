/**
 * Run: cd frontend && npx tsx src/tools/calculators/iv-flow-rate/calculation.test.ts
 */
import {
  calculateIvFlow,
  dropsPerMinute,
  flowMlPerMin,
  formatFlowDisplay,
} from './calculation';
import { createDefaultInput } from './types';
import { validateIvFlowInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  // 500 mL / 4 h at 20 gtts/mL
  const flow = flowMlPerMin(500, 240);
  assert(Math.abs(flow - 500 / 240) < 1e-12, `flow ${flow}`);
  const drops = dropsPerMinute(flow, 20);
  assert(Math.abs(drops - (500 / 240) * 20) < 1e-12, `drops ${drops}`);
  assert(Math.abs(formatFlowDisplay(flow, 'mL', 'h') - 125) < 1e-12, 'mL/h');
}

{
  const r = calculateIvFlow({
    dropFactorText: '20',
    volumeText: '500',
    volumeUnit: 'mL',
    timeText: '4',
    timeUnit: 'h',
    flowVolumeUnit: 'mL',
    flowTimeUnit: 'h',
  });
  assert(r.dropsPerMin != null && Math.abs(r.dropsPerMin - 41.6666666667) < 1e-6, 'wired drops');
  assert(r.formattedFlow === '125', `fmtFlow ${r.formattedFlow}`);
}

{
  const v = validateIvFlowInput(createDefaultInput());
  assert(v.result != null && v.result.dropsPerMin == null, 'blank');
}

console.log('iv-flow-rate calculation.test.ts: ok');
