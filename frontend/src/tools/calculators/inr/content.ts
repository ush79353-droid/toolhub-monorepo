import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const INR_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'INR Calculator' },
  { id: 'formula', label: 'WHO formula' },
  { id: 'inr-faq', label: 'Frequently Asked Questions' },
];

export const INR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is INR?',
    answer:
      'The International Normalized Ratio standardizes prothrombin time (PT) across thromboplastin reagents using the reagent’s International Sensitivity Index (ISI).',
  },
  {
    question: 'What is Control PT?',
    answer:
      'Control PT here is the laboratory mean normal PT (MNPT) for the same thromboplastin and method — not a pooled “control” vial unless your lab equates that clotting time to MNPT.',
  },
  {
    question: 'Are my values stored?',
    answer:
      'No. Inputs stay in your browser. Share uses the public page URL only.',
  },
];
