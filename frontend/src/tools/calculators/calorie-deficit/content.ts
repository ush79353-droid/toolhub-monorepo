import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CALORIE_DEFICIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is a Calorie Deficit Calculator?' },
  { id: 'formula', label: 'How the Deficit Is Estimated' },
  { id: 'intake-plan', label: 'Calorie Intake Plan' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'calorie-deficit-faq', label: 'Frequently Asked Questions' },
];

export const CALORIE_DEFICIT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the daily calorie deficit calculated?',
    answer:
      'Calendar days = target date − today. Total energy ≈ weight change (kg) × 7,700 kcal/kg. Daily deficit = total ÷ days. This is a simplified textbook estimate, not a measured metabolic rate.',
  },
  {
    question: 'How is the suggested intake derived?',
    answer:
      'Maintenance uses Mifflin–St Jeor BMR × a sedentary activity factor of 1.2 (little or no exercise), because the form has no activity selector. Suggested intake = maintenance − daily deficit.',
  },
  {
    question: 'Why are some goals blocked?',
    answer:
      'The calculator rejects past/today target dates, equal or higher target weights, average losses above about 1 kg/week, and plans that would push suggested intake below educational floors (1,200 kcal/day female / 1,500 male under the sedentary assumption).',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. Results are educational estimates. Individual needs vary with activity, health conditions, and body composition. Consult a qualified clinician before changing diet.',
  },
  {
    question: 'Is currency conversion involved?',
    answer: 'No. This tool uses physical units and kilocalories only.',
  },
];
