import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MAP_SOURCE_NOTE =
  'MAP ≈ (SBP + 2×DBP)/3; pulse pressure = SBP − DBP. Cuff-based MAP is a teaching approximation — not invasive arterial pressure.';

export const MAP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'MAP Calculator (Mean Arterial Pressure)' },
  { id: 'what-is', label: 'What Is MAP?' },
  { id: 'formula', label: 'MAP and Pulse Pressure Formulas' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'map-faq', label: 'Frequently Asked Questions' },
];

export const MAP_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this MAP calculator do?',
    answer:
      'It estimates mean arterial pressure (MAP) in mmHg from systolic and diastolic blood pressures using MAP = (SBP + 2 × DBP) ÷ 3. You can optionally show pulse pressure (SBP − DBP).',
  },
  {
    question: 'Why use 2×DBP in the MAP formula?',
    answer:
      'The classic weighted average approximates that diastole lasts longer than systole in the cardiac cycle. Algebraically it equals DBP + (SBP − DBP) ÷ 3.',
  },
  {
    question: 'Is cuff-based MAP the same as an arterial line?',
    answer:
      'No. Non-invasive cuff pressures are approximations. Invasive arterial monitoring may differ, especially in shock, arrhythmia, or wide pulse pressure.',
  },
  {
    question: 'Are the “norm” ranges in the labels treatment targets?',
    answer:
      'No. Example adult reference bands (e.g. SBP 90–120, DBP 60–80 mmHg) are contextual orientation only — not individualized goals.',
  },
  {
    question: 'Are my blood pressures stored?',
    answer:
      'No. Values stay in your browser session. Share and copy use the public tool page URL only — never SBP, DBP, MAP, or pulse pressure.',
  },
];