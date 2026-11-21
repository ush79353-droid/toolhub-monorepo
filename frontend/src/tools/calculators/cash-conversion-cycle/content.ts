import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CCC_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ccc', label: 'What Is the Cash Conversion Cycle?' },
  { id: 'ccc-formula', label: 'Cash Conversion Cycle Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate the Cash Conversion Cycle' },
  { id: 'what-ccc-tells', label: 'What Does CCC Tell Us?' },
  { id: 'negative-ccc', label: 'Negative Cash Conversion Cycle' },
  { id: 'reduce-ccc', label: 'How to Reduce the Cash Conversion Cycle' },
  { id: 'dio', label: 'Days Inventory Outstanding' },
  { id: 'dso', label: 'Days Sales Outstanding' },
  { id: 'dpo', label: 'Days Payable Outstanding' },
  { id: 'operating-cycle', label: 'Operating Cycle vs CCC' },
  { id: 'worked-example', label: 'Cash Conversion Cycle Calculation Example' },
  { id: 'common-mistakes', label: 'Common CCC Calculation Mistakes' },
  { id: 'limitations', label: 'Cash Conversion Cycle Limitations' },
  { id: 'ccc-faq', label: 'Frequently Asked Questions' },
];

export const CCC_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a cash conversion cycle?',
    answer:
      'The cash conversion cycle (CCC) estimates how many days cash remains tied up in inventory and receivables after accounting for the time taken to pay suppliers.',
  },
  {
    question: 'How do I calculate the cash conversion cycle?',
    answer:
      'CCC = DIO + DSO − DPO, using the same reporting period for inventory, receivables, payables, revenue, and COGS.',
  },
  {
    question: 'What are DIO, DSO, and DPO?',
    answer:
      'DIO is days inventory outstanding, DSO is days sales outstanding (receivable days), and DPO is days payable outstanding. Together they form the CCC.',
  },
  {
    question: 'What does a negative cash conversion cycle mean?',
    answer:
      'A negative CCC means supplier payment days exceed combined inventory and receivable days. It can appear in fast-turnover or cash-generative models and is not automatically an error or a strength.',
  },
  {
    question: 'Is a shorter cash conversion cycle always better?',
    answer:
      'Shorter often means less cash tied up in working capital, but stretching payables too far or holding too little inventory can create operational risk. Context and industry matter.',
  },
  {
    question: 'What is the difference between the operating cycle and CCC?',
    answer:
      'Operating cycle = DIO + DSO. CCC = operating cycle − DPO. CCC subtracts supplier financing days from the operating cycle.',
  },
  {
    question: 'How do I calculate average inventory?',
    answer:
      'Average inventory = (beginning inventory + ending inventory) ÷ 2, or enter a known period average directly.',
  },
  {
    question: 'How do I calculate average accounts receivable?',
    answer:
      'Average AR = (beginning AR + ending AR) ÷ 2, or enter a known period average directly.',
  },
  {
    question: 'How do I calculate average accounts payable?',
    answer:
      'Average AP = (beginning AP + ending AP) ÷ 2, or enter a known period average directly.',
  },
  {
    question: 'How can a business improve its cash conversion cycle?',
    answer:
      'Typical levers include faster inventory turns, quicker receivable collection, and responsibly negotiated supplier terms; each with operational trade-offs.',
  },
  {
    question: 'What happens when revenue or COGS equals zero?',
    answer:
      'DSO is undefined when revenue is zero. DIO and DPO are undefined when COGS is zero. This calculator does not invent day counts or display Infinity.',
  },
  {
    question: 'Why is CCC important for working capital management?',
    answer:
      'It summarizes how long operating working capital absorbs cash between paying for inventory and collecting from customers, helping liquidity and financing discussions.',
  },
  {
    question: 'Can two companies in different industries have very different CCC values?',
    answer:
      'Yes. Retail, manufacturing, and subscription businesses often have very different inventory, collection, and payment norms.',
  },
  {
    question: 'How does inventory turnover affect CCC?',
    answer:
      'Higher inventory turnover generally lowers DIO, which shortens CCC when other components are unchanged.',
  },
  {
    question:
      'What is the cash conversion cycle if DIO is 50 days, DSO is 30 days, and DPO is 45 days?',
    answer: 'CCC = 50 + 30 − 45 = 35 days.',
  },
];
