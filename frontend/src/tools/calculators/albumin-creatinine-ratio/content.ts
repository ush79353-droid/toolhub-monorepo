import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ALBUMIN_CREATININE_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'introduction', label: 'Albumin Creatinine Ratio Calculator' },
    { id: 'definition', label: 'Urine albumin creatinine ratio definition' },
    { id: 'formula', label: 'How ACR is calculated' },
    { id: 'ckd-bands', label: 'CKD albuminuria categories' },
    { id: 'acr-faq', label: 'Frequently Asked Questions' },
  ];

export const ALBUMIN_CREATININE_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'How do you calculate ACR?',
    answer:
      'Convert urine creatinine to g/dL (mg/dL ÷ 1000), then divide urine albumin in mg/dL by that value. The result is ACR in mg/g. Example: albumin 8 mg/dL and creatinine 110 mg/dL → 8 ÷ 0.11 = 72.7 mg/g.',
  },
  {
    question: 'What creatinine units are supported?',
    answer:
      'mg/dL (default) and mmol/L. mmol/L is converted with × 11.3 to mg/dL before the ratio, matching common ACR teaching tools.',
  },
  {
    question: 'What is a normal albumin creatinine ratio?',
    answer:
      'KDIGO albuminuria category A1 is ACR <30 mg/g (normal to mildly increased). A2 is 30–300 mg/g; A3 is >300 mg/g. This tool labels those bands for education only.',
  },
  {
    question: 'Are values stored or sent to a server?',
    answer:
      'No. Inputs stay in your browser. Share copies a summary and the page URL only.',
  },
];
