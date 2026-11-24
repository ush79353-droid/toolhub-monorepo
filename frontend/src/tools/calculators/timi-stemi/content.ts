import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TIMI_STEMI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'TIMI Score for STEMI Calculator' },
  { id: 'what-is', label: 'What Is the TIMI STEMI Score?' },
  { id: 'points', label: 'Point Weights' },
  { id: 'mortality', label: '30-Day Mortality Bands' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'timi-stemi-faq', label: 'Frequently Asked Questions' },
];

export const TIMI_STEMI_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this TIMI STEMI calculator do?',
    answer:
      'It totals the Morrow 2000 TIMI risk score for ST-elevation MI (0–14) from age and published bedside factors, and shows the matching InTIME II 30-day mortality band. It does not triage reperfusion or order therapy.',
  },
  {
    question: 'When is the score shown?',
    answer:
      'The total stays blank until you select an age band. Killip and anterior ST elevation/LBBB default to No; the five history/exam checkboxes start unchecked.',
  },
  {
    question: 'How are points assigned?',
    answer:
      'Age <65 = 0; 65–74 = 2; ≥75 = 3. Add 1 for diabetes/hypertension/angina, time to treatment >4 h, weight <67 kg, or anterior ST elevation/LBBB. Add 2 for heart rate >100 or Killip II–IV. Add 3 for SBP <100 mmHg. Maximum 14.',
  },
  {
    question: 'Why does age say ≥75 instead of >75?',
    answer:
      'The reference screenshot labeled the top band “> 75 years old,” but Morrow/TIMI scoring uses age 75 or older (+3). This tool uses ≥75 so age 75 is scored correctly and discloses the screenshot wording difference.',
  },
  {
    question: 'Is weight scored at 150 lb or 67 kg?',
    answer:
      'The published cutoff is weight less than 67 kg. The checkbox label also shows 150 lbs as in the reference UI; the score item is still the <67 kg factor (one point when checked).',
  },
  {
    question: 'Are my answers stored?',
    answer:
      'No. Values stay in your browser session. Share and copy use the public page URL only—never clinical answers or the numeric score.',
  },
];
