import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateFcfeFromCfo,
  calculateFcfeFromEbit,
  calculateFcfeFromEbitda,
  calculateFcfeFromFcff,
  calculateFcfeFromNetIncome,
  calculateNetBorrowingFromDebtBalances,
} from './calculation';
import { createDefaultInput } from './types';
import { validateFcfeInput } from './validation';

function nearly(actual: number | null | undefined, expected: number, eps = 1e-6) {
  assert.ok(actual !== null && actual !== undefined, 'expected a number');
  assert.ok(
    Math.abs(actual! - expected) < eps,
    `expected ${expected}, got ${actual}`
  );
}

describe('calculateNetBorrowingFromDebtBalances', () => {
  it('positive net borrowing', () => {
    nearly(calculateNetBorrowingFromDebtBalances(300_000, 400_000), 100_000);
  });
  it('negative net borrowing', () => {
    nearly(calculateNetBorrowingFromDebtBalances(500_000, 350_000), -150_000);
  });
  it('zero net borrowing', () => {
    nearly(calculateNetBorrowingFromDebtBalances(200_000, 200_000), 0);
  });
});

describe('calculateFcfeFromNetIncome', () => {
  it('standard worked example', () => {
    nearly(
      calculateFcfeFromNetIncome(500_000, 80_000, 150_000, 40_000, 60_000),
      450_000
    );
  });
  it('negative WC investment increases FCFE', () => {
    nearly(calculateFcfeFromNetIncome(100_000, 0, 0, -20_000, 0), 120_000);
  });
  it('negative FCFE', () => {
    nearly(
      calculateFcfeFromNetIncome(100_000, 20_000, 200_000, 50_000, 0),
      -130_000
    );
  });
  it('zero FCFE', () => {
    nearly(calculateFcfeFromNetIncome(100_000, 0, 100_000, 0, 0), 0);
  });
});

describe('calculateFcfeFromEbitda', () => {
  it('matches EBITDA example', () => {
    const out = calculateFcfeFromEbitda(
      800_000,
      100_000,
      50_000,
      0.25,
      200_000,
      60_000,
      40_000
    );
    nearly(out!.netIncome, 487_500);
    nearly(out!.fcfe, 367_500);
  });
});

describe('calculateFcfeFromEbit', () => {
  it('matches EBIT example', () => {
    const out = calculateFcfeFromEbit(
      600_000,
      50_000,
      0.25,
      70_000,
      150_000,
      40_000,
      30_000
    );
    nearly(out!.netIncome, 412_500);
    nearly(out!.fcfe, 322_500);
  });
});

describe('calculateFcfeFromCfo', () => {
  it('matches CFO example', () => {
    nearly(calculateFcfeFromCfo(700_000, 200_000, 50_000), 550_000);
  });
});

describe('calculateFcfeFromFcff', () => {
  it('matches FCFF example', () => {
    nearly(calculateFcfeFromFcff(900_000, 100_000, 0.25, 50_000), 875_000);
  });
});

describe('validateFcfeInput', () => {
  it('validates net-income path with debt balances', () => {
    const { isValid, result } = validateFcfeInput({
      ...createDefaultInput(),
      netIncome: '500000',
      beginningTotalDebt: '200000',
      endingTotalDebt: '260000',
      depreciationAmortization: '80000',
      fixedCapitalInvestment: '150000',
      workingCapitalInvestment: '40000',
    });
    assert.equal(isValid, true);
    nearly(result!.netBorrowing, 60_000);
    nearly(result!.freeCashFlowToEquity, 450_000);
  });

  it('validates FCFF path', () => {
    const { isValid, result } = validateFcfeInput({
      ...createDefaultInput(),
      method: 'fcff',
      freeCashFlowToFirm: '900000',
      interestExpense: '100000',
      effectiveTaxRate: '25',
      netBorrowingSource: 'direct',
      directNetBorrowing: '50000',
    });
    assert.equal(isValid, true);
    nearly(result!.freeCashFlowToEquity, 875_000);
  });

  it('rejects negative beginning debt', () => {
    const { isValid, errors } = validateFcfeInput({
      ...createDefaultInput(),
      netIncome: '100',
      beginningTotalDebt: '-1',
      endingTotalDebt: '0',
      depreciationAmortization: '0',
      fixedCapitalInvestment: '0',
      workingCapitalInvestment: '0',
    });
    assert.equal(isValid, false);
    assert.ok(errors.beginningTotalDebt);
  });

  it('returns incomplete when blank', () => {
    const { isValid, result } = validateFcfeInput(createDefaultInput());
    assert.equal(isValid, false);
    assert.equal(result, null);
  });
});
