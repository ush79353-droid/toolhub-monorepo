import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SOURCE_LABEL =
  'Bohr equation VD = VT × (PACO₂ − PECO₂) / PACO₂ using alveolar and mixed-expired CO₂. Enghoff substitution of arterial PaCO₂ for PACO₂ is a related clinical approximation and is labeled separately when used.';

export const DISCLAIMER =
  'Educational Bohr dead-space worksheet only. It does not prescribe ventilation settings or replace bedside ABG/capnography interpretation.';

export const DEAD_SPACE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Dead Space Calculator' },
  { id: 'bohr', label: 'Bohr Equation' },
  { id: 'enghoff', label: 'Enghoff Note' },
  { id: 'limits', label: 'Limits' },
  { id: 'dead-space-faq', label: 'Frequently Asked Questions' },
];

export const DEAD_SPACE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator compute?',
    answer:
      'Physiologic dead space volume VD = VT × (PACO₂ − PECO₂) / PACO₂ from the Bohr equation, using the same pressure units for both CO₂ values.',
  },
  {
    question: 'Alveolar vs arterial CO₂?',
    answer:
      'Classic Bohr uses alveolar PACO₂ and mixed-expired PECO₂. Substituting arterial PaCO₂ (Enghoff) is common clinically but is not identical to true alveolar PACO₂.',
  },
  {
    question: 'Are my values stored?',
    answer: 'No. Share uses the public page URL only.',
  },
];
