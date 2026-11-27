import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WATER_INTAKE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Water Intake Calculator' },
  { id: 'formula', label: 'How adequate intake is determined' },
  { id: 'water-intake-faq', label: 'Frequently Asked Questions' },
];

export const WATER_INTAKE_FAQS: readonly FAQItem[] = [
  {
    question: 'Where do the water intake values come from?',
    answer:
      'Adequate Intake (AI) values follow the Institute of Medicine Dietary Reference Intakes for Water (2005), as summarized for adults and children by age and sex.',
  },
  {
    question: 'What is the difference between total water and beverages?',
    answer:
      'Total water includes moisture in food. Beverages are about 81% of total AI. Adult males: ≈3.7 L total and ≈3.0 L from drinks (~13 cups).',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies the public page URL only.',
  },
];
