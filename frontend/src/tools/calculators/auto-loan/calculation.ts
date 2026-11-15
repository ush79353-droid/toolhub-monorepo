import type {
  AmortizationMonthlyRow,
  AmortizationYearlyRow,
  AutoLoanInput,
  AutoLoanResult,
  SupportedCurrency,
} from './types';
import {
  resolveDownPaymentCents,
  resolveTotalMonths,
  toCents,
  validateAutoLoanInput,
} from './validation';

export function fromCents(cents: number): number {
  return Number((cents / 100).toFixed(2));
}

export function addMonthsToIsoDate(isoDate: string, monthsToAdd: number): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) {
    throw new Error(`Invalid ISO date "${isoDate}"`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const totalMonthsFromZero = year * 12 + (month - 1) + monthsToAdd;
  const targetYear = Math.floor(totalMonthsFromZero / 12);
  const targetMonth = (totalMonthsFromZero % 12) + 1;
  const maxDay = new Date(Date.UTC(targetYear, targetMonth, 0)).getUTCDate();
  const targetDay = Math.min(day, maxDay);

  return `${String(targetYear).padStart(4, '0')}-${String(targetMonth).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;
}

export function formatDisplayDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return isoDate;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

import { formatCurrencyValue as formatCurrencyValueShared } from '@/tools/shared/currency';

export function formatCurrencyValue(
  amount: number,
  currency: SupportedCurrency,
  locale = 'en-US'
): string {
  return formatCurrencyValueShared(amount, currency, locale);
}

interface MonthlyScheduleCents {
  rows: AmortizationMonthlyRow[];
  scheduledMonthlyCents: number;
  finalMonthlyCents: number;
  totalPaymentCents: number;
  totalPrincipalCents: number;
  totalInterestCents: number;
}

function buildAmortizationLedger(
  principalCents: number,
  annualInterestRate: number,
  totalMonths: number,
  startDate: string
): MonthlyScheduleCents {
  if (principalCents === 0) {
    return {
      rows: [],
      scheduledMonthlyCents: 0,
      finalMonthlyCents: 0,
      totalPaymentCents: 0,
      totalPrincipalCents: 0,
      totalInterestCents: 0,
    };
  }

  const monthlyRate = annualInterestRate / 100 / 12;
  let scheduledMonthlyCents: number;

  if (monthlyRate === 0) {
    scheduledMonthlyCents = Math.round(principalCents / totalMonths);
  } else {
    const growthFactor = Math.pow(1 + monthlyRate, totalMonths);
    const exactMonthlyDollars =
      ((principalCents / 100) * monthlyRate * growthFactor) / (growthFactor - 1);
    scheduledMonthlyCents = Math.round(exactMonthlyDollars * 100);
  }

  const rows: AmortizationMonthlyRow[] = [];
  let balanceCents = principalCents;
  let totalPaymentCents = 0;
  let totalPrincipalCents = 0;
  let totalInterestCents = 0;
  let finalMonthlyCents = 0;

  for (let monthIndex = 1; monthIndex <= totalMonths; monthIndex += 1) {
    const paymentDate = addMonthsToIsoDate(startDate, monthIndex);
    const beginningBalanceCents = balanceCents;

    let paymentCents = 0;
    let principalPaidCents = 0;
    let interestPaidCents = 0;
    let endingBalanceCents = 0;

    if (beginningBalanceCents > 0) {
      if (monthlyRate === 0) {
        interestPaidCents = 0;
        if (monthIndex < totalMonths) {
          principalPaidCents = Math.min(beginningBalanceCents, scheduledMonthlyCents);
        } else {
          principalPaidCents = beginningBalanceCents;
        }
        paymentCents = principalPaidCents;
        endingBalanceCents = beginningBalanceCents - principalPaidCents;
      } else {
        interestPaidCents = Math.round(beginningBalanceCents * monthlyRate);
        if (monthIndex < totalMonths) {
          paymentCents = Math.min(
            scheduledMonthlyCents,
            beginningBalanceCents + interestPaidCents
          );
          principalPaidCents = paymentCents - interestPaidCents;
          endingBalanceCents = beginningBalanceCents - principalPaidCents;
        } else {
          // Adjust final payment to eliminate residual rounding balance cleanly.
          principalPaidCents = beginningBalanceCents;
          paymentCents = principalPaidCents + interestPaidCents;
          endingBalanceCents = 0;
        }
      }
    }

    balanceCents = endingBalanceCents;
    totalPaymentCents += paymentCents;
    totalPrincipalCents += principalPaidCents;
    totalInterestCents += interestPaidCents;
    if (monthIndex === totalMonths) {
      finalMonthlyCents = paymentCents;
    }

    rows.push({
      paymentNumber: monthIndex,
      paymentDate,
      beginningBalance: fromCents(beginningBalanceCents),
      monthlyPayment: fromCents(paymentCents),
      principalPaid: fromCents(principalPaidCents),
      interestPaid: fromCents(interestPaidCents),
      endingBalance: fromCents(endingBalanceCents),
    });
  }

  return {
    rows,
    scheduledMonthlyCents,
    finalMonthlyCents,
    totalPaymentCents,
    totalPrincipalCents,
    totalInterestCents,
  };
}

function summarizeByYear(rows: AmortizationMonthlyRow[]): AmortizationYearlyRow[] {
  if (rows.length === 0) return [];

  const buckets = new Map<
    number,
    {
      paymentsCount: number;
      beginningBalance: number;
      totalPaymentCents: number;
      principalCents: number;
      interestCents: number;
      endingBalance: number;
    }
  >();

  for (const row of rows) {
    const year = Number(row.paymentDate.slice(0, 4));
    const existing = buckets.get(year);
    if (!existing) {
      buckets.set(year, {
        paymentsCount: 1,
        beginningBalance: row.beginningBalance,
        totalPaymentCents: toCents(row.monthlyPayment),
        principalCents: toCents(row.principalPaid),
        interestCents: toCents(row.interestPaid),
        endingBalance: row.endingBalance,
      });
    } else {
      existing.paymentsCount += 1;
      existing.totalPaymentCents += toCents(row.monthlyPayment);
      existing.principalCents += toCents(row.principalPaid);
      existing.interestCents += toCents(row.interestPaid);
      existing.endingBalance = row.endingBalance;
    }
  }

  return Array.from(buckets.entries()).map(([year, bucket]) => ({
    year,
    paymentsCount: bucket.paymentsCount,
    beginningBalance: bucket.beginningBalance,
    totalPayment: fromCents(bucket.totalPaymentCents),
    principalPaid: fromCents(bucket.principalCents),
    interestPaid: fromCents(bucket.interestCents),
    endingBalance: bucket.endingBalance,
  }));
}

export function calculateAutoLoan(input: AutoLoanInput): AutoLoanResult {
  const validation = validateAutoLoanInput(input);
  if (!validation.isValid) {
    const firstMessage =
      Object.values(validation.errors).find(Boolean) ?? 'Invalid auto loan inputs.';
    throw new Error(firstMessage);
  }

  const autoPriceCents = toCents(input.autoPrice);
  const downPaymentCents = resolveDownPaymentCents(
    autoPriceCents,
    input.downPaymentValue,
    input.downPaymentMode
  );
  const tradeInValueCents = toCents(input.tradeInValue);
  const tradeInOwedCents = toCents(input.tradeInOwed);
  const netTradeInEquityCents = tradeInValueCents - tradeInOwedCents;

  const taxableVehicleCents =
    input.taxPolicy === 'after-trade-in'
      ? Math.max(0, autoPriceCents - tradeInValueCents)
      : autoPriceCents;
  const salesTaxCents = Math.round(taxableVehicleCents * (input.salesTaxRate / 100));
  const financedSalesTaxCents = input.salesTaxInclusion === 'finance' ? salesTaxCents : 0;
  const upfrontSalesTaxCents = input.salesTaxInclusion === 'upfront' ? salesTaxCents : 0;

  const additionalFeesCents = toCents(input.additionalFees);
  const financedFeesCents = input.feesInclusion === 'finance' ? additionalFeesCents : 0;
  const upfrontFeesCents = input.feesInclusion === 'upfront' ? additionalFeesCents : 0;

  const amountFinancedCents =
    autoPriceCents -
    downPaymentCents -
    netTradeInEquityCents +
    financedSalesTaxCents +
    financedFeesCents;

  const totalMonths = Math.round(resolveTotalMonths(input.loanTermValue, input.loanTermUnit));
  const ledger = buildAmortizationLedger(
    amountFinancedCents,
    input.annualInterestRate,
    totalMonths,
    input.startDate
  );

  const upfrontCostsCents = downPaymentCents + upfrontSalesTaxCents + upfrontFeesCents;
  const appliedPositiveEquityCents = Math.max(0, netTradeInEquityCents);
  const totalEstimatedCostCents =
    upfrontCostsCents + appliedPositiveEquityCents + ledger.totalPaymentCents;

  const payoffDate =
    amountFinancedCents === 0 || ledger.rows.length === 0
      ? input.startDate
      : ledger.rows[ledger.rows.length - 1].paymentDate;

  const totalPaymentCents = ledger.totalPaymentCents;
  const principalRatioPercent =
    totalPaymentCents > 0
      ? Number(((ledger.totalPrincipalCents / totalPaymentCents) * 100).toFixed(1))
      : 100;
  const interestRatioPercent =
    totalPaymentCents > 0
      ? Number((100 - principalRatioPercent).toFixed(1))
      : 0;

  const tradeInEquityStatus =
    netTradeInEquityCents > 0 ? 'positive' : netTradeInEquityCents < 0 ? 'negative' : 'even';

  return {
    currency: input.currency,
    autoPrice: fromCents(autoPriceCents),
    downPaymentAmount: fromCents(downPaymentCents),
    downPaymentPercentOfPrice: Number(((downPaymentCents / autoPriceCents) * 100).toFixed(2)),
    tradeInValue: fromCents(tradeInValueCents),
    tradeInOwed: fromCents(tradeInOwedCents),
    netTradeInEquity: fromCents(netTradeInEquityCents),
    tradeInEquityStatus,
    taxPolicy: input.taxPolicy,
    taxableVehicleAmount: fromCents(taxableVehicleCents),
    salesTax: fromCents(salesTaxCents),
    financedSalesTax: fromCents(financedSalesTaxCents),
    upfrontSalesTax: fromCents(upfrontSalesTaxCents),
    additionalFees: fromCents(additionalFeesCents),
    financedFees: fromCents(financedFeesCents),
    upfrontFees: fromCents(upfrontFeesCents),
    amountFinanced: fromCents(amountFinancedCents),
    totalMonths,
    annualInterestRate: input.annualInterestRate,
    monthlyInterestRate: input.annualInterestRate / 100 / 12,
    estimatedMonthlyPayment: fromCents(ledger.scheduledMonthlyCents),
    finalMonthlyPayment: fromCents(ledger.finalMonthlyCents),
    totalLoanPayments: fromCents(ledger.totalPaymentCents),
    totalInterest: fromCents(ledger.totalInterestCents),
    upfrontCosts: fromCents(upfrontCostsCents),
    totalEstimatedCost: fromCents(totalEstimatedCostCents),
    startDate: input.startDate,
    payoffDate,
    principalRatioPercent,
    interestRatioPercent,
    monthlySchedule: ledger.rows,
    yearlySchedule: summarizeByYear(ledger.rows),
    scheduleTotals: {
      totalPayment: fromCents(ledger.totalPaymentCents),
      totalPrincipal: fromCents(ledger.totalPrincipalCents),
      totalInterest: fromCents(ledger.totalInterestCents),
    },
  };
}

export function escapeCsvCell(value: string | number): string {
  const str = String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildAmortizationCsv(
  result: AutoLoanResult,
  view: 'monthly' | 'yearly',
  currency: SupportedCurrency
): string {
  const rows: string[] = [];

  if (view === 'monthly') {
    rows.push(
      [
        'Payment Number',
        'Payment Date',
        `Beginning Balance (${currency})`,
        `Monthly Payment (${currency})`,
        `Principal Paid (${currency})`,
        `Interest Paid (${currency})`,
        `Ending Balance (${currency})`,
      ]
        .map(escapeCsvCell)
        .join(',')
    );

    for (const row of result.monthlySchedule) {
      rows.push(
        [
          row.paymentNumber,
          row.paymentDate,
          row.beginningBalance.toFixed(2),
          row.monthlyPayment.toFixed(2),
          row.principalPaid.toFixed(2),
          row.interestPaid.toFixed(2),
          row.endingBalance.toFixed(2),
        ]
          .map(escapeCsvCell)
          .join(',')
      );
    }

    rows.push(
      [
        'Total',
        `${result.monthlySchedule.length} payments`,
        '',
        result.scheduleTotals.totalPayment.toFixed(2),
        result.scheduleTotals.totalPrincipal.toFixed(2),
        result.scheduleTotals.totalInterest.toFixed(2),
        '0.00',
      ]
        .map(escapeCsvCell)
        .join(',')
    );
  } else {
    rows.push(
      [
        'Year',
        'Payments',
        `Beginning Balance (${currency})`,
        `Total Payment (${currency})`,
        `Principal Paid (${currency})`,
        `Interest Paid (${currency})`,
        `Ending Balance (${currency})`,
      ]
        .map(escapeCsvCell)
        .join(',')
    );

    for (const row of result.yearlySchedule) {
      rows.push(
        [
          row.year,
          row.paymentsCount,
          row.beginningBalance.toFixed(2),
          row.totalPayment.toFixed(2),
          row.principalPaid.toFixed(2),
          row.interestPaid.toFixed(2),
          row.endingBalance.toFixed(2),
        ]
          .map(escapeCsvCell)
          .join(',')
      );
    }

    rows.push(
      [
        'Total',
        result.monthlySchedule.length,
        '',
        result.scheduleTotals.totalPayment.toFixed(2),
        result.scheduleTotals.totalPrincipal.toFixed(2),
        result.scheduleTotals.totalInterest.toFixed(2),
        '0.00',
      ]
        .map(escapeCsvCell)
        .join(',')
    );
  }

  return rows.join('\r\n');
}

export function buildResultsSummaryText(input: AutoLoanInput, result: AutoLoanResult): string {
  const fmt = (val: number) => formatCurrencyValue(val, result.currency);
  return [
    'Auto Loan Estimate — Omega Calculators',
    `Auto Price: ${fmt(result.autoPrice)}`,
    `Down Payment: ${fmt(result.downPaymentAmount)} (${result.downPaymentPercentOfPrice}%)`,
    `Net Trade-in Equity: ${fmt(result.netTradeInEquity)} (${result.tradeInEquityStatus})`,
    `Sales Tax (${input.salesTaxRate}% - ${input.salesTaxInclusion}): ${fmt(result.salesTax)}`,
    `Additional Fees (${input.feesInclusion}): ${fmt(result.additionalFees)}`,
    `Term & APR: ${result.totalMonths} months @ ${result.annualInterestRate}% APR`,
    '---',
    `Estimated Monthly Payment: ${fmt(result.estimatedMonthlyPayment)}`,
    `Amount Financed: ${fmt(result.amountFinanced)}`,
    `Total Interest: ${fmt(result.totalInterest)}`,
    `Total Loan Payments: ${fmt(result.totalLoanPayments)}`,
    `Upfront Costs: ${fmt(result.upfrontCosts)}`,
    `Total Estimated Cost: ${fmt(result.totalEstimatedCost)}`,
    `Estimated Payoff Date: ${formatDisplayDate(result.payoffDate)}`,
    'Note: Estimate only, not a lender offer.',
  ].join('\n');
}

