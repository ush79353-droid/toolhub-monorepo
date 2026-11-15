import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EQUIVALENT_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-equivalent-rate', label: 'What Is an Equivalent Rate?' },
  { id: 'equivalent-rate-formula', label: 'Equivalent Rate Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'equivalent-rate-faq', label: 'Frequently Asked Questions' },
];

export const EQUIVALENT_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is AER?',
    answer:
      'The annual equivalent rate (AER), also called EAR, is the effective yearly return after compounding: AER = (1 + r/m)^m − 1.',
  },
  {
    question: 'How is the equivalent interest rate calculated?',
    answer:
      'First compute AER from the original nominal rate and frequency, then Equivalent Rate = n × [(1 + AER)^(1/n) − 1] for the new frequency n.',
  },
  {
    question: 'Why convert compounding frequencies?',
    answer:
      'The same nominal rate can mean different effective returns when compounding differs. Equivalent rates let you compare offers on the same AER basis.',
  },
];
