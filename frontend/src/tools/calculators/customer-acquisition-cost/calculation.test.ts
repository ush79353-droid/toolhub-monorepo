import { calculateCustomerAcquisitionCost } from './calculation';
import { createDefaultInput } from './types';
import { validateCustomerAcquisitionCostInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(calculateCustomerAcquisitionCost(50_000, 30_000, 200, 'PKR')?.cac === 400, 'example CAC');
assert(calculateCustomerAcquisitionCost(0, 0, 10, 'PKR')?.cac === 0, 'zero costs');
assert(calculateCustomerAcquisitionCost(100, 0, 0, 'PKR') === null, 'reject zero customers');
assert(calculateCustomerAcquisitionCost(-1, 0, 10, 'PKR') === null, 'reject negative');

const blank = validateCustomerAcquisitionCostInput(createDefaultInput());
assert(!blank.isValid && blank.incomplete, 'blank incomplete');

const bad = validateCustomerAcquisitionCostInput({
  ...createDefaultInput(),
  costOfMarketing: '50000',
  costOfSales: '30000',
  newCustomers: '0',
});
assert(!bad.isValid && bad.errors.newCustomers, 'reject zero customers in validation');

const ok = validateCustomerAcquisitionCostInput({
  ...createDefaultInput(),
  costOfMarketing: '50000',
  costOfSales: '30000',
  newCustomers: '200',
});
assert(ok.isValid && ok.parsed, 'valid example');

console.log('customer-acquisition-cost calculation.test.ts: ok');
