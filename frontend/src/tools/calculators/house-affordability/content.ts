import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HOUSE_AFFORDABILITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-much-house', label: 'How Much House Can I Afford?' },
  { id: 'front-end-ratio', label: 'Front-End Ratio' },
  { id: 'back-end-ratio', label: 'Back-End Ratio' },
  { id: 'conventional-2836', label: 'Conventional Loans & 28/36' },
  { id: 'fha-loans', label: 'FHA Loans' },
  { id: 'va-loans', label: 'VA Loans' },
  { id: 'custom-dti', label: 'Custom Debt-to-Income Ratios' },
  { id: 'unaffordability', label: 'Unaffordability' },
  { id: 'fixed-vs-income', label: 'Fixed Budget vs. Income-Based' },
  { id: 'expenses-beyond', label: 'Expenses Beyond the Mortgage' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'formula', label: 'House Affordability Formula' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'house-affordability-faq', label: 'Frequently Asked Questions' },
];

export const HOUSE_AFFORDABILITY_FAQS: readonly FAQItem[] = [
  {
    question: 'How much house can I afford with a $120,000 annual income?',
    answer:
      'It depends on debts, rate, term, down payment, taxes, insurance, HOA, and DTI assumptions. Under an illustrative 28/36 conventional profile with $0 other monthly debts, the housing budget starts near $2,800/mo ($10,000 × 28%). The resulting house price also depends on interest rate and ownership costs. Use the income-based calculator with your real inputs.',
  },
  {
    question: 'What is the 28/36 rule?',
    answer:
      'An illustrative guideline: housing costs near 28% of gross income (front-end) and total debts including housing near 36% (back-end). Lenders may use different limits. It is not a universal approval rule.',
  },
  {
    question: 'What is the difference between front-end and back-end DTI?',
    answer:
      'Front-end compares qualifying housing costs to gross income. Back-end adds other monthly debts. Affordability often uses the tighter of the two limits.',
  },
  {
    question: 'How do existing debts affect house affordability?',
    answer:
      'Higher qualifying monthly debts reduce the back-end housing allowance, which can lower the maximum housing budget and affordable purchase price.',
  },
  {
    question: 'How does down payment change affordability?',
    answer:
      'A larger down payment reduces loan size and usually monthly principal and interest for a given price, which can support a higher purchase price within the same housing budget — while using more cash up front.',
  },
  {
    question:
      'How do mortgage interest rates affect the maximum affordable home price?',
    answer:
      'Higher rates raise the payment for a given loan, so the same monthly budget supports a smaller principal and often a lower house price, all else equal.',
  },
  {
    question: 'Should property taxes and insurance be included in my budget?',
    answer:
      'For realistic ownership planning, yes. The fixed-budget calculator can include taxes, HOA, insurance, and maintenance in the constraint, or constrain P&I only while still showing other costs.',
  },
  {
    question:
      'What is the difference between conventional, FHA, and VA mortgages?',
    answer:
      'Programs differ in insurance, down payment norms, eligibility, and underwriting. This calculator offers illustrative DTI scenarios for comparison — it does not perform official program underwriting.',
  },
  {
    question:
      'Is the maximum affordable house price the same as mortgage preapproval?',
    answer:
      'No. Preapproval depends on credit, verified income, assets, program rules, and lender overlays. This tool provides estimates from the assumptions you enter.',
  },
  {
    question: 'How much should I budget for home maintenance?',
    answer:
      'Rules of thumb vary. The fixed-budget calculator defaults to an illustrative 1.5%/year of house price. Adjust to your property type and condition; maintenance is not always a lender qualifying debt.',
  },
  {
    question: 'Can I calculate affordability using a fixed monthly payment?',
    answer:
      'Yes. Use the second calculator and enter a monthly housing budget, with optional inclusion of taxes and fees.',
  },
  {
    question: 'Why do two affordability calculators produce different results?',
    answer:
      'Income-based mode uses DTI limits from income and debts. Fixed-budget mode uses a spending cap you choose, optionally including maintenance. Different constraints produce different prices.',
  },
];
