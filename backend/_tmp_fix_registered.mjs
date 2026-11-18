import fs from 'node:fs';
import path from 'node:path';

const p = path.resolve('../frontend/src/tools/registry/keys.ts');
let src = fs.readFileSync(p, 'utf8');
const re = /(const REGISTERED_COMPONENT_KEYS = \[[\s\S]*?)(\n\] as const)/;
const m = src.match(re);
if (!m) throw new Error('no registered');
if (m[1].includes("'LoanInterestCalculator'")) {
  console.log('already in REGISTERED');
  process.exit(0);
}
const body = m[1];
let next;
if (body.includes("'LoanPaymentCalculator'")) {
  next = body.replace(
    "\n  'LoanPaymentCalculator'",
    "\n  'LoanInterestCalculator',\n  'LoanPaymentCalculator'",
  );
} else if (body.includes("'LoanRepaymentCalculator'")) {
  next = body.replace(
    "\n  'LoanRepaymentCalculator'",
    "\n  'LoanInterestCalculator',\n  'LoanRepaymentCalculator'",
  );
} else {
  throw new Error('no neighbor');
}
src = src.replace(re, next + m[2]);
fs.writeFileSync(p, src);

const a = (src.match(/APPROVED_COMPONENT_KEYS = \[([\s\S]*?)\] as const/) || [])[1] || '';
const r = (src.match(/REGISTERED_COMPONENT_KEYS = \[([\s\S]*?)\] as const/) || [])[1] || '';
console.log({
  approved: a.includes("'LoanInterestCalculator'"),
  registered: r.includes("'LoanInterestCalculator'"),
});
