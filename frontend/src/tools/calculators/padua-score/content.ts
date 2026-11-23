import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PADUA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Padua Score Calculator' },
  { id: 'what-is', label: 'What Is the Padua Score?' },
  { id: 'points', label: 'Point Weights' },
  { id: 'threshold', label: 'High-Risk Threshold' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'padua-faq', label: 'Frequently Asked Questions' },
];

export const PADUA_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this Padua calculator do?',
    answer:
      'It totals the Barbar 2010 Padua Prediction Score from eleven medical-inpatient VTE risk factors (range 0–20). It does not order prophylaxis or assess bleeding risk.',
  },
  {
    question: 'How are points assigned?',
    answer:
      'Active cancer, previous VTE (excluding superficial vein thrombosis), reduced mobility, and known thrombophilia add 3 each. Recent trauma/surgery within one month adds 2. Age ≥70, BMI ≥30, hormonal therapy, heart or respiratory failure, acute MI or ischemic stroke, and acute infection or rheumatologic disorder add 1 each. Grouped labels count once.',
  },
  {
    question: 'What does a score ≥4 mean here?',
    answer:
      'In the original Padua derivation, ≥4 marked the higher VTE-risk band used when discussing pharmacologic prophylaxis for medical inpatients. This educational tool reports that band only and does not prescribe treatment.',
  },
  {
    question: 'Are my answers stored?',
    answer:
      'No. Share and copy use the public page URL only—never checkboxes or the numeric score.',
  },
];
