import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GORLIN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Gorlin Formula Calculator' },
  { id: 'formula', label: 'Formula and Constants' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'gorlin-faq', label: 'Frequently Asked Questions' },
];

export const GORLIN_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this Gorlin calculator do?',
    answer:
      'It estimates aortic and/or mitral valve area from cardiac output, heart rate, the valve-open period per beat, and mean pressure gradient using the classic Gorlin equation.',
  },
  {
    question: 'Which constants are used?',
    answer:
      'Aortic K = 44.3. Mitral K = 37.7 (≈44.3 × 0.85 Cohen–Gorlin empiric mitral coefficient). Area = CO(mL/min) ÷ (HR × period × K × √mean gradient).',
  },
  {
    question: 'Do both valves require complete inputs?',
    answer:
      'Shared CO and HR are required for either panel. Each valve panel then needs its own mean gradient and open period. Panels are independent.',
  },
  {
    question: 'Are my values stored?',
    answer:
      'No. Share/copy uses the public page URL only—never hemodynamics or calculated areas.',
  },
];
