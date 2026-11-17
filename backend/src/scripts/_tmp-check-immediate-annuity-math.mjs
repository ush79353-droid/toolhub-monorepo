/**
 * Standalone immediate-annuity PMT check (annuity-due, monthly, matching payment compound).
 * PMT = PV * r / (1 - (1+r)^(-(n-1))) for due with FV=0? 
 * Standard due: PMT = PV * r / ((1+r) * (1 - (1+r)^(-n))) * (1+r) wait.
 * Ordinary: PMT = PV * r / (1 - (1+r)^(-n))
 * Due: PMT = ordinary / (1+r)  when FV=0 and first payment immediate... 
 * Actually for annuity due (withdraw at start): 
 *   PMT = PV * r / (1 - (1+r)^(-(n-1))) / (1+r) * (1+r) = PV * r / (1 - (1+r)^(-(n-1))) ? 
 * Omni / shared engine: period rate from APR with m=q: r = APR/12 for monthly.
 */

function periodRate(aprPercent, m, q) {
  const apr = aprPercent / 100;
  return Math.pow(1 + apr / m, m / q) - 1;
}

function pmtDueDeplete(pv, r, n) {
  if (Math.abs(r) < 1e-15) return pv / n;
  // Annuity due withdrawal to FV=0:
  // PV = PMT * (1 + (1 - (1+r)^(-(n-1))) / r)
  // => PMT = PV / (1 + (1 - (1+r)^(-(n-1))) / r)
  const factor = 1 + (1 - Math.pow(1 + r, -(n - 1))) / r;
  return pv / factor;
}

const pv = 100000;
const apr = 1.5;
const n = 120;
const r = periodRate(apr, 12, 12);
const pmt = pmtDueDeplete(pv, r, n);
const total = pmt * n;
const ret = total - pv;

console.log(
  JSON.stringify(
    {
      r,
      pmt: Number(pmt.toFixed(6)),
      pmtRounded: Number(pmt.toFixed(2)),
      total: Number(total.toFixed(2)),
      totalReturn: Number(ret.toFixed(2)),
      n,
    },
    null,
    2
  )
);

if (!(pmt > 890 && pmt < 910)) {
  console.error('PMT out of expected band');
  process.exit(1);
}
