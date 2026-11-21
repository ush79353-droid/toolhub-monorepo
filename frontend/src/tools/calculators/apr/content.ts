import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const APR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-apr', label: 'What Is APR?' },
  { id: 'apr-vs-rate', label: 'APR vs. Interest Rate' },
  { id: 'how-calculator-works', label: 'How Does an APR Calculator Work?' },
  { id: 'apr-formula', label: 'APR Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate APR Step by Step' },
  { id: 'fees-included', label: 'What Fees Are Included in APR?' },
  { id: 'personal-loans', label: 'APR for Personal Loans' },
  { id: 'mortgages', label: 'APR for Mortgages' },
  { id: 'auto-loans', label: 'APR for Auto Loans' },
  { id: 'credit-cards', label: 'APR for Credit Cards' },
  { id: 'fixed-vs-variable', label: 'Fixed APR vs. Variable APR' },
  { id: 'apr-vs-apy', label: 'APR vs. APY' },
  { id: 'apr-vs-ear', label: 'APR vs. Effective Annual Rate' },
  { id: 'fees-effect', label: 'How Do Loan Fees Affect APR?' },
  { id: 'term-effect', label: 'How Does Loan Term Affect APR?' },
  { id: 'compare-loans', label: 'How to Compare Loans Using APR' },
  { id: 'good-apr', label: 'What Is a Good APR?' },
  { id: 'limitations', label: 'Limitations of APR' },
  { id: 'mistakes', label: 'Common APR Calculation Mistakes' },
  { id: 'examples', label: 'APR Calculator Examples' },
  { id: 'apr-faq', label: 'Frequently Asked Questions' },
];

export const APR_FAQS: readonly FAQItem[] = [
  {
    question: 'What does APR stand for?',
    answer:
      'APR stands for annual percentage rate: a standardized way to express the yearly cost of borrowing, typically including interest and certain finance charges.',
  },
  {
    question: 'What is APR on a loan?',
    answer:
      'On an installment loan, APR reflects the annualized cost implied by the payment schedule and net proceeds the borrower actually receives after qualifying fees.',
  },
  {
    question: 'How is APR calculated?',
    answer:
      'This calculator builds amortizing payments from the financed principal and nominal rate, then solves for the periodic rate that makes the present value of those payments equal net proceeds, and annualizes that rate.',
  },
  {
    question: 'Is APR the same as interest rate?',
    answer:
      'Not always. The interest rate drives scheduled payments on the amortizing balance. APR can be higher when fees reduce cash received or increase the financed balance relative to proceeds.',
  },
  {
    question: 'Why is APR higher than the interest rate?',
    answer:
      'Upfront or financed fees mean you repay a payment stream sized for a larger (or full) principal while receiving less cash; which raises the implied annualized cost.',
  },
  {
    question: 'Can APR be lower than the interest rate?',
    answer:
      'Under this equal-payment cash-flow model with non-negative fees, APR is typically at least the nominal rate (within numerical tolerance) when fees are zero, and higher when fees reduce relative proceeds.',
  },
  {
    question: 'What fees are included in APR?',
    answer:
      'This tool includes the origination fee and other finance charges you enter. Legal APR definitions vary by product and jurisdiction; many third-party closing costs are excluded from disclosed APR.',
  },
  {
    question: 'Does loan term affect APR?',
    answer:
      'Yes. Spreading a fixed fee over more payments usually lowers APR relative to a short term with the same fee, even if total interest differs.',
  },
  {
    question: 'Does payment frequency affect APR?',
    answer:
      'Yes. Monthly, quarterly, semiannual, and annual schedules change the periodic rate and payment count. This model uses nominal rate ÷ periods per year.',
  },
  {
    question: 'Is APR calculated monthly or annually?',
    answer:
      'The solver finds a periodic rate matching your payment frequency, then reports a nominal annualized APR (periodic rate × periods per year × 100).',
  },
  {
    question: 'What is the difference between APR and APY?',
    answer:
      'APR is commonly used for borrowing cost. APY (annual percentage yield) is typically used for deposit earnings and compounds interest into an effective yearly yield.',
  },
  {
    question: 'What is the difference between APR and EAR?',
    answer:
      'This calculator’s APR is nominal annualization of the solved periodic rate. EAR (effective annual rate) compounds that periodic rate over a year: (1 + r)^m − 1.',
  },
  {
    question: 'What is a good APR for a personal loan?',
    answer:
      'There is no universal “good” APR. It depends on credit, term, market rates, collateral, and fees. Compare offers with matching terms and fee treatments.',
  },
  {
    question: 'How does credit score affect APR?',
    answer:
      'Stronger credit often qualifies for lower rates and sometimes lower fees, which can reduce both the nominal rate and the estimated APR.',
  },
  {
    question: 'How do origination fees affect APR?',
    answer:
      'Fees deducted from proceeds or paid upfront reduce net cash relative to payments. Financed fees raise the amortizing balance. Both typically increase APR versus a zero-fee loan.',
  },
  {
    question: 'How do I compare loans using APR?',
    answer:
      'Compare loans with similar amounts, terms, and payment frequencies. Also check total payments and cash due at closing; APR alone does not capture every difference.',
  },
  {
    question: 'Does APR include all closing costs?',
    answer:
      'No. Many appraisals, title fees, escrow deposits, and optional services are outside finance charges used for APR. Enter only charges you intend to treat as finance fees here.',
  },
  {
    question: 'Does paying off a loan early affect actual borrowing costs?',
    answer:
      'Yes. Early payoff can change the effective cost, especially when fees were front-loaded. Scheduled APR assumes you follow the modeled payment plan to maturity.',
  },
  {
    question: 'Can a zero-interest loan have a positive APR?',
    answer:
      'Yes. If fees reduce net proceeds while you still repay the face principal on a zero-rate schedule, the implied APR is positive.',
  },
  {
    question: 'What is the APR on a $10,000 loan with a $200 fee?',
    answer:
      'For a 10% nominal rate, 2-year monthly loan with a $200 fee deducted from proceeds, estimated APR is about 12.1% under this cash-flow model (payment ≈ $461.45; proceeds $9,800).',
  },
];
