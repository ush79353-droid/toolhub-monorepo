import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CARDIAC_OUTPUT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Cardiac Output Calculator' },
  { id: 'what-is', label: 'What Is Fick Cardiac Output?' },
  { id: 'formula', label: 'Formulas Used' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'cardiac-output-faq', label: 'Frequently Asked Questions' },
];

export const CARDIAC_OUTPUT_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this cardiac output calculator do?',
    answer:
      'It estimates cardiac output and cardiac index with the Fick principle from oxygen consumption and the arteriovenous oxygen content difference. It is educational only and does not replace catheter-based measurement or clinical judgement.',
  },
  {
    question: 'How is oxygen consumption estimated?',
    answer:
      'When you leave O₂ consumption blank, the tool estimates VO₂ as 125 mL/min per m² of body surface area (StatPearls resting adult index) multiplied by Mosteller BSA. Results label this path as estimated. Enter a measured VO₂ to override.',
  },
  {
    question: 'Which BSA formula is used?',
    answer:
      'Mosteller: BSA (m²) = √(height in cm × weight in kg ÷ 3600). You can override BSA directly if you already have a preferred value.',
  },
  {
    question: 'How is oxygen content calculated?',
    answer:
      'Content (mL/dL) = 1.34 × hemoglobin (g/dL) × saturation fraction + 0.0031 × PO₂ (Torr). The engine converts to mL/L (×10) before CO = VO₂ / (Ca − Cv). You may enter concentrations manually instead.',
  },
  {
    question: 'Why must arterial content exceed venous content?',
    answer:
      'Fick cardiac output divides VO₂ by the arteriovenous difference. A zero or negative difference is not physiologically usable for this equation, so the calculator rejects those cases.',
  },
  {
    question: 'Are my values stored?',
    answer:
      'No. Entries stay in your browser session. Share and copy actions use the public tool page URL only—never height, weight, hemoglobin, saturations, or computed output.',
  },
];
