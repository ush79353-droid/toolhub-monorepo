import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WEIGHT_PERCENTILE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Weight Percentile Calculator' },
  { id: 'who-lms', label: 'WHO LMS Formula' },
  { id: 'age-bounds', label: 'Age Coverage' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'weight-percentile-faq', label: 'Frequently Asked Questions' },
];

export const WEIGHT_PERCENTILE_FAQS: readonly FAQItem[] = [
  {
    question: 'What standard does this use?',
    answer:
      'WHO Child Growth Standards weight-for-age (birth to 60 months / 5 years), with sex-specific LMS parameters and the WHO ±3 SD tail adjustment. Official tables: https://www.who.int/tools/child-growth-standards/standards/weight-for-age',
  },
  {
    question: 'How is the percentile calculated?',
    answer:
      'z = ((W/M)^L − 1)/(L×S) when L ≠ 0, or ln(W/M)/S when L = 0. Beyond |z| = 3, WHO’s restricted tail policy applies. Percentile = 100 × Φ(z).',
  },
  {
    question: 'What if age is outside 0–60 months?',
    answer:
      'The tool rejects ages outside WHO weight-for-age coverage. It does not extrapolate.',
  },
  {
    question: 'Worked example?',
    answer:
      'A 24-month girl at the WHO median weight (≈11.48 kg) scores near the 50th percentile (z ≈ 0).',
  },
  {
    question: 'Is personal data stored or shared?',
    answer:
      'No. Age, sex, and weight stay in your browser for this session. Share uses only the public page URL.',
  },
];
