/**
 * Self-check: npx tsx calculation.test.ts
 */
import {
  buildCycleResult,
  ovulationOffsetFromCycleStart,
} from './calculation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(ovulationOffsetFromCycleStart(28) === 13, '28d → +13 calendar days');

const c0 = buildCycleResult('2026-01-01', 0, 28);
assert(c0.ovulationIso === '2026-01-14', `ov ${c0.ovulationIso}`);
assert(c0.fertileStartIso === '2026-01-09', `fs ${c0.fertileStartIso}`);
assert(c0.fertileEndIso === '2026-01-14', `fe ${c0.fertileEndIso}`);
// conception 2026-01-14 + 266 = 2026-10-07
assert(c0.dueDateIso === '2026-10-07', `edd ${c0.dueDateIso}`);

const c1 = buildCycleResult('2026-01-01', 1, 28);
assert(c1.cycleStartIso === '2026-01-29', `c1 start ${c1.cycleStartIso}`);
assert(c1.ovulationIso === '2026-02-11', `c1 ov ${c1.ovulationIso}`);

// Leap year: LMP 2024-02-01 · 28d → ov 2024-02-14
const leap = buildCycleResult('2024-02-01', 0, 28);
assert(leap.ovulationIso === '2024-02-14', `leap ${leap.ovulationIso}`);

console.log('ovulation calculation.test.ts: ok');
