import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateBudgetingDiscretionaryIncome,
  calculateDiscretionaryIncome,
  estimateMonthlyIdrPayment,
} from './calculation';
import {
  lookupPovertyGuideline,
  regionForState,
} from './poverty-guidelines';
import {
  computeFamilySize,
  getRepaymentStandard,
  resolveApplicableAgi,
} from './repayment-standards';
import { createDefaultInput, createEmptyInput } from './types';
import { validateDiscretionaryIncomeInput } from './validation';

describe('calculateDiscretionaryIncome', () => {
  it('worked fixture → 30000 / 2500', () => {
    const r = calculateDiscretionaryIncome({
      annualAGI: 60000,
      povertyGuideline: 20000,
      protectionMultiplier: 1.5,
    });
    assert.ok(r);
    assert.equal(r.protectedIncome, 30000);
    assert.equal(r.annualDiscretionaryIncome, 30000);
    assert.equal(r.monthlyDiscretionaryIncome, 2500);
  });

  it('AGI below threshold → 0', () => {
    const r = calculateDiscretionaryIncome({
      annualAGI: 20000,
      povertyGuideline: 20000,
      protectionMultiplier: 1.5,
    });
    assert.ok(r);
    assert.equal(r.annualDiscretionaryIncome, 0);
  });

  it('AGI equal to protected → 0', () => {
    const r = calculateDiscretionaryIncome({
      annualAGI: 30000,
      povertyGuideline: 20000,
      protectionMultiplier: 1.5,
    });
    assert.ok(r);
    assert.equal(r.annualDiscretionaryIncome, 0);
  });

  it('negative AGI floors DI at 0', () => {
    const r = calculateDiscretionaryIncome({
      annualAGI: -5000,
      povertyGuideline: 20000,
      protectionMultiplier: 1.5,
    });
    assert.ok(r);
    assert.equal(r.annualDiscretionaryIncome, 0);
  });

  it('225% multiplier', () => {
    const r = calculateDiscretionaryIncome({
      annualAGI: 60000,
      povertyGuideline: 20000,
      protectionMultiplier: 2.25,
    });
    assert.ok(r);
    assert.equal(r.protectedIncome, 45000);
    assert.equal(r.annualDiscretionaryIncome, 15000);
  });

  it('rejects negative poverty guideline', () => {
    assert.equal(
      calculateDiscretionaryIncome({
        annualAGI: 60000,
        povertyGuideline: -1,
        protectionMultiplier: 1.5,
      }),
      null
    );
  });
});

describe('estimateMonthlyIdrPayment', () => {
  it('10% of 30000 → 250', () => {
    assert.equal(estimateMonthlyIdrPayment(30000, 0.1), 250);
  });
});

describe('budgeting', () => {
  it('positive DI', () => {
    assert.equal(calculateBudgetingDiscretionaryIncome(5000, 3600), 1400);
  });

  it('negative DI allowed', () => {
    assert.equal(calculateBudgetingDiscretionaryIncome(3000, 4000), -1000);
  });
});

describe('poverty guidelines', () => {
  it('contiguous CA 2025 size 1', () => {
    assert.equal(regionForState('CA'), 'contiguous');
    const g = lookupPovertyGuideline(2025, 'contiguous', 1);
    assert.ok(g);
    assert.equal(g.annualAmount, 15650);
  });

  it('Alaska and Hawaii differ', () => {
    const ak = lookupPovertyGuideline(2025, 'alaska', 1);
    const hi = lookupPovertyGuideline(2025, 'hawaii', 1);
    const ct = lookupPovertyGuideline(2025, 'contiguous', 1);
    assert.ok(ak && hi && ct);
    assert.equal(ak.annualAmount, 19550);
    assert.equal(hi.annualAmount, 17990);
    assert.notEqual(ak.annualAmount, ct.annualAmount);
    assert.notEqual(hi.annualAmount, ct.annualAmount);
  });

  it('2024 contiguous size 2', () => {
    const g = lookupPovertyGuideline(2024, 'contiguous', 2);
    assert.ok(g);
    assert.equal(g.annualAmount, 20440);
  });

  it('size > 8 uses increment', () => {
    const g = lookupPovertyGuideline(2025, 'contiguous', 9);
    assert.ok(g);
    assert.equal(g.annualAmount, 54150 + 5500);
  });

  it('missing year → null', () => {
    assert.equal(lookupPovertyGuideline(1999, 'contiguous', 1), null);
  });
});

describe('family size / AGI rules', () => {
  it('single + 0 dependents → 1', () => {
    const std = getRepaymentStandard('ibr-new-10')!;
    assert.equal(computeFamilySize('single', 0, std), 1);
  });

  it('MFJ + 1 dependent → 3', () => {
    const std = getRepaymentStandard('ibr-new-10')!;
    assert.equal(computeFamilySize('marriedFilingJointly', 1, std), 3);
  });

  it('MFS IBR excludes spouse from family size', () => {
    const std = getRepaymentStandard('ibr-new-10')!;
    assert.equal(computeFamilySize('marriedFilingSeparately', 1, std), 2);
  });

  it('MFS SAVE-style includes spouse in family size', () => {
    const std = getRepaymentStandard('save-225')!;
    assert.equal(computeFamilySize('marriedFilingSeparately', 1, std), 3);
  });

  it('MFJ combines AGI', () => {
    const std = getRepaymentStandard('ibr-new-10')!;
    const r = resolveApplicableAgi('marriedFilingJointly', 40000, 20000, std);
    assert.equal(r.applicableAgi, 60000);
    assert.equal(r.includesSpouseIncome, true);
  });

  it('MFS IBR uses borrower AGI only', () => {
    const std = getRepaymentStandard('ibr-new-10')!;
    const r = resolveApplicableAgi('marriedFilingSeparately', 40000, 20000, std);
    assert.equal(r.applicableAgi, 40000);
    assert.equal(r.includesSpouseIncome, false);
  });
});

describe('validateDiscretionaryIncomeInput', () => {
  it('defaults student-loan mode valid', () => {
    const v = validateDiscretionaryIncomeInput(createDefaultInput());
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result.purpose, 'studentLoan');
    assert.ok((v.result.annualDiscretionaryIncome ?? -1) >= 0);
    assert.ok(v.result.estimatedMonthlyPayment != null);
  });

  it('empty → invalid', () => {
    const v = validateDiscretionaryIncomeInput(createEmptyInput());
    assert.equal(v.isValid, false);
  });

  it('budgeting mode negative DI', () => {
    const input = createDefaultInput();
    input.purpose = 'budgeting';
    input.monthlyTakeHome = '2000';
    input.housing = '2500';
    input.utilities = '0';
    input.groceries = '0';
    input.transportation = '0';
    input.insurance = '0';
    input.minDebt = '0';
    input.healthcare = '0';
    input.childcare = '0';
    input.otherNecessary = '0';
    const v = validateDiscretionaryIncomeInput(input);
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result.budgetingDiscretionaryIncome, -500);
  });

  it('invalid AGI string', () => {
    const input = createDefaultInput();
    input.annualAgi = 'abc';
    assert.equal(validateDiscretionaryIncomeInput(input).isValid, false);
  });
});
