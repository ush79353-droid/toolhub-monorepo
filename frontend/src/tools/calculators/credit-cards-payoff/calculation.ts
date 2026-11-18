/**
 * Multi-card debt avalanche schedule.
 * Adapted from debt-avalanche `runAvalancheSchedule` for a fixed monthly budget
 * (not sum of mins) plus a full month-by-month ledger. DebtAvalancheCalculator
 * is left untouched.
 */
import type {
  CardPayoffSummary,
  CardScheduleCell,
  CreditCardsPayoffResult,
  ScheduleMonth,
} from './types';

const MAX_MONTHS = 1200;
const EPS = 1e-8;

export interface NormalizedCard {
  id: number;
  name: string;
  balance: number;
  minimum: number;
  aprPercent: number;
}

function monthlyRate(aprPercent: number): number {
  return aprPercent / 100 / 12;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatApr(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years === 1 ? '' : 's'}`);
  if (rem > 0 || years === 0) {
    parts.push(`${rem} month${rem === 1 ? '' : 's'}`);
  }
  return parts.join(' ');
}

function sortByAprDesc(a: { aprPercent: number; id: number }, b: {
  aprPercent: number;
  id: number;
}): number {
  return b.aprPercent - a.aprPercent || a.id - b.id;
}

/**
 * Avalanche with fixed budget: accrue monthly interest, pay mins on active
 * cards, dump surplus to highest APR, roll capacity when a card is paid off.
 */
export function calculateCreditCardsPayoff(input: {
  monthlyBudget: number;
  cards: NormalizedCard[];
}): CreditCardsPayoffResult | null {
  const cards = input.cards.filter((c) => c.balance > EPS);
  if (cards.length === 0) return null;
  if (!(input.monthlyBudget > 0)) return null;

  for (const c of cards) {
    if (!(c.minimum >= 0) || !(c.aprPercent >= 0) || !(c.balance > 0)) {
      return null;
    }
  }

  const minSum = cards.reduce((s, c) => s + c.minimum, 0);
  if (input.monthlyBudget + 1e-12 < minSum) return null;

  const state = cards.map((c) => ({
    id: c.id,
    name: c.name,
    bal: c.balance,
    min: c.minimum,
    aprPercent: c.aprPercent,
  }));

  const payoffMonth = new Map<number, number>();
  const schedule: ScheduleMonth[] = [];
  let totalInterest = 0;
  let totalPaid = 0;
  let months = 0;

  while (state.some((d) => d.bal > EPS) && months < MAX_MONTHS) {
    months += 1;
    const monthCells: CardScheduleCell[] = [];
    let monthPayment = 0;
    let monthInterest = 0;

    const openings = new Map<number, number>();
    for (const d of state) {
      if (d.bal <= EPS) continue;
      openings.set(d.id, d.bal);
      const interest = d.bal * monthlyRate(d.aprPercent);
      d.bal += interest;
      totalInterest += interest;
      monthInterest += interest;
    }

    let remaining = input.monthlyBudget;
    const payments = new Map<number, number>();

    const activeForMin = state
      .filter((d) => d.bal > EPS)
      .sort(sortByAprDesc);

    for (const d of activeForMin) {
      const minPay = Math.min(d.min, d.bal, remaining);
      d.bal -= minPay;
      remaining -= minPay;
      payments.set(d.id, (payments.get(d.id) ?? 0) + minPay);
      if (d.bal < EPS) d.bal = 0;
    }

    const focusOrder = state
      .filter((d) => d.bal > EPS)
      .sort(sortByAprDesc);
    for (const d of focusOrder) {
      if (remaining <= 1e-12) break;
      const pay = Math.min(remaining, d.bal);
      d.bal -= pay;
      remaining -= pay;
      payments.set(d.id, (payments.get(d.id) ?? 0) + pay);
      if (d.bal < EPS) d.bal = 0;
    }

    for (const d of state) {
      const opening = openings.get(d.id);
      if (opening === undefined) continue;
      const payment = payments.get(d.id) ?? 0;
      const interest = opening * monthlyRate(d.aprPercent);
      monthPayment += payment;
      monthCells.push({
        id: d.id,
        name: d.name,
        openingBalance: opening,
        interest,
        payment,
        closingBalance: d.bal,
        formattedOpeningBalance: formatUsd(opening),
        formattedInterest: formatUsd(interest),
        formattedPayment: formatUsd(payment),
        formattedClosingBalance: formatUsd(d.bal),
      });
      if (d.bal <= EPS && !payoffMonth.has(d.id)) {
        payoffMonth.set(d.id, months);
      }
    }

    totalPaid += monthPayment;
    schedule.push({
      month: months,
      totalPayment: monthPayment,
      totalInterest: monthInterest,
      formattedTotalPayment: formatUsd(monthPayment),
      formattedTotalInterest: formatUsd(monthInterest),
      cards: monthCells,
    });

    if (state.some((d) => d.bal > EPS) && monthPayment <= 1e-12) {
      return null;
    }
  }

  if (state.some((d) => d.bal > EPS)) return null;

  const optimalOrder = [...cards].sort(sortByAprDesc);
  const cardPayoffs: CardPayoffSummary[] = optimalOrder.map((c, index) => ({
    id: c.id,
    name: c.name,
    aprPercent: c.aprPercent,
    payoffMonth: payoffMonth.get(c.id) ?? months,
    order: index + 1,
    formattedApr: formatApr(c.aprPercent),
  }));

  const totalPrincipal = cards.reduce((s, c) => s + c.balance, 0);
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const formattedDuration = formatDuration(months);
  const formattedOptimalOrder = optimalOrder.map((c) => c.name).join(' → ');

  return {
    months,
    years,
    remainingMonths,
    formattedDuration,
    totalInterest,
    formattedTotalInterest: formatUsd(totalInterest),
    totalPaid,
    formattedTotalPaid: formatUsd(totalPaid),
    totalPrincipal,
    formattedTotalPrincipal: formatUsd(totalPrincipal),
    optimalOrder: optimalOrder.map((c) => c.name),
    formattedOptimalOrder,
    cardPayoffs,
    schedule,
    summary: `Debt avalanche schedule in USD. Interest accrues monthly as balance × (APR/100/12) before payments. Budget $${formatUsd(input.monthlyBudget)}/mo covers minimums; surplus targets highest APR.`,
  };
}
