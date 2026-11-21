import { calculateCreditCardsPayoff } from './calculation';
import { createDefaultInput } from './types';
import { validateCreditCardsPayoffInput } from './validation';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function nearlyEqual(a: number, b: number, tol = 0.02): boolean {
  return Math.abs(a - b) <= tol;
}

/** Screenshot defaults: $500 budget, three cards. */
{
  const validated = validateCreditCardsPayoffInput(createDefaultInput());
  assert(validated.isValid, 'default input should validate');
  assert(validated.result !== null, 'default input should produce a result');
  const out = validated.result!;
  assert(out.months > 0, 'default schedule should have months');
  assert(out.optimalOrder[0] === 'Card 2', 'highest APR Card 2 should be first');
  assert(out.optimalOrder[1] === 'Card 1', 'Card 1 should be second');
  assert(out.optimalOrder[2] === 'Card 3', 'Card 3 should be third');
  assert(out.totalPaid > out.totalPrincipal, 'total paid includes interest');
  assert(out.schedule.length === out.months, 'schedule length matches months');
  assert(
    out.cardPayoffs.every((c) => c.payoffMonth > 0 && c.payoffMonth <= out.months),
    'each card has a payoff month'
  );
  // Final month should leave zero balances.
  const last = out.schedule[out.schedule.length - 1]!;
  assert(
    last.cards.every((c) => c.closingBalance < 1e-6),
    'final month closes all cards'
  );
}

/** Single zero-APR card: payoff = ceil(balance / budget). */
{
  const out = calculateCreditCardsPayoff({
    monthlyBudget: 100,
    cards: [
      { id: 1, name: 'Zero', balance: 250, minimum: 50, aprPercent: 0 },
    ],
  });
  assert(out !== null, 'zero APR should solve');
  assert(out!.months === 3, `expected 3 months, got ${out!.months}`);
  assert(nearlyEqual(out!.totalInterest, 0), 'zero APR → no interest');
  assert(nearlyEqual(out!.totalPaid, 250), `paid ${out!.totalPaid}`);
}

/** Budget below minimums → validation error. */
{
  const bad = validateCreditCardsPayoffInput({
    monthlyBudget: '200',
    cards: [
      {
        name: 'A',
        balance: '1000',
        minimumPayment: '150',
        aprPercent: '20',
      },
      {
        name: 'B',
        balance: '1000',
        minimumPayment: '100',
        aprPercent: '18',
      },
    ],
  });
  assert(!bad.isValid, 'budget below mins should fail');
  assert(Boolean(bad.errors.form), 'should report form error for mins');
}

/** Blank rows ignored; partial row rejected. */
{
  const mixed = validateCreditCardsPayoffInput({
    monthlyBudget: '500',
    cards: [
      {
        name: 'Only',
        balance: '1000',
        minimumPayment: '50',
        aprPercent: '12',
      },
      { name: '', balance: '', minimumPayment: '', aprPercent: '' },
      { name: 'Half', balance: '100', minimumPayment: '', aprPercent: '10' },
    ],
  });
  assert(!mixed.isValid, 'partial row should fail');
  assert(Boolean(mixed.errors.cards?.[2]?.minimumPayment), 'min required on partial');
}

/** Equal APRs: stable id order; surplus still applied. */
{
  const out = calculateCreditCardsPayoff({
    monthlyBudget: 300,
    cards: [
      { id: 1, name: 'A', balance: 500, minimum: 50, aprPercent: 10 },
      { id: 2, name: 'B', balance: 500, minimum: 50, aprPercent: 10 },
    ],
  });
  assert(out !== null, 'equal APR should solve');
  assert(out!.optimalOrder[0] === 'A', 'equal APR prefers lower id');
  assert(out!.months > 0 && out!.months < 1200, 'finishes within cap');
}

/** Non-amortizing: tiny budget that only covers mins while interest grows. */
{
  const stuck = calculateCreditCardsPayoff({
    monthlyBudget: 20,
    cards: [
      { id: 1, name: 'Grow', balance: 10000, minimum: 20, aprPercent: 30 },
    ],
  });
  assert(stuck === null, 'payment ≤ interest should not produce a schedule');
}

console.log('credit-cards-payoff calculation.test.ts: all assertions passed');
