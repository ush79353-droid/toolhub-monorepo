import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WLP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Weight Loss Percentage Calculator' },
  { id: 'formula', label: 'Weight loss percentage formula' },
  { id: 'wlp-faq', label: 'Frequently Asked Questions' },
];

export const WLP_FAQS: readonly FAQItem[] = [
  {
    question: 'How is weight loss percentage calculated?',
    answer:
      'Loss = past weight − current weight. Percent = 100 × loss ÷ past weight. Example: 80 kg → 72 kg is 8 kg and 10%.',
  },
  {
    question: 'What if current weight is higher than past weight?',
    answer:
      'Loss and percent are negative, labeled as weight gain. Equal weights yield 0.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
