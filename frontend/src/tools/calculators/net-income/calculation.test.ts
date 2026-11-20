import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateEarningsBeforeTax,
  calculateEstimatedIncomeTax,
  calculateGrossProfit,
  calculateNetIncome,
  calculateNetProfitMargin,
  calculateOperatingIncome,
} from './calculation';
import { validateNetIncomeInput } from './validation';
import { createDefaultInput } from './types';

const TOL = 1e-9;

describe('net income chain', () => {
  it('Company Alpha: 500k → NI 135k, margin 27%', () => {
    const gp = calculateGrossProfit(500000, 200000);
    const oi = calculateOperatingIncome(gp!, 100000);
    const ebt = calculateEarningsBeforeTax(oi!, 20000);
    const tax = calculateEstimatedIncomeTax(ebt!, 25);
    const ni = calculateNetIncome(ebt!, tax!);
    const margin = calculateNetProfitMargin(ni!, 500000);
    assert.equal(gp, 300000);
    assert.equal(oi, 200000);
    assert.equal(ebt, 180000);
    assert.equal(tax, 45000);
    assert.equal(ni, 135000);
    assert.ok(Math.abs(margin! - 27) < TOL);
  });

  it('zero tax rate', () => {
    assert.equal(calculateEstimatedIncomeTax(70000, 0), 0);
    assert.equal(calculateNetIncome(70000, 0), 70000);
  });

  it('negative EBT → estimated taxes 0', () => {
    assert.equal(calculateEstimatedIncomeTax(-30000, 25), 0);
    assert.equal(calculateNetIncome(-30000, 0), -30000);
  });

  it('EBT 0 → taxes 0', () => {
    assert.equal(calculateEstimatedIncomeTax(0, 25), 0);
  });

  it('zero revenue → margin null', () => {
    assert.equal(calculateNetProfitMargin(-25000, 0), null);
  });

  it('negative gross profit', () => {
    assert.equal(calculateGrossProfit(100000, 120000), -20000);
  });

  it('decimal amounts', () => {
    const gp = calculateGrossProfit(10250.75, 4100.25);
    const oi = calculateOperatingIncome(gp!, 2000.1);
    const ebt = calculateEarningsBeforeTax(oi!, 150.4);
    const tax = calculateEstimatedIncomeTax(ebt!, 20);
    const ni = calculateNetIncome(ebt!, tax!);
    assert.ok(Math.abs(gp! - 6150.5) < TOL);
    assert.ok(Math.abs(oi! - 4150.4) < TOL);
    assert.ok(Math.abs(ebt! - 4000) < TOL);
    assert.ok(Math.abs(tax! - 800) < TOL);
    assert.ok(Math.abs(ni! - 3200) < TOL);
  });
});

describe('validateNetIncomeInput', () => {
  it('Company Alpha end-to-end', () => {
    const v = validateNetIncomeInput({
      ...createDefaultInput(),
      revenue: '500000',
      costOfSales: '200000',
      operatingExpenses: '100000',
      interest: '20000',
      taxRate: '25',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.result?.netIncomeAfterTaxes, 135000);
    assert.ok(Math.abs(v.result!.netProfitMargin! - 27) < TOL);
  });

  it('negative EBT path', () => {
    const v = validateNetIncomeInput({
      ...createDefaultInput(),
      revenue: '100000',
      costOfSales: '120000',
      operatingExpenses: '10000',
      interest: '0',
      taxRate: '25',
    });
    assert.equal(v.result?.totalTaxes, 0);
    assert.equal(v.result?.netIncomeAfterTaxes, -30000);
  });

  it('tax rate > 100 → error', () => {
    const v = validateNetIncomeInput({
      ...createDefaultInput(),
      revenue: '100',
      costOfSales: '0',
      operatingExpenses: '0',
      interest: '0',
      taxRate: '105',
    });
    assert.ok(v.errors.taxRate);
    assert.equal(v.result, null);
  });

  it('negative revenue → error', () => {
    const v = validateNetIncomeInput({
      ...createDefaultInput(),
      revenue: '-1',
      costOfSales: '0',
      operatingExpenses: '0',
      interest: '0',
      taxRate: '10',
    });
    assert.ok(v.errors.revenue);
  });

  it('missing inputs → no result', () => {
    assert.equal(validateNetIncomeInput(createDefaultInput()).result, null);
  });
});
