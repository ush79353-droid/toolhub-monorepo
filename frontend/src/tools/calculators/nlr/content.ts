import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NLR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'What is NLR?' },
  { id: 'formula', label: 'NLR ratio calculation' },
  { id: 'interpretation', label: 'Interpretation of neutrophil-lymphocyte ratio' },
  { id: 'nlr-faq', label: 'FAQs' },
];

export const NLR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the neutrophil-to-lymphocyte ratio?',
    answer:
      'NLR is neutrophils divided by lymphocytes from the same CBC, using either absolute counts or matching differential percentages. It is a dimensionless inflammatory marker used in research and clinical discussion — not a standalone diagnosis.',
  },
  {
    question: 'How do I calculate NLR?',
    answer:
      'NLR = neutrophils ÷ lymphocytes. Example: ANC 4 ×10³/µL and ALC 2 ×10³/µL → NLR = 2. With percentages from the same differential, 70% neutrophils and 20% lymphocytes → NLR = 3.5.',
  },
  {
    question: 'Do I need a WBC count in percent mode?',
    answer:
      'No. When both neutrophil and lymphocyte percentages come from the same differential, their ratio equals the absolute-count NLR, so WBC cancels out.',
  },
  {
    question: 'Are my lab values stored?',
    answer:
      'No. Inputs stay in your browser. Share and copy use the public page URL only.',
  },
];
