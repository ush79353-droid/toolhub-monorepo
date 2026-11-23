import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ADDED_SUGAR_INTAKE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Added Sugar Intake Calculator' },
  { id: 'how-it-works', label: 'How Totals Are Built' },
  { id: 'guidelines', label: 'Guidelines' },
  { id: 'added-sugar-faq', label: 'Frequently Asked Questions' },
];

export const ADDED_SUGAR_INTAKE_FAQS: readonly FAQItem[] = [
  {
    question: 'What counts as added sugar?',
    answer:
      'Sugars added during processing or preparation (sweetened drinks, candy, sweetened dairy, sauces with added sugar). This tool uses reference label values per serving—not natural fruit or milk lactose unless a product entry includes them as added sugar.',
  },
  {
    question: 'How is the teaspoon estimate calculated?',
    answer:
      'Approximate teaspoons = total grams ÷ 4, using 4 grams of sugar per level teaspoon (standard nutrition conversion).',
  },
  {
    question: 'What guideline limit is shown?',
    answer:
      'A sex-specific daily limit of 25 g for women and 36 g for men (common AHA-style fixed limits). This is separate from the “10% of calories from added sugars” energy-share guidance.',
  },
  {
    question: 'Are my entries stored?',
    answer:
      'No. Quantities stay in your browser; share uses the public page URL only.',
  },
];