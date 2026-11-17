/** Self-check: screenshot defaults → 1,102.24 payment and 32,268.83 interest. */
function periodRate(annual, k) {
  return Math.pow(1 + annual / 100, 1 / k) - 1;
}
function pmt(pv, r, n) {
  if (Math.abs(r) < 1e-15) return pv / n;
  return (pv * r) / (1 - Math.pow(1 + r, -n));
}
function scheduleInterest(pv, payment, r, n) {
  let bal = pv;
  let interest = 0;
  for (let i = 0; i < n; i++) {
    const int = bal * r;
    interest += int;
    bal += int - payment;
  }
  return { interest, end: bal };
}

const r = periodRate(6, 12);
const payment = pmt(100000, r, 120);
const { interest, end } = scheduleInterest(100000, payment, r, 120);
const ok =
  Math.abs(payment - 1102.240261412723) < 1e-9 &&
  Math.abs(interest - 32268.831369526742) < 1e-6 &&
  Math.abs(end) < 1e-6;
console.log(
  JSON.stringify(
    {
      payment: Number(payment.toFixed(2)),
      interest: Number(interest.toFixed(2)),
      end,
      ok,
    },
    null,
    2
  )
);
if (!ok) process.exit(1);
