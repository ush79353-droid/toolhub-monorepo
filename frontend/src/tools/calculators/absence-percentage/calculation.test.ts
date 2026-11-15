import assert from 'node:assert/strict';
import {
  buildAbsencePercentageResult,
  calculateAbsenteeismRate,
  formatAbsenteeismRate,
} from './calculation';
import { parseWholeNumber, validateAbsencePercentageDraft } from './validation';

// Reference example: 10 employees × 20 workdays, 8 absent → 4%
{
  const rate = calculateAbsenteeismRate({
    totalEmployees: 10,
    totalWorkdays: 20,
    totalDaysAbsent: 8,
  });
  assert.equal(rate, 4);
  assert.equal(formatAbsenteeismRate(rate), '4%');
  const result = buildAbsencePercentageResult({
    totalEmployees: 10,
    totalWorkdays: 20,
    totalDaysAbsent: 8,
  });
  assert.ok(result);
  assert.equal(result!.availableEmployeeWorkdays, 200);
  assert.equal(result!.rateDisplay, '4%');
  assert.equal(result!.summaryLine, 'Absenteeism rate: 4%');
}

// Zero absences → 0%
{
  const rate = calculateAbsenteeismRate({
    totalEmployees: 10,
    totalWorkdays: 20,
    totalDaysAbsent: 0,
  });
  assert.equal(rate, 0);
  assert.equal(formatAbsenteeismRate(rate), '0%');
}

// Maximum valid absences → 100%
{
  const rate = calculateAbsenteeismRate({
    totalEmployees: 10,
    totalWorkdays: 20,
    totalDaysAbsent: 200,
  });
  assert.equal(rate, 100);
  assert.equal(formatAbsenteeismRate(rate), '100%');
}

// Zero denominators → NaN (UI must not display)
{
  assert.ok(
    Number.isNaN(
      calculateAbsenteeismRate({
        totalEmployees: 0,
        totalWorkdays: 20,
        totalDaysAbsent: 0,
      })
    )
  );
  assert.ok(
    Number.isNaN(
      calculateAbsenteeismRate({
        totalEmployees: 10,
        totalWorkdays: 0,
        totalDaysAbsent: 0,
      })
    )
  );
  assert.equal(
    buildAbsencePercentageResult({
      totalEmployees: 0,
      totalWorkdays: 20,
      totalDaysAbsent: 0,
    }),
    null
  );
}

// Decimal rate formatting
{
  assert.equal(
    formatAbsenteeismRate(
      calculateAbsenteeismRate({
        totalEmployees: 3,
        totalWorkdays: 20,
        totalDaysAbsent: 1,
      })
    ),
    '1.67%'
  );
  assert.equal(formatAbsenteeismRate(Number.NaN), '');
  assert.equal(formatAbsenteeismRate(Number.POSITIVE_INFINITY), '');
}

// Whole-number parsing
{
  assert.deepEqual(parseWholeNumber('', { allowZero: false, fieldLabel: 'Total employees' }), {
    value: null,
    blank: true,
  });
  assert.equal(
    parseWholeNumber('10', { allowZero: false, fieldLabel: 'Total employees' }).value,
    10
  );
  assert.ok(
    parseWholeNumber('0', { allowZero: false, fieldLabel: 'Total employees' }).error
  );
  assert.equal(
    parseWholeNumber('0', { allowZero: true, fieldLabel: 'Total days absent' }).value,
    0
  );
  assert.ok(
    parseWholeNumber('-1', { allowZero: true, fieldLabel: 'Total days absent' }).error
  );
  assert.ok(
    parseWholeNumber('1.5', { allowZero: false, fieldLabel: 'Total employees' }).error
  );
  assert.ok(
    parseWholeNumber('abc', { allowZero: false, fieldLabel: 'Total employees' }).error
  );
}

// Draft validation: empty / incomplete
{
  const empty = validateAbsencePercentageDraft({
    totalEmployees: '',
    totalWorkdays: '',
    totalDaysAbsent: '',
  });
  assert.equal(empty.isValid, false);
  assert.equal(empty.incomplete, true);
  assert.deepEqual(empty.errors, {});
}

// Draft validation: zero employees / workdays
{
  const zeroEmp = validateAbsencePercentageDraft({
    totalEmployees: '0',
    totalWorkdays: '20',
    totalDaysAbsent: '0',
  });
  assert.equal(zeroEmp.isValid, false);
  assert.ok(zeroEmp.errors.totalEmployees);

  const zeroDays = validateAbsencePercentageDraft({
    totalEmployees: '10',
    totalWorkdays: '0',
    totalDaysAbsent: '0',
  });
  assert.equal(zeroDays.isValid, false);
  assert.ok(zeroDays.errors.totalWorkdays);
}

// Absences exceeding available employee-workdays
{
  const over = validateAbsencePercentageDraft({
    totalEmployees: '10',
    totalWorkdays: '20',
    totalDaysAbsent: '201',
  });
  assert.equal(over.isValid, false);
  assert.ok(over.errors.totalDaysAbsent);
}

// Valid draft
{
  const ok = validateAbsencePercentageDraft({
    totalEmployees: '10',
    totalWorkdays: '20',
    totalDaysAbsent: '8',
  });
  assert.equal(ok.isValid, true);
  assert.deepEqual(ok.input, {
    totalEmployees: 10,
    totalWorkdays: 20,
    totalDaysAbsent: 8,
  });
}

console.log('absence-percentage calculation.test.ts: ok');
