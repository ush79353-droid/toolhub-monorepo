import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ARTERIAL_AGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Arterial Age Calculator' },
  { id: 'what-is', label: 'What Is Arterial Age?' },
  { id: 'formula', label: 'MESA Formula' },
  { id: 'cac-zero', label: 'CAC of Zero' },
  { id: 'uncertainty', label: 'Uncertainty (95% CI)' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'arterial-age-faq', label: 'Frequently Asked Questions' },
];

export const ARTERIAL_AGE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this arterial age calculator do?',
    answer:
      'It converts an Agatston coronary artery calcium (CAC) score into an educational MESA arterial age using Â = 39.1 + 7.25 × ln(CAC + 1). Optional chronologic age is compared only and never changes the formula.',
  },
  {
    question: 'Which study provides the formula?',
    answer:
      'McClelland et al., Am J Cardiol 2009 (MESA). The paper explicitly uses the natural logarithm for log(CAC + 1).',
  },
  {
    question: 'What happens when CAC is zero?',
    answer:
      'CAC 0 is valid. ln(0 + 1) = 0, so arterial age equals the intercept 39.1 years (about 39 years when rounded). That is a feature of the risk-equivalent model, not a bug.',
  },
  {
    question: 'When does the arterial age appear?',
    answer:
      'The result stays blank until you enter a valid non-negative calcium score. Age may stay blank; it only adds a younger/older comparison when provided.',
  },
  {
    question: 'Are 95% confidence intervals shown?',
    answer:
      'When CAC exactly matches a row in McClelland Table 1, the published 95% CI is shown. Other CAC values show the point estimate and point to the published table for nearby scores — intervals are not invented by interpolation.',
  },
  {
    question: 'Is this medical advice?',
    answer:
      'No. It is an educational transform of CAC to CHD risk-equivalent age from a research cohort. It does not diagnose disease, replace Framingham or ASCVD calculators, or recommend treatment.',
  },
  {
    question: 'Are my scores stored?',
    answer:
      'No. Values stay in your browser session. Share and copy use the public tool page URL only — never CAC or age.',
  },
];
