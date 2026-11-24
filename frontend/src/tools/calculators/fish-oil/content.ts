import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FISH_OIL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Fish Oil Calculator' },
  { id: 'epa-dha-vs-ala', label: 'EPA/DHA vs ALA' },
  { id: 'sources', label: 'Primary sources' },
  { id: 'fish-oil-faq', label: 'Frequently Asked Questions' },
];

export const FISH_OIL_FAQS: readonly FAQItem[] = [
  {
    question: 'Is there an age-based EPA or DHA Adequate Intake?',
    answer:
      'No. NIH Office of Dietary Supplements states that experts have not established recommended amounts for EPA or DHA. Age Adequate Intakes cover total omega-3s in infancy and ALA only from age 1 year onward.',
  },
  {
    question: 'Is fish oil the same as EPA + DHA milligrams?',
    answer:
      'No. A softgel’s total fish-oil milligrams are not the same as EPA + DHA content. Check the Supplement Facts panel for EPA and DHA separately; product composition varies widely.',
  },
  {
    question: 'Can this tool dose fish oil for health conditions?',
    answer:
      'It does not invent OTC condition tables. Listed special-requirement rows cite primary sources only (seafood food-pattern averages, AHA physician-directed CHD targets, prescription hypertriglyceridemia dosing, pregnancy/lactation ALA AIs, and the FDA supplement upper limit).',
  },
  {
    question: 'Are selections stored or shared?',
    answer:
      'No. Inputs stay in the browser. Share copies only the public calculator page URL—never age or condition selections.',
  },
];
