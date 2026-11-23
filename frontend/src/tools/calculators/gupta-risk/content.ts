import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GUPTA_RISK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Gupta Risk Calculator' },
  { id: 'what-is', label: 'What Is the Gupta MICA Model?' },
  { id: 'inputs', label: 'Model Inputs' },
  { id: 'formula', label: 'How Risk Is Calculated' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'gupta-faq', label: 'Frequently Asked Questions' },
];

export const GUPTA_RISK_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this Gupta risk calculator estimate?',
    answer:
      'It applies the published NSQIP logistic model for perioperative myocardial infarction or cardiac arrest (MICA) within 30 days after surgery, using age, functional status, ASA class, creatinine category, and procedure type.',
  },
  {
    question: 'Which publication is implemented?',
    answer:
      'Gupta PK et al., Circulation 2011;124:381–387, Table 2 (MICA model). Coefficients match procedure categories, ASA I–V, functional dependence, and creatinine bands described in that table.',
  },
  {
    question: 'When does the MICA percentage appear?',
    answer:
      'The score stays blank until age is at least 16 years and creatinine is either explicitly “not measured” or a measured value greater than zero (in mg/dL or µmol/L). Zero or blank creatinine without “not measured” withholds the result.',
  },
  {
    question: 'How is creatinine converted?',
    answer:
      'Measured values normalize to mg/dL using 1 mg/dL = 88.4 µmol/L before applying the ≤1.5 vs >1.5 mg/dL category split (+0.61 above the threshold).',
  },
  {
    question: 'Is this the Gupta respiratory risk model?',
    answer:
      'No. This tool implements the cardiac MICA model only. Other Gupta-derived respiratory or composite models are not included.',
  },
  {
    question: 'Are my inputs stored or shared?',
    answer:
      'No. Clinical values stay in your browser. Copy and share actions use the public tool page URL only—never age, ASA, creatinine, or the computed MICA percent.',
  },
];