import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const IIFYM_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'IIFYM Calculator' },
  { id: 'formula', label: 'BMR, TDEE & Macros' },
  { id: 'change', label: 'Change Weight' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limitations' },
  { id: 'iifym-faq', label: 'FAQ' },
];

export const IIFYM_FAQS: readonly FAQItem[] = [
  {
    question: 'How are maintenance calories calculated?',
    answer:
      'Mifflin–St Jeor BMR multiplied by an activity (PAL) factor gives estimated TDEE — calories to maintain weight.',
  },
  {
    question: 'Where do the protein, carb, and fat ranges come from?',
    answer:
      'USDA Dietary Guidelines / Acceptable Macronutrient Distribution Ranges: protein 10–35%, carbohydrates 45–65%, fat 20–35% of energy. Grams use 4 kcal/g for protein and carbs and 9 kcal/g for fat.',
  },
  {
    question: 'What do Normal and Strict paces mean?',
    answer:
      'Normal targets about 0.5 kg (1.1 lb) per week with a ±500 kcal/day adjustment. Strict targets about 1 kg (2.2 lb) per week with ±1,000 kcal/day. Direction follows whether the target weight is below or above current weight.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. It is educational nutrition arithmetic for generally healthy adults. Seek clinical guidance for medical conditions, pregnancy, eating disorders, or elite sport.',
  },
];
