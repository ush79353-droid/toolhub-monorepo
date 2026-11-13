import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from './TableOfContents';

export interface AutoLoanGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  formula?: string;
  formulaNote?: string;
  orderedSteps?: readonly string[];
  hasTermComparisonTable?: boolean;
  hasWorkedExample?: boolean;
}

export interface TermComparisonRow {
  months: number;
  yearsLabel: string;
  monthlyPayment: string;
  totalInterest: string;
  totalPayments: string;
}

export interface WorkedExampleSummary {
  scenarioSummary: string;
  inputs: readonly { label: string; value: string }[];
  steps: readonly { label: string; detail: string }[];
  outputs: readonly { label: string; value: string; highlight?: boolean }[];
}

export const AUTO_LOAN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-an-auto-loan', label: 'What Is an Auto Loan?' },
  { id: 'how-does-an-auto-loan-work', label: 'How Does an Auto Loan Work?' },
  { id: 'auto-loan-payment-formula', label: 'Auto Loan Payment Formula' },
  { id: 'how-to-use-this-calculator', label: 'How to Use This Calculator' },
  { id: 'understanding-down-payments', label: 'Understanding Down Payments' },
  { id: 'interest-rates-and-loan-terms', label: 'Interest Rates and Loan Terms' },
  { id: 'trade-in-value-and-equity', label: 'Trade-in Value and Equity' },
  { id: 'sales-tax-and-additional-fees', label: 'Sales Tax and Additional Fees' },
  { id: 'worked-calculation-example', label: 'Worked Calculation Example' },
  { id: 'tips-for-comparing-auto-loans', label: 'Tips for Comparing Auto Loans' },
  { id: 'frequently-asked-questions', label: 'Frequently Asked Questions' },
] as const;

export const AUTO_LOAN_TERM_COMPARISON: readonly TermComparisonRow[] = [
  {
    months: 36,
    yearsLabel: '3 years',
    monthlyPayment: '$760.55',
    totalInterest: '$2,379.70',
    totalPayments: '$27,379.70',
  },
  {
    months: 48,
    yearsLabel: '4 years',
    monthlyPayment: '$587.13',
    totalInterest: '$3,182.00',
    totalPayments: '$28,182.00',
  },
  {
    months: 60,
    yearsLabel: '5 years',
    monthlyPayment: '$483.32',
    totalInterest: '$3,999.23',
    totalPayments: '$28,999.23',
  },
  {
    months: 72,
    yearsLabel: '6 years',
    monthlyPayment: '$414.32',
    totalInterest: '$4,831.23',
    totalPayments: '$29,831.23',
  },
] as const;

export const AUTO_LOAN_WORKED_EXAMPLE: WorkedExampleSummary = {
  scenarioSummary:
    'Suppose you negotiate a vehicle price of $32,000.00, bring a $4,000.00 down payment, and trade in a car worth $8,000.00 that still has a $3,000.00 loan balance. Local sales tax is 6.5% assessed after trade-in credit and financed into the loan, while $440.00 in title and registration fees are paid upfront. The lender offers 6.0% APR for 60 months starting Nov 11, 2026.',
  inputs: [
    { label: 'Auto Price', value: '$32,000.00' },
    { label: 'Down Payment', value: '$4,000.00 (12.50%)' },
    { label: 'Trade-in Value / Owed', value: '$8,000.00 / $3,000.00' },
    { label: 'Sales Tax', value: '6.5% (after trade-in, financed)' },
    { label: 'Additional Fees', value: '$440.00 (paid upfront)' },
    { label: 'Term & Rate', value: '60 months at 6.0% APR' },
  ],
  steps: [
    {
      label: '1. Net Trade-in Equity',
      detail: '$8,000.00 − $3,000.00 = $5,000.00 positive equity applied toward the vehicle.',
    },
    {
      label: '2. Taxable Vehicle Amount & Sales Tax',
      detail:
        '($32,000.00 − $8,000.00) × 6.5% = $24,000.00 × 0.065 = $1,560.00 financed tax.',
    },
    {
      label: '3. Amount Financed (P)',
      detail:
        '$32,000.00 − $4,000.00 − $5,000.00 + $1,560.00 financed tax + $0.00 financed fees = $24,560.00.',
    },
    {
      label: '4. Monthly Payment (M)',
      detail:
        'With r = 6% ÷ 12 = 0.005 and n = 60, M = $24,560 × 0.005 × (1.005)^60 / ((1.005)^60 − 1) = $474.81 per month (final payment reconciles to $475.06).',
    },
  ],
  outputs: [
    { label: 'Monthly Payment', value: '$474.81 / mo', highlight: true },
    { label: 'Amount Financed', value: '$24,560.00' },
    { label: 'Total Interest', value: '$3,928.85' },
    { label: 'Total Loan Payments', value: '$28,488.85' },
    { label: 'Upfront Costs', value: '$4,440.00' },
    { label: 'Total Estimated Cost', value: '$37,928.85' },
    { label: 'Estimated Payoff Date', value: 'Nov 11, 2031' },
  ],
};

export const AUTO_LOAN_HOW_TO_USE: readonly string[] = [
  'Enter the negotiated Auto Price and select your Display Currency (note: currency selection changes symbol and number formatting only, without exchange-rate conversion).',
  'Enter your Down Payment as either a currency amount or percentage of vehicle price, then set your Loan Term (months or years) and expected Annual Interest Rate (APR).',
  'If trading in a car, add both your Trade-in Value and Amount Owed on Trade-in so the calculator computes net positive or negative trade-in equity automatically.',
  'Enter your Sales Tax Rate and Additional Fees, then choose whether sales tax applies after trade-in credit or on the full vehicle price, and whether to finance tax and fees or pay them upfront.',
  'Review your Monthly Payment, Amount Financed, Total Interest, Upfront Costs, Total Estimated Cost, Payoff Date, Principal vs. Interest chart, and Amortization Schedule (Monthly or Yearly CSV download).',
];

export const AUTO_LOAN_GUIDE_SECTIONS: readonly AutoLoanGuideSection[] = [
  {
    id: 'what-is-an-auto-loan',
    title: 'What Is an Auto Loan?',
    paragraphs: [
      'An auto loan is a secured installment loan used to finance a new or used vehicle. Because the vehicle itself serves as collateral, auto loans generally carry lower annual percentage rates (APRs) than unsecured personal loans or credit cards.',
      'Instead of paying the full out-the-door price in cash on day one, you borrow the remaining balance after your down payment and trade-in equity, then repay that financed principal plus interest in fixed monthly installments over an agreed term.',
      'All calculations on this page run locally in your browser for educational planning and should be used as mathematical estimates alongside an official lender disclosure.',
    ],
  },
  {
    id: 'how-does-an-auto-loan-work',
    title: 'How Does an Auto Loan Work?',
    paragraphs: [
      'Most consumer car loans follow standard fixed-rate monthly amortization. Each billing cycle, interest accrues on the unpaid principal balance from the prior month. The rest of your fixed monthly payment directly reduces principal.',
      'During the early months of a loan, the starting balance is at its peak, so a larger share of each monthly payment goes toward interest. As your balance declines over time, the interest portion shrinks and a steadily larger portion pays off principal until the ending balance reaches zero.',
    ],
    bullets: [
      'Amount Financed equals vehicle price minus down payment minus net trade-in equity, plus any financed sales tax and dealer fees.',
      'Upfront Costs include your cash down payment plus any sales tax or dealer fees you choose to pay at signing.',
      'Total Estimated Cost combines upfront cash, positive net trade-in equity applied to the purchase, and all scheduled loan payments.',
    ],
  },
  {
    id: 'auto-loan-payment-formula',
    title: 'Auto Loan Payment Formula',
    paragraphs: [
      'For any fixed-rate loan with a positive interest rate (APR > 0%), the monthly installment M is calculated from the financed principal P, monthly periodic rate r = APR / 12 / 100, and total number of monthly payments n:',
    ],
    formula: 'M = P × r × (1 + r)^n / ((1 + r)^n − 1)',
    formulaNote:
      'When APR is 0% (such as promotional zero-interest dealer financing), r = 0 and the monthly payment simplifies directly to M = P / n.',
    bullets: [
      'M = Scheduled monthly principal-and-interest payment',
      'P = Amount financed (starting loan principal)',
      'r = Monthly interest rate (Annual Interest Rate ÷ 12 ÷ 100)',
      'n = Loan term in months (for example, 5 years = 60 months)',
      'Rounding reconciliation: Because lenders and schedules round each payment and interest charge to two decimal places, the final payment adjusts slightly so ending principal reaches $0.00 cleanly.',
    ],
  },
  {
    id: 'how-to-use-this-calculator',
    title: 'How to Use This Calculator',
    paragraphs: [
      'Adjust any input in the calculator panel to see monthly payments, borrowing cost, and payoff timing update immediately in your browser:',
    ],
    orderedSteps: AUTO_LOAN_HOW_TO_USE,
  },
  {
    id: 'understanding-down-payments',
    title: 'Understanding Down Payments',
    paragraphs: [
      'A down payment is cash paid upfront toward the purchase price at signing. Every extra dollar put down reduces your Amount Financed one-for-one, trimming both your monthly payment and lifetime interest cost.',
      'Larger down payments also reduce the risk of owing more than a depreciating car is worth during the first few years of ownership. Many buyers target 10% to 20% down on a vehicle purchase, though exact lender requirements vary by credit profile and vehicle age.',
    ],
  },
  {
    id: 'interest-rates-and-loan-terms',
    title: 'Interest Rates and Loan Terms',
    paragraphs: [
      'Your APR and repayment length interact closely. Longer terms stretch repayment across more months to lower the required monthly payment, while shorter terms clear principal faster and save substantial money in total interest.',
      'The comparison below models a $25,000.00 financed balance at a fixed 6.0% APR across four common auto loan terms:',
    ],
    hasTermComparisonTable: true,
  },
  {
    id: 'trade-in-value-and-equity',
    title: 'Trade-in Value and Equity',
    paragraphs: [
      'Net trade-in equity equals the dealer offer for your current vehicle minus any remaining loan balance still owed on that vehicle:',
    ],
    formula: 'Net Trade-in Equity = Trade-in Value − Amount Owed on Trade-in',
    bullets: [
      'Positive equity (Value > Owed): Acts just like an additional down payment, reducing your financed principal.',
      'Negative equity (Value < Owed): Known as being "upside down." The unpaid gap rolls into your new auto loan, increasing your financed balance, monthly payment, and total interest.',
    ],
  },
  {
    id: 'sales-tax-and-additional-fees',
    title: 'Sales Tax and Additional Fees',
    paragraphs: [
      'Vehicle buyers frequently underestimate how sales tax, title, registration, and documentation charges affect total financing costs. Depending on state or regional tax law, sales tax is assessed either on the price minus trade-in allowance or on the full vehicle purchase price before trade-in.',
      'Use the Sales Tax Basis selector to switch between both tax policies, and use the Finance vs. Pay Upfront toggles to see how rolling taxes or dealer fees into the loan changes both monthly installments and cash required at signing.',
    ],
  },
  {
    id: 'worked-calculation-example',
    title: 'Worked Calculation Example',
    paragraphs: [
      'Follow these step-by-step numbers to see how negotiated price, cash down, trade-in equity, taxable basis, and upfront fees combine before amortization begins:',
    ],
    hasWorkedExample: true,
  },
  {
    id: 'tips-for-comparing-auto-loans',
    title: 'Tips for Comparing Auto Loans',
    paragraphs: [
      'Negotiating the vehicle price separately from financing terms makes dealer quotes far easier to evaluate fairly:',
    ],
    bullets: [
      'Compare total out-the-door cost and total interest paid, not monthly payment alone.',
      'Secure a pre-approved APR quote from a bank or credit union before visiting the dealership so you have a clear rate benchmark.',
      'Watch out for extended 72- to 84-month terms that mask high borrowing costs with lower monthly installments.',
      'If you have negative trade-in equity, consider paying it down at signing or keeping your current car longer instead of rolling old debt into a new depreciating asset.',
    ],
  },
];

export const AUTO_LOAN_FAQS: readonly FAQItem[] = [
  {
    question: 'Does changing the display currency convert amounts using exchange rates?',
    answer:
      'No. Currency selection changes the denomination and formatting only — not the exchange rate. Amounts are not converted when you switch currencies. Always enter vehicle price, down payment, trade-in figures, and fees in the same currency you select.',
  },
  {
    question: 'How does financing sales tax and dealer fees affect my monthly payment?',
    answer:
      'Selecting "Finance tax" or "Finance fees" adds those charges to Amount Financed, lowering the Upfront Costs due at signing while increasing your monthly payment and total interest paid over the loan term. Selecting "Pay upfront" adds those amounts to Upfront Costs instead.',
  },
  {
    question: 'Why does the calculator ask for Sales Tax Basis?',
    answer:
      'Some jurisdictions tax only the difference between the new vehicle price and the trade-in value, while others tax the full vehicle price before trade-in allowance. The Sales Tax Basis selector lets you match your local tax rule without hidden assumptions.',
  },
  {
    question: 'What happens when Amount Owed exceeds Trade-in Value?',
    answer:
      'You have negative trade-in equity. For example, if your car is valued at $5,000 and you still owe $7,000, the −$2,000 net equity increases your financed loan principal by $2,000 unless covered by a larger down payment.',
  },
  {
    question: 'Why can the final monthly payment differ by a few cents?',
    answer:
      'Each monthly payment and interest charge is rounded to the nearest cent. Over dozens of billing cycles, tiny cent-level rounding differences accumulate; adjusting the final payment ensures cumulative principal paid equals Amount Financed exactly and leaves a $0.00 ending balance.',
  },
  {
    question: 'Is any of my financial data sent to a backend server?',
    answer:
      'No. This calculator runs 100% client-side inside your browser. Inputs, amortization tables, and CSV downloads never leave your device.',
  },
];
