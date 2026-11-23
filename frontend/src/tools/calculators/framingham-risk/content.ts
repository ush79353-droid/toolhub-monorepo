import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FRAMINGHAM_RISK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Framingham Risk Calculator' },
  { id: 'what-is', label: 'What Is the Framingham Point Score?' },
  { id: 'inputs', label: 'Inputs on This Page' },
  { id: 'formula', label: 'How Points Are Summed' },
  { id: 'ten-year', label: '10-Year Hard CHD Risk Tables' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'framingham-faq', label: 'Frequently Asked Questions' },
];

export const FRAMINGHAM_RISK_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this Framingham risk calculator show?',
    answer:
      'It totals ATP III Framingham hard coronary heart disease points (myocardial infarction or coronary death) from age, sex, lipids, blood pressure treatment status, systolic BP, and smoking. The primary answer is the point total in pts.',
  },
  {
    question: 'Which tables are used?',
    answer:
      'Sex-specific Framingham Heart Study / ATP III point tables for hard CHD 10-year risk (published with Adult Treatment Panel III, JAMA 2001), as summarized on the Framingham Heart Study website.',
  },
  {
    question: 'When does the risk score appear?',
    answer:
      'The score stays blank until you enter age (20–79 years), systolic blood pressure, total cholesterol, and HDL. Sex, treatment, and smoking use the screenshot defaults until you change them.',
  },
  {
    question: 'Can I enter cholesterol in mmol/L?',
    answer:
      'Yes. Choose mmol/L on either lipid field; the engine converts to mg/dL using × 38.67 before applying ATP III bands. Switching units preserves the underlying value.',
  },
  {
    question: 'Does it show a 10-year percentage?',
    answer:
      'The main result is points only. When a total is available, brief explanation text may cite the published ATP III point-to-10-year-hard-CHD-risk mapping for education — not as an extra results dashboard field.',
  },
  {
    question: 'Are my values stored or shared?',
    answer:
      'No. Clinical entries stay in your browser. Share and copy use the public tool page URL only — never age, lipids, blood pressure, or the score.',
  },
];