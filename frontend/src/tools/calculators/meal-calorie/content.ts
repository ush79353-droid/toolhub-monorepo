import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MEAL_CALORIE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Meal Calorie Calculator' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'splits', label: 'Meal Splits' },
  { id: 'maintenance', label: 'Maintenance Option' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'meal-calorie-faq', label: 'Frequently Asked Questions' },
];

export const MEAL_CALORIE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator do?',
    answer:
      'It divides a daily calorie target across breakfast, lunch, dinner, and optional snacks using common percentage bands. You can type a daily total or estimate one from maintenance calories (Mifflin–St Jeor × activity).',
  },
  {
    question: 'What are the default meal percentages?',
    answer:
      'Three meals: breakfast 32.5%, lunch 37.5%, dinner 30%. Four meals add a morning snack at 7.5%. Five meals add an afternoon snack at 7.5% and shift dinner to 17.5%. Each meal also shows a min–max kcal band.',
  },
  {
    question: 'Why do meal calories sometimes differ by 1 kcal from a simple percentage?',
    answer:
      'Each center target is rounded to a whole kcal, then the tool reconciles so all centers add up exactly to your daily total—same idea as largest-remainder rounding.',
  },
  {
    question: 'Where does maintenance mode come from?',
    answer:
      'When “Calculate required calories” is on, daily kcal comes from the Maintenance Calorie module: Mifflin–St Jeor BMR multiplied by the Omni maintenance PAL options in that tool.',
  },
  {
    question: 'Is this medical nutrition advice?',
    answer:
      'No. It is an educational split guide. Appetite, sport, illness, pregnancy, and clinical plans may need different timing and amounts—confirm with a qualified clinician or dietitian.',
  },
];