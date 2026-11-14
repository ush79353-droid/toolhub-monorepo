import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PARKING_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-parking-ratio', label: 'What Is Parking Ratio?' },
  { id: 'parking-ratio-formula', label: 'Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'parking-ratio-faq', label: 'Frequently Asked Questions' },
];

export const PARKING_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What does parking ratio mean?',
    answer:
      'Parking ratio expresses how many parking spaces serve each 1,000 units of rentable area. A result of 5 : 1000 means 5 spaces per 1,000 area units.',
  },
  {
    question: 'How is parking ratio calculated?',
    answer:
      'Parking Ratio = (parking spots ÷ rentable area) × 1000. Example: 25 spots ÷ 5,000 m² × 1000 = 5 : 1000.',
  },
  {
    question: 'Do area units change the formula?',
    answer:
      'The formula always uses the area number in the selected unit. Changing the unit converts the entered area so the physical size stays the same.',
  },
  {
    question: 'Why must rentable area be greater than zero?',
    answer:
      'The ratio divides by area. Zero area would make the result undefined, so the calculator requires a positive area.',
  },
];
