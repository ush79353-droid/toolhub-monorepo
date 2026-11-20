import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PMI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-pmi', label: 'What Is PMI?' },
  { id: 'how-much-is-pmi', label: 'How Much Is PMI?' },
  { id: 'what-is-pmi-rate', label: 'What Is the PMI Rate?' },
  { id: 'how-to-calculate-pmi', label: 'How to Calculate PMI' },
  { id: 'pmi-example', label: 'PMI Calculation Example' },
  { id: 'get-rid-of-pmi', label: 'How to Get Rid of PMI' },
  { id: 'twenty-percent', label: 'PMI and the 20% Down Payment' },
  { id: 'pmi-vs-fha', label: 'PMI vs. FHA Mortgage Insurance' },
  { id: 'pros-cons', label: 'Advantages and Disadvantages' },
  { id: 'pmi-vs-hoi', label: 'PMI vs. Homeowners Insurance' },
  { id: 'monthly-payment', label: 'How PMI Affects Monthly Payments' },
  { id: 'limitations', label: 'PMI Calculator Limitations' },
  { id: 'pmi-faq', label: 'Frequently Asked Questions' },
];

export const PMI_FAQS: readonly FAQItem[] = [
  {
    question: 'What is PMI on a mortgage?',
    answer:
      'Private mortgage insurance (PMI) is insurance that primarily protects the lender against certain losses if a borrower defaults on a conventional mortgage. It is often associated with smaller down payments and higher loan-to-value ratios. PMI is not homeowners insurance.',
  },
  {
    question: 'How do I calculate monthly PMI?',
    answer:
      'In this simplified model: Monthly PMI = Mortgage Amount × Annual PMI Rate / 1200 (or Annual PMI ÷ 12). Example: $360,000 × 0.5% ÷ 12 = $150. Actual premiums may use different bases and schedules.',
  },
  {
    question: 'Is PMI required with a 20% down payment?',
    answer:
      'For many conventional purchase loans, a 20% down payment (about 80% LTV) often means borrower-paid PMI is not required. Requirements still depend on the lender and product. This calculator treats LTV ≤ 80% as “generally not required” under that simplified guideline only.',
  },
  {
    question: 'How much does PMI cost on a $300,000 mortgage?',
    answer:
      'It depends on the annual rate. At an illustrative 0.5%: annual PMI = $1,500 and monthly PMI = $125. Rates vary with LTV, credit, coverage, and insurer terms — enter your assumed rate for an estimate.',
  },
  {
    question: 'Does PMI protect the buyer or the lender?',
    answer:
      'PMI primarily protects the mortgage lender (or investor) against specified default-related losses. It does not replace homeowners insurance or protect the borrower against property damage.',
  },
  {
    question: 'Can PMI be removed?',
    answer:
      'On many eligible conventional loans, PMI may be cancelable or terminate automatically under applicable rules once certain LTV and payment conditions are met. Exact rules depend on the loan and jurisdiction (for example, U.S. Homeowners Protection Act concepts). FHA mortgage insurance follows different rules.',
  },
  {
    question: 'Is PMI the same as homeowners insurance?',
    answer:
      'No. Homeowners insurance covers certain property risks. PMI relates to lender protection on a mortgage with limited equity. Both can appear in a monthly housing payment but serve different purposes.',
  },
  {
    question: 'Does FHA use private mortgage insurance?',
    answer:
      'FHA loans use FHA mortgage insurance premiums (MIP), not conventional PMI. Premium structures and cancellation rules differ. Do not apply this calculator’s conventional PMI estimate as an FHA MIP quote.',
  },
  {
    question: 'Does a larger down payment reduce PMI?',
    answer:
      'A larger down payment lowers LTV, which can eliminate the need for PMI under many conventional guidelines and may also affect pricing when PMI still applies. Exact outcomes depend on the insurer and lender.',
  },
  {
    question: 'What is loan-to-value ratio?',
    answer:
      'LTV = (Mortgage Loan Amount / Property Value) × 100. Example: $360,000 loan on a $400,000 home → 90% LTV.',
  },
  {
    question: 'Can PMI be paid upfront?',
    answer:
      'Premium structures vary. Some products use monthly premiums; others may include upfront or alternate arrangements. This calculator models a simplified annual rate converted to a monthly estimate.',
  },
  {
    question: 'Is PMI included in the mortgage payment?',
    answer:
      'Often the monthly PMI premium is collected with the mortgage payment and escrow items, but billing practices vary. Confirm with your lender or servicer how PMI appears on your statement.',
  },
];
