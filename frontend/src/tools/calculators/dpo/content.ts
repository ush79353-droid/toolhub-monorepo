import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DPO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-dpo', label: 'What Is DPO? The DPO Meaning' },
  { id: 'dpo-formula', label: 'DPO Formula' },
  { id: 'average-ap', label: 'How to Calculate Average Accounts Payable' },
  { id: 'purchases', label: 'How to Calculate Purchases' },
  { id: 'how-to-calculate', label: 'How to Calculate DPO Using the Calculator' },
  { id: 'worked-example', label: 'Complete DPO Calculation Example' },
  { id: 'purpose', label: 'What Is the Purpose of Calculating DPO?' },
  { id: 'good-dpo', label: 'What Is a Good DPO?' },
  { id: 'improve-dpo', label: 'How to Improve DPO Responsibly' },
  { id: 'vs-dio-dso', label: 'DPO vs DIO vs DSO' },
  { id: 'ccc', label: 'DPO and Cash Conversion Cycle' },
  { id: 'vs-turnover', label: 'DPO vs Accounts Payable Turnover' },
  { id: 'mistakes', label: 'Common DPO Calculation Mistakes' },
  { id: 'limitations', label: 'DPO Calculation Limitations' },
  { id: 'dpo-faq', label: 'Frequently Asked Questions' },
];

export const DPO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is DPO?',
    answer:
      'Days Payable Outstanding estimates the average number of days a company takes to settle accounts payable to suppliers, based on average AP, purchases, and the reporting period.',
  },
  {
    question: 'How do I calculate Days Payable Outstanding?',
    answer:
      'DPO = (Average accounts payable ÷ Purchases) × days in the accounting period.',
  },
  {
    question: 'What is the DPO formula?',
    answer:
      'DPO = (Average AP / Purchases) × T, where T is the number of days in the reporting period that matches your AP and purchases figures.',
  },
  {
    question: 'What does a high DPO mean?',
    answer:
      'A relatively high DPO means payables remain outstanding longer versus purchases. That can conserve cash temporarily, but extending beyond agreed supplier terms can create commercial risk.',
  },
  {
    question: 'What does a low DPO mean?',
    answer:
      'A relatively low DPO means the company settles payables more quickly. That may support supplier relationships or discounts, while increasing near-term cash outflows.',
  },
  {
    question: 'Is a high DPO always better?',
    answer:
      'No. Longer payables can reduce CCC mathematically, but unpaid invoices beyond negotiated terms can damage supplier trust and raise costs. Context and contracts matter.',
  },
  {
    question: 'How do I calculate average accounts payable?',
    answer:
      'Average AP = (beginning AP + ending AP) ÷ 2, or enter a known period average directly.',
  },
  {
    question: 'How are purchases calculated from inventory and COGS?',
    answer:
      'Purchases = COGS + ending inventory − beginning inventory. This is a simplified inventory-flow estimate; actual credit purchases are often preferable for DPO.',
  },
  {
    question: 'Should I use purchases or COGS for DPO?',
    answer:
      'Standard DPO uses purchases (preferably credit purchases) as the denominator. Using COGS alone ignores inventory changes and can misstate payables days.',
  },
  {
    question: 'Can DPO equal zero?',
    answer:
      'Yes, when average AP is zero and purchases are positive. Interpret carefully; it may reflect immediate payment or reporting timing.',
  },
  {
    question: 'Can DPO be negative?',
    answer:
      'Under the standard nonnegative AP and positive-purchases model used here, no. Negative estimated purchases block the standard DPO result.',
  },
  {
    question: 'What happens when purchases equal zero?',
    answer:
      'DPO is undefined because the formula divides by purchases. This calculator does not display Infinity.',
  },
  {
    question: 'How does DPO affect the cash conversion cycle?',
    answer:
      'CCC = DIO + DSO − DPO. Higher DPO reduces measured CCC when other components are unchanged, but stretching payments beyond terms can create operational risk.',
  },
  {
    question: 'What is the difference between DPO and accounts payable turnover?',
    answer:
      'AP turnover = Purchases ÷ Average AP (times per period). When turnover is positive, DPO = period days ÷ turnover.',
  },
  {
    question: 'How can a company manage DPO responsibly?',
    answer:
      'Negotiate suitable terms, forecast cash needs, process invoices promptly, evaluate early-payment discounts, and avoid unplanned late payments that harm supplier relationships.',
  },
  {
    question:
      'What is DPO if average AP is $100,000, purchases are $800,000, and the accounting period is 365 days?',
    answer:
      'DPO = (100,000 / 800,000) × 365 = 45.625 days (displayed as 45.63 days).',
  },
];
