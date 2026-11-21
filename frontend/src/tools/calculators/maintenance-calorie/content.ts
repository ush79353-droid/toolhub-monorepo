import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MAINTENANCE_CALORIE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Are Maintenance Calories?' },
  { id: 'how', label: 'How This Calculator Works' },
  { id: 'activity', label: 'Activity Levels (PAL)' },
  { id: 'extras', label: 'Macros, Ideal Weight, and Goals' },
  { id: 'limits', label: 'Limits' },
  { id: 'maint-faq', label: 'Frequently Asked Questions' },
];

export const MAINTENANCE_CALORIE_FAQS: readonly FAQItem[] = [
  {
    question: 'Which equation do you use?',
    answer:
      'Mifflin–St Jeor BMR (kcal/day), recommended by the Academy of Nutrition and Dietetics for many adult estimates, multiplied by a physical activity level (PAL).',
  },
  {
    question: 'What do the four activity options mean?',
    answer:
      'They map to Omni Maintenance FAQ PALs: no exercise 1.2; exercise regularly 1.55; physical job 2.0; professional athlete 2.4.',
  },
  {
    question: 'Are the macro percentages fixed?',
    answer:
      'Defaults are 20% protein / 50% carbs / 30% fat. You can edit them within USDA AMDR windows (protein 10–35%, carbs 45–65%, fat 20–35%) and they must sum to 100%.',
  },
  {
    question: 'Which ideal-weight formula is shown?',
    answer:
      'Devine ideal body weight plus the WHO adult BMI 18.5–24.9 healthy band for your height. Devine needs height of at least 5 ft (152.4 cm).',
  },
  {
    question: 'Is my data stored?',
    answer:
      'No. Values stay in your browser. Share copies maintenance energy and the public page URL without your measurements.',
  },
];
