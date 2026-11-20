import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateAnnualCashFlow,
  calculateAnnualDebtService,
  calculateAnnualOperatingExpenses,
  calculateCapRate,
  calculateCashOnCashReturn,
  calculateDownPaymentAmount,
  calculateHoldingPeriodCashFlow,
  calculateInitialCashInvestment,
  calculateManagementFee,
  calculateMonthlyMortgagePayment,
  calculateMortgageAmount,
  calculateNetOperatingIncome,
  calculateNetSaleProceeds,
  calculateOutstandingLoanBalance,
  calculateProjectedSellingPrice,
  calculateSellingCosts,
  calculateTotalInvestmentRoi,
  calculateTotalMortgagePayments,
  calculateVacancyLoss,
  convertMoneyPeriodDisplay,
  toAnnualExpense,
  toAnnualIncome,
} from './calculation';
import { createDefaultInput } from './types';
import { validateRentalPropertyInput } from './validation';

const EPS = 0.02;

describe('rental-property calculation', () => {
  it('computes down payment and loan amount', () => {
    assert.equal(calculateDownPaymentAmount(300_000, 20), 60_000);
    assert.equal(calculateMortgageAmount(300_000, 60_000), 240_000);
    assert.equal(calculateMortgageAmount(300_000, 0), 300_000);
    assert.equal(calculateMortgageAmount(300_000, 300_000), 0);
  });

  it('matches the worked financing and income example', () => {
    const payment = calculateMonthlyMortgagePayment(240_000, 6, 360);
    assert.ok(payment !== null);
    assert.ok(Math.abs(payment! - 1_438.92) < EPS);

    const annualGross = toAnnualIncome(2_500, 'monthly');
    assert.equal(annualGross, 30_000);

    const vacancyLoss = calculateVacancyLoss(30_000, 5);
    assert.equal(vacancyLoss, 1_500);

    const effective = 30_000 - 1_500;
    assert.equal(effective, 28_500);

    const management = calculateManagementFee(28_500, 8);
    assert.equal(management, 2_280);

    const opex = calculateAnnualOperatingExpenses({
      propertyTax: 3_600,
      insurance: 1_200,
      maintenance: 1_800,
      hoa: 1_200,
      other: 600,
      managementFee: 2_280,
    });
    assert.equal(opex, 10_680);

    const noi = calculateNetOperatingIncome(28_500, 10_680);
    assert.equal(noi, 17_820);

    const debt = calculateAnnualDebtService(payment!);
    assert.ok(debt !== null);
    const cashFlow = calculateAnnualCashFlow(17_820, debt!);
    assert.ok(cashFlow !== null);
    assert.ok(Math.abs(cashFlow! - 552.96) < 1);

    const cap = calculateCapRate(17_820, 300_000);
    assert.ok(cap !== null);
    assert.ok(Math.abs(cap! - 5.94) < 0.01);

    const coc = calculateCashOnCashReturn(cashFlow!, 60_000);
    assert.ok(coc !== null);
    assert.ok(Math.abs(coc! - 0.92) < 0.05);
  });

  it('handles zero interest and total paid', () => {
    const payment = calculateMonthlyMortgagePayment(120_000, 0, 120);
    assert.equal(payment, 1_000);
    assert.equal(calculateTotalMortgagePayments(1_000, 120), 120_000);
  });

  it('projects appreciation and selling costs', () => {
    const price = calculateProjectedSellingPrice(300_000, 3, 5);
    assert.ok(price !== null);
    assert.ok(Math.abs(price! - 347_782.22) < 0.05);

    const costs = calculateSellingCosts(347_782.22, 6, 1_000);
    assert.ok(costs !== null);
    assert.ok(Math.abs(costs! - (347_782.22 * 0.06 + 1_000)) < 0.01);
  });

  it('computes outstanding balance and paid-off loan', () => {
    const payment = calculateMonthlyMortgagePayment(240_000, 6, 360)!;
    const bal0 = calculateOutstandingLoanBalance(240_000, 6, 360, 0);
    assert.ok(bal0 !== null);
    assert.ok(Math.abs(bal0! - 240_000) < 0.01);

    const bal360 = calculateOutstandingLoanBalance(240_000, 6, 360, 360);
    assert.equal(bal360, 0);

    const bal60 = calculateOutstandingLoanBalance(240_000, 6, 360, 60);
    assert.ok(bal60 !== null && bal60! < 240_000 && bal60! > 0);

    // Independent one-step reduction check from payment.
    const r = 0.06 / 12;
    const expectedAfter1 =
      240_000 * (1 + r) - payment;
    const bal1 = calculateOutstandingLoanBalance(240_000, 6, 360, 1);
    assert.ok(bal1 !== null);
    assert.ok(Math.abs(bal1! - expectedAfter1) < 0.02);
  });

  it('computes holding-period ROI pieces', () => {
    const initial = calculateInitialCashInvestment(60_000, 0, 0, 0);
    assert.equal(initial, 60_000);

    const cumulative = calculateHoldingPeriodCashFlow(
      28_500,
      10_680,
      1_438.92,
      360,
      60
    );
    assert.ok(cumulative !== null);

    const net = calculateNetSaleProceeds(350_000, 10_000, 200_000);
    assert.equal(net, 140_000);

    const profit = cumulative! + 140_000 - 60_000;
    const roi = calculateTotalInvestmentRoi(profit, 60_000);
    assert.ok(roi !== null);
    assert.ok(Number.isFinite(roi!));

    assert.equal(calculateCashOnCashReturn(8_000, 80_000), 10);
    assert.equal(calculateCashOnCashReturn(1_000, 0), null);
    assert.equal(calculateTotalInvestmentRoi(10_000, 0), null);
  });

  it('preserves monthly/annual conversions', () => {
    assert.equal(toAnnualExpense(100, 'monthly'), 1_200);
    assert.equal(toAnnualExpense(1_200, 'annually'), 1_200);
    assert.equal(convertMoneyPeriodDisplay(2_500, 'monthly', 'annually'), 30_000);
    assert.equal(convertMoneyPeriodDisplay(30_000, 'annually', 'monthly'), 2_500);
  });

  it('rejects invalid appreciation and negative cash flow path', () => {
    assert.equal(calculateProjectedSellingPrice(100_000, -100, 5), null);
    const noi = calculateNetOperatingIncome(10_000, 20_000);
    assert.equal(noi, -10_000);
    const cf = calculateAnnualCashFlow(-10_000, 5_000);
    assert.equal(cf, -15_000);
  });

  it('validates the end-to-end example input', () => {
    const input = {
      ...createDefaultInput(),
      currency: 'USD' as const,
      purchasePrice: '300000',
      downPaymentMode: 'percentage' as const,
      downPaymentPercentage: '20',
      interestRate: '6',
      loanTermValue: '30',
      loanTermUnit: 'years' as const,
      rent: '2500',
      rentPeriod: 'monthly' as const,
      vacancyRate: '5',
      managementFeeRate: '8',
      propertyTax: '3600',
      propertyTaxPeriod: 'annually' as const,
      insurance: '1200',
      insurancePeriod: 'annually' as const,
      maintenance: '1800',
      maintenancePeriod: 'annually' as const,
      hoaFee: '100',
      hoaFeePeriod: 'monthly' as const,
      otherCosts: '600',
      otherCostsPeriod: 'annually' as const,
      appreciationRate: '3',
      holdingPeriodValue: '5',
      holdingPeriodUnit: 'years' as const,
      sellingPriceMode: 'appreciation' as const,
      sellingCostPercent: '0',
      sellingCostFixed: '0',
      closingCosts: '0',
      renovationCosts: '0',
      otherInitialCosts: '0',
    };

    const v = validateRentalPropertyInput(input);
    assert.equal(v.isValid, true);
    assert.ok(v.result);
    assert.equal(v.result!.loanAmount, 240_000);
    assert.equal(v.result!.noi, 17_820);
    assert.ok(Math.abs(v.result!.monthlyMortgagePayment - 1_438.92) < EPS);
    assert.ok(Math.abs(v.result!.capRatePercent! - 5.94) < 0.01);
    assert.ok(v.result!.totalRoiPercent !== null);
    assert.ok(v.result!.holdingPeriodMonths === 60);
    assert.ok(Math.abs(v.result!.sellingPrice - 347_782.22) < 0.05);
  });

  it('clears results when required inputs are missing', () => {
    const v = validateRentalPropertyInput(createDefaultInput());
    assert.equal(v.result, null);
  });

  it('rejects negative purchase and over-100% down payment', () => {
    const neg = validateRentalPropertyInput({
      ...createDefaultInput(),
      purchasePrice: '-1',
    });
    assert.ok(neg.errors.purchasePrice);

    const over = validateRentalPropertyInput({
      ...createDefaultInput(),
      purchasePrice: '100000',
      downPaymentPercentage: '101',
    });
    assert.ok(over.errors.downPaymentPercentage);
  });
});

console.log('rental-property/calculation.test.ts: assertions completed');
