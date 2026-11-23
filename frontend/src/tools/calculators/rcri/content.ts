import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RCRI_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'RCRI Calculator' },
  { id: 'what-is', label: 'What Is the RCRI?' },
  { id: 'formula', label: 'Scoring and Risk Rates' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'rcri-faq', label: 'Frequently Asked Questions' },
];

export const RCRI_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this RCRI calculator do?',
    answer:
      'It totals the six Lee Revised Cardiac Risk Index factors (0–6), assigns class I–IV, and shows CCS 2017 pooled estimates for 30-day death, MI, or cardiac arrest. It does not clear patients for surgery.',
  },
  {
    question: 'Why are the percentages higher than Lee 1999?',
    answer:
      'The displayed rates are CCS 2017 pooled external-validation estimates using more sensitive troponin surveillance and a death/MI/arrest composite. Lee’s original derivation used a different endpoint and monitoring.',
  },
  {
    question: 'Does creatinine of exactly 2.0 mg/dL count?',
    answer:
      'No. The Lee factor is creatinine greater than 2.0 mg/dL (≈177 µmol/L). Exactly 2.0 scores zero points.',
  },
  {
    question: 'What counts as high-risk surgery?',
    answer:
      'Intraperitoneal, intrathoracic, or suprainguinal vascular surgery, per the original RCRI definition.',
  },
  {
    question: 'Are answers stored?',
    answer:
      'No. Selections stay in your browser. Share/copy use the public page URL only.',
  },
];
