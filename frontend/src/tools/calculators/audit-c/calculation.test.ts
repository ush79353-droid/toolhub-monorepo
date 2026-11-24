/**
 * Run: cd frontend && npx tsx src/tools/calculators/audit-c/calculation.test.ts
 */
import {
  calculateAuditC,
  computeAuditCScore,
  frequencyPoints,
  positiveThreshold,
} from './calculation';
import { createDefaultInput } from './types';
import { validateAuditCInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

{
  assert(frequencyPoints('') === null, 'unanswered ≠ 0');
  assert(frequencyPoints('never') === 0, 'never is 0');
  assert(positiveThreshold('') === null, 'sex unset');
  assert(positiveThreshold('male') === 4, 'male threshold');
  assert(positiveThreshold('female') === 3, 'female threshold');
}

{
  assert(computeAuditCScore(1, 1, 0) === 2, 'subtotal');
  assert(computeAuditCScore(4, 4, 4) === 12, 'max');
}

{
  const blank = calculateAuditC(createDefaultInput());
  assert(blank.score == null, 'blank result');
}

{
  const partial = calculateAuditC({
    sex: 'male',
    frequency: 'never',
    quantity: '',
    binge: 'never',
  });
  assert(partial.score == null, 'partial unanswered');
}

{
  const r = calculateAuditC({
    sex: 'male',
    frequency: 'monthly_or_less',
    quantity: 'three_or_four',
    binge: 'never',
  });
  assert(r.score === 2, `male 2 ${r.score}`);
  assert(r.screenBand === 'negative', 'male 2 negative');
}

{
  const r = calculateAuditC({
    sex: 'male',
    frequency: 'two_to_four_month',
    quantity: 'three_or_four',
    binge: 'less_than_monthly',
  });
  // 2+1+1 = 4 → positive for men
  assert(r.score === 4, `male 4 ${r.score}`);
  assert(r.screenBand === 'positive', 'male 4 positive');
}

{
  const r = calculateAuditC({
    sex: 'female',
    frequency: 'monthly_or_less',
    quantity: 'three_or_four',
    binge: 'never',
  });
  // 1+1+0 = 2 → negative for women (<3)
  assert(r.score === 2, `female 2 ${r.score}`);
  assert(r.screenBand === 'negative', 'female 2 negative');
}

{
  const r = calculateAuditC({
    sex: 'female',
    frequency: 'monthly_or_less',
    quantity: 'three_or_four',
    binge: 'less_than_monthly',
  });
  // 1+1+1 = 3 → positive for women
  assert(r.score === 3, `female 3 ${r.score}`);
  assert(r.screenBand === 'positive', 'female 3 positive');
}

{
  const v = validateAuditCInput(createDefaultInput());
  assert(v.result != null && v.result.score == null, 'validate blank');
}

console.log('audit-c calculation.test.ts: ok');
