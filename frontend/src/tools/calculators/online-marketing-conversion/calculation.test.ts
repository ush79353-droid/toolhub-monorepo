import { solveOnlineMarketingConversion } from './calculation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const funnel = solveOnlineMarketingConversion({
  impressions: 10_000,
  ctr: 2,
  visitsToLeads: 10,
  leadsToCustomers: 20,
  totalCost: 5_000,
  revenue: 12_000,
});
assert(Math.abs((funnel.values.visits ?? 0) - 200) < 1e-9, 'visits');
assert(Math.abs((funnel.values.leads ?? 0) - 20) < 1e-9, 'leads');
assert(Math.abs((funnel.values.customers ?? 0) - 4) < 1e-9, 'customers');
assert(Math.abs((funnel.values.cpm ?? 0) - 500) < 1e-9, 'cpm');
assert(Math.abs((funnel.values.cpc ?? 0) - 25) < 1e-9, 'cpc');
assert(Math.abs((funnel.values.roi ?? 0) - 140) < 1e-9, 'roi');

const ltv = solveOnlineMarketingConversion({
  revenuePerCustomer: 100,
  ordersPerCustomer: 3,
  revenue: 400,
});
assert(Math.abs((ltv.values.customerLtv ?? 0) - 300) < 1e-9, 'customer ltv');
assert(Math.abs((ltv.values.totalLifetimeRevenue ?? 0) - 1_200) < 1e-9, 'lifetime revenue');

const noOverwrite = solveOnlineMarketingConversion({
  impressions: 1_000,
  ctr: 5,
  visits: 999,
});
assert(noOverwrite.values.visits === 999, 'manual visits preserved');

assert(solveOnlineMarketingConversion({ ctr: -1 }).errors.ctr, 'reject negative');

console.log('online-marketing-conversion calculation.test.ts: ok');
