/**
 * Run: cd frontend && npx tsx src/tools/calculators/kidney-stone-pcnl/calculation.test.ts
 */
import {
  calculateKidneyStonePcnl,
  scoreComponents,
  stoneFreePercentForScore,
} from './calculation';
import { createDefaultInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const d = createDefaultInput();
  const parts = scoreComponents(d);
  assert(parts.total === 5, `default total ${parts.total}`);
  const r = calculateKidneyStonePcnl(d);
  assert(r.stoneFreePercent === 94, `default pct ${r.stoneFreePercent}`);
  assert(r.explanation.includes('94%'), 'expl 94');
  assert(r.explanation.includes('nephrolithotomy'), 'spelling');
}

{
  // One-at-a-time size bump → +1
  const r = calculateKidneyStonePcnl({
    ...createDefaultInput(),
    stoneSize: 's400_799',
  });
  assert(r.totalScore === 6, `size2 ${r.totalScore}`);
  assert(r.stoneFreePercent === 92, 'pct 92');
}

{
  const r = calculateKidneyStonePcnl({
    ...createDefaultInput(),
    tractLength: 'gt100',
  });
  assert(r.totalScore === 6, 'tract');
}

{
  const r = calculateKidneyStonePcnl({
    ...createDefaultInput(),
    obstruction: 'moderate_severe',
  });
  assert(r.totalScore === 6, 'obst');
}

{
  const r = calculateKidneyStonePcnl({
    ...createDefaultInput(),
    calyces: 'staghorn',
  });
  assert(r.totalScore === 7, 'staghorn +2');
  assert(r.stoneFreePercent === 88, 'pct 88');
}

{
  const r = calculateKidneyStonePcnl({
    ...createDefaultInput(),
    density: 'gt950',
  });
  assert(r.totalScore === 6, 'density');
}

{
  // Highest burden
  const r = calculateKidneyStonePcnl({
    stoneSize: 's1600_plus',
    tractLength: 'gt100',
    obstruction: 'moderate_severe',
    calyces: 'staghorn',
    density: 'gt950',
  });
  assert(r.totalScore === 13, `max ${r.totalScore}`);
  assert(r.stoneFreePercent === 27, 'pct 27');
}

{
  assert(stoneFreePercentForScore(8) === 83, '8');
  assert(stoneFreePercentForScore(9) === 64, '9');
  assert(stoneFreePercentForScore(10) === 42, '10');
  assert(stoneFreePercentForScore(11) === 27, '11');
  assert(stoneFreePercentForScore(12) === 27, '12');
}

console.log('kidney-stone-pcnl calculation.test.ts: ok');
