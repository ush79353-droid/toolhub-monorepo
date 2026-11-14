import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const OAT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-operating-asset-turnover', label: 'What is operating asset turnover?' },
  { id: 'oat-formulas', label: 'Formulas' },
  { id: 'oat-example', label: 'Worked example' },
  { id: 'oat-faq', label: 'Frequently asked questions' },
];

export interface OatGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const OAT_GUIDE_SECTIONS: readonly OatGuideSection[] = [
  {
    id: 'what-operating-asset-turnover',
    title: 'What is operating asset turnover?',
    paragraphs: [
      'Operating asset turnover measures how many times sales cover the operating asset base in a period. A higher multiple means each unit of operating assets supports more sales.',
      'This calculator first sums common operating asset lines, then divides sales by that total. It is a planning sketch, not a full balance-sheet audit.',
    ],
  },
  {
    id: 'oat-formulas',
    title: 'Formulas',
    paragraphs: [
      'Add cash, accounts receivable, inventory, prepaid expenses, and fixed assets to get operating assets. Divide sales by that sum for turnover.',
      'When operating assets are zero, turnover is undefined. This calculator leaves the ratio blank instead of showing Infinity or NaN.',
    ],
    formula:
      'Operating Assets = Cash + Accounts Receivable + Inventory + Prepaid Expenses + Fixed Assets\nOperating Asset Turnover = Sales / Operating Assets',
  },
  {
    id: 'oat-example',
    title: 'Worked example',
    paragraphs: [
      'Cash 20,000 + receivables 30,000 + inventory 50,000 + prepaid 10,000 + fixed assets 90,000 = operating assets 200,000. Sales 500,000 ÷ 200,000 = 2.5× turnover.',
    ],
  },
];

export const OAT_FAQS: readonly FAQItem[] = [
  {
    question: 'What are operating assets?',
    answer:
      'In this calculator they are the sum of cash, accounts receivable, inventory, prepaid expenses, and fixed assets — the lines shown in the first section.',
  },
  {
    question: 'What does the × mean?',
    answer:
      'Operating asset turnover is a multiple of sales relative to operating assets. For example, 2.5× means sales are two and a half times the operating asset base.',
  },
  {
    question: 'What if operating assets are zero?',
    answer:
      'The turnover field stays blank. Dividing by zero would invent Infinity, so the calculator omits the ratio.',
  },
  {
    question: 'Does changing the currency convert my numbers?',
    answer:
      'No. The currency control only changes the symbol and grouping. Enter every amount in the same denomination.',
  },
];
