import { calculateHoldingPeriodReturn } from './calculation';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

{
  const result = calculateHoldingPeriodReturn(100, 120, 5, 'PKR');
  assert(result !== null, 'example should solve');
  assert(result!.capitalGainsYieldPercent === 20, `cgy ${result!.capitalGainsYieldPercent}`);
  assert(result!.dividendYieldPercent === 5, `dy ${result!.dividendYieldPercent}`);
  assert(
    result!.holdingPeriodReturnPercent === 25,
    `hpr ${result!.holdingPeriodReturnPercent}`
  );
}

{
  const loss = calculateHoldingPeriodReturn(100, 80, 0, 'PKR');
  assert(loss !== null, 'loss case should solve');
  assert(loss!.capitalGainsYieldPercent === -20, 'negative cgy');
  assert(loss!.dividendYieldPercent === 0, 'zero dividend yield');
  assert(loss!.holdingPeriodReturnPercent === -20, 'negative hpr');
}

{
  assert(calculateHoldingPeriodReturn(0, 120, 5, 'PKR') === null, 'zero bought fails');
  assert(calculateHoldingPeriodReturn(100, -1, 5, 'PKR') === null, 'negative current fails');
}

console.log('holding-period-return calculation.test.ts: ok');
