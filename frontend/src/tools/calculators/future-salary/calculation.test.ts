/**
 * Runnable self-check for Future Salary Calculator formulas.
 * Run: npx --yes tsx src/tools/calculators/future-salary/calculation.test.ts
 */
import assert from 'node:assert/strict';
import { calculateFutureSalary } from './calculation';
import {
  createDefaultInput,
  EXAMPLE_CAREER_GROWTH,
  EXAMPLE_INFLATION_CHECK,
} from './types';
import { validateFutureSalaryInput } from './validation';

{
  const r = calculateFutureSalary({
    currentSalary: 100_000,
    salaryGrowthPercent: 5,
    years: 10,
    inflationPercent: 2,
  });
  assert.ok(r);
  assert.ok(Math.abs(r.futureSalary - 100_000 * Math.pow(1.05, 10)) < 1e-6);
  assert.ok(
    Math.abs(r.realSalary - r.futureSalary / Math.pow(1.02, 10)) < 1e-6
  );
}

{
  // Zero growth and zero inflation → future = real = current.
  const r = calculateFutureSalary({
    currentSalary: 50_000,
    salaryGrowthPercent: 0,
    years: 7,
    inflationPercent: 0,
  });
  assert.ok(r);
  assert.equal(r.futureSalary, 50_000);
  assert.equal(r.realSalary, 50_000);
}

{
  // Zero years → future = current; real = current.
  const r = calculateFutureSalary({
    currentSalary: 80_000,
    salaryGrowthPercent: 10,
    years: 0,
    inflationPercent: 3,
  });
  assert.ok(r);
  assert.equal(r.futureSalary, 80_000);
  assert.equal(r.realSalary, 80_000);
}

{
  // Negative growth (above −100%) and deflation.
  const r = calculateFutureSalary({
    currentSalary: 100_000,
    salaryGrowthPercent: -10,
    years: 2,
    inflationPercent: -5,
  });
  assert.ok(r);
  assert.ok(Math.abs(r.futureSalary - 100_000 * 0.9 * 0.9) < 1e-6);
  assert.ok(
    Math.abs(r.realSalary - r.futureSalary / Math.pow(0.95, 2)) < 1e-6
  );
}

{
  // Flat pay vs inflation (inflation check).
  const r = calculateFutureSalary({
    currentSalary: 100_000,
    salaryGrowthPercent: 0,
    years: 10,
    inflationPercent: 5,
  });
  assert.ok(r);
  assert.equal(r.futureSalary, 100_000);
  assert.ok(Math.abs(r.realSalary - 100_000 / Math.pow(1.05, 10)) < 1e-6);
}

assert.equal(
  calculateFutureSalary({
    currentSalary: 100,
    salaryGrowthPercent: -100,
    years: 1,
    inflationPercent: 0,
  }),
  null
);

assert.equal(
  calculateFutureSalary({
    currentSalary: 100,
    salaryGrowthPercent: 5,
    years: -1,
    inflationPercent: 0,
  }),
  null
);

assert.equal(
  calculateFutureSalary({
    currentSalary: Number.NaN,
    salaryGrowthPercent: 5,
    years: 1,
    inflationPercent: 0,
  }),
  null
);

{
  const empty = validateFutureSalaryInput(createDefaultInput());
  assert.equal(empty.isValid, false);
  assert.equal(empty.result, null);
}

{
  const career = validateFutureSalaryInput(EXAMPLE_CAREER_GROWTH);
  assert.equal(career.isValid, true);
  assert.ok(career.result);
  assert.ok(
    Math.abs(
      career.result.futureSalaryCanonical - 100_000 * Math.pow(1.05, 10)
    ) < 1e-6
  );
  assert.ok(
    Math.abs(
      career.result.realSalaryCanonical -
        career.result.futureSalaryCanonical / Math.pow(1.02, 10)
    ) < 1e-6
  );
}

{
  const inflation = validateFutureSalaryInput(EXAMPLE_INFLATION_CHECK);
  assert.equal(inflation.isValid, true);
  assert.ok(inflation.result);
  assert.equal(inflation.result.futureSalaryCanonical, 100_000);
  assert.ok(
    Math.abs(
      inflation.result.realSalaryCanonical - 100_000 / Math.pow(1.05, 10)
    ) < 1e-6
  );
}

{
  const badGrowth = validateFutureSalaryInput({
    ...createDefaultInput(),
    currentSalary: '100000',
    salaryGrowthPercent: '-100',
    years: '5',
    inflationPercent: '2',
  });
  assert.equal(badGrowth.isValid, false);
  assert.ok(badGrowth.errors.salaryGrowthPercent);
}

{
  const negYears = validateFutureSalaryInput({
    ...createDefaultInput(),
    currentSalary: '100000',
    salaryGrowthPercent: '5',
    years: '-1',
    inflationPercent: '2',
  });
  assert.equal(negYears.isValid, false);
  assert.ok(negYears.errors.years);
}

console.log('future-salary calculation.test.ts: all assertions passed');
