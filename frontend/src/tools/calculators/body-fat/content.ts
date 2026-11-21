import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BODY_FAT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is the Body Fat Calculator?' },
  { id: 'methods', label: 'Calculation Methods' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'results', label: 'Reading the Results' },
  { id: 'limits', label: 'Limits and Accuracy' },
  { id: 'body-fat-faq', label: 'Frequently Asked Questions' },
];

export const BODY_FAT_FAQS: readonly FAQItem[] = [
  {
    question: 'Which method should I pick?',
    answer:
      'American Diabetes Association (CUN-BAE) is the default “most common” age–sex–BMI estimator. U.S. Navy uses tape measurements and is usually more precise for that model. BMI (Deurenberg) is the simplest comparison estimate and is labeled least precise.',
  },
  {
    question: 'What is the ADA / CUN-BAE equation?',
    answer:
      'It is the Clínica Universidad de Navarra Body Adiposity Estimator published in Diabetes Care (2012): BF% depends on age, sex (female=1, male=0), BMI, and BMI² interaction terms. It was studied mainly in adults about 18–80 years old.',
  },
  {
    question: 'Why do neck, waist, and hip appear only for Navy?',
    answer:
      'Those circumferences are required by the Hodgdon & Beckett / NHRC Navy formulas. ADA and BMI methods need only age, height, and weight, so the tape fields stay hidden.',
  },
  {
    question: 'How are fat mass and lean mass calculated?',
    answer:
      'Fat mass = body weight × (body fat % ÷ 100). Lean mass = weight − fat mass. BMI = kg ÷ m² after converting your selected units.',
  },
  {
    question: 'Is my data stored?',
    answer:
      'No. Values stay in your browser session. Share copies a short summary with percentages and masses plus the public page URL — not your raw measurements.',
  },
  {
    question: 'Can this diagnose obesity or fitness readiness?',
    answer:
      'No. Results are educational estimates with typical errors of several percentage points. Extremely muscular people, older adults, and some ethnic groups may see larger bias versus DXA or other clinical methods.',
  },
];
