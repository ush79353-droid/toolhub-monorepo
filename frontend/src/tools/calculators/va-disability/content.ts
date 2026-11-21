import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const VA_DISABILITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  {
    id: 'how-to-use-va-disability',
    label: 'How to use the VA disability pay calculator',
  },
  {
    id: 'about-va-disability',
    label: 'About the Veterans disability calculator',
  },
  {
    id: 'how-va-disability-is-calculated',
    label: 'How is VA disability calculated?',
  },
  { id: 'va-disability-rating-chart', label: 'VA disability rating chart' },
  { id: 'va-disability-faq', label: 'FAQs' },
];

export const VA_DISABILITY_FAQS: readonly FAQItem[] = [
  {
    question: 'How does the VA calculate combined disability ratings?',
    answer:
      'VA does not add percentages. It starts with the highest rating, then applies each next rating to the remaining efficiency (38 CFR 4.25). The exact combined value is rounded to the nearest 10 percent, and a value ending in 5 rounds up. The result cannot exceed 100 percent.',
  },
  {
    question: 'Can I combine multiple disability ratings?',
    answer:
      'Yes. Enter each service-connected percentage. The calculator combines them with the remaining-efficiency method. Two 50 percent ratings do not become 100 percent.',
  },
  {
    question: 'What is the VA bilateral factor?',
    answer:
      'Under 38 CFR 4.26, when compensable disabilities affect both arms, both legs, or an arm and a leg, those ratings are combined first and 10 percent of that combined value is added. That result is then combined with any other ratings. A rating on only one limb does not get the factor. This tool does not decide whether a particular diagnosis qualifies.',
  },
  {
    question: 'Does having a spouse affect VA disability compensation?',
    answer:
      'A spouse can increase the monthly rate when the combined rating is 30 percent or higher. At 10 percent and 20 percent, VA pays the same amount with or without dependents. Use the 2026 rate table, effective December 1, 2025.',
  },
  {
    question: 'Do children affect VA disability compensation?',
    answer:
      'At 30 percent or higher, one child under 18 is included in the “with child” rate. Each further child under 18 adds the published additional amount. Each child over 18 in a qualifying school program adds the published school amount. The child must meet VA dependency rules. This estimate does not check eligibility.',
  },
  {
    question: 'Can my VA disability rating reach 100%?',
    answer:
      'The combined schedular rating can reach 100 percent. That is not the same as total disability based on individual unemployability or special monthly compensation, which this calculator does not estimate.',
  },
  {
    question: 'Is the calculator an official VA tool?',
    answer:
      'No. It estimates a combined rating and a monthly amount from published VA tables. VA makes the official rating decision and payment.',
  },
];

export const VA_RATES_HREF =
  'https://www.va.gov/disability/compensation-rates/veteran-rates/';
export const VA_COMBINED_HREF =
  'https://www.va.gov/disability/about-disability-ratings/';
