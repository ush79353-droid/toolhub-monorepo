import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HOME_AFFORDABILITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-much-home', label: 'How Much Home Can I Afford?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'how-to-calculate', label: 'How to Calculate House Affordability' },
  { id: 'mortgage-rates', label: 'How Mortgage Rates Affect Affordability' },
  { id: 'budget-homeownership', label: 'How to Budget for Homeownership' },
  { id: 'common-expenses', label: 'Common Expenses When Buying a Home' },
  { id: 'dti-limits', label: 'Front-End vs. Back-End DTI' },
  { id: 'down-payment', label: 'How Down Payment Affects Affordability' },
  { id: 'vs-preapproval', label: 'Affordability vs. Mortgage Preapproval' },
  { id: 'limitations', label: 'Limitations of Affordability Estimates' },
  { id: 'home-affordability-faq', label: 'Frequently Asked Questions' },
];

export const HOME_AFFORDABILITY_FAQS: readonly FAQItem[] = [
  {
    question: 'How does down payment affect home affordability?',
    answer:
      'A larger down payment reduces the loan principal needed for the same purchase price, which usually lowers monthly principal-and-interest. It also uses more cash up front, so leave room for closing costs and reserves.',
  },
  {
    question: 'How much mortgage can I qualify for if I earn $60,000 a year?',
    answer:
      'There is no single approved amount. Example assumptions only: $60,000 gross income ($5,000/mo), $400 other monthly debts, 28%/36% DTI, 6.5% rate, 30-year term, $20,000 down, no taxes/insurance/HOA. Front-end limit = $1,400; back-end = $1,400. The mortgage principal that fits that housing budget depends on rate, term, and ownership expenses. Use the calculator with your real inputs.',
  },
  {
    question: 'How do I know what house I can afford?',
    answer:
      'Start with a comfortable housing budget (or income and DTI limits), then account for rate, term, down payment, property taxes, insurance, HOA, and other debts. Compare the estimated total monthly housing payment with what you can sustain, not only the lender’s maximum.',
  },
  {
    question: 'What is the 28/36 rule?',
    answer:
      'An illustrative guideline: front-end DTI near 28% of gross income for housing, and back-end DTI near 36% for housing plus other qualifying debts. Lenders and programs may use different limits. This calculator defaults to 28/36 but lets you change them.',
  },
  {
    question: 'Does a higher down payment increase affordability?',
    answer:
      'It can increase the purchase price reachable for a given monthly budget by shrinking the loan. It may also reduce or eliminate mortgage insurance in real lending. Using every available dollar as down payment is not always wise if it leaves no emergency reserves.',
  },
  {
    question: 'How does interest rate affect mortgage payments?',
    answer:
      'For the same loan amount and term, a higher rate raises monthly principal-and-interest. For a fixed payment budget, a higher rate reduces the maximum loan principal you can support.',
  },
  {
    question: 'Does home affordability include property taxes and insurance?',
    answer:
      'This calculator treats maximum payment as a total housing budget and includes property tax rate, homeowners insurance, HOA, and optional mortgage-insurance rate in the total monthly housing payment when you enter them.',
  },
  {
    question: 'Is home affordability the same as mortgage approval?',
    answer:
      'No. This tool estimates affordability from your assumptions. Lender approval also depends on credit, verified income, employment, assets, program rules, and underwriting.',
  },
  {
    question: 'Can I afford a home with existing debt?',
    answer:
      'Yes in many cases, but qualifying monthly debts reduce back-end housing capacity. If debts already consume most of the back-end DTI allowance, little or no housing budget remains under those limits.',
  },
  {
    question: 'What costs are not included in a mortgage affordability estimate?',
    answer:
      'Maintenance, repairs, utilities, furnishings, moving costs, and many lifestyle expenses are often outside the monthly housing estimate. Closing costs may be estimated separately and are not the same as down payment.',
  },
];
