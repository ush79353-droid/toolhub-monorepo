/**
 * Run: cd frontend && npx tsx src/tools/calculators/audit-score/calculation.test.ts
 */
import { calculateAuditScore } from './calculation';
import { createDefaultInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  const r = calculateAuditScore(createDefaultInput());
  assert(r.consumption === 2, `c ${r.consumption}`);
  assert(r.dependence === 0, `d ${r.dependence}`);
  assert(r.harm === 0, `h ${r.harm}`);
  assert(r.total === 2, `t ${r.total}`);
  assert(r.interpretation.includes('2 points'), 'interp');
  assert(r.interpretation.includes('probably do not'), 'low risk copy');
}

{
  // All Never / 1-2 drinks → 0
  const r = calculateAuditScore({
    sex: 'male',
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
    q6: 0,
    q7: 0,
    q8: 0,
    q9: 0,
    q10: 0,
  });
  assert(r.total === 0, 'zero');
}

{
  // Max 40
  const r = calculateAuditScore({
    sex: 'male',
    q1: 4,
    q2: 4,
    q3: 4,
    q4: 4,
    q5: 4,
    q6: 4,
    q7: 4,
    q8: 4,
    q9: 4,
    q10: 4,
  });
  assert(r.total === 40, `max ${r.total}`);
  assert(r.consumption === 12, 'c12');
  assert(r.dependence === 12, 'd12');
  assert(r.harm === 16, 'h16');
}

{
  // Q9/Q10 only take 0/2/4
  const r = calculateAuditScore({
    ...createDefaultInput(),
    q9: 2,
    q10: 4,
  });
  assert(r.harm === 6, `harm ${r.harm}`);
  assert(r.total === 8, `t ${r.total}`);
}

console.log('audit-score calculation.test.ts: ok');
