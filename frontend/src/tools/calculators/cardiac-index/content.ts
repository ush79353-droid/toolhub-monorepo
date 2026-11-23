import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CARDIAC_INDEX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Cardiac Index Calculator' },
  { id: 'what-is', label: 'What Is Cardiac Index?' },
  { id: 'formula', label: 'Formulas Used' },
  { id: 'modes', label: 'Known Output vs Fick' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'ci-faq', label: 'Frequently Asked Questions' },
];

export const CARDIAC_INDEX_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this cardiac index calculator do?',
    answer:
      'It computes educational cardiac index (L/min/m²) as cardiac output divided by Mosteller body surface area. You can enter a known cardiac output or estimate output with the Fick principle when output is unknown.',
  },
  {
    question: 'Which BSA formula is used?',
    answer:
      'Mosteller’s formula: BSA (m²) = √(height_cm × weight_kg / 3600). The engine keeps full BSA precision in the division; display may round the index for readability.',
  },
  {
    question: 'What happens if I select No for cardiac output?',
    answer:
      'The Fick branch appears: hemoglobin, arterial and venous saturation and tension, optional O₂ consumption, and derived concentrations. Cardiac output is VO₂ / (Ca−Cv) with contents in mL/L, then indexed by BSA.',
  },
  {
    question: 'Is O₂ consumption measured or estimated?',
    answer:
      'If you leave O₂ consumption blank, the tool estimates resting VO₂ as 125 × BSA mL/min and labels it as estimated. Enter a measured value to override.',
  },
  {
    question: 'Are my values stored?',
    answer:
      'No. Inputs stay in your browser session. Share and copy use the public tool page URL only—never CO, weight, blood gases, or the index.',
  },
];
