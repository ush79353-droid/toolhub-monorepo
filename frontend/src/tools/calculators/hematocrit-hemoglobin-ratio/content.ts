import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HCT_HGB_RATIO_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Hematocrit to Hemoglobin Ratio' },
  { id: 'rule-of-three', label: 'Rule of three' },
  { id: 'hct-hgb-faq', label: 'Frequently Asked Questions' },
];

export const HCT_HGB_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Hct/Hgb ratio?',
    answer:
      'It is hematocrit (%) divided by hemoglobin (g/dL). Many CBC teaching notes expect a value near 3.',
  },
  {
    question: 'What is the rule of three?',
    answer:
      'A teaching approximation that hematocrit (%) is roughly three times hemoglobin in g/dL (for example, Hb 14 g/dL ↔ Hct ≈ 42%). It is approximate and not a diagnostic cutoff.',
  },
  {
    question: 'Are my values stored?',
    answer:
      'No. Inputs stay in your browser. Share uses the public page URL only.',
  },
];
