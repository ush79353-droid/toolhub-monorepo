import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HELOC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-heloc', label: 'What Is a HELOC?' },
  { id: 'how-heloc-works', label: 'How Does a HELOC Work?' },
  { id: 'draw-period', label: 'Draw Period' },
  { id: 'repayment-period', label: 'Repayment Period' },
  { id: 'heloc-loan-amount', label: 'How to Calculate HELOC Amount' },
  { id: 'heloc-payment', label: 'How to Calculate HELOC Payment' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'fixed-vs-variable', label: 'Fixed vs Variable Rates' },
  { id: 'heloc-fees', label: 'Fees and Additional Costs' },
  { id: 'heloc-vs-home-equity-loan', label: 'HELOC vs Home Equity Loan' },
  { id: 'pros-cons', label: 'Advantages and Disadvantages' },
  { id: 'reduce-interest', label: 'How to Reduce Interest Costs' },
  { id: 'draw-ends', label: 'When the Draw Period Ends' },
  { id: 'payment-shock', label: 'HELOC Payment Shock' },
  { id: 'limitations', label: 'Calculator Limitations' },
  { id: 'heloc-faq', label: 'Frequently Asked Questions' },
];

export const HELOC_FAQS: readonly FAQItem[] = [
  {
    question: 'Is HELOC interest tax deductible?',
    answer:
      'Tax treatment depends on your jurisdiction, how you use the borrowed funds, and current tax rules. Interest on funds used for certain home improvements may qualify in some places, while other uses may not. This calculator does not provide tax advice — confirm deductibility with a qualified tax professional.',
  },
  {
    question: 'How do I get a HELOC?',
    answer:
      'Lenders typically review credit history, income, existing mortgage balance, home value, and combined loan-to-value. You apply, complete underwriting (often including an appraisal), and if approved receive a revolving credit limit. Terms, fees, and eligibility vary by lender.',
  },
  {
    question: 'How is HELOC interest calculated?',
    answer:
      'This model uses Monthly interest = outstanding balance × (APR ÷ 12). Many lenders accrue interest daily using a daily rate. Actual statements can differ from this monthly simplification.',
  },
  {
    question: 'How is interest calculated on a HELOC vs a mortgage?',
    answer:
      'A traditional mortgage usually amortizes from day one with fixed principal-and-interest payments. A HELOC often charges interest only on the drawn balance during a draw period, then amortizes remaining principal during repayment. HELOC rates are also more commonly variable.',
  },
  {
    question: 'How are HELOC interest rates calculated?',
    answer:
      'Variable HELOCs often use an index (such as a prime rate) plus a lender margin, subject to caps and floors. This calculator models a simplified percentage-point adjustment schedule with an optional lifetime ceiling — not a full index-and-margin contract.',
  },
  {
    question: 'What is a HELOC draw period?',
    answer:
      'The draw period is the stage when you may borrow against the approved credit line (subject to lender rules). Many products allow interest-only payments during this stage. This calculator models interest-only payments with no additional draws.',
  },
  {
    question: 'What happens after the draw period?',
    answer:
      'Borrowing usually stops under standard repayment arrangements, and the outstanding balance is repaid with principal-and-interest installments over the repayment term. Payments often rise compared with interest-only amounts.',
  },
  {
    question: 'Can HELOC interest rates change?',
    answer:
      'Yes, if your agreement is variable. Rates can rise or fall with the index, within any contractual caps. Fixed-rate HELOCs or fixed-rate conversion options exist with some lenders.',
  },
  {
    question: 'Can I pay off a HELOC early?',
    answer:
      'Early repayment is generally allowed, but some lenders charge early closure or prepayment fees. Check your credit agreement before accelerating payoff.',
  },
  {
    question: 'Is HELOC interest-only during the draw period?',
    answer:
      'Some HELOCs offer interest-only minimum payments during the draw period; others require principal payments. This calculator assumes interest-only during the draw period for planning clarity.',
  },
  {
    question: 'What is the difference between a HELOC and a home equity loan?',
    answer:
      'A HELOC is revolving credit you can draw and repay during the draw period. A home equity loan is typically a lump-sum installment loan with a fixed payment schedule from the start.',
  },
  {
    question: 'How much HELOC can I qualify for?',
    answer:
      'Available credit often depends on home value, mortgage balance, CLTV limits, income, creditworthiness, and lender policy. A common illustration is Potential credit ≈ (Home value × CLTV limit) − existing mortgage debt — actual approval may be lower.',
  },
  {
    question: 'Does a HELOC affect my credit score?',
    answer:
      'Applications can trigger hard inquiries. Utilization of revolving credit, payment history, and account age can also influence scores. Responsible use and on-time payments matter.',
  },
  {
    question: 'What is a good HELOC interest rate?',
    answer:
      'There is no universal “good” rate. Competitive offers depend on market conditions, credit profile, loan-to-value, lender, and whether the rate is fixed or variable.',
  },
  {
    question: 'Can my HELOC monthly payment increase?',
    answer:
      'Yes. Variable rates can raise interest-only payments, and transitioning into amortizing repayment often increases the payment even if the rate is unchanged.',
  },
  {
    question: 'What are HELOC closing costs?',
    answer:
      'Common costs include application, appraisal, origination, title, and recording fees. Some lenders waive or rebate certain fees. This calculator separates percentage and fixed upfront fees from annual maintenance fees.',
  },
  {
    question: 'Can I use a HELOC for home renovation?',
    answer:
      'Home improvement is a common use case. Because the home secures the line, renovation overruns or declining home values still carry foreclosure risk if obligations are not met.',
  },
  {
    question: 'How can I minimize HELOC interest?',
    answer:
      'Borrow only what you need, pay down principal during the draw period when possible, compare adjustment terms and caps, and monitor variable-rate changes.',
  },
  {
    question: 'What happens if I cannot repay my HELOC?',
    answer:
      'Missed payments can trigger late fees, collections, damage to credit, and — because the home is collateral — foreclosure risk under the credit agreement and local law.',
  },
  {
    question: 'How much is the monthly payment on a 50,000 HELOC?',
    answer:
      'At 6% during an interest-only draw period: 50,000 × 0.06 / 12 = 250 per month. Amortizing repayment payments differ — for example, about 358.22 per month for a 20-year repayment at 6% on the same balance.',
  },
];
