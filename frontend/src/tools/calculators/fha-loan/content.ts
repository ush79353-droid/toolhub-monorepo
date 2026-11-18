import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { FHA_UPFRONT_MIP_RATE } from './types';

export const FHA_LOAN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-fha-loan', label: 'What Is an FHA Loan?' },
  { id: 'fha-loan-formulas', label: 'FHA Loan Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'fha-loan-faq', label: 'Frequently Asked Questions' },
];

export const FHA_LOAN_FAQS: readonly FAQItem[] = [
  {
    question: 'How is upfront MIP handled?',
    answer: `This calculator uses a fixed ${(FHA_UPFRONT_MIP_RATE * 100).toFixed(2)}% upfront MIP on the FHA base loan amount, matching the reference screenshot. Upfront MIP is not an editable input here.`,
  },
  {
    question: 'Is the monthly mortgage payment based on the total FHA loan?',
    answer:
      'No. The reference amortizes the FHA base loan amount only. Upfront MIP is added for the total FHA loan amount display but is not rolled into the amortizing principal in this model.',
  },
  {
    question: 'What does total cost of loan include?',
    answer:
      'Under this simplified reference model, total cost equals total monthly payment (mortgage + monthly MIP) × number of payments. It does not add down payment or other closing costs separately.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Home price and each monetary result have independent currencies. Changing home-price currency converts that amount with stored FX rates. Changing a result currency only re-expresses that result. Percentages and payment counts are never converted.',
  },
];
