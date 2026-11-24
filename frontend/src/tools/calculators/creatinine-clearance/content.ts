import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CREATININE_CLEARANCE_TOC: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'What is creatinine clearance?' },
  { id: 'cockcroft-gault', label: 'Cockcroft–Gault equation' },
  { id: 'weight-adjustment', label: 'Body-weight adjustment' },
  { id: 'direct-crcl', label: 'Direct CrCl calculation' },
  { id: 'crcl-faq', label: 'Frequently Asked Questions' },
];

export const CREATININE_CLEARANCE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator estimate?',
    answer:
      'It estimates creatinine clearance (mL/min) with the Cockcroft–Gault equation from age, sex, weight, height, and serum creatinine. An optional direct panel uses timed urine creatinine, volume, serum creatinine, and collection duration.',
  },
  {
    question: 'Which body weight is used?',
    answer:
      'Following common Winter/Brown practice documented by Omni Calculator: actual weight when BMI is under 18.5, Devine ideal body weight when BMI is 18.5 to under 25, and adjusted body weight IBW + 0.4×(TBW−IBW) when BMI is 25 or higher.',
  },
  {
    question: 'Are my lab values stored?',
    answer:
      'No. Inputs stay in your browser. Share uses the public page URL only — not your numbers.',
  },
];
