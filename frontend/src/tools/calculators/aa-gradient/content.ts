import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_LABEL =
  'Alveolar gas equation with R = 0.8 and PH₂O = 47 mmHg (37 °C water vapor). Expected A–a ≈ age/4 + 4 mmHg (common bedside rule; Omni Aa gradient calculator documentation).';

export const DISCLAIMER =
  'Educational A–a gradient worksheet only. It does not diagnose hypoxemia causes, prescribe oxygen, or replace arterial blood gas interpretation by a clinician.';

export const AA_GRADIENT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Aa Gradient Calculator' },
  { id: 'use', label: 'Aa Gradient Use' },
  { id: 'formula', label: 'How to Calculate' },
  { id: 'expected', label: 'Expected for Age' },
  { id: 'limits', label: 'Limits' },
  { id: 'aa-gradient-faq', label: 'Frequently Asked Questions' },
];

export const AA_GRADIENT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the A–a gradient?',
    answer:
      'It is PAO₂ − PaO₂: the difference between estimated alveolar oxygen tension and measured arterial PaO₂. A widened gradient suggests V/Q mismatch, shunt, or diffusion limitation rather than pure hypoventilation or low inspired O₂.',
  },
  {
    question: 'Which constants does this tool use?',
    answer:
      'Respiratory quotient R = 0.8 and alveolar water vapor pressure PH₂O = 47 mmHg at body temperature 37 °C (≈ 6.27 kPa). FiO₂ is entered as a percent and converted to a fraction.',
  },
  {
    question: 'What if age is blank?',
    answer:
      'The measured A–a gradient still calculates when FiO₂, PaCO₂, PaO₂, and atmospheric pressure are valid. Expected-for-age stays blank until age is entered.',
  },
  {
    question: 'Are my ABG values stored?',
    answer:
      'No. Share and copy use the public page URL only—never ages, pressures, or gradients.',
  },
];
