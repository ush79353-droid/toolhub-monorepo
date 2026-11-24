import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const KETO_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Keto Calculator' },
  { id: 'formula', label: 'Calories & Macros' },
  { id: 'pace', label: 'Diet Pace' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limitations' },
  { id: 'keto-faq', label: 'FAQ' },
];

export const KETO_FAQS: readonly FAQItem[] = [
  {
    question: 'How are daily calories estimated?',
    answer:
      'Mifflin–St Jeor BMR is multiplied by an activity (PAL) factor for maintenance. Normal (±500 kcal/day) or Strict (±1,000 kcal/day) pace then adjusts intake toward your target weight.',
  },
  {
    question: 'Why 75% fat, 5% carbs, and 20% protein?',
    answer:
      'Those shares match commonly published recreational / modified ketogenic teaching (for example JAMA 2020 patient education and UK modified ketogenic diet descriptions). Grams use Atwater factors: 9 kcal/g fat, 4 kcal/g carbohydrate, 4 kcal/g protein.',
  },
  {
    question: 'Can I change the macro percentages?',
    answer:
      'Yes. Recommended intake fields are editable, but fat + carbohydrate + protein percentages must total 100% before intakes are shown.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. It is educational nutrition arithmetic for generally healthy adults. Therapeutic ketogenic diets (for example classic 4:1 epilepsy protocols) require clinical supervision.',
  },
];
