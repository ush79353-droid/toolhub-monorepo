import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HEART_FAILURE_LIFE_EXPECTANCY_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'introduction', label: 'Heart Failure Life Expectancy Calculator' },
    { id: 'maggic', label: 'MAGGIC Risk Score' },
    { id: 'survival', label: 'Survival Probabilities' },
    { id: 'inputs', label: 'Inputs and EF Interactions' },
    { id: 'how-to-use', label: 'How to Use the Calculator' },
    { id: 'limits', label: 'Limits and Safety' },
    { id: 'related', label: 'Related Calculators' },
    { id: 'heart-failure-life-expectancy-faq', label: 'Frequently Asked Questions' },
  ];

export const HEART_FAILURE_LIFE_EXPECTANCY_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator output?',
    answer:
      'It sums the published MAGGIC integer chart (Pocock et al. 2013) from 13 heart-failure predictors, then shows 1-year and 3-year survival as 100% minus Table 4 mortality. It does not estimate years of life remaining.',
  },
  {
    question: 'Which model is used?',
    answer:
      'The MAGGIC meta-analysis model (39 372 patients, 30 cohorts). Coefficients and Table 4 are from Eur Heart J 2013; Figure 2 integer chart; age and systolic blood pressure rows depend on ejection fraction.',
  },
  {
    question: 'How is heart failure duration coded?',
    answer:
      'The chart adds 2 points when heart failure was first diagnosed more than 18 months ago — the same direction as HF duration >18 months in the original paper and www.heartfailurerisk.org.',
  },
  {
    question: 'How are ACE inhibitors and beta-blockers scored?',
    answer:
      'Checked boxes mean the patient is prescribed therapy (0 extra points). Unchecked means not prescribed: +3 for no beta-blocker and +1 for no ACE inhibitor or ARB, matching Figure 2.',
  },
  {
    question: 'What if the integer score is above 50?',
    answer:
      'Table 4 publishes death probabilities only for scores 0–50. Higher scores still display the total integer score, but survival percentages are withheld.',
  },
  {
    question: 'Are clinical values stored or shared?',
    answer:
      'No. Entries stay in your browser. Share and copy use the public tool page URL only — never patient data.',
  },
];