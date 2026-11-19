import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CAR_AFFORDABILITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-much-car', label: 'How much car can I afford?' },
  { id: 'how-to-use', label: 'How to use this calculator' },
  { id: 'how-much-spend', label: 'How much should you spend on a car?' },
  { id: 'total-ownership-costs', label: 'Total costs of owning a car' },
  { id: 'interest-rates', label: 'How interest rates affect affordability' },
  { id: 'loan-duration', label: 'How loan duration affects affordability' },
  { id: 'trade-in-value', label: 'How trade-in value affects affordability' },
  { id: 'related-considerations', label: 'Related financial considerations' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'car-affordability-faq', label: 'Frequently asked questions' },
];

export const CAR_AFFORDABILITY_FAQS: readonly FAQItem[] = [
  {
    question: 'How much car can I afford?',
    answer:
      'Your affordable monthly payment, available cash, trade-in contribution, loan interest rate, and loan duration together set a maximum financed principal and a maximum vehicle price. This calculator combines those inputs into an estimate — not a purchase recommendation or loan approval.',
  },
  {
    question: 'How much should I spend on a car?',
    answer:
      'A responsible budget leaves room for insurance, fuel, maintenance, and emergency savings after the payment. Common rules of thumb exist, but household income, debts, and local costs vary — treat guidelines as starting points, not universal limits.',
  },
  {
    question: 'Should I buy a car based on my monthly payment?',
    answer:
      'Monthly payment is useful, but incomplete. The same payment can support very different purchase prices depending on rate and term, and a longer loan often means more total interest. Also weigh ownership costs beyond the installment.',
  },
  {
    question: 'How does a down payment affect car affordability?',
    answer:
      'A larger down payment reduces the amount you need to finance for a given purchase price, or raises the sticker price you can target for a given monthly budget. In this tool, an optional down payment allocates money you already have — it is never added on top of that cash.',
  },
  {
    question: 'Does my trade-in value increase my car budget?',
    answer:
      'Positive trade-in equity can reduce what you finance or raise the price you can afford. If you still owe more than the trade-in is worth (negative equity), subtract that shortfall yourself — this calculator treats the entered trade-in as a positive contribution only.',
  },
  {
    question: 'How does the interest rate affect my maximum car price?',
    answer:
      'For a fixed monthly payment and term, a higher APR reduces the loan principal the payment can support, which lowers the maximum car value after cash and trade-in are added.',
  },
  {
    question: 'Is a longer car loan better?',
    answer:
      'Longer terms usually lower the monthly payment for a given loan (or raise the loan for a given payment) but increase total interest and keep you financed longer. Shorter terms cost more per month but typically less interest overall.',
  },
  {
    question: 'What other costs should I consider when buying a car?',
    answer:
      'Budget for sales tax, fees, insurance, fuel, maintenance, repairs, parking, registration, and depreciation. Optional fields in this calculator can include tax and selected fees; ongoing operating costs are still separate.',
  },
  {
    question: 'Does the Car Affordability Calculator include insurance?',
    answer:
      'No. The primary result estimates financing affordability. Insurance and other operating costs should be budgeted separately unless you fold a portion into your monthly payment figure yourself.',
  },
  {
    question: 'Can I afford a car with no down payment?',
    answer:
      'You can model zero available cash here; the maximum car value then equals the affordable loan (plus any trade-in). Lenders may still require a down payment or restrict terms based on credit and the vehicle.',
  },
  {
    question: 'What is the difference between car affordability and car loan eligibility?',
    answer:
      'Affordability is whether the payment and total ownership costs fit your budget. Eligibility is whether a lender will approve you based on credit, income, debt ratios, and collateral rules. You can be eligible for more than you should comfortably spend — or the reverse.',
  },
  {
    question: 'How much interest will I pay on my car loan?',
    answer:
      'Total interest depends on principal, APR, and number of payments. This calculator estimates interest as total scheduled payments minus the affordable loan amount for the payment and term you entered.',
  },
];
