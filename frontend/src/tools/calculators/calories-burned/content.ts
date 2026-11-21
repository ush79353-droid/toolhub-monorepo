import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CALORIES_BURNED_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'Calories Burned Calculator' },
  { id: 'compendium', label: 'Adult Compendium METs' },
  { id: 'formula', label: 'Calorie Burn Formula' },
  { id: 'distance-mode', label: 'Distance Mode' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'calories-burned-faq', label: 'Frequently Asked Questions' },
];

export const CALORIES_BURNED_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a MET?',
    answer:
      'A metabolic equivalent (MET) expresses activity intensity as a multiple of resting metabolism. The 2011 Compendium of Physical Activities assigns MET values to hundreds of activities.',
  },
  {
    question: 'How are calories calculated here?',
    answer:
      'This tool uses gross energy expenditure: kcal = MET × 3.5 × body weight (kg) × duration (minutes) ÷ 200, a common Compendium convention.',
  },
  {
    question: 'When can I use distance instead of time?',
    answer:
      'Only for walking, running, and cycling entries that include a documented pace (mph). Distance in miles is converted to minutes using that pace, then the MET formula runs as usual.',
  },
  {
    question: 'Why is my result different from my fitness tracker?',
    answer:
      'Trackers use motion sensors and personal models. This calculator uses a fixed MET table and your entered weight — useful for comparison, not a medical measurement.',
  },
  {
    question: 'Does sharing include my weight?',
    answer:
      'No. Share and copy send only the public calculator page URL for privacy.',
  },
  {
    question: 'How does this relate to daily calorie needs?',
    answer:
      'This estimates energy for one activity. For total daily intake or maintenance calories, use the Calorie Calculator on Omega Calculators (Mifflin–St Jeor × activity level).',
  },
];