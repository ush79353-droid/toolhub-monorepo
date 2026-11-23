import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EGG_FREEZING_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Egg Freezing Calculator' },
  { id: 'model', label: 'Goldman 2017 Model' },
  { id: 'formula', label: 'How the Probability Is Calculated' },
  { id: 'population', label: 'Population and Limits' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'egg-freezing-faq', label: 'Frequently Asked Questions' },
];

export const EGG_FREEZING_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this egg freezing calculator estimate?',
    answer:
      'It reports a Goldman et al. (Hum Reprod 2017) modeled chance of at least one live birth from a given number of frozen mature oocytes at a given age at freezing. It does not guarantee a birth or recommend how many eggs to freeze.',
  },
  {
    question: 'Which formula is used?',
    answer:
      'Equation 2: P(≥1) = 1 − (1 − p)^n, where p = 0.6 × p(euploid) × p(blast), p(blast) includes age-specific thaw survival, and p(euploid) comes from Supplementary Table SI.',
  },
  {
    question: 'What ages are supported?',
    answer:
      'Whole years 25–44. Ages ≤35 share the published ≤35 blastocyst regression group. Ages outside 25–44 are suppressed rather than extrapolated.',
  },
  {
    question: 'Are my numbers stored?',
    answer:
      'No. Values stay in your browser. Share and copy use the public page URL only—never age or egg counts.',
  },
];
