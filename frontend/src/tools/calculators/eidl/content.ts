import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EIDL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'overview-and-history', label: 'Overview & Historical Context' },
  { id: 'historical-advance-structure', label: 'Historical Advance Structure' },
  { id: 'advance-vs-loan', label: 'Advance (Grant) vs. EIDL Loan' },
  { id: 'program-closure-timeline', label: 'Program Closure & Expiration' },
  { id: 'current-loan-alternatives', label: 'Current Small Business Alternatives' },
  { id: 'eidl-faq', label: 'Frequently Asked Questions' },
];

export const EIDL_FAQS: readonly FAQItem[] = [
  {
    question: 'What was the SBA EIDL Emergency Advance?',
    answer:
      'The Economic Injury Disaster Loan (EIDL) Emergency Advance was a COVID-19 pandemic relief measure enacted by the U.S. federal government through the CARES Act. It provided small business owners with an immediate emergency cash grant of up to $10,000 ($1,000 per employee) to cover temporary operational shortfalls.',
  },
  {
    question: 'Can business owners still apply for the EIDL Advance today?',
    answer:
      'No. The SBA EIDL Emergency Advance program officially depleted its allocated congressional funding and is completely closed to new applications. The COVID-19 emergency declaration and relief programs have concluded.',
  },
  {
    question: 'Did the EIDL Emergency Advance have to be repaid?',
    answer:
      'No. The emergency advance component was structured as a grant and was not required to be repaid, provided the applicant met qualifying conditions. In contrast, the standard EIDL loan itself was a low-interest, 30-year repayable debt obligation.',
  },
  {
    question: 'Why are historical EIDL calculations no longer valid?',
    answer:
      'Because the program has ended and funds are no longer distributed under these pandemic emergency criteria, any formula based on employee headcount for emergency grant allocations no longer applies to active borrowing decisions.',
  },
  {
    question: 'Where can business owners calculate active financing options?',
    answer:
      'Businesses seeking current commercial loans, equipment financing, or line-of-credit options should utilize our interactive Loan Calculator (/tools/loan-calculator) or Business Loan Calculator (/tools/business-loan-calculator) to evaluate contemporary amortized payments, interest rates, and APR structures.',
  },
];
