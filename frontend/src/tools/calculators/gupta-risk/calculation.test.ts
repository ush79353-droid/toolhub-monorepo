/**
 * Gupta MICA — assert-based engine check (no test framework).
 * Run: npx tsx src/tools/calculators/gupta-risk/calculation.test.ts
 */
import {
  creatinineToMgDl,
  logOddsToRiskPercent,
  creatinineCategoryCoef,
  CREATININE_HIGH_THRESHOLD_MG_DL,
} from './calculation';
import { createExampleInput } from './types';
import { validateGuptaRiskInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// Creatinine unit conversion
assert(creatinineToMgDl(88.4, 'umolL') === 1, '88.4 µmol/L → 1 mg/dL');
assert(creatinineToMgDl(1.5, 'mgDl') === 1.5, '1.5 mg/dL');

// Threshold categories
assert(creatinineCategoryCoef(false, 1.5) === 0, '1.5 → 0');
assert(creatinineCategoryCoef(false, 1.51) === 0.61, '1.51 → high');
assert(creatinineCategoryCoef(true, null) === -0.1, 'not measured');

// Fixture: age 50, independent, ASA I, creat 1.0, anorectal
{
  const v = validateGuptaRiskInput(createExampleInput());
  assert(v.isValid && v.result != null, 'fixture valid');
  assert(Number.isFinite(v.result!.micaRiskPercent), 'finite %');
  assert(v.result!.micaRiskPercent > 0 && v.result!.micaRiskPercent < 1, 'low risk band');
}

// ASA change moves risk up
{
  const base = validateGuptaRiskInput(createExampleInput());
  const higher = validateGuptaRiskInput({
    ...createExampleInput(),
    asaClass: 'III',
  });
  assert(
    higher.result!.micaRiskPercent > base.result!.micaRiskPercent,
    'ASA III > ASA I'
  );
}

// Blank creatinine withholds
{
  const v = validateGuptaRiskInput({
    ...createExampleInput(),
    creatinineValue: '',
    creatinineNotMeasured: false,
  });
  assert(!v.isValid && v.result == null, 'blank creatinine');
}

// Zero creatinine withholds
{
  const v = validateGuptaRiskInput({
    ...createExampleInput(),
    creatinineValue: '0',
  });
  assert(!v.isValid && v.result == null, 'zero creatinine');
}

// Creatinine threshold in validation path
{
  const low = validateGuptaRiskInput({
    ...createExampleInput(),
    creatinineValue: String(CREATININE_HIGH_THRESHOLD_MG_DL),
  });
  const high = validateGuptaRiskInput({
    ...createExampleInput(),
    creatinineValue: '1.51',
  });
  assert(high.result!.micaRiskPercent > low.result!.micaRiskPercent, 'creat threshold');
}

// Logistic transform sanity
assert(logOddsToRiskPercent(0) === 50, 'L=0 → 50%');
assert(logOddsToRiskPercent(-10) < 1, 'very low');

console.log('gupta-risk calculation.test.ts: ok');