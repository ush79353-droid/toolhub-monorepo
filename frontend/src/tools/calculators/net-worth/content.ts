import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NET_WORTH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-net-worth', label: 'What is net worth? Definition' },
  { id: 'how-to-calculate', label: 'How to calculate net worth?' },
  {
    id: 'net-worth-formula',
    label: 'What net worth formula is applied in our calculator?',
  },
  { id: 'average-us-net-worth', label: 'Average net worth in the US' },
  { id: 'increase-net-worth', label: 'How to increase your net worth' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'net-worth-faq', label: 'Frequently asked questions' },
];

export const NET_WORTH_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a good net worth?',
    answer:
      'A “good” net worth depends on age, income, location, family circumstances, goals, and retirement plans. Comparing your figure with age or income peer benchmarks can add context, but personal goals matter more than any single average.',
  },
  {
    question: 'How do I calculate my net worth?',
    answer:
      'Add the current value of everything you own (assets), add everything you owe (liabilities), then subtract: Net Worth = Total Assets − Total Liabilities.',
  },
  {
    question: 'What is the average net worth in the US?',
    answer:
      'According to the Federal Reserve SCF 2022, median household net worth was about $192,900 and mean (average) household net worth about $1,063,700 (2022 dollars). Means are pulled up by high-wealth households; medians better describe a typical family.',
  },
  {
    question: 'Should my house be included in my net worth?',
    answer:
      'Yes: count the current market value as an asset and the outstanding mortgage as a liability. The difference is your home equity.',
  },
  {
    question: 'Should retirement savings be included in net worth?',
    answer:
      'Yes. Retirement accounts are financial assets and are usually included at their current account balances (taxes or penalties on withdrawal are a separate planning issue).',
  },
  {
    question: 'Is negative net worth bad?',
    answer:
      'Negative net worth means liabilities exceed assets. It is common early in careers or with student loans, but sustained high-interest debt can limit financial flexibility. The path matters more than a single snapshot.',
  },
  {
    question: 'How often should I calculate my net worth?',
    answer:
      'Many people review quarterly or annually. More frequent checks can help after large purchases, debt paydowns, or market moves.',
  },
  {
    question: 'Does net worth include income?',
    answer:
      'No. Net worth is a balance-sheet snapshot of assets minus liabilities. Income is a cash-flow concept and is not added as an asset until it is saved or invested.',
  },
  {
    question: 'What is the difference between net worth and cash flow?',
    answer:
      'Net worth measures what you own minus what you owe at a point in time. Cash flow measures money in and out over a period (month, year). Both matter for financial health.',
  },
  {
    question: 'How can I increase my net worth?',
    answer:
      'Reduce high-interest debt, save and invest consistently, grow income, avoid unnecessary liabilities, and periodically revalue assets. There are no guaranteed investment returns.',
  },
];
