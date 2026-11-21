import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Introduction' },
  { id: 'what-is', label: 'What Is the Retention Ratio?' },
  { id: 'how-to-calculate', label: 'How to Calculate Retention Ratio' },
  { id: 'interpretation', label: 'Retention Ratio Interpretation' },
  { id: 'vs-payout', label: 'Retention Ratio vs. Dividend Payout Ratio' },
  { id: 'limitations', label: 'Limitations of Retention Ratio' },
  { id: 'rr-faq', label: 'Frequently Asked Questions' },
];

export const RR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a retention ratio?',
    answer:
      'The retention ratio (also called the plowback ratio) is the share of net income a company keeps after paying dividends. It equals period retained earnings divided by net income.',
  },
  {
    question: 'How do you calculate retention ratio?',
    answer:
      'Retention % = ((net income − dividends paid) ÷ net income) × 100. Equivalently, retention % = (1 − dividend payout ratio) × 100 when payout is expressed as a decimal.',
  },
  {
    question: 'What is a good retention ratio?',
    answer:
      'There is no universal ideal. Growth companies often retain more; mature dividend payers often retain less. Judge retention against industry norms, growth opportunities, and capital needs.',
  },
  {
    question: 'Can a retention ratio be negative?',
    answer:
      'Yes, when dividends exceed positive net income. That can mean dividends were funded from cash reserves or other capital, not just current earnings.',
  },
  {
    question: 'What does a 100% retention ratio mean?',
    answer:
      'The company paid no dividends and retained all of its net income for the period.',
  },
  {
    question:
      'What is the difference between retention ratio and dividend payout ratio?',
    answer:
      'Payout is dividends ÷ net income. Retention is what remains: roughly 1 − payout (as decimals). They describe complementary sides of the same dividend policy.',
  },
  {
    question: 'Is a higher retention ratio always better?',
    answer:
      'No. Higher retention only helps if reinvested capital earns adequate returns. Paying dividends can be appropriate when growth opportunities are limited.',
  },
  {
    question: 'How is retention ratio related to sustainable growth?',
    answer:
      'A common sustainable-growth estimate is retention ratio × return on equity. Higher retention can support faster internal growth, but only if ROE and financing assumptions hold.',
  },
];
