import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BLOOD_TYPE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Blood Type Calculator' },
  { id: 'inheritance', label: 'ABO and Rh inheritance' },
  { id: 'blood-type-faq', label: 'Frequently Asked Questions' },
];

export const BLOOD_TYPE_FAQS: readonly FAQItem[] = [
  {
    question: 'Why are percentages not always 0 or 100%?',
    answer:
      'A blood type phenotype does not always reveal genotype. Type A parents might be AA or AO; Rh+ parents might be homozygous or heterozygous for D. This calculator averages equally across every genotype still compatible with what you select.',
  },
  {
    question: 'Does this match paternity testing?',
    answer:
      'No. Paternity and forensic typing use many markers and lab methods. This page is a teaching aid for classic ABO/Rh Punnett-style outcomes only.',
  },
  {
    question: 'What are the default values?',
    answer:
      'Reload restores the reference example from the product design: mother A Rh+, father AB Rh−, yielding about 50% A, 12.5% B, 37.5% AB, 0% O, 75% Rh+, and 25% Rh− under uniform genotype priors.',
  },
];