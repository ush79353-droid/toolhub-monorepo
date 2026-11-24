import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const KIDNEY_FAILURE_RISK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Kidney Failure Risk Calculator' },
  { id: 'what-is', label: 'What Is the Tangri Points Score?' },
  { id: 'inputs', label: 'Inputs on This Page' },
  { id: 'formula', label: 'How Points Are Summed' },
  { id: 'probability', label: '5-Year Probability Chart' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'kfr-faq', label: 'Frequently Asked Questions' },
];

export const KIDNEY_FAILURE_RISK_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this kidney failure risk calculator show?',
    answer:
      'It totals Tangri 2011 eight-variable categorical points from sex, age, urine ACR band, indexed eGFR, and serum albumin, bicarbonate, calcium, and phosphorus. The primary answer is the point total in pts.',
  },
  {
    question: 'Is this the continuous Kidney Failure Risk Equation (KFRE)?',
    answer:
      'No. Continuous 8-variable KFRE uses log ACR and lab coefficients to estimate 2- and 5-year probabilities. This page implements the published categorical points chart from the same Tangri JAMA 2011 work. ACR is never replaced by a numeric midpoint.',
  },
  {
    question: 'Who is the score for?',
    answer:
      'Adults with CKD stages G3–G5 (eGFR under 60 mL/min/1.73 m²) as in the derivation cohorts. eGFR ≥60 is not scored here.',
  },
  {
    question: 'When does the risk score appear?',
    answer:
      'The score stays blank until age, eGFR (1–59), albumin, bicarbonate, calcium, and phosphorus are valid. Sex defaults to Female and ACR to &lt;30 mg/g until you change them.',
  },
  {
    question: 'Can I enter labs in alternate units?',
    answer:
      'Yes. Albumin supports g/dL and g/L; bicarbonate mEq/L or mmol/L (identical); calcium and phosphorus support mg/dL and mmol/L with standard conversions. Switching units preserves the underlying value.',
  },
  {
    question: 'Are my values stored or shared?',
    answer:
      'No. Clinical entries stay in your browser. Share and copy use the public tool page URL only — never age, labs, ACR, or the score.',
  },
];
