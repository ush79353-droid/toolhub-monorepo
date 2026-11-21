import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BIRTH_CONTROL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Birth Control Calculator' },
  { id: 'how-it-works', label: 'How Cost Estimates Work' },
  { id: 'methods', label: 'Methods and Cadence' },
  { id: 'condoms', label: 'Condom Costs' },
  { id: 'currency', label: 'Currencies and FX' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'bc-faq', label: 'Frequently Asked Questions' },
];

export const BIRTH_CONTROL_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator estimate?',
    answer:
      'Out-of-pocket contraceptive costs over a chosen horizon. It is a budgeting tool, not medical advice about which method to use.',
  },
  {
    question: 'Why is the pill cycle 28 days?',
    answer:
      'Pill, patch, and ring costs use a 28-day menstrual-cycle cadence: total = cost per cycle × horizonDays / 28, with a 365.25-day year.',
  },
  {
    question: 'How are IUD, injection, and implant costs modeled?',
    answer:
      'Enter the device or course price and its longevity. The calculator prorates price × horizon / longevity over your selected period.',
  },
  {
    question: 'Are sterilization and vasectomy one-time costs?',
    answer:
      'Yes. Procedure cost is counted once for the horizon. Optional condom spending can still be added on top.',
  },
  {
    question: 'Can input and result currencies differ?',
    answer:
      'Yes. Each money field keeps its denomination; the total converts into the result currency with Omega’s stored Phase 2 rates when needed.',
  },
  {
    question: 'Is shared data private?',
    answer:
      'Share Result copies only the public page URL. Calculator inputs are not placed in URLs, analytics payloads, or share text.',
  },
];
