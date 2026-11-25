import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_LABEL =
  'PaO₂/FiO₂ (Horovitz) index = arterial PaO₂ ÷ inspired oxygen fraction. Berlin Definition ARDS severity bands use P/F ≤300 / ≤200 / ≤100 mmHg with PEEP context — ratio alone does not diagnose ARDS (ARDS Definition Task Force, JAMA 2012).';

export const DISCLAIMER =
  'Educational PaO₂/FiO₂ worksheet only. It does not diagnose ARDS, prescribe oxygen, or replace clinical ABG and ventilator interpretation.';

export const PF_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'PF Ratio Calculator' },
  { id: 'formula', label: 'Formula' },
  { id: 'interpretation', label: 'Interpretation' },
  { id: 'limits', label: 'Limits' },
  { id: 'pf-ratio-faq', label: 'Frequently Asked Questions' },
];

export const PF_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator compute?',
    answer:
      'The PaO₂/FiO₂ (Horovitz) ratio: arterial oxygen partial pressure divided by the fraction of inspired oxygen (FiO₂ as 0–1).',
  },
  {
    question: 'How should FiO₂ be entered?',
    answer:
      'Enter percent (e.g. 40) or fraction (e.g. 0.40). Ambient air is about 21% (0.21). Zero FiO₂ is rejected.',
  },
  {
    question: 'Does a low ratio diagnose ARDS?',
    answer:
      'No. Berlin ARDS criteria also require timing, imaging, origin of edema, and PEEP context. This tool only reports the ratio and educational severity bands.',
  },
  {
    question: 'Are my values stored?',
    answer: 'No. Share uses the public page URL only.',
  },
];
