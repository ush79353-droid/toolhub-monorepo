import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_LABEL =
  'Conventional oxygenation index OI = (FiO₂ fraction × MAP × 100) / PaO₂ with paired ventilator mean airway pressure and arterial PaO₂. P/F = PaO₂ / FiO₂ fraction.';

export const DISCLAIMER =
  'Educational oxygenation worksheet only. It does not diagnose ARDS severity, set ECMO criteria, or replace bedside ventilator and ABG interpretation.';

export const OXYGENATION_INDEX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Oxygenation Index Calculator' },
  { id: 'formula', label: 'Oxygenation Index formula' },
  { id: 'fio2', label: 'What does FiO₂ stand for?' },
  { id: 'pf-ratio', label: 'PaO₂ / FiO₂ ratio' },
  { id: 'oi-faq', label: 'Frequently Asked Questions' },
];

export const OXYGENATION_INDEX_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator compute?',
    answer:
      'PaO₂/FiO₂ (P/F) and the conventional oxygenation index OI = (FiO₂ as a decimal × mean airway pressure × 100) ÷ PaO₂. FiO₂ is entered as a percent and converted once to a fraction.',
  },
  {
    question: 'What does MAP mean here?',
    answer:
      'Ventilator mean airway pressure in cmH₂O from the same stable state as FiO₂ and the arterial PaO₂ — not blood-pressure mean arterial pressure.',
  },
  {
    question: 'Are my values stored?',
    answer: 'No. Share uses the public page URL only.',
  },
];
