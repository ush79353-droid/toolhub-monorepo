import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '../auto-loan/TableOfContents';

export interface LoanGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  bullets?: readonly string[];
  orderedSteps?: readonly string[];
  hasTermComparisonTable?: boolean;
  hasFrequencyComparisonTable?: boolean;
  hasWorkedExample?: boolean;
}

export const LOAN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-loan-calculator', label: 'What Is a Loan Calculator?' },
  { id: 'how-a-loan-calculator-works', label: 'How Does a Loan Calculator Work?' },
  { id: 'loan-payment-formula', label: 'Loan Payment Formula' },
  { id: 'how-to-use-this-calculator', label: 'How to Use This Calculator' },
  { id: 'understanding-loan-terms', label: 'Understanding Loan Terms' },
  { id: 'interest-rates-and-apr', label: 'Interest Rates and APR' },
  { id: 'payment-frequency-comparison', label: 'Monthly vs. Biweekly vs. Weekly' },
  { id: 'amortized-vs-interest-only', label: 'Amortized vs. Interest-Only Loans' },
  { id: 'extra-payments-and-savings', label: 'Extra Payments and Interest Savings' },
  { id: 'worked-loan-example', label: 'Worked Loan Calculation Example' },
  { id: 'comparing-loan-offers', label: 'Tips for Comparing Loan Offers' },
  { id: 'frequently-asked-questions', label: 'Frequently Asked Questions' },
] as const;

export const LOAN_TERM_COMPARISON = [
  {
    yearsLabel: '2 years (24 mo)',
    regularPayment: '$1,108.02',
    totalInterest: '$1,592.37',
    totalPaid: '$26,592.37',
  },
  {
    yearsLabel: '3 years (36 mo)',
    regularPayment: '$760.55',
    totalInterest: '$2,379.70',
    totalPaid: '$27,379.70',
  },
  {
    yearsLabel: '5 years (60 mo)',
    regularPayment: '$483.32',
    totalInterest: '$3,999.23',
    totalPaid: '$28,999.23',
  },
  {
    yearsLabel: '7 years (84 mo)',
    regularPayment: '$365.21',
    totalInterest: '$5,678.02',
    totalPaid: '$30,678.02',
  },
  {
    yearsLabel: '10 years (120 mo)',
    regularPayment: '$277.55',
    totalInterest: '$8,306.27',
    totalPaid: '$33,306.27',
  },
] as const;

export const LOAN_FREQUENCY_COMPARISON = [
  {
    frequency: 'Monthly (12/yr)',
    paymentsCount: '60 payments',
    periodicPayment: '$483.32 / mo',
    totalInterest: '$3,999.23',
    totalPaid: '$28,999.23',
  },
  {
    frequency: 'Biweekly (26/yr)',
    paymentsCount: '130 payments',
    periodicPayment: '$222.81 / 2 wks',
    totalInterest: '$3,965.93',
    totalPaid: '$28,965.93',
  },
  {
    frequency: 'Weekly (52/yr)',
    paymentsCount: '260 payments',
    periodicPayment: '$111.35 / wk',
    totalInterest: '$3,951.51',
    totalPaid: '$28,951.51',
  },
] as const;

export const LOAN_WORKED_EXAMPLE = {
  scenarioSummary:
    'Suppose you borrow $25,000 at a fixed 6.00% nominal APR over 5 years (60 months) with monthly payments, no origination fee, and $0 extra payments.',
  inputs: [
    { label: 'Original Loan Amount', value: '$25,000.00' },
    { label: 'Annual Interest Rate (APR)', value: '6.00% (0.50% / month)' },
    { label: 'Loan Term & Schedule', value: '5 years (60 monthly payments)' },
    { label: 'Loan Type', value: 'Amortized fixed-rate' },
    { label: 'Origination Fee', value: '$0.00' },
  ],
  outputs: [
    { label: 'Estimated Regular Payment', value: '$483.32 / mo', highlight: true },
    { label: 'Total Interest Paid', value: '$3,999.23', highlight: false },
    { label: 'Total Paid Over 60 Months', value: '$28,999.23', highlight: true },
    { label: 'Remaining Balance at End', value: '$0.00', highlight: false },
  ],
  steps: [
    {
      label: '1. Monthly Periodic Rate',
      detail: 'r = 6.00% / 100 / 12 = 0.005 (0.50% charged each month on remaining principal).',
    },
    {
      label: '2. Regular Amortized Payment',
      detail:
        'Payment = $25,000 × 0.005 / (1 − (1 + 0.005)^(-60)) = $125.00 / 0.2586278 ≈ $483.32 per month.',
    },
    {
      label: '3. Month 1 Interest vs. Principal',
      detail:
        'Month 1 interest is $25,000 × 0.005 = $125.00. The remaining $358.32 pays down principal, leaving a balance of $24,641.68.',
    },
    {
      label: '4. Extra Payment & Interest-Only Sensitivity',
      detail:
        'Adding $100/month in extra principal cuts payoff from 60 to 49 months and saves $792.93 in interest ($3,206.30 total interest). Conversely, making the first 12 months interest-only ($125.00/mo) raises the post-I/O 48-month payment to $587.13/mo and increases total interest to $4,682.00.',
    },
  ],
} as const;

export const LOAN_GUIDE_SECTIONS: readonly LoanGuideSection[] = [
  {
    id: 'what-is-a-loan-calculator',
    title: 'What Is a Loan Calculator?',
    paragraphs: [
      'A loan calculator is a planning tool that estimates your recurring payment, total interest cost, payoff timeline, and period-by-period amortization schedule before you sign a credit agreement.',
      'You can model personal loans, business financing, debt consolidation loans, fixed-rate installment credit, or interest-only structures by adjusting principal, APR, repayment length, payment frequency, origination fees, and optional extra principal payments.',
    ],
  },
  {
    id: 'how-a-loan-calculator-works',
    title: 'How Does a Loan Calculator Work?',
    paragraphs: [
      'Each scheduled payment covers two distinct components: interest accrued on the unpaid principal balance during that period, and principal repayment that reduces the balance owed for the next cycle.',
      'Early in an amortized loan, interest makes up a larger slice of each installment because the remaining principal is at its peak. As principal declines, each successive payment directs a larger share toward reducing the balance until the final installment settles the loan to $0.00.',
    ],
    bullets: [
      'Monthly schedules increment by calendar month from the selected loan start date, capping on month-end dates such as February 28 or February 29.',
      'Biweekly schedules apply 26 payments per year spaced 14 calendar days apart; weekly schedules apply 52 payments per year spaced 7 days apart.',
      'Origination fees can either be treated as upfront closing charges or rolled directly into the financed loan balance.',
      'Extra recurring or lump-sum payments are capped automatically at your remaining principal so overpayments never occur.',
    ],
  },
  {
    id: 'loan-payment-formula',
    title: 'Loan Payment Formula',
    paragraphs: [
      'For any fixed-rate amortized loan with a positive periodic interest rate (r > 0), the regular scheduled payment per period is calculated directly from the financed principal P and total payment count n:',
    ],
    formula: 'Payment = P × r / (1 − (1 + r)^(-n))   |   When APR = 0%: Payment = P / n',
    formulaNote:
      'Where P = financed principal, r = nominal APR / 100 / periods per year (12 monthly, 26 biweekly, or 52 weekly), and n = scheduled payment periods. During an interest-only period, Payment = P × r and principal remains unchanged unless extra principal is paid.',
    bullets: [
      'Nominal APR vs. Effective Rate: dividing nominal APR by 12, 26, or 52 defines the periodic interest factor r; effective annual cost rises slightly with more frequent compounding (1 + r)^m − 1.',
      'Final Installment Reconciliation: because each payment is rounded to whole cents (0.01), the final scheduled installment is adjusted automatically so total principal equals financed principal cleanly.',
    ],
  },
  {
    id: 'how-to-use-this-calculator',
    title: 'How to Use This Calculator',
    paragraphs: [
      'All calculations run immediately inside your browser as you edit values. Keep Advanced Options collapsed for a quick payment estimate or expand it to model fees and early payoff scenarios.',
    ],
    orderedSteps: [
      'Choose Amortized (standard fixed payoff) or Interest-Only mode (and set the Interest-Only Period if applicable).',
      'Enter the Loan Amount, nominal Annual Interest Rate (APR %), Loan Term (in years or months), and Payment Frequency (Monthly, Biweekly, or Weekly).',
      'Optionally open Advanced Options to enter recurring extra payments, a one-time extra payment at a chosen payment number, origination fees (upfront or financed), or a custom Loan Start Date.',
      'Click Chart or Breakdown to view principal vs. interest proportions and the remaining balance curve over time, or open Amortization Schedule to inspect period/yearly rows and export CSV.',
    ],
  },
  {
    id: 'understanding-loan-terms',
    title: 'Understanding Loan Terms',
    paragraphs: [
      'Shorter loan terms demand higher periodic payments, yet reduce cumulative interest dramatically because the lender holds your unpaid balance for fewer years. Longer terms lower the required installment while multiplying total interest.',
      'The table below illustrates how repayment length changes cost on a $25,000 amortized loan at 6.00% APR with monthly payments:',
    ],
    hasTermComparisonTable: true,
  },
  {
    id: 'interest-rates-and-apr',
    title: 'Interest Rates and APR',
    paragraphs: [
      'Your interest rate directly determines how much of each installment goes toward borrowing cost rather than debt reduction. Comparing both the nominal rate and upfront fees prevents surprises when evaluating competing loan offers.',
      'Keep in mind that financed origination fees raise both your financed principal balance and the interest charged on that balance over time, whereas upfront fees increase out-of-pocket cash needed at closing without inflating periodic loan payments.',
    ],
    bullets: [
      '0% Promotional APR: every dollar paid goes strictly to principal, making Total Paid equal to financed principal.',
      'Nominal Periodic Conversion: a 6.00% nominal APR converts to 0.5000% per month, 0.2308% per biweekly period, and 0.1154% per week.',
    ],
  },
  {
    id: 'payment-frequency-comparison',
    title: 'Monthly vs. Biweekly vs. Weekly Payments',
    paragraphs: [
      'Choosing biweekly (every 14 days) or weekly (every 7 days) installments reduces principal slightly sooner than monthly installments across the same nominal loan length because principal shrinks multiple times before a full calendar month accrues interest.',
      'Notice the modest interest reduction across identical 5-year terms on a $25,000 loan at 6.00% APR below. Even larger savings occur when borrowers make extra principal payments or pay half a monthly installment every two weeks (equivalent to 13 monthly payments per year):',
    ],
    hasFrequencyComparisonTable: true,
  },
  {
    id: 'amortized-vs-interest-only',
    title: 'Amortized vs. Interest-Only Loans',
    paragraphs: [
      'An amortized loan schedules every regular payment to cover both periodic interest and principal reduction so the loan reaches a $0.00 balance at maturity. Most personal, auto, and installment loans use fixed-rate amortization.',
      'An interest-only loan lowers required payments during a defined introductory window where regular installments pay only accrued interest. Because scheduled interest-only payments do not reduce principal, either required payments jump noticeably once amortization begins over the shorter remaining term, or the full original principal remains due at maturity if the entire term is interest-only.',
    ],
    bullets: [
      'Mixed Interest-Only Example: 12 months I/O at $125.00/mo followed by 48 months amortized at $587.13/mo raises total interest to $4,682.00 on a $25,000 6% loan.',
      'Full-Term Interest-Only: setting the I/O period equal to the entire 60-month term results in $125.00/mo payments totaling $7,500.00 in interest, with $25,000.00 principal still owed at the end.',
    ],
  },
  {
    id: 'extra-payments-and-savings',
    title: 'Extra Payments and Interest Savings',
    paragraphs: [
      'Extra principal payments reduce the unpaid balance immediately without increasing future minimum payments, which shrinks interest accrued in every subsequent period and pulls your payoff date forward.',
      'You can test recurring extra payments applied every scheduled payment, once per calendar month, or once per year—as well as a single one-time lump-sum payment applied at any scheduled installment.',
    ],
    bullets: [
      'Interest Savings Metric: displays exact dollars saved compared against an identical loan without extra payments.',
      'Automatic Overpayment Guard: extra payments stop automatically once the principal balance reaches $0.00.',
    ],
  },
  {
    id: 'worked-loan-example',
    title: 'Worked Loan Calculation Example',
    paragraphs: [
      'Walk through a complete $25,000 loan example step by step to verify how periodic rate, amortized installment, first-month interest split, extra principal savings, and interest-only deferral behave.',
    ],
    hasWorkedExample: true,
  },
  {
    id: 'comparing-loan-offers',
    title: 'Tips for Comparing Loan Offers',
    paragraphs: [
      'A slightly lower monthly installment can conceal higher total interest, longer debt duration, or costly origination fees. Reviewing every offer on a standardized baseline reveals its true financial cost.',
    ],
    bullets: [
      'Compare Total Paid plus upfront origination fees alongside periodic installment size.',
      'Confirm whether the lender allows extra principal payments without prepayment penalties.',
      'Check whether the quoted rate assumes autopay discounts or variable rate adjustments.',
      'Match payment dates cleanly with your paycheck schedule (biweekly or weekly) to avoid cash-flow timing gaps.',
    ],
  },
] as const;

export const LOAN_FAQS: readonly FAQItem[] = [
  {
    question: 'How does the Loan Calculator convert APR for biweekly and weekly payments?',
    answer:
      'It uses standard nominal APR division: Annual Rate / 100 / 12 for monthly payments, / 26 for biweekly payments (every 14 days), and / 52 for weekly payments (every 7 days). Each period calculates interest on the unpaid principal balance from the prior period.',
  },
  {
    question: 'What is the difference between Amortized and Interest-Only loans?',
    answer:
      'An Amortized loan repays both interest and principal on every scheduled installment so the ending balance reaches zero at payoff. An Interest-Only loan charges only accrued interest during the chosen I/O period; principal stays unpaid until amortization begins over the remaining periods (or until maturity if set to the full term).',
  },
  {
    question: 'How are extra payments applied to my loan?',
    answer:
      'Recurring additional payments and one-time lump-sum extra payments go 100% directly toward reducing remaining principal. Lowering principal early reduces future interest charges, shortens payoff time, and is automatically capped so you never overpay past a $0.00 balance.',
  },
  {
    question: 'Should I roll an origination fee into the loan or pay it upfront?',
    answer:
      'Paying the origination fee upfront keeps your financed loan balance smaller, avoiding extra interest charges on the fee itself. Rolling it into the loan lowers cash due at closing, but increases both regular payments and cumulative interest paid over the loan term.',
  },
  {
    question: 'Does changing the display currency convert monetary amounts using live FX rates?',
    answer:
      'No. Currency selection changes the denomination and formatting only (for example USD, PKR, EUR, AED, JPY, or KWD). It does not apply live exchange-rate conversions, and entered amounts are not converted when you switch currencies.',
  },
  {
    question: 'Are any of my loan details or calculation inputs sent to a server?',
    answer:
      'No. All amortization math, extra-payment schedules, charts, and CSV exports run entirely inside your browser with zero financial input sent to external APIs or databases.',
  },
] as const;

