import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FOUR_T_SCORE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: '4T Score Calculator | HIT' },
  { id: 'components', label: 'Four 4Ts Components' },
  { id: 'thrombocytopenia', label: 'Platelet Fall and Nadir' },
  { id: 'probability', label: 'Pretest Probability Bands' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'four-t-faq', label: 'Frequently Asked Questions' },
];

export const FOUR_T_SCORE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the 4Ts score?',
    answer:
      'The 4Ts is a 0–8 point pretest clinical score for heparin-induced thrombocytopenia (HIT): Thrombocytopenia (joint fall/nadir), Timing, Thrombosis, and oTher causes. It helps structure probability before immunoassay — it is not a definitive test.',
  },
  {
    question: 'Why are platelet fall and nadir one component?',
    answer:
      'Validated 4Ts tables score thrombocytopenia from both the percent fall and the absolute nadir together. A >50% fall with nadir <10 ×10⁹/L scores 0 on that component, not 2.',
  },
  {
    question: 'What do the probability percentages mean?',
    answer:
      'Approximate positive predictive values from Cuker et al. (Blood 2012) meta-analysis: low ~5%, intermediate ~14%, high ~64%. These are population estimates among tested cohorts, not an individual’s absolute risk.',
  },
  {
    question: 'Does a high 4Ts score confirm HIT?',
    answer:
      'No. High pretest probability warrants PF4/heparin antibody testing and clinical review. This calculator does not stop heparin or start alternative anticoagulation.',
  },
  {
    question: 'Is patient data stored or sent in share links?',
    answer:
      'No. Selections remain in your browser. Share and copy actions use the public page URL only — clinical answers are excluded from the payload.',
  },
];