import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WHR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Waist to Hip Ratio Calculator' },
  { id: 'why', label: 'Why is waist-hip ratio important?' },
  { id: 'measure', label: 'How should I measure waist and hips?' },
  { id: 'how', label: 'How do I calculate the waist to hip ratio?' },
  { id: 'whr-faq', label: 'FAQs' },
];

export const WHR_FAQS: readonly FAQItem[] = [
  {
    question: 'How is waist-to-hip ratio calculated?',
    answer:
      'Convert waist and hip to the same length unit, then divide waist by hip. Example: 80 cm ÷ 100 cm = 0.8. The result is a dimensionless ratio, not a percent.',
  },
  {
    question: 'Where should I measure?',
    answer:
      'Teaching materials typically measure waist at the narrowest point (or midway between ribs and iliac crest) and hips at the widest point of the buttocks. Follow the method your clinician uses.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
