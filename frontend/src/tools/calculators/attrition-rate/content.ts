import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ATTRITION_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-attrition-rate', label: 'What Is Attrition Rate?' },
  { id: 'formula-and-calculation', label: 'Attrition Rate Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'attrition-vs-turnover', label: 'Attrition vs. Turnover' },
  { id: 'healthy-attrition-rate', label: 'What Is a Healthy Attrition Rate?' },
  { id: 'how-to-reduce-attrition', label: 'Strategies to Reduce Attrition' },
  { id: 'attrition-faq', label: 'Frequently Asked Questions' },
];

export const ATTRITION_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is employee attrition rate?',
    answer:
      'Employee attrition rate measures the percentage of staff members who leave a company over a specific timeframe, such as a month, quarter, or year, relative to the average number of employees during that period.',
  },
  {
    question: 'What is the difference between attrition and turnover?',
    answer:
      'Attrition occurs when employees depart (due to resignation, retirement, or structural downsizing) and their positions are left open or eliminated. Turnover refers to departures where the company actively hires replacements to refill the vacated roles.',
  },
  {
    question: 'Can the attrition rate exceed 100%?',
    answer:
      'Yes. In high-turnover industries (such as hospitality, seasonal retail, or customer service call centers), more people may leave during a single year than the average total workforce employed at any one time, resulting in an attrition rate greater than 100%.',
  },
  {
    question: 'Why does the formula use average headcount instead of starting headcount?',
    answer:
      'Using average headcount ((Start + End) / 2) accounts for organizational growth or contraction across the measurement window. It prevents distortions caused by rapid hiring sprees or mid-period layoffs.',
  },
  {
    question: 'How often should organizations calculate attrition?',
    answer:
      'Most organizations calculate attrition annually and quarterly for board and leadership reporting, while human resource teams often monitor monthly trends to identify emerging team-level or departmental retention concerns.',
  },
];
