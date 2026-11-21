import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ces', label: 'What is Customer Effort Score?' },
  { id: 'ces-formula', label: 'The customer effort score formula' },
  { id: 'how-to-use', label: 'How to use this calculator' },
  { id: 'interpret-ces', label: 'How to interpret CES results' },
  { id: 'ces-vs-nps-csat', label: 'CES vs. NPS and CSAT' },
  { id: 'improve-ces', label: 'How to improve Customer Effort Score' },
  { id: 'ces-faq', label: 'Frequently Asked Questions' },
];

export const CES_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a good Customer Effort Score?',
    answer:
      'Interpretation depends on the scale and scoring direction. In this calculator, lower scores mean less effort. On a 1–5 scale, a CES near 1 suggests most customers found the interaction relatively easy. There is no single universal benchmark that fits every industry or survey wording.',
  },
  {
    question: 'What is the Customer Effort Score scale?',
    answer:
      'This tool supports 1–5 and 1–7 scales. Score 1 means very easy and the highest value means very difficult. Some surveys reverse that direction; do not mix directions when comparing results.',
  },
  {
    question: 'How is Customer Effort Score different from NPS?',
    answer:
      'CES measures perceived effort to complete an interaction. NPS measures how likely customers are to recommend a company, product, or service. They answer different questions and are not interchangeable.',
  },
  {
    question: 'How is CES different from CSAT?',
    answer:
      'CES focuses on effort and friction. CSAT focuses on satisfaction with a product or experience. A customer can be satisfied overall yet still report high effort on a specific task.',
  },
  {
    question: 'How do I improve my Customer Effort Score?',
    answer:
      'Reduce friction: simplify journeys and forms, improve navigation and self-service, raise first-contact resolution, cut unnecessary transfers, and review complaints after process changes. Compare surveys that share the same scale and question wording.',
  },
  {
    question: 'Is 2.5 a good Customer Effort Score?',
    answer:
      'On a 1–5 scale with lower = easier, 2.5 sits between easy and neutral. Business meaning depends on survey wording, distribution shape, historical baselines, and context; not the mean alone.',
  },
  {
    question: 'Can Customer Effort Score be higher than 5?',
    answer:
      'Yes, when the survey uses a 1–7 scale. A correctly calculated CES must stay between the scale minimum and maximum.',
  },
  {
    question: 'How often should Customer Effort Score be measured?',
    answer:
      'Many teams survey after relevant interactions; support contacts, returns, purchases, or issue resolution. Ideal frequency varies by volume, channel, and change cadence; there is no one schedule for every company.',
  },
  {
    question: 'Can I compare CES from a 1–5 scale with a 1–7 scale?',
    answer:
      'Direct comparison is misleading because ranges and question meanings differ. Normalization can help explore trends but does not remove methodological differences.',
  },
  {
    question: 'Why is my CES result not a whole number?',
    answer:
      'CES is a weighted average of ordinal scores, so decimals are expected whenever responses span more than one rating.',
  },
];
