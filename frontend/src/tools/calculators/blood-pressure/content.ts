import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BLOOD_PRESSURE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Blood Pressure Calculator' },
  { id: 'what-it-does', label: 'What This Calculator Does' },
  { id: 'guidelines', label: 'ACC/AHA vs ESC/ESH Tables' },
  { id: 'how-classified', label: 'How a Reading Is Classified' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Examples' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'bp-faq', label: 'Frequently Asked Questions' },
];

export const BLOOD_PRESSURE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this blood pressure calculator do?',
    answer:
      'It maps one systolic/diastolic mmHg pair onto an educational office-BP category using either the American ACC/AHA adult table or the 2018 joint ESC/ESH office table. It does not diagnose hypertension from a single reading.',
  },
  {
    question: 'Which American guideline table is used?',
    answer:
      'ACC/AHA adult categories as retained in the 2025 AHA/ACC hypertension guideline Table 4 (Normal, Elevated, Stage 1, Stage 2), plus the AHA public “severe hypertension” band when SBP is above 180 mmHg and/or DBP is above 120 mmHg.',
  },
  {
    question: 'Which European table is used?',
    answer:
      'The 2018 joint ESC/ESH Guidelines Table 3 (Optimal, Normal, High normal, Grades 1–3, and graded isolated systolic hypertension). Later separate ESC 2024 or ESH-only editions are not mixed into this mode so the screenshot’s joint “ESC and ESH” option stays edition-labeled.',
  },
  {
    question: 'What if systolic and diastolic fall in different categories?',
    answer:
      'Both tables instruct clinicians to use the higher applicable category. This calculator classifies each number, then selects the higher band (with ESC/ESH isolated systolic hypertension when SBP ≥140 and DBP <90).',
  },
  {
    question: 'Does a category mean I have hypertension?',
    answer:
      'No. Guidelines classify average office BP from repeated careful measurements on more than one occasion. This tool only labels the entered reading for learning.',
  },
  {
    question: 'Are my numbers stored or shared?',
    answer:
      'No. Values stay in your browser session. Share and copy use the public tool page URL only—never the mmHg pair or category.',
  },
];
