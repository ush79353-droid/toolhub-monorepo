/**
 * Blood Pressure — assert-based engine check (no test framework).
 * Run: npx tsx src/tools/calculators/blood-pressure/calculation.test.ts
 */
import {
  classifyAccAha,
  classifyAccAhaDiastolic,
  classifyAccAhaSystolic,
  classifyEscEsh2018,
  calculateBloodPressure,
} from './calculation';
import { createExampleInput } from './types';
import { validateBloodPressureInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// --- ACC/AHA boundaries ---
assert(classifyAccAha(119, 79) === 'normal', 'ACC normal 119/79');
assert(classifyAccAha(120, 79) === 'elevated', 'ACC elevated 120/79');
assert(classifyAccAha(129, 79) === 'elevated', 'ACC elevated 129/79');
assert(classifyAccAha(120, 80) === 'stage1', 'ACC mixed elevated SBP + stage1 DBP');
assert(classifyAccAha(130, 79) === 'stage1', 'ACC stage1 SBP');
assert(classifyAccAha(139, 89) === 'stage1', 'ACC stage1 upper');
assert(classifyAccAha(140, 80) === 'stage2', 'ACC stage2 SBP');
assert(classifyAccAha(130, 90) === 'stage2', 'ACC stage2 DBP');
assert(classifyAccAha(180, 120) === 'stage2', 'ACC 180/120 still stage2 (not >)');
assert(classifyAccAha(181, 80) === 'severe', 'ACC severe SBP >180');
assert(classifyAccAha(140, 121) === 'severe', 'ACC severe DBP >120');
assert(classifyAccAhaSystolic(120) === 'elevated', 'sys band');
assert(classifyAccAhaDiastolic(79) === 'normal', 'dia band <80');

// Higher category when mixed
assert(classifyAccAha(125, 95) === 'stage2', 'mixed elevated+stage2 → stage2');
assert(classifyAccAha(135, 75) === 'stage1', 'stage1 SBP + normal DBP');

// --- ESC/ESH 2018 boundaries ---
assert(classifyEscEsh2018(119, 79) === 'optimal', 'ESC optimal');
assert(classifyEscEsh2018(120, 79) === 'normal', 'ESC normal SBP');
assert(classifyEscEsh2018(119, 80) === 'normal', 'ESC normal DBP');
assert(classifyEscEsh2018(129, 84) === 'normal', 'ESC normal upper');
assert(classifyEscEsh2018(130, 84) === 'highNormal', 'ESC high normal SBP');
assert(classifyEscEsh2018(129, 85) === 'highNormal', 'ESC high normal DBP');
assert(classifyEscEsh2018(140, 90) === 'grade1', 'ESC grade1 both');
assert(classifyEscEsh2018(159, 99) === 'grade1', 'ESC grade1 upper');
assert(classifyEscEsh2018(160, 90) === 'grade2', 'ESC grade2');
assert(classifyEscEsh2018(180, 110) === 'grade3', 'ESC grade3 inclusive');
assert(classifyEscEsh2018(150, 80) === 'ishGrade1', 'ESC ISH grade1');
assert(classifyEscEsh2018(170, 85) === 'ishGrade2', 'ESC ISH grade2');
assert(classifyEscEsh2018(185, 70) === 'ishGrade3', 'ESC ISH grade3');
assert(classifyEscEsh2018(135, 95) === 'grade1', 'ESC high-normal SBP + grade1 DBP');

// Validation inactive until both filled
{
  const v = validateBloodPressureInput({
    guideline: 'accAha',
    systolic: '',
    diastolic: '',
  });
  assert(!v.isValid && v.result == null, 'blank inactive');
}

{
  const v = validateBloodPressureInput({
    guideline: 'accAha',
    systolic: '120',
    diastolic: '',
  });
  assert(!v.isValid && v.errors.diastolic, 'needs diastolic');
}

{
  const v = validateBloodPressureInput(createExampleInput());
  assert(v.isValid && v.result != null, 'example valid');
  assert(v.result!.categoryId === 'normal', 'example normal');
  assert(v.result!.readingLabel === '118/76 mmHg', 'reading label');
}

// Inconsistent order flagged but still categorized
{
  const v = validateBloodPressureInput({
    guideline: 'accAha',
    systolic: '80',
    diastolic: '120',
  });
  assert(v.isValid && v.result != null, 'inconsistent still computes');
  assert(v.result!.inconsistentOrder, 'flag order');
  assert(v.errors.form, 'form warning');
  assert(v.result!.categoryId === 'stage1' || v.result!.categoryId === 'stage2' || v.result!.categoryId === 'severe', 'has category');
}

// Negative / zero rejected
{
  const v = validateBloodPressureInput({
    guideline: 'accAha',
    systolic: '0',
    diastolic: '80',
  });
  assert(!v.isValid && v.errors.systolic, 'zero systolic rejected');
}

{
  const r = calculateBloodPressure({ guideline: 'escEsh2018' }, 145, 88);
  assert(r.categoryId === 'ishGrade1', 'calc ISH');
  assert(r.guidelineLabel.includes('ESC/ESH'), 'label');
}

console.log('blood-pressure calculation.test.ts: ok');
