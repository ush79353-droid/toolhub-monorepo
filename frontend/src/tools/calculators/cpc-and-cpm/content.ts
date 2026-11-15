import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CPC_CPM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-cpc-cpm-mean', label: 'What CPC and CPM Mean' },
  { id: 'formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'cpc-cpm-faq', label: 'Frequently Asked Questions' },
];

export const CPC_CPM_FAQS: readonly FAQItem[] = [
  {
    question: 'What is CPC?',
    answer:
      'Cost per click (CPC) is the average amount paid for each click. It equals total cost divided by clicks.',
  },
  {
    question: 'What is CPM?',
    answer:
      'Cost per mille (CPM) is the cost per 1,000 impressions. It equals total cost ÷ impressions × 1,000.',
  },
  {
    question: 'How are clicks and CTR related?',
    answer:
      'Clicks = impressions × CTR ÷ 100. CTR (%) = clicks ÷ impressions × 100. Enter any two of impressions, CTR, and clicks to solve the third when it is blank.',
  },
  {
    question: 'Will the calculator overwrite values I typed?',
    answer:
      'No. Fields you enter stay as you typed them. Blank fields are filled when other inputs make them determinable. Conflicting manual values are flagged instead of silently changing your numbers.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the display symbol and formatting for CPC, total cost, and CPM.',
  },
];
