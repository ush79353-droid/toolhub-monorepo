import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CVD_RISK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: '10-Year CVD Risk' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'formula', label: 'Formula' },
  { id: 'limits', label: 'Limits & Safety' },
  { id: 'cvd-faq', label: 'Frequently Asked Questions' },
];

export const CVD_RISK_FAQS: readonly FAQItem[] = [
  {
    question: 'Which model is used?',
    answer:
      "Framingham Heart Study general CVD 10-year lipid equation (D'Agostino et al., Circulation 2008) for adults 30–74 without baseline CVD.",
  },
  {
    question: 'What events are included?',
    answer:
      'General CVD: coronary death, MI, coronary insufficiency, angina, stroke/TIA, peripheral artery disease, and heart failure (as defined in the Framingham publication).',
  },
  {
    question: 'Can I enter mmol/L?',
    answer:
      'Yes. HDL and total cholesterol unit selectors convert mmol/L to mg/dL with ÷0.02586 before the published equation.',
  },
  {
    question: 'Does Share send my numbers?',
    answer: 'No. Share/copy uses only the public page URL.',
  },
];
