import { calculateOperatingMargin, formatOperatingMarginPercent } from './calculation';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function nearlyEqual(a: number, b: number, tol = 1e-12): boolean {
  return Math.abs(a - b) <= tol;
}

{
  const r = calculateOperatingMargin({
    revenue: 1000000,
    cogs: 400000,
    operatingExpenses: 250000,
  });
  assert(r !== null, 'positive case');
  assert(nearlyEqual(r!.operatingIncome, 350000), 'income');
  assert(nearlyEqual(r!.marginPercent, 35), 'margin 35%');
  assert(formatOperatingMarginPercent(r!.marginPercent) === '35.00', 'format');
}

{
  const r = calculateOperatingMargin({
    revenue: 100000,
    cogs: 80000,
    operatingExpenses: 40000,
  });
  assert(r !== null, 'negative case');
  assert(nearlyEqual(r!.operatingIncome, -20000), 'neg income');
  assert(nearlyEqual(r!.marginPercent, -20), 'neg margin');
}

{
  assert(
    calculateOperatingMargin({ revenue: 0, cogs: 1, operatingExpenses: 1 }) === null,
    'zero revenue blocked'
  );
}

console.log('operating-margin calculation.test.ts: ok');
