import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const AVERAGE_COLLECTION_PERIOD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-acp-means', label: 'What Average Collection Period Means' },
  { id: 'acp-formulas', label: 'Formulas' },
  { id: 'how-to-calculate-acp', label: 'How to Calculate' },
  { id: 'turnover-method', label: 'Turnover Ratio Method' },
  { id: 'terms-of-credit', label: 'Terms of Credit' },
  { id: 'acp-examples', label: 'Examples' },
  { id: 'acp-faq', label: 'Frequently Asked Questions' },
];

export const AVERAGE_COLLECTION_PERIOD_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the average collection period?',
    answer:
      'Average collection period estimates how many days it takes a business to collect credit sales. It is the same idea as days sales outstanding (DSO), expressed from average receivables or from the receivables turnover ratio.',
  },
  {
    question: 'Which sales belong in total credit sales?',
    answer:
      'Use credit sales for the same period as the receivables figure, after returns and allowances. Cash sales never sat in receivables, so they do not belong in the denominator.',
  },
  {
    question: 'How is average accounts receivable calculated?',
    answer:
      'Average accounts receivable = (beginning accounts receivable + ending accounts receivable) ÷ 2. Expand Calculate average accounts receivable to fill both balances, or type the average directly.',
  },
  {
    question: 'When should I use the receivables turnover ratio method?',
    answer:
      'Use that method when you already know turnover (credit sales ÷ average receivables). Collection period in days is then duration ÷ turnover. Both methods describe the same relationship when the inputs are consistent.',
  },
  {
    question: 'Do terms of credit change the result?',
    answer:
      'No. Terms of credit are for comparison only. The calculator does not fold stated terms into the day count. A collection period longer than terms can signal slow collection; a shorter figure can mean customers pay early or that terms are longer than actual practice.',
  },
  {
    question: 'Does currency convert the amounts?',
    answer:
      'No. Currency changes the symbol and grouping only. Enter receivables and sales in the same currency. The calculator does not convert between currencies.',
  },
];
