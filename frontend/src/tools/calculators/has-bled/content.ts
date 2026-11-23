import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HAS_BLED_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'HAS-BLED Calculator' },
  { id: 'factors', label: 'Nine Scoring Factors' },
  { id: 'rates', label: 'Bleeding Rates' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'hasbled-faq', label: 'Frequently Asked Questions' },
];

export const HAS_BLED_FAQS: readonly FAQItem[] = [
  {
    question: 'What is HAS-BLED?',
    answer:
      'HAS-BLED is a 0–9 point educational score for one-year major bleeding risk context in atrial fibrillation, published by Pisters et al. in Chest 2010 from the Euro Heart Survey.',
  },
  {
    question: 'Does a high score mean anticoagulation must stop?',
    answer:
      'No. A score ≥3 flags higher bleeding risk for clinical review. This calculator never starts, stops, or doses anticoagulants.',
  },
  {
    question: 'How are renal/liver and drugs/alcohol scored?',
    answer:
      'Abnormal renal function and abnormal liver function each add 1 point (max 2 for “A”). Alcohol excess and bleeding-predisposing drugs each add 1 point (max 2 for “D”).',
  },
  {
    question: 'Is age 65 enough to score the elderly point?',
    answer:
      'No. The criterion is age greater than 65 years, so 65 alone does not score; 66 and older does.',
  },
  {
    question: 'What do the percentage and patient-year figures mean?',
    answer:
      'Events per 100 patient-years come from the Pisters 2010 oral-anticoagulation subgroup. The paired bleeding-risk % restates that incidence rate for display. It is not a personalized absolute probability.',
  },
];
