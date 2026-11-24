import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FEUREA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'The fractional excretion of urea (FEUrea)' },
  { id: 'how-to-use', label: 'How to use the FEUrea calculator?' },
  { id: 'interpretation', label: 'FEUrea interpretation' },
  { id: 'aki', label: 'Acute kidney injury — definition and causes' },
  { id: 'urea', label: 'Urea as a parameter' },
  { id: 'creatinine', label: 'Creatinine as a parameter' },
  { id: 'feurea-faq', label: 'Frequently Asked Questions' },
];

export const FEUREA_FAQS: readonly FAQItem[] = [
  {
    question: 'What is FEUrea?',
    answer:
      'Fractional excretion of urea (FEUrea) estimates the percentage of filtered urea excreted in urine using paired serum and urine urea (or BUN) and creatinine. It is sometimes used when evaluating AKI patterns, especially when diuretics limit FENa.',
  },
  {
    question: 'Which units does this calculator use?',
    answer:
      'Creatinine defaults to mg/dL (µmol/L also available). Urea defaults to mg/dL whole urea, with mg/dL (BUN) and mmol/L options. Nitrogen vs whole urea is normalized across specimens before dividing; keep creatinine units matched.',
  },
  {
    question: 'What do ≤35% and >50% mean?',
    answer:
      'Classic Carvounis teaching maps FEUrea ≤35% toward a prerenal pattern and >50% toward intrinsic injury/ATN, with 35–50% indeterminate. These cohort thresholds do not establish etiology alone.',
  },
  {
    question: 'Can I mix BUN with urea?',
    answer:
      'Prefer matching analytes (BUN with urine urea nitrogen, or urea with urea). If units differ, this worksheet converts BUN to urea mg/dL (×2.14) so the ratio stays consistent.',
  },
  {
    question: 'Are lab values stored?',
    answer:
      'No. Values stay in your browser; share uses the public page URL only — never the entered labs.',
  },
];
